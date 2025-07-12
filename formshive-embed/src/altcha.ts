/**
 * Robust Altcha script loading with comprehensive error handling
 */

export interface AltchaLoadResult {
  success: boolean;
  error?: string;
  alreadyLoaded?: boolean;
}

/**
 * Check if Altcha script is already loaded
 */
function isAltchaLoaded(): boolean {
  return !!document.querySelector('script[src*="altcha.min.js"]') || 
         typeof (window as any).altcha !== 'undefined';
}

/**
 * Wait for script to load with timeout
 */
function waitForScriptLoad(script: HTMLScriptElement, timeout: number = 10000): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Altcha script loading timeout'));
    }, timeout);

    script.onload = () => {
      clearTimeout(timeoutId);
      resolve();
    };

    script.onerror = () => {
      clearTimeout(timeoutId);
      reject(new Error('Altcha script failed to load from CDN'));
    };
  });
}

/**
 * Verify Altcha is functional after loading
 */
function verifyAltchaFunctionality(): boolean {
  try {
    // Check if altcha elements can be created
    const testElement = document.createElement('altcha-widget');
    return testElement instanceof HTMLElement;
  } catch (error) {
    console.warn('Altcha functionality verification failed:', error);
    return false;
  }
}

/**
 * Load Altcha script with comprehensive error handling and fallback options
 */
export async function loadAltchaScript(): Promise<AltchaLoadResult> {
  if (isAltchaLoaded()) {
    console.log('Altcha script already loaded');
    return { success: true, alreadyLoaded: true };
  }

  console.log('Loading Altcha script...');

  // Primary CDN URL
  const primaryUrl = 'https://cdn.jsdelivr.net/npm/altcha/dist/altcha.min.js';
  
  // Fallback CDN URLs
  const fallbackUrls = [
    'https://unpkg.com/altcha/dist/altcha.min.js',
    'https://cdn.skypack.dev/altcha/dist/altcha.min.js'
  ];

  const urls = [primaryUrl, ...fallbackUrls];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const isLastAttempt = i === urls.length - 1;
    
    try {
      console.log(`Attempting to load Altcha from: ${url}`);
      
      const script = document.createElement('script');
      script.src = url;
      script.type = 'module';
      script.async = true;
      script.defer = true;
      
      // Add integrity and crossorigin for security if using primary CDN
      if (url === primaryUrl) {
        script.crossOrigin = 'anonymous';
        // Note: In production, you should add specific SRI hash
        // script.integrity = 'sha384-...';
      }

      document.head.appendChild(script);

      // Wait for script to load
      await waitForScriptLoad(script);

      // Verify functionality
      setTimeout(() => {
        if (verifyAltchaFunctionality()) {
          console.log('Altcha script loaded and verified successfully');
        } else {
          console.warn('Altcha script loaded but functionality verification failed');
        }
      }, 100);

      return { success: true };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`Failed to load Altcha from ${url}: ${errorMessage}`);
      
      if (isLastAttempt) {
        return { 
          success: false, 
          error: `Failed to load Altcha script from all CDN sources. Last error: ${errorMessage}` 
        };
      }
      
      // Continue to next URL
    }
  }

  return { 
    success: false, 
    error: 'All Altcha CDN sources failed to load' 
  };
}

/**
 * Enhanced Altcha loading function with form integration
 */
export async function loadAltchaIfNeeded(html: string): Promise<AltchaLoadResult> {
  if (!html.includes('altcha-widget')) {
    console.log('No Altcha widget detected in HTML');
    return { success: true };
  }

  console.log('Altcha widget detected, ensuring script is loaded...');
  
  try {
    const result = await loadAltchaScript();
    
    if (!result.success) {
      console.error('Critical: Altcha script failed to load, form will not function properly');
      return result;
    }

    // Additional verification after DOM has been updated
    setTimeout(() => {
      const altchaWidgets = document.querySelectorAll('altcha-widget');
      if (altchaWidgets.length > 0) {
        console.log(`Found ${altchaWidgets.length} Altcha widget(s) in DOM`);
        
        // Check if widgets are properly initialized
        altchaWidgets.forEach((widget, index) => {
          if (!(widget as any).shadowRoot) {
            console.warn(`Altcha widget ${index + 1} may not be properly initialized`);
          }
        });
      }
    }, 500);

    return result;

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Unexpected error during Altcha loading:', errorMessage);
    return { 
      success: false, 
      error: `Unexpected error: ${errorMessage}` 
    };
  }
}

/**
 * Check if form has working Altcha widgets
 */
export function validateAltchaIntegration(): { isValid: boolean; error?: string } {
  const altchaWidgets = document.querySelectorAll('altcha-widget');
  
  if (altchaWidgets.length === 0) {
    return { isValid: true }; // No widgets needed
  }

  // Check if script is loaded
  if (!isAltchaLoaded()) {
    return { 
      isValid: false, 
      error: 'Altcha widgets present but script not loaded' 
    };
  }

  // Check if widgets appear to be working
  let workingWidgets = 0;
  altchaWidgets.forEach((widget) => {
    if ((widget as any).shadowRoot || (widget as any).altcha) {
      workingWidgets++;
    }
  });

  if (workingWidgets === 0) {
    return { 
      isValid: false, 
      error: 'Altcha widgets present but none appear to be functional' 
    };
  }

  if (workingWidgets < altchaWidgets.length) {
    console.warn(`Only ${workingWidgets}/${altchaWidgets.length} Altcha widgets appear functional`);
  }

  return { isValid: true };
}