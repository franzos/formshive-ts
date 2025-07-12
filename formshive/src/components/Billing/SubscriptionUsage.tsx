import { UsageResponse as SubscriptionUsageItem } from '@gofranz/common';
import { Card, Group, Progress, Stack, Text } from '@mantine/core';
import { useEffect } from 'react';
import { useRustyState } from '../../state';

export function SubscriptionUsage() {
  const { subscriptionUsage, getAndSetSubscriptionUsage, currentSubscription } = useRustyState();

  useEffect(() => {
    const loadUsage = async () => {
      try {
        await getAndSetSubscriptionUsage();
      } catch (error) {
        console.error('Failed to load subscription usage:', error);
      }
    };
    loadUsage();
  }, []);

  // Check if subscriptionUsage is the array format from API
  const isArrayFormat = Array.isArray(subscriptionUsage);
  const usageItems: SubscriptionUsageItem[] = isArrayFormat
    ? (subscriptionUsage as SubscriptionUsageItem[])
    : [];

  if (!subscriptionUsage || (isArrayFormat && usageItems.length === 0)) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text>No subscription usage data available</Text>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatServiceName = (service: string) => {
    return service.replace('_', ' ').toUpperCase();
  };

  const formatUsageAmount = (service: string, amount: number) => {
    if (amount === -1) return '∞';

    if (service === 'file_upload') {
      // Convert KB to MB and add thousands separator with space
      const mb = amount / 1024;
      return mb.toLocaleString('en-US').replace(/,/g, ' ') + ' MB';
    }

    // Add thousands separator with space for regular numbers
    return amount.toLocaleString('en-US').replace(/,/g, ' ');
  };

  const getPeriodDisplay = () => {
    if (currentSubscription?.current_period_start && currentSubscription?.current_period_end) {
      return `${formatDate(currentSubscription.current_period_start)} - ${formatDate(currentSubscription.current_period_end)}`;
    }
    return 'Current billing period';
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text size="lg" fw={600} mb="md">
        Usage This Period
      </Text>

      <Group mb="md">
        <Text size="sm" c="dimmed">
          Period: {getPeriodDisplay()}
        </Text>
      </Group>

      <Stack gap="md">
        {usageItems.map((usage, index) => {
          const percentage = (usage.used / usage.limit) * 100;
          const isNearLimit = percentage > 80;
          const isOverLimit = usage.used > usage.limit;

          return (
            <div key={`${usage.service}-${index}`}>
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={500}>
                  {formatServiceName(usage.service)}
                </Text>
                <Text size="sm" c={isOverLimit ? 'red' : isNearLimit ? 'orange' : 'dimmed'}>
                  {formatUsageAmount(usage.service, usage.used)} /{' '}
                  {formatUsageAmount(usage.service, usage.limit)}
                </Text>
              </Group>

              <Progress
                value={usage.limit === -1 ? 0 : Math.min(percentage, 100)}
                color={isOverLimit ? 'red' : isNearLimit ? 'orange' : 'blue'}
                size="lg"
                radius="sm"
              />

              {usage.remaining < 0 && (
                <Text size="xs" c="red" mt="xs">
                  Exceeded by {formatUsageAmount(usage.service, Math.abs(usage.remaining))}
                </Text>
              )}

              {usage.remaining >= 0 && usage.limit !== -1 && (
                <Text size="xs" c="dimmed" mt="xs">
                  {formatUsageAmount(usage.service, usage.remaining)} remaining
                </Text>
              )}
            </div>
          );
        })}
      </Stack>
    </Card>
  );
}
