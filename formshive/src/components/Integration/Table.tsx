import { ActionIcon, Box, Group, NavLink, ThemeIcon } from '@mantine/core';
import {
  IconBrandGoogle,
  IconBrandMailgun,
  IconBrandSlack,
  IconExternalLink,
  IconMail,
  IconTrash,
  IconUsers,
  IconWebhook,
} from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HttpIntegration, HttpUpdateIntegration } from '../../lib/models';
import { CommonTableProps } from '../../lib/table';

const getIntegrationIcon = (kind: string) => {
  switch (kind) {
    case 'API_PIPEDRIVE':
      return { icon: IconUsers, color: 'green' };
    case 'API_MAILCHIMP':
      return { icon: IconMail, color: 'yellow' };
    case 'API_KIT':
      return { icon: IconBrandMailgun, color: 'teal' };
    case 'WEBHOOK_ZAPIER':
      return { icon: IconWebhook, color: 'orange' };
    case 'WEBHOOK_SLACK':
      return { icon: IconBrandSlack, color: 'grape' };
    case 'WEBHOOK_GOOGLE_SHEETS':
      return { icon: IconBrandGoogle, color: 'green' };
    case 'WEBHOOK':
    default:
      return { icon: IconExternalLink, color: 'blue' };
  }
};

const getIntegrationDisplayName = (kind: string) => {
  switch (kind) {
    case 'API_PIPEDRIVE':
      return 'Pipedrive CRM';
    case 'API_MAILCHIMP':
      return 'Mailchimp';
    case 'API_KIT':
      return 'Kit (ConvertKit)';
    case 'WEBHOOK_ZAPIER':
      return 'Zapier';
    case 'WEBHOOK_SLACK':
      return 'Slack';
    case 'WEBHOOK_GOOGLE_SHEETS':
      return 'Google Sheets';
    case 'WEBHOOK':
    default:
      return 'Custom Webhook';
  }
};

export function IntegrationsTable(props: CommonTableProps<HttpIntegration, HttpUpdateIntegration>) {
  const { t } = useTranslation();
  const [isBusy, setIsBusy] = useState(false);
  const [records, setRecords] = useState<HttpIntegration[] | []>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const doIt = async () => {
      setIsBusy(true);
      try {
        const newRecords = await props.onChange({
          nextPage: page,
        });
        setRecords(newRecords);
      } catch (e) {
        alert(e);
        console.error(e);
      } finally {
        setIsBusy(false);
      }
    };
    doIt();
  }, [page]);

  const deleteCb = async (id: string) => {
    setIsBusy(true);
    await props.deleteCb(id);
    setRecords((prev) => prev.filter((m) => m.id !== id));
    setIsBusy(false);
  };

  const columns = [
    {
      accessor: 'title',
      title: t('integrationTable.integrationName'),
      render: (row: HttpIntegration) => (
        <NavLink label={row.title} onClick={() => props.openRowPage(row)} />
      ),
    },
    {
      accessor: 'type',
      title: t('integrationTable.integrationType'),
      render: (row: HttpIntegration) => {
        const { icon: Icon, color } = getIntegrationIcon(row.kind);
        return (
          <Group wrap="nowrap" gap="xs">
            <ThemeIcon size="sm" radius="xl" color={color}>
              <Icon size={14} />
            </ThemeIcon>
            {getIntegrationDisplayName(row.kind)}
          </Group>
        );
      },
    },
    {
      accessor: 'created_at',
      title: t('integrationTable.createdAt'),
      render: (row: HttpIntegration) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      accessor: 'updated_at',
      title: t('integrationTable.updatedAt'),
      render: (row: HttpIntegration) => new Date(row.updated_at).toLocaleDateString(),
    },
    {
      accessor: 'delete',
      title: '',
      render: (row: HttpIntegration) => (
        <ActionIcon
          color="red"
          onClick={() => deleteCb(row.id)}
          loading={isBusy}
          variant="filled"
          aria-label={t('integration.delete')}
        >
          <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
      ),
    },
  ];

  return (
    <Box>
      <DataTable
        withTableBorder
        borderRadius="md"
        shadow="xs"
        records={records}
        columns={columns}
        totalRecords={props.pagination.total}
        recordsPerPage={props.pagination.perPage}
        page={page}
        onPageChange={(p) => setPage(p)}
        fetching={isBusy}
        loadingText={t('integrationTable.loading')}
        noRecordsText={t('integrationTable.noIntegrationsFound')}
      />
    </Box>
  );
}
