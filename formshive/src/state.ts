import {
  CommonQueryParams,
  getErrorTitle,
  LOGIN_METHOD,
  LoginChallengeUserResponse,
  RustyAuth,
  Session,
  StateBaseWithSubscription,
  VerifiedEmail,
  VerifiedEmailsResponse
} from '@gofranz/common';
import { showApiErrorNotification, showSuccessNotification } from '@gofranz/common-components';
import { File, Form, FormRecipientsQueryParams, FormsQueryParams, FormsRecipientsResponse, FormsResponse, Message, MessageQueryParams, RustyFormsApi } from '@gofranz/formshive-common';
import { notifications } from '@mantine/notifications';
import * as Sentry from '@sentry/react';
import type { AxiosError, AxiosResponse } from "axios";
import { create } from 'zustand';
import { API_BASE_URL, LOCAL_STORAGE_KEY } from './constants';

const errorHandler = (error: AxiosError) => {
  // Don't show notifications for aborted requests or network timeouts during development
  if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
    return;
  }

  Sentry.captureException(error, {
    extra: {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    },
  });

  console.log('API Error:', error);

  const title = getErrorTitle(error);
  showApiErrorNotification(error, notifications, title);
};

const successHandler = (response: AxiosResponse) => {
  const accepted = ['post', 'put', 'patch']
  if (!accepted.includes(response.config.method || '')) {
    return;
  }

  showSuccessNotification(
    `Request Successful`,
    `Your ${response.config.method?.toUpperCase()} request to ${response.config.url} was successful.`,
    notifications
  );
};

// Helper function to update Sentry user context
const updateSentryUserContext = (session: Session | undefined) => {
  if (session?.isLoggedIn) {
    Sentry.setUser({
      id: session.userId,
      // Partially mask the public key for privacy
      username: session.publicKey
        ? `${session.publicKey.slice(0, 8)}...${session.publicKey.slice(-8)}`
        : undefined,
      email: undefined, // Don't set email for privacy
    });

    // Set additional context
    Sentry.setTag('login_method', session.method || 'unknown');
    Sentry.setTag('user_authenticated', 'true');
  } else {
    Sentry.setUser(null);
    Sentry.setTag('user_authenticated', 'false');
  }
};

export interface VerifiedEmailsByForm {
  [formId: string]: VerifiedEmail[];
}

interface State extends StateBaseWithSubscription<RustyFormsApi> {
  forms: Form[];
  // Basically form recipients
  verifiedEmailsByForm: VerifiedEmailsByForm;

  getAndSetForms: (params?: FormsQueryParams) => Promise<FormsResponse>;
  getAndSetVerifiedEmails: (params?: FormRecipientsQueryParams) => Promise<VerifiedEmailsResponse>;
  getAndSetFormVerifiedEmails: (formId: string, params?: FormRecipientsQueryParams) => Promise<VerifiedEmailsResponse>;
  getMessagesWithForms: (params: MessageQueryParams) => Promise<{
    data: {
      form: Form | undefined;
      files: File[];
      msg: Message;
    }[];
    total: number;
  }>;
  downloadFile: (id: string) => Promise<string>;
}

const api = new RustyFormsApi({
  baseUrl: API_BASE_URL,
  auth: new RustyAuth({ baseUrl: API_BASE_URL, useLocalStore: true, localStorageKey: LOCAL_STORAGE_KEY }),
  errorHandler,
  successHandler
});

