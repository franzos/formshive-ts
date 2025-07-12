import { FormsRecipient } from './models';

export const forms_placeholder = [
  {
    id: 'df828c71-3661-4bef-902f-a7131457a797',
    title: 'Contact Form',
    user_id: '0228fa6d-3d3b-4d02-828c-f93785c57b16',
    filter_spam: false,
    redirect_url: 'https://redirect.com',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '0149c6cc-67fe-427d-a3e1-2bd90b5c5d17',
    title: 'Job Application form',
    user_id: '35902e1f-e544-4ba3-8f6f-e1add3494d76',
    filter_spam: true,
    redirect_url: 'https://redirect.com',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'a2b0d1b3-0b3d-4a5d-9f1b-0a5d9f2b1d0b',
    title: 'Newsletter Signup',
    user_id: '35902e1f-e544-4ba3-8f6f-e1add3494d76',
    filter_spam: true,
    redirect_url: 'https://redirect.com',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'b9c8a7b6-6d5c-4e4d-8a9b-7b6d5c4e4d8a',
    title: 'Contact Form',
    user_id: '0228fa6d-3d3b-4d02-828c-f93785c57b16',
    filter_spam: false,
    redirect_url: 'https://redirect.com',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'c3d2e1f0-9e8f-7d6c-5b4a-3a291b0c9d8e',
    title: 'Job Application form',
    user_id: '35902e1f-e544-4ba3-8f6f-e1add3494d76',
    filter_spam: true,
    redirect_url: 'https://redirect.com',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
    title: 'Newsletter Signup',
    user_id: '35902e1f-e544-4ba3-8f6f-e1add3494d76',
    filter_spam: true,
    redirect_url: 'https://redirect.com',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'e0f1a2b3-c4d5-e6f7-a8b9-c0d1e2f3a4b5',
    title: 'Contact Form',
    user_id: '0228fa6d-3d3b-4d02-828c-f93785c57b16',
    filter_spam: false,
    redirect_url: 'https://redirect.com',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export const messages_placeholder = [
  {
    id: 'e0f1a2b3-c4d5-e6f7-a8b9-c0d1e2f3a4b5',
    form_id: 'df828c71-3661-4bef-902f-a7131457a797',
    data: {
      name: 'John Doer',
      email: 'some@one.com',
      message: 'Hello World',
    },
    is_spam: false,
    spam_score: 0,
    user_marked_spam: false,
    src_ipv4: '10.10.10.1',
    src_ipv6: '',
    src_agent: '',
    created_at: new Date(),
  },
  {
    id: 'd4e5f6a7-c4d5-e6f7-a8b9-c0d1e2f3a4b5',
    form_id: 'df828c71-3661-4bef-902f-a7131457a797',
    data: {
      name: 'John Does',
      email: 'some1@one.com',
      message: 'Hello World',
    },
    is_spam: false,
    spam_score: 0,
    user_marked_spam: false,
    src_ipv4: '10.10.10.2',
    src_ipv6: '',
    src_agent: '',
    created_at: new Date(),
  },
  {
    id: 'c3d2e1f0-c4d5-e6f7-a8b9-c0d1e2f3a4b5',
    form_id: 'df828c71-3661-4bef-902f-a7131457a797',
    data: {
      name: 'John Doem',
      email: 'some@one.com',
      message: 'Hello World',
    },
    is_spam: false,
    spam_score: 0,
    user_marked_spam: false,
    src_ipv4: '10.10.10.1',
    src_ipv6: '',
    src_agent: '',
    created_at: new Date(),
  },
  {
    id: 'a2b0d1b3-c4d5-e6f7-a8b9-c0d1e2f3a4b5',
    form_id: 'df828c71-3661-4bef-902f-a7131457a797',
    data: {
      name: 'John Doet',
      email: 'some1@one.com',
      message: 'Hello World',
    },
    is_spam: false,
    spam_score: 0,
    user_marked_spam: false,
    src_ipv4: '10.10.10.2',
    src_ipv6: '',
    src_agent: '',
    created_at: new Date(),
  },
];

export const emails_placeholder = [
  {
    id: 'id1',
    user_id: 'user_id1',
    email: 'some@one.com',
    is_verified: false,
    created_at: new Date(),
  },
  {
    id: 'id2',
    user_id: 'user_id2',
    email: 'some@two.com',
    is_verified: false,
    created_at: new Date(),
  },
];

export const forms_recipients_placeholder: FormsRecipient[] = [
  {
    form_id: 'form_id1',
    verified_email_id: 'id1',
    created_at: new Date(),
  },
  {
    form_id: 'form_id2',
    verified_email_id: 'id2',
    created_at: new Date(),
  },
];
