import { Badge, Card, Stack, Table, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  Currency,
  formatCurrency,
  ListResponse,
  ReferralHistoryItem,
  ReferralStatsResponse as ReferralStatsType,
} from '@gofranz/common';
import { showApiErrorNotification } from '@gofranz/common-components';
import { useEffect, useState } from 'react';
import { useRustyState } from '../../state';

interface ReferralStatsProps {
  stats: ReferralStatsType;
}

export function ReferralStats({ stats }: ReferralStatsProps) {
  const [referralHistory, setReferralHistory] = useState<ReferralHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const { getReferralHistory } = useRustyState();

  useEffect(() => {
    const loadReferralHistory = async () => {
      try {
        const response: ListResponse<ReferralHistoryItem> = await getReferralHistory();
        // The API response has structure: {data: [...], total: number}
        if (response && Array.isArray(response.data)) {
          setReferralHistory(response.data);
        } else {
          console.warn('Invalid referral history response:', response);
          setReferralHistory([]);
        }
      } catch (error) {
        console.error('Failed to load referral history:', error);
        showApiErrorNotification(error, notifications, 'Failed to Load Referral History');
        setReferralHistory([]);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    loadReferralHistory();
  }, [getReferralHistory]);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Handle total_earnings which comes as array of currency-amount pairs like [["EUR", 150000]]
  const getTotalEarnings = (): [Currency, number] => {
    if (Array.isArray(stats.total_earnings) && stats.total_earnings.length > 0) {
      // For now, display the first currency-amount pair
      const firstEarning = stats.total_earnings[0];
      if (Array.isArray(firstEarning) && firstEarning.length === 2) {
        return [firstEarning[0] as Currency, firstEarning[1]]; // Return the [currency, amount] pair
      }
    }
    return [Currency.EUR, 0]; // Default fallback
  };

  const getPendingEarnings = () => {
    return stats.pending_earnings || 0;
  };

  return (
    <Stack gap="md">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text size="lg" fw={600} mb="md">
          Referral Statistics
        </Text>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
          }}
        >
          <div>
            <Text size="sm" c="dimmed">
              Total Referrals
            </Text>
            <Text size="xl" fw={700}>
              {stats.total_referrals}
            </Text>
          </div>

          <div>
            <Text size="sm" c="dimmed">
              Total Earnings
            </Text>
            <Text size="xl" fw={700} c="green">
              {formatCurrency(getTotalEarnings())}
            </Text>
          </div>

          <div>
            <Text size="sm" c="dimmed">
              Pending Earnings
            </Text>
            <Text size="xl" fw={700} c="orange">
              {formatCurrency([Currency.EUR, getPendingEarnings()])}
            </Text>
          </div>
        </div>
      </Card>

      {!isLoadingHistory && referralHistory && referralHistory.length > 0 && (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="lg" fw={600} mb="md">
            Recent Referrals
          </Text>

          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date</Table.Th>
                <Table.Th>First Payment</Table.Th>
                <Table.Th>Bonus</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {referralHistory?.map((referral, index) => (
                <Table.Tr key={index}>
                  <Table.Td>
                    {referral?.created_at ? formatDate(referral.created_at) : '-'}
                  </Table.Td>
                  <Table.Td>
                    <Badge color={referral?.first_payment_processed ? 'green' : 'orange'}>
                      {referral?.first_payment_processed ? 'Processed' : 'Pending'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {referral?.bonus_amount && referral?.bonus_currency
                      ? formatCurrency([referral.bonus_currency as Currency, referral.bonus_amount])
                      : '-'}
                  </Table.Td>
                  <Table.Td>
                    {referral?.bonus_date ? (
                      <Badge color="green">Bonus Paid</Badge>
                    ) : referral?.first_payment_processed ? (
                      <Badge color="orange">Awaiting Bonus</Badge>
                    ) : (
                      <Badge color="gray">Pending Payment</Badge>
                    )}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      )}

      {!isLoadingHistory && (!referralHistory || referralHistory.length === 0) && (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="lg" fw={600} mb="md">
            Recent Referrals
          </Text>
          <Text c="dimmed">
            No referrals yet. Share your referral code to start earning commissions!
          </Text>
        </Card>
      )}

      {isLoadingHistory && (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="lg" fw={600} mb="md">
            Recent Referrals
          </Text>
          <Text c="dimmed">Loading referral history...</Text>
        </Card>
      )}
    </Stack>
  );
}
