import { useLanguageAwareRouting, usePagination } from '@gofranz/common-components';
import { Button, Card, Group, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import {
  IconBrandGoogle,
  IconBrandSlack,
  IconExternalLink,
  IconMail,
  IconUsers,
  IconWebhook,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { IntegrationsTable } from '../../../components/Integration/Table';
import { IntegrationsHelp } from '../../../components/Integrations';
import { HttpIntegration } from '../../../lib/models';
import { useRustyState } from '../../../state';

export function AccountIntegrationsStartPage() {
  const { t } = useTranslation();
  const { api } = useRustyState.getState();
  const nav = useNavigate();
  const { createLanguageURL } = useLanguageAwareRouting();

  const fetchIntegrations = async (params: { nextPage: number; [key: string]: any }) => {
    const { nextPage, ...otherParams } = params;
    const apiParams = {
      offset: nextPage === 1 ? 0 : 10 * (nextPage - 1),
      limit: 10,
      ...otherParams,
    };

    const res = await api.getIntegrations(apiParams);
    return {
      data: res.data,
      total: res.total,
    };
  };

  const pagination = usePagination({
    perPage: 10,
    fetchData: fetchIntegrations,
  });

  const openCreate = (integrationType?: string) => {
    const url = integrationType
      ? `/account/integrations/create?type=${integrationType}`
      : '/account/integrations/create';
    nav(createLanguageURL(url));
  };

  const openForm = (form: HttpIntegration) => {
    nav(createLanguageURL(`/account/integrations/${form.id}`));
  };

  const handleIntegrationsChange = async (params: { nextPage: number; [key: string]: any }) => {
    return await pagination.loadPage(params.nextPage, params);
  };

  return (
    <Stack gap="xl">
      <div>
        <Title order={2} mb="md">
          Integrations
        </Title>
        <Text mb="lg" c="dimmed">
          Connect your forms to external services and automate your workflow. Choose from popular
          integrations below or create a custom webhook.
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md" mb="xl">
          <Card
            withBorder
            padding="lg"
            radius="md"
            style={{ cursor: 'pointer' }}
            onClick={() => openCreate('PIPEDRIVE')}
          >
            <Group>
              <ThemeIcon size="xl" radius="md" color="teal">
                <IconUsers size={24} />
              </ThemeIcon>
              <div>
                <Text fw={500} size="sm">
                  Pipedrive
                </Text>
                <Text size="xs" c="dimmed">
                  CRM & Leads
                </Text>
              </div>
            </Group>
          </Card>

          <Card
            withBorder
            padding="lg"
            radius="md"
            style={{ cursor: 'pointer' }}
            onClick={() => openCreate('MAILCHIMP')}
          >
            <Group>
              <ThemeIcon size="xl" radius="md" color="yellow">
                <IconMail size={24} />
              </ThemeIcon>
              <div>
                <Text fw={500} size="sm">
                  Mailchimp
                </Text>
                <Text size="xs" c="dimmed">
                  Email Marketing
                </Text>
              </div>
            </Group>
          </Card>

          <Card
            withBorder
            padding="lg"
            radius="md"
            style={{ cursor: 'pointer' }}
            onClick={() => openCreate('ZAPIER')}
          >
            <Group>
              <ThemeIcon size="xl" radius="md" color="orange">
                <IconWebhook size={24} />
              </ThemeIcon>
              <div>
                <Text fw={500} size="sm">
                  Zapier
                </Text>
                <Text size="xs" c="dimmed">
                  8,000+ apps
                </Text>
              </div>
            </Group>
          </Card>

          <Card
            withBorder
            padding="lg"
            radius="md"
            style={{ cursor: 'pointer' }}
            onClick={() => openCreate('SLACK')}
          >
            <Group>
              <ThemeIcon size="xl" radius="md" color="grape">
                <IconBrandSlack size={24} />
              </ThemeIcon>
              <div>
                <Text fw={500} size="sm">
                  Slack
                </Text>
                <Text size="xs" c="dimmed">
                  Team notifications
                </Text>
              </div>
            </Group>
          </Card>

          <Card
            withBorder
            padding="lg"
            radius="md"
            style={{ cursor: 'pointer' }}
            onClick={() => openCreate('GOOGLE_SHEETS')}
          >
            <Group>
              <ThemeIcon size="xl" radius="md" color="green">
                <IconBrandGoogle size={24} />
              </ThemeIcon>
              <div>
                <Text fw={500} size="sm">
                  Google Sheets
                </Text>
                <Text size="xs" c="dimmed">
                  Spreadsheet data
                </Text>
              </div>
            </Group>
          </Card>

          <Card
            withBorder
            padding="lg"
            radius="md"
            style={{ cursor: 'pointer' }}
            onClick={() => openCreate('WEBHOOK')}
          >
            <Group>
              <ThemeIcon size="xl" radius="md" color="blue">
                <IconExternalLink size={24} />
              </ThemeIcon>
              <div>
                <Text fw={500} size="sm">
                  Custom Webhook
                </Text>
                <Text size="xs" c="dimmed">
                  Any API endpoint
                </Text>
              </div>
            </Group>
          </Card>
        </SimpleGrid>

        <Group mb="lg">
          <Button onClick={() => openCreate()}>{t('accountPages.newIntegration')}</Button>
        </Group>
      </div>

      <div>
        <Title order={3} mb="md">
          Your Integrations
        </Title>
        <IntegrationsTable
          pagination={pagination.paginationConfig}
          onChange={handleIntegrationsChange}
          openRowPage={openForm}
          updateCb={api.updateIntegration}
          deleteCb={api.deleteIntegration}
        />
      </div>

      <div>
        <Title order={3} mb="md">
          Integration Help
        </Title>
        <IntegrationsHelp />
      </div>
    </Stack>
  );
}
