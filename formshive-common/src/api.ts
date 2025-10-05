import {
  ApiKeyCreateRequest,
  ApiKeyResponse,
  ApiKeyUpdateRequest,
  ApiKeyUsageResponse,
  ApiProps,
  CommonQueryParams,
  CustomerPortalResponse,
  HttpNewVerifiedEmail,
  makeAuthHeaders,
  makeUrl,
  NewDepositHttp,
  NewSubscriptionResponse,
  NotificationConfig,
  ReferralCodeResponse,
  ReferralHistoryItem,
  ReferralStatsResponse,
  RustyApiKeys,
  RustyApiKeysSpec,
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
  VerifiedEmailsResponse,
} from '@gofranz/common';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { Form, FormAnalyticsResponse, FormAnalyticsAggregateResponse, FormRecipientsQueryParams, FormsIntegrationsQueryParams, FormsIntegrationsResponse, FormsQueryParams, FormsRecipientsResponse, FormsResponse, FormView, HttpNewForm, HttpNewIntegration, HttpUpdateMessage, IntegrationResponse, IntegrationsApiResponse, IntegrationsQueryParams, MessageCountByDay, MessageQueryParams, MessagesResponse, NewFormsIntegration, NewFormsRecipient, UpdateForm, UpdateIntegration, ViewCountByDay } from './types/generated';

export interface ListResponse<T> {
  data: T[];
  total: number;
}

export class RustyFormsApi {
  private baseUrl: string;
  private timeout: number;
  private client: AxiosInstance;
  private errorHandler?: (error: AxiosError) => void;
  private successHandler?: (response: AxiosResponse) => void;
  auth?: RustyAuthSpec;

