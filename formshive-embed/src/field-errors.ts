import type { SupportedFramework } from './types';

// Type definition for field validation errors from backend
export interface FieldValidationError {
  field: string;
  code: string;
  message: string;
  params: Record<string, any>;
}

export interface FieldValidationErrorResponse {
  error: string;
  action?: string;
  message: string;
  errors: FieldValidationError[];
}

export interface JsonRedirectResponse {
  redirect_url: string;
}

/**
 * Detect which CSS framework is being used for the form
 */
function detectCssFramework(): SupportedFramework {
  // Check data attribute set by form-loader
  const framework = document.documentElement.getAttribute('data-framework') as SupportedFramework;
  if (framework) {
    return framework;
  }

  // Fallback to CSS class detection
  const form = document.querySelector('form.formshive');
  if (!form) return 'bootstrap'; // Default fallback

  // Check for framework-specific classes in form
  if (form.querySelector('.fh-input, .fh-button')) {
    return 'formshive';
  } else if (form.querySelector('.input, .button')) {
    return 'bulma';
  } else {
    return 'bootstrap';
  }
}

/**
 * Clear all existing field error highlights and messages
 */
export function clearFieldErrors(): void {
  const form = document.querySelector('form.formshive') as HTMLFormElement;
  if (!form) return;

  // Remove error classes from all inputs
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.classList.remove('is-invalid', 'is-danger', 'fh-error');
  });

  // Remove all error message elements
  const errorMessages = form.querySelectorAll('.invalid-feedback, .help.is-danger, .fh-error-message');
  errorMessages.forEach(msg => msg.remove());
}

/**
 * Apply error styling to a specific field based on CSS framework
 */
function highlightSingleFieldError(fieldName: string, errorMessage: string, framework: SupportedFramework): void {
  const input = document.querySelector(`[name="${fieldName}"]`) as HTMLElement;
  if (!input) {
    console.warn(`Field not found: ${fieldName}`);
    return;
  }

  // Apply framework-specific error classes
  switch (framework) {
    case 'bootstrap':
      input.classList.add('is-invalid');
      break;
    case 'bulma':
      input.classList.add('is-danger');
      break;
    case 'formshive':
      input.classList.add('fh-error');
      break;
  }

  // Create and insert error message element
  const errorElement = document.createElement('div');
  errorElement.textContent = errorMessage;

  switch (framework) {
    case 'bootstrap':
      errorElement.className = 'invalid-feedback';
      break;
    case 'bulma':
      errorElement.className = 'help is-danger';
      break;
    case 'formshive':
      errorElement.className = 'fh-error-message';
      break;
  }

  // Insert error message after the input element
  // For complex fields (radio/checkbox groups), find the field container
  const fieldContainer = input.closest('.field, .mb-3, .fh-field') || input.parentElement;
  if (fieldContainer) {
    fieldContainer.appendChild(errorElement);
  } else {
    // Fallback: insert after the input element
    input.parentNode?.insertBefore(errorElement, input.nextSibling);
  }
}

/**
 * Show success message and clear form
 */
function showSuccessMessage(form: HTMLFormElement): void {
  // Create success message element
  const successDiv = document.createElement('div');
  successDiv.style.cssText = 'margin: 10px 0; padding: 10px; background: #d4edda; border: 1px solid #c3e6cb; border-radius: 4px; color: #155724;';
  successDiv.innerHTML = '<strong>✓ Success:</strong> Your form has been submitted successfully.';
  
  // Insert success message before the form
  form.parentNode?.insertBefore(successDiv, form);
  
  // Clear form after successful submission
  form.reset();
  
  // Remove success message after 5 seconds
  setTimeout(() => {
    successDiv.remove();
  }, 5000);
}

/**
 * Show error message for non-validation errors
 */
function showErrorMessage(form: HTMLFormElement, status: number, statusText: string): void {
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'margin: 10px 0; padding: 10px; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; color: #721c24;';
  
  let errorMessage = '<strong>⚠️ Error:</strong> ';
  
  switch (status) {
    case 403:
      errorMessage += 'Access denied. Please check your permissions.';
      break;
    case 404:
      errorMessage += 'Form not found. Please check the form URL.';
      break;
    case 500:
      errorMessage += 'Server error. Please try again later.';
      break;
    default:
      errorMessage += `Form submission failed (${status}: ${statusText}). Please try again.`;
  }
  
  errorDiv.innerHTML = errorMessage;
  form.parentNode?.insertBefore(errorDiv, form);
  
  // Remove error message after 10 seconds
  setTimeout(() => {
    errorDiv.remove();
  }, 10000);
}

/**
 * Show network error message
 */
function showNetworkErrorMessage(form: HTMLFormElement): void {
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'margin: 10px 0; padding: 10px; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; color: #721c24;';
  errorDiv.innerHTML = '<strong>⚠️ Network Error:</strong> Could not submit form. Please check your connection and try again.';
  
  form.parentNode?.insertBefore(errorDiv, form);
  
  // Remove error message after 10 seconds
  setTimeout(() => {
    errorDiv.remove();
  }, 10000);
}

/**
 * Highlight multiple field errors on the form
 */
export function highlightFieldErrors(errors: FieldValidationError[]): void {
  if (!errors || errors.length === 0) return;

  const framework = detectCssFramework();

  errors.forEach(error => {
    highlightSingleFieldError(error.field, error.message, framework);
  });

  // Scroll to first error field for better UX
  const firstErrorField = document.querySelector('.is-invalid, .is-danger, .fh-error');
  if (firstErrorField) {
    firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

/**
 * Handle form submission with error highlighting
 */
export async function handleFormSubmission(event: Event): Promise<void> {
  event.preventDefault();
  
  const form = event.target as HTMLFormElement;
  if (!form) return;

  // Clear any existing errors
  clearFieldErrors();

  // Collect form data
  const formData = new FormData(form);
  const actionUrl = form.action;

  try {
    const response = await fetch(actionUrl, {
      method: 'POST',
      body: formData,
    });

    console.log('Response status:', response.status);

    // Handle 201 Created - check for JSON redirect
    if (response.status === 201) {
      const contentType = response.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        try {
          const responseData = await response.json() as JsonRedirectResponse;
          if (responseData.redirect_url) {
            console.log('Form submitted successfully - redirecting to:', responseData.redirect_url);
            window.location.href = responseData.redirect_url;
            return;
          }
        } catch (jsonError) {
          console.warn('Failed to parse JSON response:', jsonError);
        }
      }
      
      // No redirect URL or not JSON - show success message
      console.log('Form submitted successfully - showing success message');
      showSuccessMessage(form);
    } else if (response.status === 200 && response.ok) {
      // Handle 200 OK responses
      console.log('Form submitted successfully - showing success message');
      showSuccessMessage(form);
    } else if (response.status === 400) {
      // Validation error case
      try {
        const errorData = await response.json() as FieldValidationErrorResponse;
        if (errorData.errors && errorData.errors.length > 0) {
          highlightFieldErrors(errorData.errors);
        } else {
          // Fallback for generic validation error
          console.error('Validation failed but no specific field errors provided');
        }
      } catch (jsonError) {
        console.error('Failed to parse error response as JSON:', jsonError);
      }
    } else {
      // Other error cases (403, 404, 500, etc.)
      console.error('Form submission failed:', response.status, response.statusText);
      showErrorMessage(form, response.status, response.statusText);
    }
  } catch (networkError) {
    console.error('Network error during form submission:', networkError);
    showNetworkErrorMessage(form);
  }
}