export const useRustyState = create<State>((set, get) => ({
  init: () => {
    // Update Sentry context with current session on init
    const session = get().getSession();
    updateSentryUserContext(session);
  },
  session: {
    isLoggedIn: false,
  },
  getSession: (): Session | undefined => {
    if (api.auth) {
      return api.auth.getSession();
    }
    console.warn('No auth instance available to get session');
  },
  login: async (identifier: string, loginMethod: LOGIN_METHOD) => {
    if (!api.auth) {
      throw new Error('No auth');
    }

    switch (loginMethod) {
      case LOGIN_METHOD.NOSTR:
    // Nostr login uses the public key as the identifier
      return await api.auth.login({
        type: LOGIN_METHOD.NOSTR,
        content: {
          public_key: identifier,
        },
      });
      case LOGIN_METHOD.EMAIL_MAGIC_LINK:
      // Use the identifier as the email for magic link login
        return await api.auth.login({
          type: LOGIN_METHOD.EMAIL_MAGIC_LINK,
          content: {
          email: identifier,
        },
      });
      case LOGIN_METHOD.GOOGLE:
        return await api.auth.login({
          type: LOGIN_METHOD.GOOGLE,
          content: {},
      });
      default:
        throw new Error(`Unsupported login method: ${loginMethod}`);
    }
  },
  /**
   *
   * @param loginResponse
   * @param method
   *    MANUAL: manual login (supply signature)
   *    NOSTR: login with nostr extentions
   *    PRIVATE_KEY: login with private key
   * @param signedResponse
   * @returns
   */
  loginChallenge: async (loginResponse: LoginChallengeUserResponse) => {
    if (!api.auth) {
      throw new Error('No auth');
    }

    if (loginResponse.type === LOGIN_METHOD.EMAIL_MAGIC_LINK) {
      const response = await api.auth.loginChallenge({
        type: LOGIN_METHOD.EMAIL_MAGIC_LINK,
        content: {
          id: loginResponse.content.id,
          challenge: loginResponse.content.challenge,
        }
      });

      // Update Sentry context after successful login
      updateSentryUserContext(get().getSession());

      return response;
    } else if (
      loginResponse.type === LOGIN_METHOD.NOSTR
    ) {
      const response = await api.auth.loginChallenge(loginResponse);

      // Update Sentry context after successful login
      updateSentryUserContext(get().getSession());

      return response;
    }
    throw new Error('Unsupported challenge response');
  },
  logout: async () => {
    if (api.auth) {
      await api.auth.logout();
    } else {
      console.warn('No auth instance available to logout');
    }

    // Clear Sentry user context after logout
    updateSentryUserContext(undefined);
  },
  api,
  verifiedEmails: [],
  forms: [],
  verifiedEmailsByForm: {},

  // Subscription state
  subscriptionPlans: [],
  currentSubscription: null,
  subscriptionUsage: null,

  // Referral state
  referralCode: null,
  referralStats: null,
  getAndSetForms: async (params?: FormsQueryParams) => {
    const res = await api.getForms(params);
    if (res.data) {
      set({ forms: res.data });
      return res;
    }
    return {
      data: [],
      total: 0,
    };
  },
  getForm: async (id: string) => {
    const form = await api.getForm(id);
    if (!form) {
      throw new Error(`Could not get form with id: ${id}`);
    }
    return form;
  },
  getAndSetVerifiedEmails: async (
    // params?: FormRecipientsQueryParams
  ): Promise<FormsRecipientsResponse> => {
    // TODO: Params
    const res = await api.getVerifiedEmails();
    if (res.data) {
      set({ verifiedEmails: res.data });
      return res;
    }
    return {
      data: [],
      total: 0,
    };
  },
  getAndSetFormVerifiedEmails: async (
    formId: string,
    params?: FormRecipientsQueryParams
  ): Promise<VerifiedEmailsResponse> => {
    const res = await api.getFormRecipients(formId, params);
    if (res.data) {
      const exists = get().verifiedEmailsByForm[formId];
      if (exists) {
        set({
          verifiedEmailsByForm: {
            ...get().verifiedEmailsByForm,
            [formId]: [...exists, ...res.data],
          },
        });
        return res;
      }
      set({
        verifiedEmailsByForm: {
          ...get().verifiedEmailsByForm,
          [formId]: res.data,
        },
      });

      return res;
    }
    return {
      data: [],
      total: 0,
    };
  },
  getFormRecipients: async (formId: string, query: FormRecipientsQueryParams) => {
    const res = await api.getFormRecipients(formId, query);
    if (res.data) {
      const exists = get().verifiedEmailsByForm[formId];
      if (exists) {
        set({
          verifiedEmailsByForm: {
            ...get().verifiedEmailsByForm,
            [formId]: [...exists, ...res.data],
          },
        });
        return res.data;
      }
      set({
        verifiedEmailsByForm: {
          ...get().verifiedEmailsByForm,
          [formId]: res.data,
        },
      });

      return res.data;
    }
    return {
      data: [],
      total: 0,
    };
  },
  getMessagesWithForms: async (query: MessageQueryParams) => {
    const res = await api.getMessages(query);
    if (res) {
      const files = Array.isArray(res.files) ? res.files : [];

      return {
        data: res.data.map((m) => {
          const filteredFiles = files.filter(
            (f): f is File => 'message_id' in f && f.message_id === m.id
          );

          return {
            msg: m,
            files: filteredFiles,
            form: get().forms.find((f) => f.id === m.form_id),
          };
        }),
        total: res.total,
      };
    }
    return {
      data: [],
      total: 0,
    };
  },
  downloadFile: async (id: string) => {
    return api.downloadFile(id);
  },

  // Subscription methods
  getAndSetSubscriptionPlans: async () => {
    const subscriptionPlans = await api.getSubscriptionPlans();
    set({ subscriptionPlans });
    return subscriptionPlans;
  },

  getAndSetCurrentSubscription: async () => {
    if (!api.auth?.hasValidAccessToken()) {
      return new Promise((resolve) => {
        setTimeout(async () => {
          const result = await get().getAndSetCurrentSubscription();
          resolve(result);
        }, 500);
      });
    }
    const subscription = await api.getCurrentSubscription();
    set({ currentSubscription: subscription });
    return subscription;
  },

  getAndSetSubscriptionUsage: async () => {
    if (!api.auth?.hasValidAccessToken()) {
      return new Promise((resolve) => {
        setTimeout(async () => {
          const result = await get().getAndSetSubscriptionUsage();
          resolve(result);
        }, 500);
      });
    }
    try {
      const usage = await api.getSubscriptionUsage();
      set({ subscriptionUsage: usage });
      return usage;
    } catch (error: any) {
      // If user doesn't have an active subscription, this will fail
      // Reset usage to null to indicate no subscription usage available
      set({ subscriptionUsage: null });
      console.warn('No subscription usage available:', error.message);
      return null;
    }
  },

  subscribeToplan: async (planId: string) => {
    try {
      const result = await api.subscribeToplan(planId);

      if (result.type === "Checkout") {
        // Redirect to Stripe checkout
        window.location.href = result.content.redirect_url;
        return result;
      }

      // Refresh subscription data after successful change
      await get().getAndSetCurrentSubscription();
      return result;
    } catch (error: any) {
      // Check if this is a CustomerPortalRequired error
      if (
        error.response?.status === 400 &&
        error.response?.data?.error === 'CustomerPortalRequired' &&
        error.response?.data?.action === 'redirect_to_customer_portal'
      ) {
        // Redirect to Customer Portal for paid subscription management
        const portalSession = await get().createCustomerPortalSession();
        window.location.href = portalSession.portal_url;
        return;
      }

      // Re-throw other errors
      throw error;
    }
  },

  cancelSubscription: async () => {
    const result = await api.cancelSubscription();
    // Refresh subscription data after canceling
    await get().getAndSetCurrentSubscription();
    return result;
  },

  createCustomerPortalSession: async () => {
    return await api.createCustomerPortalSession();
  },

  // Account methods
  getAccountMovements: async (query: CommonQueryParams = {}) => {
    return await api.getAccountMovements(query);
  },

  // Referral methods
  getAndSetReferralCode: async () => {
    if (!api.auth?.hasValidAccessToken()) {
      return new Promise((resolve) => {
        setTimeout(async () => {
          const result = await get().getAndSetReferralCode();
          resolve(result);
        }, 500);
      });
    }
    const code = await api.getReferralCode();
    set({ referralCode: code });
    return code;
  },

  getAndSetReferralStats: async () => {
    if (!api.auth?.hasValidAccessToken()) {
      return new Promise((resolve) => {
        setTimeout(async () => {
          const result = await get().getAndSetReferralStats();
          resolve(result);
        }, 500);
      });
    }
    const stats = await api.getReferralStats();
    set({ referralStats: stats });
    return stats;
  },

  getReferralHistory: async () => {
    return await api.getReferralHistory();
  },
}));
