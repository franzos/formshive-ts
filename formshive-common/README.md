# @gofranz/formshive-common

TypeScript types and interfaces for https://formshive.com/ service by https://gofranz.com/.

## Features

- Types Auto-generated types from Rust backend
- Integration types (Webhook, Zapier, Slack, Google Sheets, Pipedrive, Mailchimp, Kit)
- ALTCHA challenge system types

## Installation

```bash
pnpm add @gofranz/formshive-common
```

## Key Types

### Core Entities
- `Form` - Form configuration and settings
- `Message` - Form submission data
- `FileAttachment` - File upload metadata
- `VerifiedEmail` - Verified recipient emails
- `Challenge` - ALTCHA spam protection

### Integrations
- `WebhookIntegration` - Standard webhook config
- `ZapierIntegration` - Zapier automation
- `SlackIntegration` - Slack notifications
- `GoogleSheetsIntegration` - Spreadsheet export
- `PipedriveIntegration` - CRM integration
- `MailchimpIntegration` - Email marketing
- `KitIntegration` - ConvertKit integration

### API Responses
- `ListResponse<T>` - Paginated list response
- `FormsList` - Forms with metadata
- `MessagesList` - Messages with files

## Notes

Types are auto-generated from the Rust backend using typeshare. Do not modify generated files directly.