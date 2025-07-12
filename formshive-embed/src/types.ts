// TypeScript type definitions for Formshive embed
export type SupportedFramework = 'bootstrap' | 'bulma' | 'formshive';

export interface FormshiveOptions {
  formId?: string | null;
  framework?: SupportedFramework;
  apiEndpoint?: string;
  title?: string | null;
  rustyFormsDiv?: HTMLElement | null;
}

export interface UrlParameters {
  form_id: string | null;
  api_endpoint: string | null;
  framework: string | null;
  title: string | null;
}

// Global window interface declaration for browser exports
declare global {
  interface Window {
    FormshiveUtils: {
      loadFormshiveForm: (options: FormshiveOptions) => Promise<void>;
      loadAltchaIfNeeded: (html: string) => void;
      showErrorMessage: (element: HTMLElement, message: string) => void;
      getUrlParameters: () => UrlParameters;
      initializeLinkForm: () => Promise<void>;
    };
  }
}

// Make this file a module
export {};