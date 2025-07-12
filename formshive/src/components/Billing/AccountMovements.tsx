import { Badge, Card, Table, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { AccountMovement, CommonQueryParams, formatCurrency, ListResponse } from '@gofranz/common';
import { showApiErrorNotification } from '@gofranz/common-components';
import { useEffect, useState } from 'react';
import { useRustyState } from '../../state';

export function AccountMovements() {
  const [movements, setMovements] = useState<AccountMovement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getAccountMovements } = useRustyState();

  useEffect(() => {
    const loadAccountMovements = async () => {
      try {
        const query: CommonQueryParams = { limit: 10 }; // Show last 10 movements
        const response: ListResponse<AccountMovement> = await getAccountMovements(query);
        if (response && Array.isArray(response.data)) {
          setMovements(response.data);
        } else {
          console.warn('Invalid account movements response:', response);
          setMovements([]);
        }
      } catch (error) {
        console.error('Failed to load account movements:', error);
        showApiErrorNotification(error, notifications, 'Failed to Load Account Movements');
        setMovements([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadAccountMovements();
  }, [getAccountMovements]);

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getMovementTypeColor = (amount: number) => {
    return amount > 0 ? 'green' : 'red';
  };

  const getMovementType = (amount: number) => {
    return amount > 0 ? 'Credit' : 'Debit';
  };

  if (isLoading) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text size="lg" fw={600} mb="md">
          Recent Account Movements
        </Text>
        <Text c="dimmed">Loading account movements...</Text>
      </Card>
    );
  }

  if (!movements || movements.length === 0) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text size="lg" fw={600} mb="md">
          Recent Account Movements
        </Text>
        <Text c="dimmed">No account movements found.</Text>
      </Card>
    );
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text size="lg" fw={600} mb="md">
        Recent Account Movements
      </Text>

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Date</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Features</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {movements.map((movement) => (
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
    </Card>
  );
}
