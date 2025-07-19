// Import types and functions from split modules
import type { SupportedFramework } from './types';
import { getUrlParameters, loadAltchaIfNeeded, showErrorMessage } from './utils';
import { loadFormshiveForm, initializeLinkForm } from './form-loader';

/**
 * Initialize the formshive script
 * This function automatically detects whether it's being used in:
 * 1. Embed mode: div has form-id attribute (uses attributes from div)
 * 2. Link mode: URL has form_id parameter (uses URL parameters)
 */
async function initializeFormshive(): Promise<void> {
  const rustyFormsDiv = document.querySelector('div#formshive') as HTMLElement | null;

  if (!rustyFormsDiv) {
    console.error('Error: Could not find div with id="formshive"');
    return;
  }

  // Check if this is embed mode (has form-id attribute) or link mode (has URL parameters)
  const formId = rustyFormsDiv.getAttribute('form_id');
  const urlParams = getUrlParameters();
  
  if (formId) {
    // Embed mode: Use attributes from the div element
    let framework = rustyFormsDiv.getAttribute('framework') as SupportedFramework | null;
    const customApiUrl = rustyFormsDiv.getAttribute('api_url');

    if (!framework) {
      framework = 'bootstrap' as SupportedFramework; // Default to bootstrap for embed
    }

    // Use custom API URL if provided, otherwise use default
    const apiEndpoint = customApiUrl || 'https://api.formshive.com/v1';

    await loadFormshiveForm({
      formId,
      framework,
      apiEndpoint,
      rustyFormsDiv,
    });
  } else if (urlParams.form_id) {
    // Link mode: Use URL parameters
    await initializeLinkForm();
  } else {
    console.error('Error: No form ID found in div attributes or URL parameters');
    showErrorMessage(rustyFormsDiv, 'No form ID provided. Please specify form-id attribute or form_id URL parameter.');
  }
}

/**
 * Initialize script when DOM is ready, handling race conditions with async/defer loading
 */
function initializeWhenReady(): void {
  if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
    document.addEventListener('DOMContentLoaded', initializeFormshive);
  } else {
    // DOM is already loaded (interactive or complete), execute immediately
    console.log(`DOM already ready (${document.readyState}), initializing immediately`);
    initializeFormshive();
  }
}

// Initialize when script loads
initializeWhenReady();

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
  window.FormshiveUtils = {
    loadFormshiveForm,
    loadAltchaIfNeeded,
    showErrorMessage,
    getUrlParameters,
    initializeLinkForm
  };
}