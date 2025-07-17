import { useForm } from '@mantine/form';
import { useState } from 'react';
import { Title } from '@mantine/core';
import { FormFields } from './Common';
import { extractApiErrorMessage } from '../../lib/errors';
import { Integration, UpdateIntegration } from '@gofranz/formshive-common';

export interface EditIntegrationProps {
  submitFormCb: (id: string, updateIntegration: UpdateIntegration) => Promise<void>;
  integration: Integration
}

export function EditIntegration(props: EditIntegrationProps) {
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState('');

  const form = useForm({
    initialValues: {
      title: props.integration.title,
      kind: props.integration.kind,
      data: JSON.parse(props.integration.data),
    },
    validate: {
      title: (value: string) => (value ? null : 'Title is required'),
      kind: (value) => (value ? null : 'Integration type is required'),
      data: {
        webhook_url: (value) => {
          // Only validate webhook URL if it's a webhook integration
          if (props.integration.kind.startsWith('WEBHOOK') && value) {
            return /^(http|https):\/\/[^ "]+$/.test(value) ? null : 'Invalid URL';
          }
          return null;
        },
      },
    },
  });

  const submitForm = async () => {
    console.log('EditIntegration: submitForm called');
    console.log('Form values:', form.values);

    // Prepare the data for submission
    const formData = { ...form.values.data };
    let secrets = undefined;

    // Handle API key for API integrations - move to secrets
    if (props.integration.kind.startsWith('API_')) {
      if (formData.api_key && formData.api_key.trim() !== '') {
        console.log('EditIntegration: Moving API key to secrets');
        secrets = { api_key: formData.api_key };
      }
      // Always remove API key from data for API integrations
      delete formData.api_key;
    }

    const updateIntegration = {
      id: props.integration.id,
      title: form.values.title,
      data: JSON.stringify(formData),
      secrets,
    };

    console.log('EditIntegration: Update payload:', updateIntegration);

    setIsBusy(true);
    try {
      await props.submitFormCb(props.integration.id, updateIntegration);
      setError('');
      console.log('EditIntegration: Update successful');
    } catch (e) {
      const errorMessage = extractApiErrorMessage(e);
      setError(errorMessage);
      console.error('EditIntegration: Update failed:', e);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <>
      <Title order={3}>General</Title>

      {FormFields({
        isEditing: true,
        isBusy,
        hasError: error,
        submitCb: async () => {
          // For edit mode, bypass form validation and submit directly
          await submitForm();
        },
        form,
        integrationId: props.integration.id,
      })}
    </>
  );
}
