import { ApiErrorResponse } from '@gofranz/common-components';
import axios from 'axios';

/**
 * Extracts a user-friendly error message from API error responses
 * Handles structured error responses with error, action, and message fields
 */
export function extractApiErrorMessage(error: any): string {
  if (axios.isAxiosError(error) && error.response?.data) {
    const errorData = error.response.data as ApiErrorResponse;
    if (errorData.message) {
      return errorData.message;
    }
  }

  // Fallback to generic error message
  if (error?.message) {
    return error.message;
  }

  return String(error);
}

/**
 * Extracts the error code from API error responses for conditional handling
 */
export function extractApiErrorCode(error: any): string | null {
  if (axios.isAxiosError(error) && error.response?.data) {
    const errorData = error.response.data as ApiErrorResponse;
    return errorData.error || null;
  }

  return null;
}

/**
 * Extracts the suggested action from API error responses
 */
export function extractApiErrorAction(error: any): string | null {
  if (axios.isAxiosError(error) && error.response?.data) {
    const errorData = error.response.data as ApiErrorResponse;
    return errorData.action || null;
  }

  return null;
}
