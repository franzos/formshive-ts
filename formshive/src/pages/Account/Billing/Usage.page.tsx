import { Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { CombinedBillingDashboard } from '../../../components/Billing/CombinedBillingDashboard';

export function AccountBillingUsagePage() {
  const { t } = useTranslation();

  return (
    <>
      <Title order={2} mb="md">
        {t('glob_billing.billingOverview')}
      </Title>
      <CombinedBillingDashboard />
    </>
  )
}
