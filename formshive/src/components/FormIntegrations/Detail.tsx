import { useEffect, useState } from 'react';
import { Alert, Card } from '@mantine/core';
import { FormIntegration } from '../Integration/Integration';
import { CreateFormsRecipient } from './Create';
import { ListResponse } from '../../../../formshive-common/src/api';
import { IconAlertCircle } from '@tabler/icons-react';
import { Form, FormsIntegrationsQueryParams, FormsIntegrationsResponse, Integration, NewFormsIntegration } from '@gofranz/formshive-common';

export interface FormsIntegrationDetailProps {
  submitFormCb: (newForm: NewFormsIntegration) => Promise<void>;
  getIntegrations: (params: FormsIntegrationsQueryParams) => Promise<FormsIntegrationsResponse>;
  getFormIntegrations: (
    id: string,
    query: FormsIntegrationsQueryParams
  ) => Promise<ListResponse<Integration>>;
  deleteFormIntegrationCb: (formId: string, integrationId: string) => Promise<void>;
  form: Form;
}

export function FormsIntegrationDetail(props: FormsIntegrationDetailProps) {
  const [isBusy, setIsBusy] = useState(false);
  // TODO: Use error
  const [_, setError] = useState('');

  const [integrations, setIntegrations] = useState<Integration[]>([]);

  const submitCb = async (recipient: NewFormsIntegration) => {
    try {
      setIsBusy(true);
      await props.submitFormCb(recipient);
      const data = await props.getFormIntegrations(props.form.id, {
        limit: 100,
        offset: 0,
      });
      setIntegrations(data.data);
      setError('');
    } catch (e) {
      setError(`Error: ${e}`);
      console.error(e);
    } finally {
      setIsBusy(false);
    }
  };

  const deleteFormIntegrationCb = async (formId: string, integrationId: string) => {
    try {
      setIsBusy(true);
      await props.deleteFormIntegrationCb(formId, integrationId);
      const data = await props.getFormIntegrations(props.form.id, {
        limit: 100,
        offset: 0,
      });
      setIntegrations(data.data);
    } catch (e) {
      setError(`Error: ${e}`);
      console.error(e);
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    const getIntegrations = async () => {
      setIsBusy(true);
      try {
        const data = await props.getFormIntegrations(props.form.id, {
          limit: 100,
          offset: 0,
        });
        setIntegrations(data.data);
      } catch (e) {
        setError(`Error: ${e}`);
        console.error(e);
      } finally {
        setIsBusy(false);
      }
    };
    getIntegrations();
  }, []);

  const FormIntegrations = () =>
    integrations.map((integration) => (
      <Card key={integration.id} shadow="xs" radius="md" mb="md" withBorder>
        <FormIntegration
          key={`integration-${integration.id}`}
          integration={integration}
          form_id={props.form.id}
          deleteCb={deleteFormIntegrationCb}
          isBusy={isBusy}
        />
      </Card>
    ));

  const FormIntegrationsNotFound = () => (
    <Alert color="primary" icon={<IconAlertCircle size={20} />} mb="xs" mt="xs">
      Integrations have not been setup.
    </Alert>
  );

  return (
    <>
      {integrations && integrations.length > 0 ? (
        <FormIntegrations />
      ) : (
        <FormIntegrationsNotFound />
      )}
      <CreateFormsRecipient
        submitFormCb={submitCb}
        getIntegrations={props.getIntegrations}
        form={props.form}
      />
    </>
  );
}
