import type { UrlParameters } from './types';
import { escapeHtml } from './validation';

/**
 * Loading state management
 */
export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  RETRYING = 'retrying',
  SUCCESS = 'success',
  ERROR = 'error'
}

/**
 * Parse URL query parameters and return structured data
 */
export function getUrlParameters(): UrlParameters {
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    form_id: urlParams.get('form_id'),
    api_endpoint: urlParams.get('api_endpoint'),
    framework: urlParams.get('framework'),
    title: urlParams.get('title')
  };
}

/**
 * Show loading state with progress information
 */
export function showLoadingState(
  element: HTMLElement,
  state: LoadingState,
  attempt?: number,
  maxAttempts?: number,
  error?: string
): void {
  let content = '';

  switch (state) {
    case LoadingState.LOADING:
      content = `
        <div style="border: 2px solid #2196F3; padding: 16px; border-radius: 4px; background-color: #e3f2fd; text-align: center;">
          <div style="display: inline-block; width: 20px; height: 20px; border: 3px solid #f3f3f3; border-top: 3px solid #2196F3; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 10px;"></div>
          <strong>Loading form...</strong>
          ${attempt && maxAttempts ? `<br><small>Attempt ${attempt} of ${maxAttempts}</small>` : ''}
          <style>
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </div>
      `;
      break;

    case LoadingState.RETRYING:
      content = `
        <div style="border: 2px solid #FF9800; padding: 16px; border-radius: 4px; background-color: #fff3e0; text-align: center;">
          <div style="display: inline-block; width: 20px; height: 20px; border: 3px solid #f3f3f3; border-top: 3px solid #FF9800; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 10px;"></div>
          <strong>Retrying...</strong>
          ${attempt && maxAttempts ? `<br><small>Attempt ${attempt} of ${maxAttempts}</small>` : ''}
          ${error ? `<br><small style="color: #e65100;">Previous error: ${escapeHtml(error)}</small>` : ''}
          <style>
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </div>
      `;
      break;

    default:
      // Don't change content for other states
      return;
  }

  element.innerHTML = content;
}

/**
 * Display error message in the target div with styled error box
 */
export function showErrorMessage(rustyFormsDiv: HTMLElement, message: string): void {
  const escapedMessage = escapeHtml(message);
  rustyFormsDiv.innerHTML = `
    <div style="border: 2px solid #f44336; padding: 16px; border-radius: 4px; background-color: #ffebee;">
      <h3 style="color: #d32f2f; margin-top: 0;">Form Loading Error</h3>
      <p>${escapedMessage}</p>
      <details style="margin-top: 12px;">
        <summary style="cursor: pointer; color: #666;">Troubleshooting</summary>
        <ul style="margin: 8px 0; padding-left: 20px; color: #666; font-size: 14px;">
          <li>Check your internet connection</li>
          <li>Verify the form ID is correct</li>
          <li>Try refreshing the page</li>
          <li>Contact support@formshive.com if the problem persists</li>
        </ul>
      </details>
    </div>
  `;
}

/**
 * Display success message (optional, for completion feedback)
 */
export function showSuccessMessage(element: HTMLElement, message: string): void {
  const escapedMessage = escapeHtml(message);
  element.innerHTML = `
    <div style="border: 2px solid #4CAF50; padding: 16px; border-radius: 4px; background-color: #e8f5e8;">
      <h3 style="color: #2e7d32; margin-top: 0;">✓ Success</h3>
      <p>${escapedMessage}</p>
    </div>
  `;
}

/**
 * Legacy function for backward compatibility - now uses robust Altcha loading
 */
export function loadAltchaIfNeeded(html: string): void {
  console.warn('loadAltchaIfNeeded is deprecated. Use loadAltchaIfNeeded from altcha.ts module for better error handling.');

  // Simple fallback for backward compatibility
  if (html.includes('altcha-widget')) {
    if (!document.querySelector('script[src*="altcha.min.js"]')) {
      console.log('Altcha widget detected, loading script (legacy mode)');
      const altchaScript = document.createElement('script');
      altchaScript.src = 'https://cdn.jsdelivr.net/npm/altcha/dist/altcha.min.js';
      altchaScript.type = 'module';
      altchaScript.async = true;
      altchaScript.defer = true;
      document.head.appendChild(altchaScript);
    }
  }
}