import { showSuccessNotification } from '@gofranz/common-components';
import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IntegrationDetail } from '../../../components/Integration/Detail';
import { HttpIntegration, HttpUpdateIntegration } from '../../../lib/models';
import { useRustyState } from '../../../state';

export function AccountIntegrationViewPage() {
  const { api } = useRustyState.getState();
  const { uuid } = useParams<{ uuid: string }>();
  const [integration, setIntegration] = useState<HttpIntegration | undefined>(undefined);

  useEffect(() => {
    const getForm = async () => {
      if (!uuid) {
        return;
      }
      const res = await api.getIntegration(uuid);
      if (res) {
        setIntegration(res);
      }
    };
    getForm();
  }, []);

  const handleUpdate = async (id: string, updateIntegration: HttpUpdateIntegration) => {
    await api.updateIntegration(id, updateIntegration);
    showSuccessNotification(
      'Integration Updated',
      `Your ${integration?.title || 'integration'} has been successfully updated with the new settings.`,
      notifications
    );
    // Refresh the integration data to show updated values
    if (uuid) {
      const res = await api.getIntegration(uuid);
      if (res) {
        setIntegration(res);
      }
    }
  };

  return (
    <>
      {integration && integration.id && (
        <IntegrationDetail
          integration={integration}
          submitCb={handleUpdate}
          deleteCb={api.deleteIntegration}
        />
      )}
    </>
  );
}
