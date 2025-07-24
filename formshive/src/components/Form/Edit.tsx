import { parseAndValidateFormSpec } from '../../lib/form-specs';
import { validateTemplateString } from '../../lib/template-validation';
import { validateUrl } from '../../lib/validate-url';
import { useRustyState } from '../../state';
import { Accordion, Anchor, Group, Text, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconChecklist,
  IconMail,
  IconMailForward,
  IconSettings,
  IconWebhook,
} from '@tabler/icons-react';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormsIntegrationDetail } from '../FormIntegrations/Detail';
import { FormsRecipientDetail } from '../FormsRecipient/Detail';
import { AutoResponse } from './AutoResponse';
import { FormFields } from './Common';
import { FormSpecifications } from './FormSpecification';
import { VerifiedEmailsResponse } from '@gofranz/common';
import { Form, FormsIntegrationsQueryParams, FormsIntegrationsResponse, IntegrationsApiResponse, IntegrationsQueryParams, NewFormsIntegration, NewFormsRecipient, UpdateForm } from '@gofranz/formshive-common';

export interface EditFormProps {
  submitFormCb: (id: string, updatedForm: UpdateForm) => Promise<void>;
  form: Form;
  formSubmitUrl: string;
  formChallengeUrl: string;
  formChallengeUrlNoTrack?: string;

  submitFormRecipientCb: (newForm: NewFormsRecipient) => Promise<void>;
  getVerifiedEmails: () => Promise<VerifiedEmailsResponse>;
  getFormVerifiedEmails: () => Promise<VerifiedEmailsResponse>;
  deleteRecipientCp: (formId: string, recipientId: string) => Promise<void>;

  submitFormIntegrationCb: (newForm: NewFormsIntegration) => Promise<void>;
  getIntegrations: (params: IntegrationsQueryParams) => Promise<IntegrationsApiResponse>;
  getFormIntegrations: (
    id: string,
    query: FormsIntegrationsQueryParams
  ) => Promise<FormsIntegrationsResponse>;
  deleteFormIntegrationCb: (formId: string, integrationId: string) => Promise<void>;
}

