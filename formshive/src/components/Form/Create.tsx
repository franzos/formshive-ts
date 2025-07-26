import { axiosFieldValidationErrorToFormErrors, hasFieldValidationError } from '@gofranz/common';
import { parseApiError } from '@gofranz/common-components';
import { HttpNewForm } from '@gofranz/formshive-common';
import { Text, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { clearField } from '../../lib/clear-field';
import { FormFields } from './Common';

export interface CreateFormProps {
  submitFormCb: (newForm: HttpNewForm) => Promise<void>;
}

export function CreateForm(props: CreateFormProps) {
  const { t } = useTranslation();
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<{ title: string, message: string } | null>(null);

  const form = useForm({
    initialValues: {
      title: '',
      filter_spam: false,
      check_challenge: false,
      check_specs: false,
      specs: undefined as string | undefined,
      redirect_url: undefined as string | undefined,
      auto_response_enabled: false,
      auto_response_subject: undefined as string | undefined,
      auto_response_text: undefined as string | undefined,
    },
  });

  const submitForm = async () => {
    const newForm: HttpNewForm = {
      title: form.values.title,
      filter_spam: form.values.filter_spam,
      check_challenge: form.values.check_challenge,
      redirect_url: clearField(form.values.redirect_url),
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
      <Title order={3}>{t('forms.createForm')}</Title>
      <Text>{t('forms.createDescription')}</Text>
      <FormFields
        isEditing={false}
        isBusy={isBusy}
        hasError={error}
        submitCb={submitForm}
        formSubmitUrl="https://formshive.com/TBD"
        form={form}
        hasUnsavedChanges={false}
        onCancel={() => {
          console.log('Cancel clicked');
        }}
      />
    </>
  );
}
