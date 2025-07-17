import { Text, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { extractApiErrorMessage } from '../../lib/errors';
import { FormFields } from './Common';
import { HttpNewIntegration, IntegrationType } from '@gofranz/formshive-common';

export interface CreateIntegrationProps {
  submitFormCb: (newIntegration: HttpNewIntegration) => Promise<void>;
  initialIntegrationType?: string | null;
}

export function CreateIntegration(props: CreateIntegrationProps) {
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState('');

  const getInitialKind = (): IntegrationType => {
    // Map URL parameter values to backend enum values
    const typeMapping: { [key: string]: IntegrationType } = {
      PIPEDRIVE: IntegrationType.API_PIPEDRIVE,
      MAILCHIMP: IntegrationType.API_MAILCHIMP,
      KIT: IntegrationType.API_KIT,
      ZAPIER: IntegrationType.WEBHOOK_ZAPIER,
      SLACK: IntegrationType.WEBHOOK_SLACK,
      GOOGLE_SHEETS: IntegrationType.WEBHOOK_GOOGLE_SHEETS,
      WEBHOOK: IntegrationType.WEBHOOK,
    };

    return typeMapping[props.initialIntegrationType || ''] || IntegrationType.WEBHOOK;
  };

  const getInitialData = (kind: string) => {
    switch (kind) {
      case 'API_PIPEDRIVE':
        return {
          api_key: '',
          company_domain: '',
          create_person: true,
          create_lead: false,
          default_owner_id: null,
          default_org_id: null,
          custom_field_mapping: {},
          lead_title_template: 'Web Form Lead: {{form_title}}',
        };
      case 'API_MAILCHIMP':
        return {
          api_key: '',
          list_id: '',
          double_optin: false,
          merge_field_mapping: {
            FNAME: 'first_name',
            LNAME: 'last_name',
            PHONE: 'phone',
          },
          default_tags: ['web_form'],
          status: 'subscribed',
        };
      case 'API_KIT':
        return {
          api_key: '',
          form_id: '',
          field_mapping: {
            first_name: 'first_name',
            last_name: 'last_name',
            company: 'company',
          },
          default_tags: ['web_form'],
        };
      default:
        return {
          webhook_url: '',
        };
    }
  };

  const initialKind = getInitialKind();
  const form = useForm({
    initialValues: {
      title: '',
      kind: initialKind,
      data: getInitialData(initialKind),
    },
    validate: (values: any) => {
      const errors: any = {};

      if (!values.title) {
        errors.title = 'Title is required';
      }

      if (!values.kind) {
        errors.kind = 'Integration type is required';
      }

      const kind = values.kind;
      const data = values.data;

      if (kind === 'API_PIPEDRIVE' || kind === 'API_MAILCHIMP' || kind === 'API_KIT') {
        if (!data?.api_key) {
          errors['data.api_key'] = 'API key is required';
        }
      }

      if (kind === 'API_PIPEDRIVE') {
        if (!data?.company_domain) {
          errors['data.company_domain'] = 'Company domain is required';
        } else if (!data.company_domain.includes('.pipedrive.com')) {
          errors['data.company_domain'] = 'Domain must be in format: company.pipedrive.com';
        }
      }

      if (kind === 'API_MAILCHIMP' && !data?.list_id) {
        errors['data.list_id'] = 'List ID is required';
      }

      if (kind === 'API_KIT' && !data?.form_id) {
        errors['data.form_id'] = 'Form ID is required';
      }

      if (kind && !kind.startsWith('API_')) {
        if (!data?.webhook_url) {
          errors['data.webhook_url'] = 'Webhook URL is required';
        } else if (!/^(http|https):\/\/[^ "]+$/.test(data.webhook_url)) {
          errors['data.webhook_url'] = 'Invalid URL';
        }
      }

      return errors;
    },
  });

  const submitForm = async () => {
    // Extract API key from data for API integrations and move to secrets
    const data = { ...form.values.data };
    let secrets = undefined;

    if (form.values.kind.startsWith('API_')) {
      if ('api_key' in data && data.api_key) {
        secrets = { api_key: data.api_key };
        delete (data as any).api_key;
      }
    }

    const newForm: HttpNewIntegration = {
      title: form.values.title,
      kind: form.values.kind,
      data: JSON.stringify(data),
      secrets,
    };
    setIsBusy(true);
    try {
      await props.submitFormCb(newForm);
    } catch (e) {
      const errorMessage = extractApiErrorMessage(e);
      setError(errorMessage);
      console.error(e);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <>
      <Title order={3}>Create Integration</Title>
      <Text>
        Connect your forms to external services like Zapier, Slack, Google Sheets, or any webhook
        endpoint.
      </Text>
      <FormFields
        isEditing={false}
        isBusy={isBusy}
        hasError={error}
        submitCb={submitForm}
        form={form as any}
      />
    </>
  );
}