export function EditForm(props: EditFormProps) {
  const { t } = useTranslation();
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [hasEmailRecipients, setHasEmailRecipients] = useState(false);

  const form = useForm({
    initialValues: {
      title: props.form.title,
      filter_spam: props.form.filter_spam,
      check_challenge: props.form.check_challenge,
      check_specs: props.form.check_specs,
      specs: props.form.specs,
      redirect_url: props.form.redirect_url,
      auto_response_enabled: props.form.auto_response_enabled,
      auto_response_subject: props.form.auto_response_subject,
      auto_response_text: props.form.auto_response_text,
    },
    onValuesChange: () => {
      setHasUnsavedChanges(true);
    },
    validate: {
      title: (value) => (value ? null : t('formEdit.titleRequired')),
      specs: () => {
        if (form.values && form.values.specs && form.values.specs.trim() !== '') {
          const specIsValid = parseAndValidateFormSpec(form.values.specs);
          if (!specIsValid.isValid) {
            console.warn(`Form specs validation failed: ${JSON.stringify(specIsValid.errors)}`);
            let errorString = '';
            specIsValid.errors.forEach((value, key) => {
              errorString += `${key}: ${value}\n`;
            });
            return errorString;
          }
        }
        if (form.values.check_specs && form.values.specs && form.values.specs.match('name =')) {
          console.warn('Form specs validation failed: form specs are required when check_specs is enabled');
          return t('formEdit.formSpecsRequired');
        }
        return null;
      },
      redirect_url: (value) => validateUrl(value, true),
      auto_response_enabled: (value) => {
        if (value && !form.values.check_challenge) {
          return 'Auto-response requires captcha to be enabled for security';
        }
        return null;
      },
      auto_response_subject: (value) => {
        if (form.values.auto_response_enabled && (!value || value.trim() === '')) {
          return 'Auto-response subject is required when auto-response is enabled';
        }
        if (value && value.length > 200) {
          return 'Auto-response subject must be under 200 characters';
        }
        if (value && value.trim() !== '') {
          const templateValidation = validateTemplateString(value);
          if (!templateValidation.isValid) {
            return `Subject template syntax errors: ${templateValidation.errors.join('; ')}`;
          }
        }
        return null;
      },
      auto_response_text: (value) => {
        if (form.values.auto_response_enabled && (!value || value.trim() === '')) {
          return 'Auto-response message is required when auto-response is enabled';
        }
        if (value && value.length > 2000) {
          return 'Auto-response message must be under 2000 characters';
        }
        if (value && value.trim() !== '') {
          const templateValidation = validateTemplateString(value);
          if (!templateValidation.isValid) {
            return `Template syntax errors: ${templateValidation.errors.join('; ')}`;
          }
        }
        return null;
      },
    },
  });

  // Check if form has email recipients
  useEffect(() => {
    const checkEmailRecipients = async () => {
      try {
        const data = await props.getFormVerifiedEmails();
        setHasEmailRecipients(data.data.length > 0);
      } catch (e) {
        console.error('Error checking email recipients:', e);
        setHasEmailRecipients(false);
      }
    };
    checkEmailRecipients();
  }, [props.form.id, props.getFormVerifiedEmails]);

  // Function to update email recipients count (for FormsRecipientDetail to call)
  const updateEmailRecipientsCount = async () => {
    try {
      const data = await props.getFormVerifiedEmails();
      setHasEmailRecipients(data.data.length > 0);
    } catch (e) {
      console.error('Error updating email recipients count:', e);
      setHasEmailRecipients(false);
    }
  };

  const cancelChanges = () => {
    form.setValues({
      title: props.form.title,
      filter_spam: props.form.filter_spam,
      check_challenge: props.form.check_challenge,
      check_specs: props.form.check_specs,
      specs: props.form.specs,
      redirect_url: props.form.redirect_url,
      auto_response_enabled: props.form.auto_response_enabled,
      auto_response_subject: props.form.auto_response_subject,
      auto_response_text: props.form.auto_response_text,
    } as UpdateForm);
    setHasUnsavedChanges(false);
    setError('');
  };

  const submitForm = async () => {
    if (form.values && form.values.specs && form.values.specs.trim() !== '') {
      const specIsValid = parseAndValidateFormSpec(form.values.specs);
      if (!specIsValid.isValid) {
        let errorString = '';
        specIsValid.errors.forEach((value, key) => {
          errorString += `${key}: ${value}\n`;
        });
        setError(errorString);
        return;
      }
    }
    setError('');
    const updatedForm: UpdateForm = {
      title: form.values.title,
      filter_spam: form.values.filter_spam,
      check_challenge: form.values.check_challenge,
      check_specs: form.values.check_specs,
      specs: form.values.specs,
      redirect_url: form.values.redirect_url,
      auto_response_enabled: form.values.auto_response_enabled,
      auto_response_subject: form.values.auto_response_subject,
      auto_response_text: form.values.auto_response_text,
    };
    setIsBusy(true);
    try {
      await props.submitFormCb(props.form.id, updatedForm);
      setHasUnsavedChanges(false);
    } catch (e) {
      setError(`Error: ${(e as AxiosError).response?.data ? (e as AxiosError).response?.data : e}`);
      console.error(e);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <>
      <Title order={2} mb="sm">
        {t('formEdit.settings')}
      </Title>

      <Accordion variant="contained">
        <Accordion.Item key={`accordion-${1}`} value="form-fields">
          <Accordion.Control>
            <Group wrap="nowrap">
              <IconSettings size={20} />
              <div>
                <Text>{t('formEdit.general')}</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  {t('formEdit.generalDescription')}
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <FormFields
              isEditing={true}
              isBusy={isBusy}
              hasError={error}
              submitCb={submitForm}
              formSubmitUrl={props.formSubmitUrl}
              form={form}
              hasUnsavedChanges={hasUnsavedChanges}
              onCancel={cancelChanges}
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item key={`accordion-${2}`} value="specifications">
          <Accordion.Control>
            <Group wrap="nowrap">
              <IconChecklist size={20} />
              <div>
                <Text>{t('formEdit.formFieldsOptional')}</Text>
                <Text size="sm" c="dimmed">
                  {t('formEdit.formFieldsDescription')}{' '}
                  <Anchor href="/docs">{t('formEdit.readMore')}</Anchor>
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <FormSpecifications
              isEditing={true}
              isBusy={isBusy}
              hasError={error}
              submitSection={submitForm}
              form={form}
              formSubmitUrl={props.formSubmitUrl}
              formChallengeUrl={props.formChallengeUrl}
              formChallengeUrlNoTrack={props.formChallengeUrlNoTrack}
              hasUnsavedChanges={hasUnsavedChanges}
              onCancel={cancelChanges}
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item key={`accordion-${3}`} value="forwarding">
          <Accordion.Control>
            <Group wrap="nowrap">
              <IconMailForward size={20} />
              <div>
                <Text>{t('formEdit.emailNotifications')}</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  {t('formEdit.emailNotificationsDescription')}
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <FormsRecipientDetail
              form={props.form}
              submitFormCb={props.submitFormRecipientCb}
              getVerifiedEmails={useRustyState.getState().getAndSetVerifiedEmails}
              getFormVerifiedEmails={props.getFormVerifiedEmails}
              deleteRecipientCp={props.deleteRecipientCp}
              onRecipientsChange={updateEmailRecipientsCount}
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item key={`accordion-${4}`} value="autoresponse">
          <Accordion.Control>
            <Group wrap="nowrap">
              <IconMail size={20} />
              <div>
                <Text>Autoresponder</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  Send automated responses to form submitters
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <AutoResponse
              isBusy={isBusy}
              hasError={error}
              submitCb={submitForm}
              form={form}
              hasUnsavedChanges={hasUnsavedChanges}
              onCancel={cancelChanges}
              hasEmailRecipients={hasEmailRecipients}
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item key={`accordion-${5}`} value="integrations">
          <Accordion.Control>
            <Group wrap="nowrap">
              <IconWebhook size={20} />
              <div>
                <Text>{t('formEdit.integrations')}</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  {t('formEdit.integrationsDescription')}
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <FormsIntegrationDetail
              form={props.form}
              submitFormCb={props.submitFormIntegrationCb}
              getIntegrations={props.getIntegrations}
              getFormIntegrations={props.getFormIntegrations}
              deleteFormIntegrationCb={props.deleteFormIntegrationCb}
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
