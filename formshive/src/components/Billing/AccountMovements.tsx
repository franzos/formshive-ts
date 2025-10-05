import { Badge, Card, Flex, Pagination, Table, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { AccountMovement, CommonQueryParams, formatCurrency } from '@gofranz/common';
import { showApiErrorNotification, usePagination } from '@gofranz/common-components';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useRustyState } from '../../state';

export function AccountMovements() {
  const { getAccountMovements } = useRustyState();
  const { t } = useTranslation();

  const fetchAccountMovements = useCallback(async (params: { nextPage: number; [key: string]: any }) => {
    try {
      const { nextPage, ...otherParams } = params;
      const queryParams: CommonQueryParams = {
        offset: nextPage === 1 ? 0 : 10 * (nextPage - 1),
        limit: 10,
        ...otherParams,
      };
      const response = await getAccountMovements(queryParams);
      return {
        data: response.data || [],
        total: response.total || 0,
      };
    } catch (error) {
      console.error('Failed to load account movements:', error);
      showApiErrorNotification(error, notifications, 'Failed to Load Account Movements');
      return { data: [], total: 0 };
    }
  }, [getAccountMovements]);

  const pagination = usePagination({
    perPage: 10,
    fetchData: fetchAccountMovements,
  });

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getMovementTypeColor = (amount: number) => {
    return amount > 0 ? 'green' : 'red';
  };

  const getMovementType = (amount: number) => {
    return amount > 0 ? t('glob_billing.credit') : t('glob_billing.debit');
  };

  const totalPages = Math.ceil(pagination.total / pagination.perPage);

  if (pagination.loading) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text size="lg" fw={600} mb="md">
          {t('glob_billing.recentAccountMovements')}
        </Text>
        <Text c="dimmed">{t('glob_billing.loadingAccountMovements')}</Text>
      </Card>
    );
  }

  if (!pagination.data || pagination.data.length === 0) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text size="lg" fw={600} mb="md">
          {t('glob_billing.recentAccountMovements')}
        </Text>
        <Text c="dimmed">{t('glob_billing.noAccountMovements')}</Text>
      </Card>
    );
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text size="lg" fw={600} mb="md">
        {t('glob_billing.recentAccountMovements')}
      </Text>

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t('glob_billing.date')}</Table.Th>
            <Table.Th>{t('glob_billing.amount')}</Table.Th>
            <Table.Th>{t('glob_billing.type')}</Table.Th>
            <Table.Th>{t('glob_billing.features')}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {pagination.data.map((movement) => (
            <Table.Tr key={movement.id}>
              <Table.Td>{formatDate(movement.created_at)}</Table.Td>
              <Table.Td>
                <Text c={getMovementTypeColor(movement.amount)} fw={500}>
                  {formatCurrency([movement.currency, Math.abs(movement.amount)])}
                </Text>
              </Table.Td>
              <Table.Td>
                <Badge color={getMovementTypeColor(movement.amount)}>
                  {getMovementType(movement.amount)}
                </Badge>
              </Table.Td>
              <Table.Td>{movement.features || '-'}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {totalPages > 1 && (
        <Flex justify="center" mt="md">
          <Pagination total={totalPages} value={pagination.page} onChange={pagination.setPage} />
        </Flex>
      )}
    </Card>
  );
}
