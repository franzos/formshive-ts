import { showSuccessNotification, useLanguageAwareRouting } from '@gofranz/common-components';
import { Stack, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CreateIntegration } from '../../../components/Integration/Create';
import { IntegrationsHelp } from '../../../components/Integrations';
import { useRustyState } from '../../../state';
import { HttpNewIntegration } from '@gofranz/formshive-common';

export function AccountIntegrationCreatePage() {
  const { api } = useRustyState.getState();
  const nav = useNavigate();
  const { createLanguageURL } = useLanguageAwareRouting();
  const [searchParams] = useSearchParams();

  const integrationType = searchParams.get('type');

  const submit = async (newForm: HttpNewIntegration) => {
    const integration = await api.newIntegration(newForm);
    showSuccessNotification(
      'Integration Created',
      `Your ${newForm.title} integration has been successfully created and is ready to receive form submissions.`,
      notifications
    );
    nav(createLanguageURL(`/account/integrations/${integration.id}`));
  };

  return (
    <Stack gap="xl">
      <CreateIntegration submitFormCb={submit} initialIntegrationType={integrationType} />

      <div>
        <Title order={3} mb="md">
          Integration Setup Help
        </Title>
        <IntegrationsHelp />
      </div>
    </Stack>
  );
}
