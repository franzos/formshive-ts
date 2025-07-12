import { Alert, Button, Card, Stack, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Balance, formatCurrency } from '@gofranz/common';
import { showApiErrorNotification } from '@gofranz/common-components';
import { IconInfoCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useRustyState } from '../../state';
import { AccountMovements } from './AccountMovements';
import { CurrentSubscription } from './CurrentSubscription';
import { NewDepositForm } from './Deposit';
import { SubscriptionUsage } from './SubscriptionUsage';

export function CombinedBillingDashboard() {
  const { currentSubscription, getAndSetCurrentSubscription, api } = useRustyState();

  const [balance, setBalance] = useState<Balance[]>([]);
  const [addMoney, setAddMoney] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([getAndSetCurrentSubscription(), loadAccountBalance()]);
      } catch (error) {
        console.error('Failed to load billing data:', error);
        showApiErrorNotification(error, notifications, 'Failed to Load Billing Data');
      }
    };
    loadData();
  }, []);

  const loadAccountBalance = async () => {
    try {
      const res = await api.getAccountBalance();
      setBalance(res);
    } catch (error) {
      console.error('Failed to load account balance:', error);
      showApiErrorNotification(error, notifications, 'Failed to Load Account Balance');
    }
  };

  const BalanceComponent = ({ bal }: { bal: Balance }) => (
    <Text size="lg" fw={700} c="green">
      {formatCurrency(bal)}
    </Text>
  );

  const BalancesDisplay = ({ balances }: { balances: Balance[] }) => {
    if (!balances || balances.length === 0) {
      return <Text c="dimmed">No balance found</Text>;
    }
    return (
      <Stack gap="xs">
        {balances.map((bal, index) => (
          <BalanceComponent bal={bal} key={`balance-${index}`} />
        ))}
      </Stack>
    );
  };

  return (
    <Stack gap="md">
      <Text size="xl" fw={600}>
        Billing Overview
      </Text>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem',
        }}
      >
        <CurrentSubscription />

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="lg" fw={600} mb="md">
            Pay-as-you-go Credits
          </Text>
          <BalancesDisplay balances={balance} />
          {addMoney ? (
            <Stack gap="md" mt="md">
              <Title order={4}>Add Credits</Title>
              <NewDepositForm onCancelCb={() => setAddMoney(false)} />
            </Stack>
          ) : (
            <Button onClick={() => setAddMoney(true)} mt="md" variant="light">
              Add Credits
            </Button>
          )}
        </Card>
      </div>

      <Alert icon={<IconInfoCircle size="1rem" />} title="Hybrid Billing Model">
        When subscription allowances are exhausted, usage automatically falls back to pay-as-you-go
        credits. You'll never lose service - just additional usage beyond your plan limits.
      </Alert>

      {currentSubscription && currentSubscription.status.toLowerCase() === 'active' && (
        <SubscriptionUsage />
      )}

      <AccountMovements />
    </Stack>
  );
}
