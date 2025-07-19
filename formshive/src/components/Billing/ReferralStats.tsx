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
import { useTranslation } from 'react-i18next';
import { useRustyState } from '../../state';

interface ReferralStatsProps {
  stats: ReferralStatsType;
}

export function ReferralStats({ stats }: ReferralStatsProps) {
  const [referralHistory, setReferralHistory] = useState<ReferralHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const { getReferralHistory } = useRustyState();
  const { t } = useTranslation();

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

  // TODO
  const getPendingEarnings = () => {
    return 0
    // return stats.pending_earnings || 0;
  };

  return (
    <Stack gap="md">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text size="lg" fw={600} mb="md">
          {t('glob_billing.referralStatistics')}
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
              {t('glob_billing.totalReferrals')}
            </Text>
            <Text size="xl" fw={700}>
              {stats.total_referrals}
            </Text>
          </div>

          <div>
            <Text size="sm" c="dimmed">
              {t('glob_billing.totalEarnings')}
            </Text>
            <Text size="xl" fw={700} c="green">
              {formatCurrency(getTotalEarnings())}
            </Text>
          </div>

          <div>
            <Text size="sm" c="dimmed">
              {t('glob_billing.pendingEarnings')}
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
            {t('glob_billing.recentReferrals')}
          </Text>

          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('glob_billing.date')}</Table.Th>
                <Table.Th>{t('glob_billing.firstPayment')}</Table.Th>
                <Table.Th>{t('glob_billing.bonus')}</Table.Th>
                <Table.Th>{t('glob_billing.status')}</Table.Th>
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
                      {referral?.first_payment_processed ? t('glob_billing.processed') : t('glob_billing.pending')}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {referral?.bonus_amount && referral?.bonus_currency
                      ? formatCurrency([referral.bonus_currency as Currency, referral.bonus_amount])
                      : '-'}
                  </Table.Td>
                  <Table.Td>
                    {referral?.bonus_date ? (
                      <Badge color="green">{t('glob_billing.bonusPaid')}</Badge>
                    ) : referral?.first_payment_processed ? (
                      <Badge color="orange">{t('glob_billing.awaitingBonus')}</Badge>
                    ) : (
                      <Badge color="gray">{t('glob_billing.pendingPayment')}</Badge>
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
            {t('glob_billing.recentReferrals')}
          </Text>
          <Text c="dimmed">
            {t('glob_billing.noReferrals')}
          </Text>
        </Card>
      )}

      {isLoadingHistory && (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="lg" fw={600} mb="md">
            {t('glob_billing.recentReferrals')}
          </Text>
          <Text c="dimmed">{t('glob_billing.loadingReferralHistory')}</Text>
        </Card>
      )}
    </Stack>
  );
}
