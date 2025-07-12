import { QueryParamsBase } from '@gofranz/common';

export interface VerifiedEmail {
  id: string;
  user_id: string;
  email: string;
  is_verified: boolean;
  created_at: Date;
  is_account_email: boolean;
}

export interface HttpNewVerifiedEmail {
  email: string;
}

export interface Form {
  id: string;
  title: string;
  user_id: string;
  filter_spam: boolean;
  check_challenge: boolean;
  check_specs: boolean;
  specs: string;
  redirect_url: string;
  auto_response_enabled: boolean;
  auto_response_subject: string | null;
  auto_response_text: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface HttpNewForm {
  title: string;
  filter_spam?: boolean;
  check_challenge?: boolean;
  check_specs?: boolean;
  specs?: string;
  redirect_url?: string;
  auto_response_enabled?: boolean;
  auto_response_subject?: string | null;
  auto_response_text?: string | null;
}

export interface UpdateForm {
  title: string;
  filter_spam: boolean;
  check_challenge: boolean;
  check_specs: boolean;
  specs: string;
  redirect_url: string;
  auto_response_enabled: boolean;
  auto_response_subject: string | null;
  auto_response_text: string | null;
}

/**
 * id from form_id_verified_email_id
 */
export interface FormsRecipient {
  form_id: string;
  verified_email_id: string;
  created_at: Date;
}

// NewFormsRecipient
export interface HttpNewFormsRecipient {
  form_id: string;
  verified_email_id: string;
}

export interface Message {
  id: string;
  form_id: string;
  data: any;
  is_spam: boolean;
  spam_score: number;
  user_marked_spam: boolean;
  src_ipv4: string;
  src_ipv6: string;
  src_agent: string;
  created_at: Date;
}

export interface FileAttachment {
  id: string;
  form_id: string;
  message_id: string;
  filename: string;
  bucket_name: string;
  path: string;
  size: number;
  created_at: Date;
}

export interface MessagesQueryParams extends QueryParamsBase {
  form_id?: string;
  is_spam?: boolean;
}

export interface MessageCountByDay {
  date: string;
  message_count: number;
}

export interface IntegrationsQueryParams extends QueryParamsBase {
  form_id?: string;
}

export interface VerfiedEmailsQuery {
  form_id?: string;
}

export interface FormsQueryParams extends QueryParamsBase {}

export interface FormsRecipientsQueryParams extends QueryParamsBase {}

export interface FormsIntegrationsQueryParams extends QueryParamsBase {}

export interface HttpUpdateMessage {
  user_marked_spam: boolean;
}
export interface HttpIntegration {
  id: string;
  user_id: string;
  title: string;
  kind: string;
  data: string;
  created_at: string;
  updated_at: string;
}

export interface HttpNewIntegration {
  title: string;
  kind: string;
  data: string;
  secrets?: Record<string, any>;
}

export interface HttpUpdateIntegration {
  title?: string;
  data?: string;
  secrets?: Record<string, any>;
}

export interface HttpNewFormsIntegration {
  form_id: string;
  integration_id: string;
}

export interface ApiErrorResponse {
  error: string;
  action: string | null;
  message: string;
}
