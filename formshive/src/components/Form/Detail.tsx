import { VerifiedEmailsResponse } from '@gofranz/common';
import { Form, FormsIntegrationsQueryParams, FormsIntegrationsResponse, IntegrationsApiResponse, IntegrationsQueryParams, NewFormsIntegration, NewFormsRecipient, UpdateForm } from '@gofranz/formshive-common';
import { Title } from '@mantine/core';
import { lazy, Suspense, useEffect, useState } from 'react';
import { API_BASE_URL } from '../../constants';
import { generateCurlFormData, generateCurlJson } from '../../lib/form-spec-to-curl';
import { generateHtmlFromSpecV2, generateLLMPrompt } from '../../lib/form-spec-to-html';
import { parseAndValidateFormSpec } from '../../lib/form-specs';
import {
  exampleCurlForm,
  exampleCurlJson,
  exampleCurlMulitpart,
  exampleFormHtml,
  exampleFormHtmlFileUpload,
  exampleLLMPrompt,
} from '../../lib/forms';
import { useRustyState } from '../../state';
import { EditForm } from './Edit';
import './form.module.scss';
import { IntegrationHelp } from './Integration';

const AccountMessagesStartPage = lazy(() =>
  import('../../pages/Account/Messags/Start.page').then(module => ({
    default: module.AccountMessagesStartPage
  }))
);

export interface FormDetailProps {
  form: Form;
  submitFormCb: (id: string, newForm: UpdateForm) => Promise<void>;
  deleteCb?: (formId: string) => Promise<void>;

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

export function FormDetail(props: FormDetailProps) {
  const url = `${API_BASE_URL}/digest/${props.form.id}`;
  const challengeUrl = `${API_BASE_URL}/forms/${props.form.id}/challenge/altcha`;
  const challengeUrlNoTrack = `${API_BASE_URL}/forms/${props.form.id}/challenge/altcha?track=false`;

  const [hasFormSpec, setHasFormSpec] = useState(false);
  const [hasFileField, setHasFileField] = useState(true);

  const [curlExample, setCurlExample] = useState<string>(exampleCurlJson(url));
  const [curlMultipartExample, setCurlMultipartExample] = useState<string>(
    exampleCurlMulitpart(url)
  );
  const [curlFormExample, setCurlFormExample] = useState<string>(exampleCurlForm(url));
  const [formExample, setFormExample] = useState<string>(
    exampleFormHtml(url, props.form.check_challenge, challengeUrl)
  );
  const [formExampleFileUpload, setFormExampleFileUpload] = useState<string>(
    exampleFormHtmlFileUpload(url, props.form.check_challenge, challengeUrl)
  );
  const [llmExample, setLlmExample] = useState<string>(
    exampleLLMPrompt(url, props.form.check_challenge, challengeUrl)
  );

  const generateFromSpec = () => {
    const result = parseAndValidateFormSpec(props.form.specs);
    if (result.isValid && result.formSpec) {
      const curl = generateCurlJson(result.formSpec, url);
      setCurlExample(curl);

      // Only update preview, if file upload field is present
      const hasFileField = Object.values(result.formSpec.fields).find(
        (item) => item.field === 'file'
      );

      if (hasFileField) {
        setHasFileField(true);
        const curlMultipart = generateCurlFormData(result.formSpec, url);
        setCurlMultipartExample(curlMultipart);
      } else {
        setHasFileField(false);
      }

      const curlForm = generateCurlFormData(result.formSpec, url);
      setCurlFormExample(curlForm);

      const html = generateHtmlFromSpecV2(
        result.formSpec,
        url,
        props.form.check_challenge,
        challengeUrl
      );
      setFormExample(html);

      const htmlFileUpload = generateHtmlFromSpecV2(
        result.formSpec,
        url,
        props.form.check_challenge,
        challengeUrl
      );
      setFormExampleFileUpload(htmlFileUpload);

      const llmPrompt = generateLLMPrompt(
        result.formSpec,
        url,
        props.form.check_challenge,
        challengeUrl
      );
      setLlmExample(llmPrompt);
    }
  };

  useEffect(() => {
    if (props.form.specs && props.form.specs.length > 0 && props.form.check_specs) {
      setHasFormSpec(true);
      generateFromSpec();
    } else {
      setHasFormSpec(false);
      setCurlExample(exampleCurlJson(url));
      setCurlMultipartExample(exampleCurlMulitpart(url));
      setCurlFormExample(exampleCurlForm(url));
      setFormExample(exampleFormHtml(url, props.form.check_challenge, challengeUrl));
      setFormExampleFileUpload(
        exampleFormHtmlFileUpload(url, props.form.check_challenge, challengeUrl)
      );
      setLlmExample(exampleLLMPrompt(url, props.form.check_challenge, challengeUrl));
    }
  }, [props.form]);

  return (
    <>
      <IntegrationHelp
        form={props.form}
        url={url}
        challengeUrl={challengeUrl}
        challengeUrlNoTrack={challengeUrlNoTrack}
        hasFormSpec={hasFormSpec}
        hasFileField={hasFileField}
        formExample={formExample}
        formExampleFileUpload={formExampleFileUpload}
        curlExample={curlExample}
        curlMultipartExample={curlMultipartExample}
        curlFormExample={curlFormExample}
        llmExample={llmExample}
      />
      <EditForm
        form={props.form}
        formSubmitUrl={url}
        formChallengeUrl={challengeUrl}
        formChallengeUrlNoTrack={challengeUrlNoTrack}
        submitFormCb={props.submitFormCb}
        submitFormRecipientCb={props.submitFormRecipientCb}
        getVerifiedEmails={useRustyState.getState().getAndSetVerifiedEmails}
        getFormVerifiedEmails={props.getFormVerifiedEmails}
        deleteRecipientCp={props.deleteRecipientCp}
        submitFormIntegrationCb={props.submitFormIntegrationCb}
        getIntegrations={props.getIntegrations}
        getFormIntegrations={props.getFormIntegrations}
        deleteFormIntegrationCb={props.deleteFormIntegrationCb}
      />
      <Title order={2} mt="xl" mb="xs">
        Messages
      </Title>
      <Suspense fallback={<div>Loading messages...</div>}>
        <AccountMessagesStartPage formId={props.form.id} />
      </Suspense>
    </>
  );
}
