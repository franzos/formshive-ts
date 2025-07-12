import { Stack, Title } from '@mantine/core';
import { SubscriptionPlans } from '../../../components/Billing/SubscriptionPlans';
import { CurrentSubscription } from '../../../components/Billing/CurrentSubscription';

export function AccountBillingSubscriptionsPage() {
  return (
    <Stack gap="xl">
      <CurrentSubscription />
      <Title order={3} fw={600}>
        Subscription Plans
      </Title>
      <SubscriptionPlans />
    </Stack>
  );
}
