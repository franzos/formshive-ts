import { validateHtmlResponse } from './validation';

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  timeout: number;
}

export interface NetworkResponse {
  success: boolean;
  data?: string;
  error?: string;
  statusCode?: number;
  attempt?: number;
}

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000, // 1 second
  timeout: 10000   // 10 seconds
};

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get user-friendly error message based on HTTP status code
 */
function getStatusErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Invalid form request. Please check the form ID and parameters.';
    case 401:
      return 'Authentication required to access this form.';
    case 403:
      return 'Access denied. You do not have permission to view this form.';
    case 404:
      return 'Form not found. Please check the form ID and try again.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'Server error. Please try again in a few minutes.';
    case 502:
    case 503:
    case 504:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      if (status >= 400 && status < 500) {
        return `Client error (${status}). Please check your request.`;
      } else if (status >= 500) {
        return `Server error (${status}). Please try again later.`;
      }
      return `Unexpected response (${status}). Please try again.`;
  }
}

/**
 * Fetch with timeout support
 */
async function fetchWithTimeout(url: string, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Cache-Control': 'no-cache'
      }
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout. Please check your internet connection and try again.');
    }
    throw error;
  }
}

/**
 * Robust fetch with retry logic and comprehensive error handling
 */
export async function fetchWithRetry(
  url: string, 
  config: Partial<RetryConfig> = {},
  onProgress?: (attempt: number, maxAttempts: number, error?: string) => void
): Promise<NetworkResponse> {
  const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: string = '';
  
  for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
    try {
      // Notify progress
      if (onProgress) {
        onProgress(attempt, finalConfig.maxAttempts);
      }
      
      console.log(`Fetching form (attempt ${attempt}/${finalConfig.maxAttempts}): ${url}`);
      
      const response = await fetchWithTimeout(url, finalConfig.timeout);
      
      if (!response.ok) {
        const errorMessage = getStatusErrorMessage(response.status);
        lastError = errorMessage;
        
        // Don't retry on client errors (4xx) except for specific cases
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          return {
            success: false,
            error: errorMessage,
            statusCode: response.status,
            attempt
          };
        }
        
        // Retry on server errors (5xx) and 429 (rate limiting)
        if (attempt === finalConfig.maxAttempts) {
          return {
            success: false,
            error: errorMessage,
            statusCode: response.status,
            attempt
          };
        }
        
        console.warn(`HTTP ${response.status} error, attempt ${attempt}/${finalConfig.maxAttempts}: ${errorMessage}`);
      } else {
        // Success - validate response
        const html = await response.text();
        const validation = validateHtmlResponse(html);
        
        if (!validation.isValid) {
          lastError = validation.error || 'Invalid HTML response';
          if (attempt === finalConfig.maxAttempts) {
            return {
              success: false,
              error: lastError,
              statusCode: response.status,
              attempt
            };
          }
          console.warn(`Invalid HTML response, attempt ${attempt}/${finalConfig.maxAttempts}: ${lastError}`);
        } else {
          console.log(`Form fetched successfully on attempt ${attempt}`);
          return {
            success: true,
            data: html,
            statusCode: response.status,
            attempt
          };
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown network error';
      lastError = errorMessage;
      
      if (attempt === finalConfig.maxAttempts) {
        return {
          success: false,
          error: `Network error: ${errorMessage}`,
          attempt
        };
      }
      
      console.warn(`Network error, attempt ${attempt}/${finalConfig.maxAttempts}: ${errorMessage}`);
      
      // Notify progress with error
      if (onProgress) {
        onProgress(attempt, finalConfig.maxAttempts, errorMessage);
      }
    }
    
    // Wait before retry (exponential backoff)
    if (attempt < finalConfig.maxAttempts) {
      const delay = finalConfig.baseDelay * Math.pow(2, attempt - 1);
      console.log(`Waiting ${delay}ms before retry...`);
      await sleep(delay);
    }
  }
  
  return {
    success: false,
    error: lastError || 'All retry attempts failed',
    attempt: finalConfig.maxAttempts
  };
}