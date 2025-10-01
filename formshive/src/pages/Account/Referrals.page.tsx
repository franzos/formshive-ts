import { Title } from '@mantine/core';
import { ReferralDashboard } from '../../components/Billing/ReferralDashboard';

export function AccountReferralsPage() {
  return <>
    <Title order={2} mb="md">
      Referrals
    </Title>
    <ReferralDashboard />
  </>
}
