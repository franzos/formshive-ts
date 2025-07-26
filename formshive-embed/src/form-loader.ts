import type { FormshiveOptions, SupportedFramework } from './types';
import { showErrorMessage, getUrlParameters, showLoadingState, LoadingState } from './utils';
import { validateFormId, validateApiEndpoint, validateFramework, sanitizeTitle } from './validation';
import { fetchWithRetry } from './network';
import { loadAltchaIfNeeded as robustLoadAltcha, validateAltchaIntegration } from './altcha';
import { handleFormSubmission } from './field-errors';

/**
 * Load the appropriate CSS framework stylesheet
 */
function loadFrameworkCSS(framework: SupportedFramework): Promise<void> {
  return new Promise((resolve, reject) => {
    // Remove any existing framework stylesheets
    const existingLinks = document.querySelectorAll('link[data-framework-css]');
    existingLinks.forEach(link => link.remove());

    // Skip loading CSS for 'formshive' framework (assumes custom styling)
    if (framework === 'formshive') {
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.setAttribute('data-framework-css', framework);
    
    // Set the appropriate CDN URL based on framework
    switch (framework) {
      case 'bootstrap':
        link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css';
        break;
      case 'bulma':
        link.href = 'https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css';
        break;
      default:
        reject(new Error(`Unsupported framework: ${framework}`));
        return;
    }

    link.onload = () => {
      console.log(`${framework} CSS loaded successfully`);
      
      // Set framework-specific attributes for better theme detection
      document.documentElement.setAttribute('data-framework', framework);
      
      // Detect and set initial dark mode state based on system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        if (framework === 'bulma') {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else if (framework === 'bootstrap') {
          document.documentElement.setAttribute('data-bs-theme', 'dark');
        }
      }
      
      resolve();
    };
    
    link.onerror = () => {
      reject(new Error(`Failed to load ${framework} CSS`));
    };

    // Add to document head
    document.head.appendChild(link);
  });
}

/**
 * Main form loading function that fetches and displays a Formshive form
 * Can be used by both embed and link scenarios with robust error handling
 */
