import {
  CommonQueryParams,
  makeAuthHeaders,
  NewDepositHttp,
  NewSubscriptionResponse,
  QueryParamsBase,
  ReferralCodeResponse,
  ReferralHistoryItem,
  ReferralStatsResponse,
  RustyAuthSpec,
  RustyDeposit,
  RustyDepositSpec,
  RustyReferral,
  RustyReferralSpec,
  RustySubscription,
  RustySubscriptionSpec,
  SubscriptionPlanConfig,
  SubscriptionResponse,
  UsageResponse,
} from '@gofranz/common';
import axios, { AxiosInstance } from 'axios';
import {
  FileAttachment,
  Form,
  FormsIntegrationsQueryParams,
  FormsRecipientsQueryParams,
  HttpIntegration,
  HttpNewForm,
  HttpNewFormsIntegration,
  HttpNewFormsRecipient,
  HttpNewIntegration,
  HttpNewVerifiedEmail,
  HttpUpdateIntegration,
  HttpUpdateMessage,
  VerifiedEmail,
  IntegrationsQueryParams,
  Message,
  MessageCountByDay,
  MessagesQueryParams,
  UpdateForm,
} from './models';

export interface GenericResponse {
  status: number;
  data?: any;
}

export interface TypedGenericResponse<T> {
  status: number;
  data?: T;
}

export interface ListResponse<T> {
  data: T[];
  total: number;
}

export type ExtendedListResponse<T, R> = ListResponse<T> & {
  [key: string]: R | T[] | number;
};

export const makeHeaders = (accessToken: string) => {
  if (!accessToken) {
    throw new Error('No access token');
  }
  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

export const defaultReqHeaders = (kind: 'json' | 'form', accessToken?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': `application/${kind}`,
  };

  if (accessToken) {
    Object.assign(headers, makeHeaders(accessToken));
  }

  return headers;
};

export interface MessageCountByDayParams extends QueryParamsBase {
  form_ids?: string[];
  is_spam?: boolean;
}

function makeUrl(
  url: string,
  params?: QueryParamsBase | MessageCountByDayParams | IntegrationsQueryParams
) {
  if (params) {
    return `${url}?${new URLSearchParams(params as Record<string, string>)}`;
  }
  return url;
}

export interface RustyFormsApiProps {
  baseUrl?: string;
  timeout?: number;
  auth?: RustyAuthSpec;
}

export class RustyFormsAPI {
  private baseUrl: string;
  private timeout: number;
  private client: AxiosInstance;
  auth?: RustyAuthSpec;

