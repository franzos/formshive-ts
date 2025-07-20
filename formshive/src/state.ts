import * as Sentry from '@sentry/react';
import {
  LOGIN_METHOD,
  LoginChallenge,
  LoginChallengeUserResponse,
  LoginSuccess,
  RustyAuth,
  Session,
  CommonQueryParams,
  SubscriptionResponse,
  UsageResponse,
  CustomerPortalResponse,
  SubscriptionPlanConfig,
  ReferralCodeResponse,
  ReferralStatsResponse,
  NewSubscriptionResponse,
  getErrorTitle,
  VerifiedEmail,
  VerifiedEmailsResponse,
  AccountMovementsResponse,
  ReferralHistoryResponse,
} from '@gofranz/common';
import { create } from 'zustand';
import { API_BASE_URL, LOCAL_STORAGE_KEY } from './constants';
import type { AxiosError } from "axios";
import { showApiErrorNotification } from '@gofranz/common-components';
import { notifications } from '@mantine/notifications';
import { Form, FormsResponse, RustyFormsApi, FormsQueryParams, FormsRecipientsResponse, FormRecipientsQueryParams, MessageQueryParams, File, Message } from '@gofranz/formshive-common';

// Helper function to handle API errors generically
const handleApiError = (error: AxiosError) => {
  // Don't show notifications for aborted requests or network timeouts during development
  if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
    return;
  }

  const title = getErrorTitle(error);
  showApiErrorNotification(error, notifications, title);
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

interface State {
  init: () => void;
  getSession: () => Session | undefined;
  login: (identifier: string, loginMethod: LOGIN_METHOD) => Promise<LoginChallenge>;
  loginChallenge(loginResponse: LoginChallengeUserResponse): Promise<LoginSuccess>;
  // generateNewAccount: () => Promise<void>;
  logout: () => Promise<void>;
  api: RustyFormsApi;
  verifiedEmails: VerifiedEmail[];
  forms: Form[];
  // Basically form recipients
  verifiedEmailsByForm: VerifiedEmailsByForm;

  // Subscription state
  subscriptionPlans: SubscriptionPlanConfig[] | null;
  currentSubscription: SubscriptionResponse | null;
  subscriptionUsage: UsageResponse | null;

  // Referral state
  referralCode: ReferralCodeResponse | null;
  referralStats: ReferralStatsResponse | null;

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

  // Subscription methods
  getAndSetSubscriptionPlans: () => Promise<SubscriptionPlanConfig[]>;
  getAndSetCurrentSubscription: () => Promise<SubscriptionResponse | null>;
  getAndSetSubscriptionUsage: () => Promise<UsageResponse | null>;
  subscribeToplan: (planId: string) => Promise<NewSubscriptionResponse | undefined>;
  cancelSubscription: () => Promise<any>;
  createCustomerPortalSession: () => Promise<CustomerPortalResponse>;

  // Account methods
  getAccountMovements: (query?: CommonQueryParams) => Promise<AccountMovementsResponse>;

  // Referral methods
  getAndSetReferralCode: () => Promise<ReferralCodeResponse>;
  getAndSetReferralStats: () => Promise<ReferralStatsResponse>;
  getReferralHistory: () => Promise<ReferralHistoryResponse>;
}

const api = new RustyFormsApi({
  baseUrl: API_BASE_URL,
  auth: new RustyAuth({ baseUrl: API_BASE_URL, useLocalStore: true, localStorageKey: LOCAL_STORAGE_KEY }),
  errorHandler: handleApiError,
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
  // generateNewAccount: async () => {
  //   const keypair = await loadOrCreateKeypair();
  //   console.log(`Generated new account with public key: ${keypair.publicKey}`);
  //   get().api?.auth?.setSession({
  //     isLoggedIn: false,
  //     publicKey: keypair.publicKey,
  //   });
  //   setLsPrivateKey(keypair.privateKey, LOCAL_STORAGE_KEY);
  //   setLsPublicKey(keypair.publicKey, LOCAL_STORAGE_KEY);
  //   const loginChallenge = await get().login(keypair.publicKey, LOGIN_METHOD.NOSTR);

  //   if (loginChallenge.type === 'NOSTR') {
  //     const { content } = loginChallenge;
  //     // Create the signed nostr event
  //     const event = new NEvent({
  //       pubkey: keypair.publicKey,
  //       kind: NEVENT_KIND.CLIENT_AUTHENTICATION,
  //       tags: [
  //         ['relay', API_BASE_URL],
  //         ['challenge', content.challenge],
  //       ],
  //       content: '',
  //     });

  //     await get().loginChallenge({
  //       type: 'NOSTR',
  //       content: {
  //         id: content.id,
  //         response: event.ToObj(),
  //       },
  //     });

  //     // Update Sentry context after successful account generation and login
  //     const session = get().getSession();
  //     updateSentryUserContext(session);
  //   }
  // },
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
