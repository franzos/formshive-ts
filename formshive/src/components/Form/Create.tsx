import { useForm } from '@mantine/form';
import { useState } from 'react';
import { Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { FormFields } from './Common';
import { validateUrl } from '../../lib/validate-url';
import { HttpNewForm } from '@gofranz/formshive-common';

export interface CreateFormProps {
  submitFormCb: (newForm: HttpNewForm) => Promise<void>;
}

export function CreateForm(props: CreateFormProps) {
  const { t } = useTranslation();
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState('');

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
    validate: {
      title: (value) => (value ? null : t('forms.titleRequired')),
      redirect_url: (value) => validateUrl(value || '', true),
    },
  });

  const submitForm = async () => {
    const newForm: HttpNewForm = {
      title: form.values.title,
      filter_spam: form.values.filter_spam,
      check_challenge: form.values.check_challenge,
      // check_specs: form.values.check_specs,
      // specs: form.values.specs,
      redirect_url: form.values.redirect_url,
      auto_response_enabled: form.values.auto_response_enabled,
      // auto_response_subject: form.values.auto_response_subject,
      // auto_response_text: form.values.auto_response_text,
    };
    setIsBusy(true);
    try {
      await props.submitFormCb(newForm);
      setError('');
    } catch (e) {
      setError(`Error: ${e}`);
      console.error(e);
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