  constructor({ baseUrl, timeout, auth, errorHandler, successHandler }: ApiProps) {
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

    this.errorHandler = errorHandler;
    this.successHandler = successHandler;

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to automatically handle authentication
    this.client.interceptors.request.use(async (config) => {
      // Check if this request needs auth (uses auth endpoints)
      const needsAuth = config.url?.startsWith('/a/');

      if (needsAuth && this.auth) {
        if (!this.auth.hasValidAccessToken()) {
          await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for auth to be ready
        }
        const token = this.auth.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });

    // Add response interceptor to handle errors / success generically
    this.client.interceptors.response.use(
      (response) => {
        if (this.successHandler) {
          this.successHandler(response);
        }
        return response; // Pass through successful responses
      }, // Pass through successful responses
      (error: AxiosError) => {
        if (this.errorHandler) {
          this.errorHandler(error);
        }
        return Promise.reject(error); // Still reject so specific handlers can override
      }
    );
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

  private getApiKeysApi = (): RustyApiKeysSpec => new RustyApiKeys({ client: this.client });

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

  createCustomerPortalSession = async (): Promise<CustomerPortalResponse> =>
    this.getSubscriptionApi().createCustomerPortalSession(this.getAccessToken());

  // Referral endpoints
  getReferralCode = async (): Promise<ReferralCodeResponse> =>
    this.getReferralApi().getReferralCode(this.getAccessToken());

  getReferralStats = async (): Promise<ReferralStatsResponse> =>
    this.getReferralApi().getReferralStats(this.getAccessToken());

  getReferralHistory = async (): Promise<ListResponse<ReferralHistoryItem>> =>
    this.getReferralApi().getReferralHistory(this.getAccessToken());

  // API Keys endpoints
  createApiKey = async (request: ApiKeyCreateRequest): Promise<ApiKeyResponse> =>
    this.getApiKeysApi().createApiKey(request, this.getAccessToken());

  listApiKeys = async (): Promise<ApiKeyResponse[]> =>
    this.getApiKeysApi().listApiKeys(this.getAccessToken());

  updateApiKey = async (
    id: string,
    request: ApiKeyUpdateRequest
  ): Promise<{ success: boolean }> =>
    this.getApiKeysApi().updateApiKey(id, request, this.getAccessToken());

  deleteApiKey = async (id: string): Promise<{ success: boolean }> =>
    this.getApiKeysApi().deleteApiKey(id, this.getAccessToken());

  getApiKeyUsage = async (id: string): Promise<ApiKeyUsageResponse> =>
    this.getApiKeysApi().getApiKeyUsage(id, this.getAccessToken());

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

  getForms = async (query?: FormsQueryParams): Promise<FormsResponse> => {
    const response = await this.client.get<FormsResponse>(
      makeUrl('/a/forms', query)
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
      { verified_email_id: id }
    );
  };

  deleteVerifiedEmail = async (id: string): Promise<void> => {
    await this.client.delete(`/a/emails/${id}`, this.getAxiosConfig());
  };

  setAccountEmail = async (id: string): Promise<void> => {
    await this.client.put(`/a/emails/${id}/set-account-email`, {}, this.getAxiosConfig());
  };

  getVerifiedEmails = async (): Promise<VerifiedEmailsResponse> => {
    const response = await this.client.get<VerifiedEmailsResponse>(
      '/a/emails'
    );
    return response.data;
  };

  // Form recipients endpoints
  newFormRecipient = async (data: NewFormsRecipient): Promise<void> => {
    await this.client.post('/a/forms/recipients', data, this.getAxiosConfig());
  };

  getFormRecipients = async (
    formId: string,
    query?: FormRecipientsQueryParams
  ): Promise<FormsRecipientsResponse> => {
    const response = await this.client.get<FormsRecipientsResponse>(
      makeUrl(`/a/forms/${formId}/recipients`, query)
    );
    return response.data;
  };

  deleteFormRecipient = async (formId: string, recipientId: string): Promise<void> => {
    await this.client.delete(`/a/forms/${formId}/recipients/${recipientId}`, this.getAxiosConfig());
  };

  // Messages endpoints
  getMessages = async (
    query: MessageQueryParams
  ): Promise<MessagesResponse> => {
    const response = await this.client.get<MessagesResponse>(
      makeUrl('/a/messages', query)
    );
    return response.data;
  };

  updateMessage = async (
    id: string,
    data: HttpUpdateMessage,
    notification?: NotificationConfig | { title: string; message: string }
  ): Promise<void> => {
    const config = this.getAxiosConfig();
    if (notification) {
      (config as any).notification = notification;
    }
    await this.client.patch(`/a/messages/${id}`, data, config);
  };

  deleteMessage = async (id: string): Promise<void> => {
    await this.client.delete(`/a/messages/${id}`, this.getAxiosConfig());
  };

  getMessageView = async (messageId: string): Promise<FormView | null> => {
    const response = await this.client.get<FormView | null>(
      `/a/messages/${messageId}/view`,
      this.getAxiosConfig()
    );
    return response.data;
  };

  getMessageCountByDay = async (params?: {
    form_ids?: string[];
    is_spam?: boolean;
    data_type?: 'views' | 'messages' | 'combined';
  }): Promise<MessageCountByDay[] | ViewCountByDay[] | FormAnalyticsResponse> => {
    const response = await this.client.get(
      makeUrl('/a/messages/count-by-day', params)
    );
    return response.data;
  };

  getAnalyticsAggregate = async (params?: {
    form_ids?: string[];
    is_spam?: boolean;
  }): Promise<FormAnalyticsAggregateResponse> => {
    const response = await this.client.get<FormAnalyticsAggregateResponse>(
      makeUrl('/a/analytics/aggregate', params)
    );
    return response.data;
  };

  // Integrations endpoints
  newIntegration = async (data: HttpNewIntegration): Promise<IntegrationResponse> => {
    const response = await this.client.post<IntegrationResponse>(
      '/a/integrations',
      data
    );
    return response.data;
  };

  getIntegrations = async (
    query: IntegrationsQueryParams
  ): Promise<IntegrationsApiResponse> => {
    const response = await this.client.get<IntegrationsApiResponse>(
      makeUrl('/a/integrations', query)
    );
    return response.data;
  };

  getIntegration = async (id: string): Promise<IntegrationResponse> => {
    const response = await this.client.get<IntegrationResponse>(
      `/a/integrations/${id}`
    );
    return response.data;
  };

  updateIntegration = async (id: string, data: UpdateIntegration): Promise<void> => {
    await this.client.patch(`/a/integrations/${id}`, data, this.getAxiosConfig());
  };

  deleteIntegration = async (id: string): Promise<void> => {
    await this.client.delete(`/a/integrations/${id}`, this.getAxiosConfig());
  };

  // Forms integrations endpoints
  newFormsIntegration = async (data: NewFormsIntegration): Promise<void> => {
    await this.client.post('/a/forms/integrations', data, this.getAxiosConfig());
  };

  getFormsIntegrations = async (
    formId: string,
    query: FormsIntegrationsQueryParams
  ): Promise<FormsIntegrationsResponse> => {
    const response = await this.client.get(
      makeUrl(`/a/forms/${formId}/integrations`, query)
    );
    return response.data;
  };

  deleteFormsIntegration = async (formId: string, integrationId: string): Promise<void> => {
    await this.client.delete(
      `/a/forms/${formId}/integrations/${integrationId}`
    );
  };

  async downloadFile(fileId: string) {
    const response = await fetch(makeUrl(`${this.baseUrl}/a/files/download/${fileId}`), {
      method: 'GET',
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
