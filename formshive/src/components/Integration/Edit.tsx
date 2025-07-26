import { axiosFieldValidationErrorToFormErrors, hasFieldValidationError } from '@gofranz/common';
import { parseApiError } from '@gofranz/common-components';
import { Integration, UpdateIntegration } from '@gofranz/formshive-common';
import { Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { FormFields } from './Common';

export interface EditIntegrationProps {
  submitFormCb: (id: string, updateIntegration: UpdateIntegration) => Promise<void>;
  integration: Integration
}

export function EditIntegration(props: EditIntegrationProps) {
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<{ title: string, message: string } | null>(null);

  const form = useForm({
    initialValues: {
      title: props.integration.title,
      kind: props.integration.kind,
      data: JSON.parse(props.integration.data),
    },
  });

  const submitForm = async () => {
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

    setIsBusy(true);
    try {
      await props.submitFormCb(props.integration.id, updateIntegration);
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