  constructor({ baseUrl, timeout, auth }: RustyFormsApiProps) {
    if (baseUrl) {
      this.baseUrl = baseUrl;
    } else {
      this.baseUrl = 'https://api.formshive.com/v1';
    }

    console.info(`[api] => baseUrl: ${this.baseUrl}`);

    if (timeout) {
      this.timeout = timeout;
    } else {
      this.timeout = 5000;
    }

    if (auth) {
      this.auth = auth;
    } else {
      console.warn('Auth config not set');
    }

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to handle authentication timing
    this.client.interceptors.request.use(async (config) => {
      // Check if this request needs auth (has Authorization header or uses auth endpoints)
      const needsAuth = config.url?.startsWith('/a/') || 
                       (config.headers && 'Authorization' in config.headers);
      
      if (needsAuth && this.auth && !this.auth.hasValidAccessToken()) {
        // Wait for auth to be ready
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      return config;
    });
  }

  getAuthApi = (): RustyAuthSpec => {
    if (!this.auth) {
      throw new Error('Auth config not set');
    }
    return this.auth;
  };

  private getDepositApi = (): RustyDepositSpec => new RustyDeposit({ client: this.client });

  private getSubscriptionApi = (): RustySubscriptionSpec =>
    new RustySubscription({ client: this.client });

  private getReferralApi = (): RustyReferralSpec => new RustyReferral({ client: this.client });

  private getAccessToken = () => this.getAuthApi().getAccessToken();

  private getAuthHeaders = () => makeAuthHeaders(this.getAccessToken());

  private getAxiosConfig = () => ({ headers: this.getAuthHeaders(), timeout: this.timeout });

  getAccountBalance = async () => this.getDepositApi().getAccountBalance(this.getAccessToken());

  getAccountMovements = async (query: CommonQueryParams = {}) =>
    this.getDepositApi().getAccountMovements(query, this.getAccessToken());

  getDeposits = async (query: CommonQueryParams) =>
    this.getDepositApi().getDeposits(query, this.getAccessToken());

  getDeposit = async (id: string) => this.getDepositApi().getDeposit(id, this.getAccessToken());

  newDeposit = async (deposit: NewDepositHttp) =>
    this.getDepositApi().newDeposit(deposit, this.getAccessToken());

  // Subscription endpoints
  getSubscriptionPlans = async (): Promise<SubscriptionPlanConfig[]> =>
    this.getSubscriptionApi().getSubscriptionPlans();

  getCurrentSubscription = async (): Promise<SubscriptionResponse | null> =>
    this.getSubscriptionApi().getCurrentSubscription(this.getAccessToken());

  subscribeToplan = async (planId: string): Promise<NewSubscriptionResponse> =>
    this.getSubscriptionApi().subscribeToplan(planId, this.getAccessToken());

  cancelSubscription = async (): Promise<any> =>
    this.getSubscriptionApi().cancelSubscription(this.getAccessToken());

  getSubscriptionUsage = async (): Promise<UsageResponse> =>
    this.getSubscriptionApi().getSubscriptionUsage(this.getAccessToken());

  createCustomerPortalSession = async (): Promise<CustomerPortalSession> =>
    this.getSubscriptionApi().createCustomerPortalSession(this.getAccessToken());

  // Referral endpoints
  getReferralCode = async (): Promise<ReferralCodeResponse> =>
    this.getReferralApi().getReferralCode(this.getAccessToken());

  getReferralStats = async (): Promise<ReferralStatsResponse> =>
    this.getReferralApi().getReferralStats(this.getAccessToken());

  getReferralHistory = async (): Promise<ListResponse<ReferralHistoryItem>> =>
    this.getReferralApi().getReferralHistory(this.getAccessToken());
  // Forms endpoints
  newForm = async (data: HttpNewForm): Promise<Form> => {
    const response = await this.client.post<Form>('/a/forms', data, this.getAxiosConfig());
    return response.data;
  };

  updateForm = async (id: string, data: UpdateForm): Promise<void> => {
    await this.client.patch(`/a/forms/${id}`, data, this.getAxiosConfig());
  };

  deleteForm = async (id: string): Promise<void> => {
    await this.client.delete(`/a/forms/${id}`, this.getAxiosConfig());
  };

  getForms = async (query?: QueryParamsBase): Promise<ListResponse<Form>> => {
    const response = await this.client.get<ListResponse<Form>>(
      makeUrl('/a/forms', query),
      this.getAxiosConfig()
    );
    return response.data;
  };

  getForm = async (id: string): Promise<Form> => {
    const response = await this.client.get<Form>(`/a/forms/${id}`, this.getAxiosConfig());
    return response.data;
  };

  // Email verification endpoints
  newVerifiedEmail = async (data: HttpNewVerifiedEmail): Promise<void> => {
    await this.client.post('/a/emails/verify', data, this.getAxiosConfig());
  };

  verifyVerifiedEmail = async (id: string): Promise<void> => {
    await this.client.post(
      '/a/emails/verify/retry',
      { verified_email_id: id },
      this.getAxiosConfig()
    );
  };

  deleteVerifiedEmail = async (id: string): Promise<void> => {
    await this.client.delete(`/a/emails/${id}`, this.getAxiosConfig());
  };

  getVerifiedEmails = async (): Promise<ListResponse<VerifiedEmail>> => {
    const response = await this.client.get<ListResponse<VerifiedEmail>>(
      '/a/emails',
      this.getAxiosConfig()
    );
    return response.data;
  };

  // Form recipients endpoints
  newFormRecipient = async (data: HttpNewFormsRecipient): Promise<void> => {
    await this.client.post('/a/forms/recipients', data, this.getAxiosConfig());
  };

  getFormRecipients = async (
    formId: string,
    query?: FormsRecipientsQueryParams
  ): Promise<ListResponse<VerifiedEmail>> => {
    const response = await this.client.get<ListResponse<VerifiedEmail>>(
      makeUrl(`/a/forms/${formId}/recipients`, query),
      this.getAxiosConfig()
    );
    return response.data;
  };

  deleteFormRecipient = async (formId: string, recipientId: string): Promise<void> => {
    await this.client.delete(`/a/forms/${formId}/recipients/${recipientId}`, this.getAxiosConfig());
  };

  // Messages endpoints
  getMessages = async (
    query: MessagesQueryParams
  ): Promise<ExtendedListResponse<Message, FileAttachment[]>> => {
    const response = await this.client.get<ExtendedListResponse<Message, FileAttachment[]>>(
      makeUrl('/a/messages', query),
      this.getAxiosConfig()
    );
    return response.data;
  };

  updateMessage = async (id: string, data: HttpUpdateMessage): Promise<void> => {
    await this.client.patch(`/a/messages/${id}`, data, this.getAxiosConfig());
  };

  deleteMessage = async (id: string): Promise<void> => {
    await this.client.delete(`/a/messages/${id}`, this.getAxiosConfig());
  };

  getMessageCountByDay = async (params?: {
    form_ids?: string[];
    is_spam?: boolean;
  }): Promise<MessageCountByDay[]> => {
    const response = await this.client.get<MessageCountByDay[]>(
      makeUrl('/a/messages/count-by-day', params),
      this.getAxiosConfig()
    );
    return response.data;
  };

  // Integrations endpoints
  newIntegration = async (data: HttpNewIntegration): Promise<HttpIntegration> => {
    const response = await this.client.post<HttpIntegration>(
      '/a/integrations',
      data,
      this.getAxiosConfig()
    );
    return response.data;
  };

  getIntegrations = async (
    query: IntegrationsQueryParams
  ): Promise<ListResponse<HttpIntegration>> => {
    const response = await this.client.get<ListResponse<HttpIntegration>>(
      makeUrl('/a/integrations', query),
      this.getAxiosConfig()
    );
    return response.data;
  };

  getIntegration = async (id: string): Promise<HttpIntegration> => {
    const response = await this.client.get<HttpIntegration>(
      `/a/integrations/${id}`,
      this.getAxiosConfig()
    );
    return response.data;
  };

  updateIntegration = async (id: string, data: HttpUpdateIntegration): Promise<void> => {
    await this.client.patch(`/a/integrations/${id}`, data, this.getAxiosConfig());
  };

  deleteIntegration = async (id: string): Promise<void> => {
    await this.client.delete(`/a/integrations/${id}`, this.getAxiosConfig());
  };

  // Forms integrations endpoints
  newFormsIntegration = async (data: HttpNewFormsIntegration): Promise<void> => {
    await this.client.post('/a/forms/integrations', data, this.getAxiosConfig());
  };

  getFormsIntegrations = async (
    formId: string,
    query: FormsIntegrationsQueryParams
  ): Promise<any> => {
    const response = await this.client.get(
      makeUrl(`/a/forms/${formId}/integrations`, query),
      this.getAxiosConfig()
    );
    return response.data;
  };

  deleteFormsIntegration = async (formId: string, integrationId: string): Promise<void> => {
    await this.client.delete(
      `/a/forms/${formId}/integrations/${integrationId}`,
      this.getAxiosConfig()
    );
  };

  async downloadFile(fileId: string, accessToken: string) {
    const response = await fetch(makeUrl(`${this.baseUrl}/a/files/download/${fileId}`), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      const signedUrl = response.url;
      if (signedUrl) {
        return signedUrl;
      }
    }
    throw new Error('File not found');
  }
}
