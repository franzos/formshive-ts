// Export all generated types from Rust backend
export * from './types/generated';

// Additional response types not covered by generation
export interface GenericListResponse<T> {
  data: T[];
  total: number;
}

export interface FormsResponse extends GenericListResponse<Form> {}
export interface MessagesResponse extends GenericListResponse<Message> {}
export interface IntegrationsResponse extends GenericListResponse<Integration> {}
export interface FilesResponse extends GenericListResponse<File> {}
export interface ChallengesResponse extends GenericListResponse<Challenge> {}

// Import generated types for use above
import type { Form, Message, Integration, File, Challenge } from './types/generated';