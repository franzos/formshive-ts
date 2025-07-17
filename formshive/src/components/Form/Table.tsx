import { useEffect, useState } from 'react';
import { DataTable } from 'mantine-datatable';
import { ActionIcon, NavLink, Tooltip, Group } from '@mantine/core';
import {
  IconTrash,
  IconShield,
  IconLink,
  IconListCheck,
  IconShieldCheck,
  IconMail,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { CommonTableProps } from '../../lib/table';
import { Form, UpdateForm } from '@gofranz/formshive-common';

export function FormsTable(props: CommonTableProps<Form, UpdateForm>) {
  const { t } = useTranslation();
  const [isBusy, setIsBusy] = useState(false);
  const [records, setRecords] = useState<Form[] | []>([]);
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
      title: t('forms.formName'),
      render: (row: Form) => <NavLink label={row.title} onClick={() => props.openRowPage(row)} />,
    },
    {
      accessor: 'security',
      title: t('forms.security'),
      textAlign: 'center' as const,
      render: (row: Form) => (
        <Group gap="xs" justify="center">
          {row.filter_spam && (
            <Tooltip label={t('forms.spamFilterEnabled')}>
              <IconShield size={16} style={{ color: 'var(--mantine-color-blue-6)' }} />
            </Tooltip>
          )}
          {row.check_challenge && (
            <Tooltip label={t('forms.captchaEnabled')}>
              <IconShieldCheck size={16} style={{ color: 'var(--mantine-color-green-6)' }} />
            </Tooltip>
          )}
          {!row.filter_spam && !row.check_challenge && (
            <Tooltip label={t('forms.noSecurityEnabled')}>
              <span style={{ color: 'var(--mantine-color-gray-5)' }}>—</span>
            </Tooltip>
          )}
        </Group>
      ),
    },
    {
      accessor: 'redirect',
      title: t('forms.redirect'),
      textAlign: 'center' as const,
      render: (row: Form) => (
        <Tooltip label={row.redirect_url || t('forms.noRedirectUrl')}>
          {row.redirect_url ? (
            <IconLink size={16} style={{ color: 'var(--mantine-color-blue-6)' }} />
          ) : (
            <span style={{ color: 'var(--mantine-color-gray-5)' }}>—</span>
          )}
        </Tooltip>
      ),
    },
    {
      accessor: 'specs',
      title: t('forms.fieldSpecs'),
      textAlign: 'center' as const,
      render: (row: Form) => (
        <Tooltip label={row.check_specs ? t('forms.specsEnabled') : t('forms.specsDisabled')}>
          {row.check_specs ? (
            <IconListCheck size={16} style={{ color: 'var(--mantine-color-green-6)' }} />
          ) : (
            <span style={{ color: 'var(--mantine-color-gray-5)' }}>—</span>
          )}
        </Tooltip>
      ),
    },
    {
      accessor: 'autoResponse',
      title: t('forms.autoResponse'),
      textAlign: 'center' as const,
      render: (row: Form) => (
        <Tooltip
          label={
            row.auto_response_enabled
              ? t('forms.autoResponseEnabled')
              : t('forms.autoResponseDisabled')
          }
        >
          {row.auto_response_enabled ? (
            <IconMail size={16} style={{ color: 'var(--mantine-color-orange-6)' }} />
          ) : (
            <span style={{ color: 'var(--mantine-color-gray-5)' }}>—</span>
          )}
        </Tooltip>
      ),
    },
    {
      accessor: 'updated_at',
      title: t('forms.updatedAt'),
      render: (row: Form) => new Date(row.updated_at).toLocaleDateString(),
    },
    {
      accessor: 'delete',
      title: '',
      textAlign: 'center' as const,
      render: (row: Form) => (
        <ActionIcon
          color="red"
          onClick={() => deleteCb(row.id)}
          loading={isBusy}
          variant="filled"
          aria-label={t('forms.deleteAriaLabel')}
        >
          <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
      ),
    },
  ];

  return (
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
      loadingText={t('forms.loading')}
      noRecordsText={t('forms.noFormsFound')}
    />
  );
}
