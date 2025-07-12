import {
  Alert,
  Button,
  Code,
  Group,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { IconInfoCircle } from '@tabler/icons-react';

const getExamplePayload = (kind: string, formId: string) => {
  switch (kind) {
    case 'API_PIPEDRIVE':
      return `// Person Creation (always created):
{
  "name": "Mike Johnson",
  "email": ["mike@example.com"],
  "phone": ["+1234567890"],
  "org_id": null,
  "owner_id": null
}

// Lead Creation (if enabled):
{
  "title": "Web Form Lead: Contact Form",
  "person_id": 123,
  "organization_id": null,
  "owner_id": null
}`;
    case 'API_MAILCHIMP':
      return `// Subscriber Addition:
{
  "email_address": "mike@example.com",
  "status": "subscribed",
  "merge_fields": {
    "FNAME": "Mike",
    "LNAME": "Johnson",
    "PHONE": "+1234567890"
  },
  "tags": ["web_form"]
}`;
    case 'API_KIT':
      return `// Step 1: Create Subscriber
{
  "email_address": "mike@example.com",
  "fields": {
    "first_name": "Mike",
    "last_name": "Johnson",
    "company": "Example Corp"
  },
  "tags": ["web_form"]
}

// Step 2: Add to Form
{
  "email_address": "mike@example.com"
}`;
    case 'WEBHOOK_SLACK':
      return `{
  "text": "New form submission received from Contact Form",
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*New Contact Form Submission*\\n\\n*Name:* Mike\\n*Email:* your-email@gmail.com\\n*Message:* Hi, I want to enquire about ....\\n\\n*Submitted:* 2024-06-28 10:30 UTC"
      }
    }
  ]
}`;
    case 'WEBHOOK_GOOGLE_SHEETS':
      return `{
  "form_title": "Contact Form",
  "submitted_at": "2024-06-28T10:30:00.000Z",
  "data": {
    "name": "Mike",
    "email": "your-email@gmail.com",
    "message": "Hi, I want to enquire about ...."
  }
}`;
    case 'WEBHOOK_ZAPIER':
      return `{
  "integration": "${formId}",
  "data": {
    "name": "Mike",
    "email": "your-email@gmail.com",
    "message": "Hi, I want to enquire about ...."
  }
}`;
    default:
      return `{
  "integration": "${formId}",
  "data": {
    "name": "Mike",
    "email": "your-email@gmail.com",
    "message": "Hi, I want to enquire about ...."
  }
}`;
  }
};

export interface FormFieldsProps {
  isEditing: boolean;
  isBusy: boolean;
  hasError: string;
  submitCb: () => Promise<void>;
  form: UseFormReturnType<{
    title: string;
    kind: string;
    data: {
      // Webhook fields
      webhook_url?: string;

      // Pipedrive fields
      api_key?: string;
      company_domain?: string;
      create_person?: boolean;
      create_lead?: boolean;
      default_owner_id?: string | null;
      default_org_id?: string | null;
      custom_field_mapping?: Record<string, string>;
      lead_title_template?: string;

      // Mailchimp fields
      list_id?: string;
      double_optin?: boolean;
      merge_field_mapping?: Record<string, string>;
      default_tags?: string[];
      status?: string;

      // Kit fields
      form_id?: string;
      field_mapping?: Record<string, string>;
    };
  }>;
  integrationId?: string;
}

const getHelpText = (kind: string) => {
  switch (kind) {
    case 'API_PIPEDRIVE':
      return {
        title: 'Pipedrive Configuration',
        description:
          "Configure your Pipedrive CRM integration to automatically create contacts and leads from form submissions. You'll need your API token and company domain.",
        testUrl: 'Get API token at: https://developers.pipedrive.com/docs/api/v1/getting-started',
      };
    case 'API_MAILCHIMP':
      return {
        title: 'Mailchimp Configuration',
        description:
          "Automatically add form submitters to your Mailchimp audience. You'll need your API key and the List ID of the audience you want to add subscribers to.",
        testUrl: 'Get API key at: https://mailchimp.com/help/about-api-keys/',
      };
    case 'API_KIT':
      return {
        title: 'Kit (ConvertKit) Configuration',
        description:
          "Automatically add form submitters to your Kit email marketing forms. You'll need your v4 API key and the Form ID you want to add subscribers to.",
        testUrl: 'Get API key at: https://help.kit.com/en/articles/9902901-kit-api-overview',
      };
    case 'WEBHOOK_SLACK':
      return {
        title: 'Slack Webhook URL',
        description:
          "Get this URL from your Slack app's Incoming Webhooks section. It should look like: https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
        testUrl: 'Create at: https://api.slack.com/messaging/webhooks',
      };
    case 'WEBHOOK_ZAPIER':
      return {
        title: 'Zapier Webhook URL',
        description:
          'Create a "Webhooks by Zapier" trigger in Zapier and use the webhook URL it provides. Zapier will automatically receive your form submissions.',
        testUrl: 'Sign up at: https://zapier.com',
      };
    case 'WEBHOOK_GOOGLE_SHEETS':
      return {
        title: 'Google Apps Script Webhook URL',
        description:
          'Deploy a Google Apps Script as a web app and use the deployment URL. The script will automatically append form data to your Google Sheet.',
        testUrl: 'Create at: https://script.google.com',
      };
    default:
      return {
        title: 'Webhook URL',
        description:
          'A webhook URL is commonly provided by external services to receive data. The data will be posted as JSON object.',
        testUrl: 'Test at: https://webhook.site',
      };
  }
};

export function FormFields(props: FormFieldsProps) {
  const helpText = getHelpText(props.form.values.kind);

  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          console.log('FormFields: Form submitted, isEditing:', props.isEditing);
          if (props.isEditing) {
            // For edit mode, skip form validation and submit directly
            console.log('FormFields: Calling submitCb for edit mode');
            props.submitCb();
          } else {
            // For create mode, use form validation
            console.log('FormFields: Calling submitCb for create mode with validation');
            props.form.onSubmit((values) => {
              console.log('FormFields: Form validation passed, values:', values);
              props.submitCb();
            })(event);
          }
        }}
      >
        <Stack gap="md">
          <TextInput
            label="Title"
            placeholder="e.g., My Slack Notifications"
            value={props.form.values.title}
            onChange={(event) => props.form.setFieldValue('title', event.currentTarget.value)}
            error={props.form.errors.title && 'Title is required'}
          />

          {!props.isEditing && (
            <Select
              label="Integration Type"
              placeholder="Choose an integration type"
              data={[
                { value: 'API_PIPEDRIVE', label: 'Pipedrive CRM (Contact & Lead Management)' },
                { value: 'API_MAILCHIMP', label: 'Mailchimp (Email Marketing)' },
                { value: 'API_KIT', label: 'Kit (ConvertKit) (Email Marketing)' },
                { value: 'WEBHOOK_ZAPIER', label: 'Zapier (8,000+ apps)' },
                { value: 'WEBHOOK_SLACK', label: 'Slack (Team notifications)' },
                { value: 'WEBHOOK_GOOGLE_SHEETS', label: 'Google Sheets (Spreadsheet data)' },
                { value: 'WEBHOOK', label: 'Custom Webhook (Any API endpoint)' },
              ]}
              value={props.form.values.kind}
              onChange={(value) => props.form.setFieldValue('kind', value || 'WEBHOOK')}
              error={props.form.errors.kind}
            />
          )}

          {/* Render different fields based on integration type */}
          {props.form.values.kind === 'API_PIPEDRIVE' ? (
            <Stack gap="md">
              <TextInput
                label="API Token"
                placeholder={
                  props.isEditing
                    ? 'Enter new API token to replace existing one (leave empty to keep current)'
                    : 'Enter your Pipedrive API token'
                }
                type="password"
                value={props.form.values.data.api_key || ''}
                onChange={(event) =>
                  props.form.setFieldValue('data.api_key', event.currentTarget.value)
                }
                error={props.form.errors['data.api_key'] && 'API token is required'}
                description={
                  props.isEditing
                    ? 'Leave empty to keep existing API token, or enter new token to replace it'
                    : undefined
                }
              />
              <TextInput
                label="Company Domain"
                placeholder="yourcompany.pipedrive.com"
                value={props.form.values.data.company_domain || ''}
                onChange={(event) =>
                  props.form.setFieldValue('data.company_domain', event.currentTarget.value)
                }
                error={props.form.errors['data.company_domain'] && 'Company domain is required'}
              />

              <Text size="md" fw={500} mt="md" mb="xs">
                Lead Generation Options
              </Text>

              <Switch
                label="Create person in Pipedrive"
                description="Always create a person record from form submissions"
                checked={props.form.values.data.create_person ?? true}
                onChange={(event) =>
                  props.form.setFieldValue('data.create_person', event.currentTarget.checked)
                }
              />

              <Switch
                label="Create lead for sales follow-up"
                description="Also create a lead record for your sales team"
                checked={props.form.values.data.create_lead ?? false}
                onChange={(event) =>
                  props.form.setFieldValue('data.create_lead', event.currentTarget.checked)
                }
              />

              <TextInput
                label="Default Owner ID (optional)"
                placeholder="Enter user ID to assign as owner"
                value={props.form.values.data.default_owner_id || ''}
                onChange={(event) =>
                  props.form.setFieldValue(
                    'data.default_owner_id',
                    event.currentTarget.value || null
                  )
                }
              />

              <TextInput
                label="Default Organization ID (optional)"
                placeholder="Enter organization ID to link contacts"
                value={props.form.values.data.default_org_id || ''}
                onChange={(event) =>
                  props.form.setFieldValue('data.default_org_id', event.currentTarget.value || null)
                }
              />

              <TextInput
                label="Lead Title Template"
                placeholder="Web Form Lead: {{form_title}}"
                value={
                  props.form.values.data.lead_title_template || 'Web Form Lead: {{form_title}}'
                }
                onChange={(event) =>
                  props.form.setFieldValue('data.lead_title_template', event.currentTarget.value)
                }
                description="Use {{form_title}} to include the form name in lead titles"
              />
            </Stack>
          ) : props.form.values.kind === 'API_MAILCHIMP' ? (
            <Stack gap="md">
              <TextInput
                label="API Key"
                placeholder={
                  props.isEditing
                    ? 'Enter new API key to replace existing one (leave empty to keep current)'
                    : 'Enter your Mailchimp API key'
                }
                type="password"
                value={props.form.values.data.api_key || ''}
                onChange={(event) =>
                  props.form.setFieldValue('data.api_key', event.currentTarget.value)
                }
                error={props.form.errors['data.api_key'] && 'API key is required'}
                description={
                  props.isEditing
                    ? 'Leave empty to keep existing API key, or enter new key to replace it'
                    : undefined
                }
              />
              <TextInput
                label="List ID"
                placeholder="Enter your Mailchimp audience/list ID"
                value={props.form.values.data.list_id || ''}
                onChange={(event) =>
                  props.form.setFieldValue('data.list_id', event.currentTarget.value)
                }
                error={props.form.errors['data.list_id'] && 'List ID is required'}
              />

              <Text size="md" fw={500} mt="md" mb="xs">
                Subscriber Options
              </Text>

              <Select
                label="Subscriber Status"
                placeholder="Choose subscription status"
                value={props.form.values.data.status || 'subscribed'}
                data={[
                  { value: 'subscribed', label: 'Subscribed (immediately active)' },
                  { value: 'pending', label: 'Pending (requires confirmation email)' },
                ]}
                onChange={(value) => props.form.setFieldValue('data.status', value || 'subscribed')}
              />

              <Switch
                label="Double Opt-in"
                description="Send confirmation email for GDPR compliance"
                checked={props.form.values.data.double_optin ?? false}
                onChange={(event) =>
                  props.form.setFieldValue('data.double_optin', event.currentTarget.checked)
                }
              />

              <Textarea
                label="Default Tags"
                placeholder="web_form, newsletter, contact"
                value={
                  Array.isArray(props.form.values.data.default_tags)
                    ? props.form.values.data.default_tags.join(', ')
                    : 'web_form'
                }
                onChange={(event) => {
                  const tags = event.currentTarget.value
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter((tag) => tag.length > 0);
                  props.form.setFieldValue('data.default_tags', tags);
                }}
                description="Comma-separated tags for organizing subscribers"
              />

              <Text size="md" fw={500} mt="md" mb="xs">
                Merge Field Mapping
              </Text>
              <Text size="sm" c="dimmed" mb="sm">
                Map form fields to Mailchimp merge fields. Leave empty to use defaults.
              </Text>

              <Group grow>
                <TextInput
                  label="First Name Field"
                  placeholder="first_name"
                  value={props.form.values.data.merge_field_mapping?.FNAME || 'first_name'}
                  onChange={(event) =>
                    props.form.setFieldValue(
                      'data.merge_field_mapping.FNAME',
                      event.currentTarget.value
                    )
                  }
                />
                <TextInput
                  label="Last Name Field"
                  placeholder="last_name"
                  value={props.form.values.data.merge_field_mapping?.LNAME || 'last_name'}
                  onChange={(event) =>
                    props.form.setFieldValue(
                      'data.merge_field_mapping.LNAME',
                      event.currentTarget.value
                    )
                  }
                />
              </Group>

              <TextInput
                label="Phone Field"
                placeholder="phone"
                value={props.form.values.data.merge_field_mapping?.PHONE || 'phone'}
                onChange={(event) =>
                  props.form.setFieldValue(
                    'data.merge_field_mapping.PHONE',
                    event.currentTarget.value
                  )
                }
              />
            </Stack>
          ) : props.form.values.kind === 'API_KIT' ? (
            <Stack gap="md">
              <TextInput
                label="API Key"
                placeholder={
                  props.isEditing
                    ? 'Enter new API key to replace existing one (leave empty to keep current)'
                    : 'Enter your Kit v4 API key'
                }
                type="password"
                value={props.form.values.data.api_key || ''}
                onChange={(event) =>
                  props.form.setFieldValue('data.api_key', event.currentTarget.value)
                }
                error={props.form.errors['data.api_key'] && 'API key is required'}
                description={
                  props.isEditing
                    ? 'Leave empty to keep existing API key, or enter new key to replace it'
                    : undefined
                }
              />
              <TextInput
                label="Form ID"
                placeholder="Enter your Kit form ID"
                value={props.form.values.data.form_id || ''}
                onChange={(event) =>
                  props.form.setFieldValue('data.form_id', event.currentTarget.value)
                }
                error={props.form.errors['data.form_id'] && 'Form ID is required'}
              />

              <Text size="md" fw={500} mt="md" mb="xs">
                Subscriber Options
              </Text>

              <Textarea
                label="Default Tags"
                placeholder="web_form, newsletter, contact"
                value={
                  Array.isArray(props.form.values.data.default_tags)
                    ? props.form.values.data.default_tags.join(', ')
                    : 'web_form'
                }
                onChange={(event) => {
                  const tags = event.currentTarget.value
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter((tag) => tag.length > 0);
                  props.form.setFieldValue('data.default_tags', tags);
                }}
                description="Comma-separated tags for organizing subscribers"
              />

              <Text size="md" fw={500} mt="md" mb="xs">
                Field Mapping
              </Text>
              <Text size="sm" c="dimmed" mb="sm">
                Map form fields to Kit custom fields. Leave empty to use defaults.
              </Text>

              <Group grow>
                <TextInput
                  label="First Name Field"
                  placeholder="first_name"
                  value={props.form.values.data.field_mapping?.first_name || 'first_name'}
                  onChange={(event) =>
                    props.form.setFieldValue(
                      'data.field_mapping.first_name',
                      event.currentTarget.value
                    )
                  }
                />
                <TextInput
                  label="Last Name Field"
                  placeholder="last_name"
                  value={props.form.values.data.field_mapping?.last_name || 'last_name'}
                  onChange={(event) =>
                    props.form.setFieldValue(
                      'data.field_mapping.last_name',
                      event.currentTarget.value
                    )
                  }
                />
              </Group>

              <TextInput
                label="Company Field"
                placeholder="company"
                value={props.form.values.data.field_mapping?.company || 'company'}
                onChange={(event) =>
                  props.form.setFieldValue('data.field_mapping.company', event.currentTarget.value)
                }
              />
            </Stack>
          ) : (
            // Webhook integrations
            <TextInput
              label={helpText.title}
              placeholder="https://..."
              value={props.form.values.data.webhook_url || ''}
              onChange={(event) =>
                props.form.setFieldValue('data.webhook_url', event.currentTarget.value)
              }
              error={props.form.errors['data.webhook_url'] && 'Invalid URL'}
            />
          )}

          <Alert icon={<IconInfoCircle size={16} />} color="blue">
            <Text size="sm">
              {helpText.description}
              <br />
              <Text component="span" c="blue" td="underline" style={{ cursor: 'pointer' }}>
                {helpText.testUrl}
              </Text>
            </Text>
          </Alert>

          <div>
            <Text size="md" mb="xs" fw={500}>
              Example JSON Payload
            </Text>
            <Code block>
              {getExamplePayload(
                props.form.values.kind,
                props.integrationId || 'SAVE_TO_GENERATE_ID'
              )}
            </Code>
          </div>

          <Button type="submit" loading={props.isBusy} disabled={props.isBusy}>
            {props.isEditing ? 'Update Integration' : 'Create Integration'}
          </Button>
        </Stack>
      </form>
      {props.hasError && (
        <Alert variant="light" color="red" mt="md">
          <Text size="sm" fw={500} mb="xs">
            Error
          </Text>
          <Text size="sm">{props.hasError}</Text>
        </Alert>
      )}
    </>
  );
}