export async function loadFormshiveForm(options: FormshiveOptions = {}): Promise<void> {
  const {
    formId,
    framework = 'bootstrap',
    apiEndpoint = 'https://api.formshive.com/v1',
    title = null,
    rustyFormsDiv = null,
  } = options;

  const targetDiv = rustyFormsDiv || document.querySelector('div#formshive') as HTMLElement | null;

  if (!targetDiv) {
    console.error('Error: Could not find div with id="formshive"');
    return;
  }

  // Validate form ID
  const formIdValidation = validateFormId(formId || null);
  if (!formIdValidation.isValid) {
    console.error('Error: Invalid form ID');
    showErrorMessage(targetDiv, formIdValidation.error!);
    return;
  }

  // Validate API endpoint
  const apiValidation = validateApiEndpoint(apiEndpoint);
  if (!apiValidation.isValid) {
    console.error('Error: Invalid API endpoint');
    showErrorMessage(targetDiv, apiValidation.error!);
    return;
  }

  // Validate framework
  const frameworkValidation = validateFramework(framework);
  if (!frameworkValidation.isValid) {
    console.error('Error: Invalid framework');
    showErrorMessage(targetDiv, frameworkValidation.error!);
    return;
  }

  const validatedFormId = formIdValidation.formId!;
  const validatedApiEndpoint = apiValidation.sanitizedUrl!;
  const validatedFramework = frameworkValidation.framework!;

  // Load appropriate CSS framework
  try {
    await loadFrameworkCSS(validatedFramework);
  } catch (error) {
    console.warn('Failed to load framework CSS:', error);
    // Continue with form loading even if CSS fails
  }

  // Update title if provided
  if (title) {
    const sanitizedTitle = sanitizeTitle(title);
    if (sanitizedTitle) {
      // Update the visible title element (h1#title)
      const titleElement = document.querySelector('h1#title') as HTMLElement | null;
      if (titleElement) {
        titleElement.textContent = sanitizedTitle;
      }

      // Update the HTML document title
      document.title = sanitizedTitle;
    }
  }

  // Show initial loading state
  showLoadingState(targetDiv, LoadingState.LOADING);

  try {
    console.log(`Loading form ${validatedFormId} with framework ${validatedFramework}`);
    
    // Fetch form HTML with retry logic
    const result = await fetchWithRetry(
      `${validatedApiEndpoint}/forms/${validatedFormId}/html?iframe=false&css_framework=${validatedFramework}&redirect=none`,
      {}, // Use default retry config
      (attempt, maxAttempts, error) => {
        if (attempt === 1) {
          showLoadingState(targetDiv, LoadingState.LOADING, attempt, maxAttempts);
        } else {
          showLoadingState(targetDiv, LoadingState.RETRYING, attempt, maxAttempts, error);
        }
      }
    );

    if (!result.success) {
      console.error('Failed to fetch form HTML:', result.error);
      showErrorMessage(targetDiv, result.error!);
      return;
    }

    const html = result.data!;
    console.log('Form HTML fetched successfully, inserting into DOM');

    // Replace the target div with form HTML
    targetDiv.outerHTML = html;

    // Handle Altcha if needed
    const needsAltcha = html.includes('altcha-widget');
    if (needsAltcha) {
      console.log('Form contains Altcha widgets, loading Altcha script...');
      
      const altchaResult = await robustLoadAltcha(html);
      if (!altchaResult.success) {
        console.error('Altcha loading failed:', altchaResult.error);
        
        // Show warning but don't fail completely
        const warningDiv = document.createElement('div');
        warningDiv.style.cssText = 'margin: 10px 0; padding: 10px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; color: #856404;';
        warningDiv.innerHTML = `
          <strong>⚠️ Warning:</strong> Anti-spam protection failed to load. 
          The form may not submit properly. ${altchaResult.error}
        `;
        
        // Insert warning after form
        const formContainer = document.querySelector('div[id*="form"], form') as HTMLElement;
        if (formContainer && formContainer.parentNode) {
          formContainer.parentNode.insertBefore(warningDiv, formContainer.nextSibling);
        }
      } else {
        // Validate Altcha integration after a short delay
        setTimeout(() => {
          const validation = validateAltchaIntegration();
          if (!validation.isValid) {
            console.warn('Altcha integration validation failed:', validation.error);
          }
        }, 1000);
      }
    }

    console.log('Form loaded and rendered successfully');

    // Add form submission event listener for error handling
    const formElement = document.querySelector('form.formshive') as HTMLFormElement;
    if (formElement) {
      formElement.addEventListener('submit', handleFormSubmission);
      console.log('Form submission handler attached');
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Unexpected error during form loading:', errorMessage);
    showErrorMessage(targetDiv, `Unexpected error: ${errorMessage}`);
  }
}

/**
 * Initialize form loading using URL parameters (for link.html)
 * Extracts form configuration from URL query parameters with validation
 */
export async function initializeLinkForm(): Promise<void> {
  const params = getUrlParameters();
  
  // Validate form ID from URL
  const formIdValidation = validateFormId(params.form_id);
  if (!formIdValidation.isValid) {
    console.error('Error: Invalid form_id parameter in URL');
    const targetDiv = document.querySelector('div#formshive') as HTMLElement | null;
    if (targetDiv) {
      showErrorMessage(targetDiv, `URL parameter error: ${formIdValidation.error}`);
    }
    return;
  }

  // Validate API endpoint if provided
  let apiEndpoint = 'https://api.formshive.com/v1';
  if (params.api_endpoint) {
    const apiValidation = validateApiEndpoint(params.api_endpoint);
    if (!apiValidation.isValid) {
      console.warn('Invalid API endpoint in URL, using default:', apiValidation.error);
    } else {
      apiEndpoint = apiValidation.sanitizedUrl!;
    }
  }

  // Validate framework if provided
  let framework: SupportedFramework = 'bulma'; // Default for link.html
  if (params.framework) {
    const frameworkValidation = validateFramework(params.framework);
    if (!frameworkValidation.isValid) {
      console.warn('Invalid framework in URL, using default bulma:', frameworkValidation.error);
    } else {
      framework = frameworkValidation.framework!;
    }
  }

  const title = params.title || 'Formshive';

  await loadFormshiveForm({
    formId: formIdValidation.formId!,
    framework,
    apiEndpoint,
    title
  });
}