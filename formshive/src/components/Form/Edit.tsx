import { axiosFieldValidationErrorToFormErrors, hasFieldValidationError, VerifiedEmailsResponse } from '@gofranz/common';
import { parseApiError } from '@gofranz/common-components';
import { Form, FormsIntegrationsQueryParams, FormsIntegrationsResponse, IntegrationsApiResponse, IntegrationsQueryParams, NewFormsIntegration, NewFormsRecipient, UpdateForm } from '@gofranz/formshive-common';
import { Accordion, Anchor, Group, Text, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconChecklist,
  IconMail,
  IconMailForward,
  IconSettings,
  IconWebhook,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { clearField } from '../../lib/clear-field';
import { parseAndValidateFormSpec } from '../../lib/form-specs';
import { useRustyState } from '../../state';
import { FormsIntegrationDetail } from '../FormIntegrations/Detail';
import { FormsRecipientDetail } from '../FormsRecipient/Detail';
import { AutoResponse } from './AutoResponse';
import { FormFields } from './Common';
import { FormSpecifications } from './FormSpecification';

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
  const [error, setError] = useState<{ title: string, message: string } | null>(null);
  // const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
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
    // setHasUnsavedChanges(false);
    form.resetDirty();
    setError(null);
  };

  const submitForm = async () => {
    if (form.values && form.values.specs && form.values.specs.trim() !== '') {
      const specIsValid = parseAndValidateFormSpec(form.values.specs);
      if (!specIsValid.isValid) {
        let message = '';
        specIsValid.errors.forEach((value, key) => {
          message += `${key}: ${value}\n`;
        });
        setError({
          title: 'Form Specs Validation Error',
          message,
        });
        return;
      }
    }
    setError(null);
    const updatedForm: UpdateForm = {
      title: form.values.title,
      filter_spam: form.values.filter_spam,
      check_challenge: form.values.check_challenge,
      check_specs: form.values.check_specs,
      specs: form.values.specs,
      redirect_url: clearField(form.values.redirect_url),
      auto_response_enabled: form.values.auto_response_enabled,
      auto_response_subject: clearField(form.values.auto_response_subject),
      auto_response_text: clearField(form.values.auto_response_text),
    };
    setIsBusy(true);
    try {
      await props.submitFormCb(props.form.id, updatedForm);
      // setHasUnsavedChanges(false);
      form.resetDirty();
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
              hasUnsavedChanges={form.isDirty()}
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
              hasUnsavedChanges={form.isDirty()}
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
              hasUnsavedChanges={form.isDirty()}
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
