import type { SupportedFramework } from './types';

/**
 * Validate UUID format (form ID validation)
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate and sanitize API endpoint URL
 */
export function validateApiEndpoint(url: string): { isValid: boolean; sanitizedUrl?: string; error?: string } {
  try {
    const parsedUrl = new URL(url);
    
    // Check protocol
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return { isValid: false, error: 'API endpoint must use HTTP or HTTPS protocol' };
    }
    
    // Warn about HTTP in production (but allow for development)
    if (parsedUrl.protocol === 'http:' && !parsedUrl.hostname.includes('localhost') && !parsedUrl.hostname.includes('127.0.0.1')) {
      console.warn('Warning: Using HTTP endpoint in production environment. Consider using HTTPS for security.');
    }
    
    // Basic hostname validation
    if (!parsedUrl.hostname || parsedUrl.hostname.length < 3) {
      return { isValid: false, error: 'Invalid hostname in API endpoint' };
    }
    
    return { isValid: true, sanitizedUrl: parsedUrl.toString().replace(/\/$/, '') }; // Remove trailing slash
  } catch (error) {
    return { isValid: false, error: 'Invalid URL format for API endpoint' };
  }
}

/**
 * Validate framework parameter against whitelist
 */
export function validateFramework(framework: string): { isValid: boolean; framework?: SupportedFramework; error?: string } {
  const supportedFrameworks: SupportedFramework[] = ['bootstrap', 'bulma', 'formshive'];
  
  if (!framework || typeof framework !== 'string') {
    return { isValid: false, error: 'Framework parameter is required and must be a string' };
  }
  
  const normalizedFramework = framework.toLowerCase().trim();
  
  if (!supportedFrameworks.includes(normalizedFramework as SupportedFramework)) {
    return { 
      isValid: false, 
      error: `Unsupported framework "${framework}". Supported frameworks: ${supportedFrameworks.join(', ')}` 
    };
  }
  
  return { isValid: true, framework: normalizedFramework as SupportedFramework };
}

/**
 * HTML escape function to prevent XSS attacks
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize title content (remove quotes and escape HTML)
 */
export function sanitizeTitle(title: string): string {
  if (!title || typeof title !== 'string') {
    return '';
  }
  
  // Remove quotes and trim
  const cleaned = title.replace(/["']/g, '').trim();
  
  // Limit length to prevent abuse
  const maxLength = 100;
  const truncated = cleaned.length > maxLength ? cleaned.substring(0, maxLength) + '...' : cleaned;
  
  return escapeHtml(truncated);
}

/**
 * Validate form ID with detailed error messaging
 */
export function validateFormId(formId: string | null): { isValid: boolean; formId?: string; error?: string } {
  if (!formId || typeof formId !== 'string') {
    return { isValid: false, error: 'Form ID is required' };
  }
  
  const trimmed = formId.trim();
  
  if (!trimmed) {
    return { isValid: false, error: 'Form ID cannot be empty' };
  }
  
  if (!isValidUUID(trimmed)) {
    return { isValid: false, error: 'Form ID must be a valid UUID format' };
  }
  
  return { isValid: true, formId: trimmed };
}

/**
 * Validate HTML response content
 */
export function validateHtmlResponse(html: string): { isValid: boolean; error?: string } {
  if (!html || typeof html !== 'string') {
    return { isValid: false, error: 'Empty or invalid HTML response' };
  }
  
  const trimmed = html.trim();
  
  if (trimmed.length < 10) {
    return { isValid: false, error: 'HTML response too short to be valid' };
  }
  
  // Check if it looks like HTML
  if (!trimmed.includes('<') || !trimmed.includes('>')) {
    return { isValid: false, error: 'Response does not appear to be HTML content' };
  }
  
  // Check for common error responses
  if (trimmed.toLowerCase().includes('<!doctype html') && trimmed.toLowerCase().includes('error')) {
    return { isValid: false, error: 'Server returned an error page instead of form content' };
  }
  
  return { isValid: true };
}