'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface UseApiFormOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  successMessage?: string;
  errorMessage?: string;
}

interface ApiErrorResponse {
  error?: {
    code?: string;
    message?: string;
    details?: Array<{ message?: string }> | string;
  };
  details?: Array<{ message?: string }>;
}

/**
 * Hook for handling API form submissions with loading state, error handling, and toast notifications
 */
export function useApiForm(options: UseApiFormOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (
    url: string,
    fetchOptions: {
      method?: string;
      body?: unknown;
      headers?: Record<string, string>;
    } = {},
    callOptions?: {
      successMessage?: string;
      errorMessage?: string;
      onSuccess?: () => void;
      onError?: (error: string) => void;
    }
  ): Promise<boolean> => {
    const { method = 'POST', body, headers = {} } = fetchOptions;
    const successMessage = callOptions?.successMessage ?? options.successMessage;
    const errorMessage = callOptions?.errorMessage ?? options.errorMessage;
    const onSuccess = callOptions?.onSuccess ?? options.onSuccess;
    const onError = callOptions?.onError ?? options.onError;

    setIsLoading(true);
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      // Only parse JSON if there's content
      let data: ApiErrorResponse = {};
      const contentType = response.headers.get('content-type');
      const hasContent = contentType && contentType.includes('application/json');
      
      if (hasContent || !response.ok) {
        try {
          const text = await response.text();
          if (text) {
            data = JSON.parse(text);
          }
        } catch (parseError) {
          // If JSON parsing fails and it's an error response, use status text
          if (!response.ok) {
            const statusText = response.statusText || `HTTP ${response.status}`;
            throw new Error(statusText);
          }
          // For successful responses with invalid JSON, just continue
          data = {};
        }
      }

      if (!response.ok) {
        // Parse error message from response
        let parsedErrorMessage = errorMessage || 'Request failed';
        
        if (data.error) {
          const { message, details } = data.error;
          if (details) {
            const detailMessages = Array.isArray(details)
              ? details.map((d) => (typeof d === 'string' ? d : d.message || '')).filter(Boolean)
              : [String(details)];
            parsedErrorMessage = detailMessages.length > 0
              ? `${message || 'Error'}: ${detailMessages.join(', ')}`
              : message || parsedErrorMessage;
          } else {
            parsedErrorMessage = message || parsedErrorMessage;
          }
        } else if (data.details) {
          const detailMessages = Array.isArray(data.details)
            ? data.details.map((d) => d.message || '').filter(Boolean)
            : [String(data.details)];
          parsedErrorMessage = detailMessages.length > 0
            ? detailMessages.join(', ')
            : parsedErrorMessage;
        }

        throw new Error(parsedErrorMessage);
      }

      // Success
      const successMsg = successMessage || 'Operation completed successfully';
      toast.success(successMsg);
      
      if (onSuccess) {
        onSuccess();
      }

      return true;
    } catch (error) {
      console.error('API form submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    submit,
  };
}

