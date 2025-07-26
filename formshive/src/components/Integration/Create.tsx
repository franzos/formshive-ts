import { axiosFieldValidationErrorToFormErrors, hasFieldValidationError } from '@gofranz/common';
import { parseApiError } from '@gofranz/common-components';
import { HttpNewIntegration, IntegrationType } from '@gofranz/formshive-common';
import { Text, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { FormFields } from './Common';

export interface CreateIntegrationProps {
  submitFormCb: (newIntegration: HttpNewIntegration) => Promise<void>;
  initialIntegrationType?: string | null;
}

export function CreateIntegration(props: CreateIntegrationProps) {
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<{ title: string, message: string } | null>(null);

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
      setError(null);
    } catch (e) {
      setError({
        ...parseApiError(e),
      });
      if (hasFieldValidationError(e)) {
        console.log(axiosFieldValidationErrorToFormErrors(e));
        form.setErrors(axiosFieldValidationErrorToFormErrors(e));
      }
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
