import { Alert, Anchor, Box, Button, Checkbox, Group, Text, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { IconAlertCircle, IconDeviceFloppy, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export interface FormFieldsProps {
  isEditing: boolean;
  isBusy: boolean;
  hasError: string;
  submitCb: () => Promise<void>;
  form: UseFormReturnType<{
    title: string;
    filter_spam: boolean;
    check_challenge: boolean;
    check_specs: boolean;
    specs: string;
    redirect_url: string;
    auto_response_enabled: boolean;
    auto_response_subject: string | null;
    auto_response_text: string | null;
  }>;
  formSubmitUrl: string;
  hasUnsavedChanges: boolean;
  onCancel: () => void;
}

export function FormFields(props: FormFieldsProps) {
  const { t } = useTranslation();
  return (
    <>
      <form
        onSubmit={props.form.onSubmit(() => {
          props.submitCb();
        })}
      >
        <TextInput
          label={t('forms.title')}
          placeholder={t('forms.titlePlaceholder')}
          value={props.form.values.title}
          onChange={(event) => props.form.setFieldValue('title', event.currentTarget.value)}
          error={props.form.errors.title && t('forms.titleRequired')}
          mb="xs"
          required
          description={t('forms.titleDescription')}
        />
        <TextInput
          label={t('forms.redirectUrl')}
          placeholder={t('forms.redirectPlaceholder')}
          value={props.form.values.redirect_url}
          onChange={(event) => props.form.setFieldValue('redirect_url', event.currentTarget.value)}
          error={props.form.errors.redirect_url && t('forms.invalidUrl')}
          mb="xs"
          description={t('forms.redirectDescription')}
        />
        {!props.form.values.redirect_url && (
          <Alert variant="light" color="primary" icon={<IconAlertCircle size={20} />} mb="md">
            {t('forms.redirectWarning')}
          </Alert>
        )}
        <Checkbox
          label={t('forms.filterSpam')}
          checked={props.form.values.filter_spam}
          onChange={(event) => props.form.setFieldValue('filter_spam', event.currentTarget.checked)}
          mb="xs"
          description={t('forms.filterSpamDescription')}
        />
        {props.form.values.filter_spam && (
          <Alert variant="light" color="primary" icon={<IconAlertCircle size={20} />} mb="md">
            {t('forms.filterSpamWarning')}
          </Alert>
        )}
        <Checkbox
          label={t('forms.checkCaptcha')}
          checked={props.form.values.check_challenge}
          onChange={(event) =>
            props.form.setFieldValue('check_challenge', event.currentTarget.checked)
          }
          mb="xs"
          description={t('forms.captchaDescription')}
        />
        {props.form.values.check_challenge && (
          <Alert variant="light" color="primary" icon={<IconAlertCircle size={20} />} mb="md">
            {t('forms.captchaWarning')}{' '}
            <Anchor href="/docs#captcha-setup">{t('forms.setupInstructions')}</Anchor>
          </Alert>
        )}

        <Box mb="md">
          <Group>
            <Button
              type="submit"
              loading={props.isBusy}
              disabled={props.isBusy}
              leftSection={<IconDeviceFloppy />}
              color={props.hasUnsavedChanges ? 'yellow' : ''}
            >
              {props.isEditing
                ? props.hasUnsavedChanges
                  ? t('glob_buttons.updateUnsaved')
                  : t('glob_buttons.update')
                : t('glob_buttons.create')}
            </Button>
            {props.hasUnsavedChanges && (
              <Button
                onClick={props.onCancel}
                loading={props.isBusy}
                disabled={props.isBusy}
                leftSection={<IconX />}
                variant="light"
                color="gray"
              >
                {t('glob_buttons.cancel')}
              </Button>
            )}
          </Group>

          {props.hasError && props.hasError !== '' && <Text color="red">{props.hasError}</Text>}
        </Box>
      </form>
    </>
  );
}
