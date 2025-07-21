import {
  Currency,
  formatCurrency,
  isCurrentPlan,
  isNextPlan,
  SubscriptionPlanConfig,
} from '@gofranz/common';
import { showApiErrorNotification } from '@gofranz/common-components';
import {
  Badge,
  Box,
  BoxProps,
  Button,
  Group,
  List,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconBuilding, IconCheck, IconCrown, IconRocket, IconStar } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useRustyState } from '../../state';

interface SubscriptionPlansProps extends BoxProps {
  mode?: 'public' | 'private';
}

export function SubscriptionPlans({ mode = 'private', ...boxProps }: SubscriptionPlansProps) {
  const {
    subscriptionPlans,
    currentSubscription,
    getAndSetSubscriptionPlans,
    getAndSetCurrentSubscription,
    subscribeToplan,
  } = useRustyState();

  const [loading, setLoading] = useState(false);
  const [subscribingToPlan, setSubscribingToPlan] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Always load subscription plans
        await getAndSetSubscriptionPlans();

        // Only load current subscription in private mode
        if (mode === 'private') {
          await getAndSetCurrentSubscription();
        }
      } catch (error) {
        console.error('Failed to load subscription data:', error);
        showApiErrorNotification(error, notifications, 'Loading Error');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [mode]);

  const handleSubscribe = async (planId: string) => {
    try {
      setSubscribingToPlan(planId);
      await subscribeToplan(planId);
    } catch (error: any) {
      console.error('Failed to subscribe:', error);
      showApiErrorNotification(error, notifications, 'Subscription Error');
    } finally {
      setSubscribingToPlan(null);
    }
  };

  if (loading) {
    return <LoadingOverlay visible />;
  }

  return (
    <Box
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
      }}
      {...boxProps}
    >
      {subscriptionPlans?.map((plan: SubscriptionPlanConfig, index: number) => {
        const isPremium = !plan.is_free_plan && plan.price > 0;
        const isCurrent = isCurrentPlan(plan.id, currentSubscription);
        const isUpcoming = isNextPlan(plan.id, currentSubscription);

        // Plan tier colors and icons based on typical order: Free, Hobby, Project, Business
        const getTierConfig = (index: number, planName: string) => {
          const name = planName.toLowerCase();
          if (name.includes('free') || index === 0) {
            return { color: 'gray', icon: IconStar, gradient: null };
          } else if (name.includes('hobby') || index === 1) {
            return { color: 'blue', icon: IconCrown, gradient: { from: 'blue', to: 'cyan' } };
          } else if (name.includes('project') || index === 2) {
            return { color: 'violet', icon: IconRocket, gradient: { from: 'violet', to: 'grape' } };
          } else {
            return { color: 'orange', icon: IconBuilding, gradient: { from: 'orange', to: 'red' } };
          }
        };

        const tierConfig = getTierConfig(index, plan.name);

        return (
          <Paper
            key={plan.id}
            shadow={isPremium ? 'lg' : 'sm'}
            p="xl"
            radius="lg"
            withBorder
            style={{
              position: 'relative',
              border:
                isCurrent || isUpcoming
                  ? `2px solid var(--mantine-color-${tierConfig.color}-5)`
                  : undefined,
              background:
                isPremium && !isCurrent && !isUpcoming
                  ? `linear-gradient(135deg, var(--mantine-color-${tierConfig.color}-0) 0%, var(--mantine-color-white) 100%)`
                  : undefined,
            }}
          >
            <Stack gap="md">
              <Group justify="space-between" align="flex-start">
                <Group gap="xs">
                  <ThemeIcon variant="light" color={tierConfig.color} size="sm">
                    <tierConfig.icon size={16} />
                  </ThemeIcon>
                  <Text fw={600} size="lg">
                    {plan.name}
                  </Text>
                </Group>
                <Group gap="xs">
                  {mode === 'private' && isCurrent && (
                    <Badge color="green" variant="filled" size="sm">
                      Current
                    </Badge>
                  )}
                  {mode === 'private' && isUpcoming && (
                    <Badge color="blue" variant="filled" size="sm">
                      Upcoming
                    </Badge>
                  )}
                  {plan.is_free_plan && (
                    <Badge color="gray" variant="light" size="sm">
                      Free
                    </Badge>
                  )}
                </Group>
              </Group>

              <Box>
                <Text size="2rem" fw={900} c={tierConfig.color} lh={1}>
                  {plan.price === 0
                    ? 'Free'
                    : formatCurrency([plan.currency as Currency, plan.price])}
                </Text>
                {plan.price > 0 && (
                  <Text size="sm" c="dimmed" mt={-5}>
                    /month
                  </Text>
                )}
              </Box>

              <Box>
                <Text size="sm" fw={500} c="dark" mb="xs">
                  What's included:
                </Text>
                <List size="sm" spacing="xs">
                  {plan.allowances.map((allowance, index) => {
                    const formatAmount = (resource: string, amount: number) => {
                      if (amount === -1) return 'Unlimited';

                      if (resource === 'file_upload') {
                        // Convert KB to MB and add thousands separator with space
                        const mb = amount / 1024;
                        return mb.toLocaleString('en-US').replace(/,/g, ' ') + ' MB';
                      }

                      // Add thousands separator with space for regular numbers
                      return amount.toLocaleString('en-US').replace(/,/g, ' ');
                    };

                    return (
                      <List.Item
                        key={index}
                        icon={
                          <ThemeIcon color={tierConfig.color} size={18} radius="xl">
                            <IconCheck size={12} />
                          </ThemeIcon>
                        }
                      >
                        <Text size="sm">
                          <Text component="span" fw={500}>
                            {formatAmount(allowance.service, allowance.limit)}
                          </Text>{' '}
                          <Text component="span" c="dimmed">
                            {allowance.service.replace('_', ' ')}
                          </Text>
                        </Text>
                      </List.Item>
                    );
                  })}
                </List>

                {/* Features section */}
                {plan.features && plan.features.length > 0 && (
                  <Box mt="md">
                    <Text size="sm" fw={500} c="dark" mb="xs">
                      Integrations:
                    </Text>
                    <List size="sm" spacing="xs">
                      {plan.features.map((feature, index) => {
                        const formatFeature = (feature: string) => {
                          // Parse integration features like "integration:webhook" -> "Webhook"
                          if (feature.startsWith('integration:')) {
                            const integrationName = feature.split(':')[1];
                            // Convert snake_case or kebab-case to Title Case
                            return integrationName
                              .split(/[_-]/)
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ');
                          }

                          // Handle other feature types if needed
                          return feature.charAt(0).toUpperCase() + feature.slice(1);
                        };

                        return (
                          <List.Item
                            key={index}
                            icon={
                              <ThemeIcon color={tierConfig.color} size={18} radius="xl">
                                <IconCheck size={12} />
                              </ThemeIcon>
                            }
                          >
                            <Text size="sm">{formatFeature(feature)}</Text>
                          </List.Item>
                        );
                      })}
                    </List>
                  </Box>
                )}
              </Box>

              {mode === 'private' && (
                <Button
                  fullWidth
                  size="md"
                  variant={isCurrent || isUpcoming ? 'light' : isPremium ? 'gradient' : 'filled'}
                  gradient={isPremium && tierConfig.gradient ? tierConfig.gradient : undefined}
                  color={!isPremium ? tierConfig.color : undefined}
                  disabled={isCurrent || isUpcoming || subscribingToPlan === plan.id}
                  loading={subscribingToPlan === plan.id}
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {isCurrent
                    ? 'Current Plan'
                    : isUpcoming
                      ? `Upcoming Plan`
                      : currentSubscription?.plan_id
                        ? 'Switch Plan'
                        : 'Get Started'}
                </Button>
              )}
            </Stack>
          </Paper>
        );
      })}
    </Box>
  );
}
