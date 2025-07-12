import { useEffect, useState } from 'react';
import { Alert, Card } from '@mantine/core';
import {
  Form,
  FormsIntegrationsQueryParams,
  HttpIntegration,
  HttpNewFormsIntegration,
  IntegrationsQueryParams,
} from '../../lib/models';
import { FormIntegration } from '../Integration/Integration';
import { CreateFormsRecipient } from './Create';
import { ListResponse } from '../../lib/api';
import { IconAlertCircle } from '@tabler/icons-react';

export interface FormsIntegrationDetailProps {
  submitFormCb: (newForm: HttpNewFormsIntegration) => Promise<void>;
  getIntegrations: (params: IntegrationsQueryParams) => Promise<ListResponse<HttpIntegration>>;
  getFormIntegrations: (
    id: string,
    query: FormsIntegrationsQueryParams
  ) => Promise<ListResponse<HttpIntegration>>;
  deleteFormIntegrationCb: (formId: string, integrationId: string) => Promise<void>;
  form: Form;
}

export function FormsIntegrationDetail(props: FormsIntegrationDetailProps) {
  const [isBusy, setIsBusy] = useState(false);
  // TODO: Use error
  const [_, setError] = useState('');

  const [integrations, setIntegrations] = useState<HttpIntegration[]>([]);

  const submitCb = async (recipient: HttpNewFormsIntegration) => {
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
