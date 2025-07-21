import { useLanguageAwareRouting } from '@gofranz/common-components';
import { HttpNewIntegration } from '@gofranz/formshive-common';
import { Stack, Title } from '@mantine/core';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CreateIntegration } from '../../../components/Integration/Create';
import { IntegrationsHelp } from '../../../components/Integrations';
import { useRustyState } from '../../../state';

export function AccountIntegrationCreatePage() {
  const { api } = useRustyState.getState();
  const nav = useNavigate();
  const { createLanguageURL } = useLanguageAwareRouting();
  const [searchParams] = useSearchParams();

  const integrationType = searchParams.get('type');

  const submit = async (newForm: HttpNewIntegration) => {
    const integration = await api.newIntegration(newForm);
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
