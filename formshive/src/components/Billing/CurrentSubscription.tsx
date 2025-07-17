import { useEffect, useState } from 'react';
import { Card, Text, Group, Button, Badge, Alert, Divider } from '@mantine/core';
import { IconInfoCircle, IconX, IconExternalLink, IconArrowRight } from '@tabler/icons-react';
import {
  Currency,
  formatCurrency,
  hasNextPlan,
  isPaidPlan,
  getNextPlan,
  getPlanDisplayName,
  getStatusColor,
  PlanAllowance,
} from '@gofranz/common';
import { useRustyState } from '../../state';

export function CurrentSubscription() {
  const {
    currentSubscription,
    subscriptionPlans,
    getAndSetCurrentSubscription,
    cancelSubscription,
    createCustomerPortalSession,
  } = useRustyState();

  const [canceling, setCanceling] = useState(false);
  const [openingPortal, setOpeningPortal] = useState(false);

  useEffect(() => {
    getAndSetCurrentSubscription();
  }, []);

  const handleCancel = async () => {
    try {
      setCanceling(true);
      await cancelSubscription();
      // Success feedback
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      // Error feedback
    } finally {
      setCanceling(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleOpenCustomerPortal = async () => {
    try {
      setOpeningPortal(true);
      const portalSession = await createCustomerPortalSession();
      window.location.href = portalSession.portal_url;
    } catch (error: any) {
      console.error('Customer Portal not available:', error);
      // Fallback to direct cancellation for now
      if (error.message?.includes('not available') || error.response?.status === 404) {
        console.warn('Customer Portal not implemented yet, falling back to direct cancellation');
        await handleCancel();
      } else {
        // Show error to user
        alert('Unable to open subscription management. Please try again later.');
      }
    } finally {
      setOpeningPortal(false);
    }
  };

  if (!currentSubscription) {
    return (
      <Alert icon={<IconInfoCircle size="1rem" />} title="No Active Subscription">
        You don't have an active subscription. You're using our pay-as-you-go billing model.
      </Alert>
    );
  }

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Group justify="space-between" mb="sm">
        <Text size="lg" fw={600}>
          Current Subscription
        </Text>
        <Badge color={getStatusColor(currentSubscription.status)}>
          {currentSubscription.status.toUpperCase()}
        </Badge>
      </Group>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginBottom: '12px',
        }}
      >
        <div>
          <Text size="xs" c="dimmed">
            Plan
          </Text>
          <Text fw={500} size="sm">
            {getPlanDisplayName(currentSubscription)}
          </Text>
        </div>

        {currentSubscription.current_period_start && (
          <div>
            <Text size="xs" c="dimmed">
              Period Started
            </Text>
            <Text size="sm">{formatDate(currentSubscription.current_period_start)}</Text>
          </div>
        )}

        {currentSubscription.current_period_end && (
          <div>
            <Text size="xs" c="dimmed">
              Next Billing
            </Text>
            <Text size="sm">{formatDate(currentSubscription.current_period_end)}</Text>
          </div>
        )}
      </div>

      {/* {currentSubscription.cancel_at_period_end && (
        <Alert color="orange" mb="sm">
          Subscription will be canceled at period end.
        </Alert>
      )} */}

      {hasNextPlan(currentSubscription) && (
        <>
          <Divider my="xs" />
          <Alert color="blue" mb="sm" icon={<IconArrowRight size="0.9rem" />}>
            <div>
              <Group justify="space-between" align="center" mb="xs">
                <Text fw={500} size="sm">
                  Next Cycle:{' '}
                  {getNextPlan(currentSubscription, subscriptionPlans)?.name ||
                    currentSubscription.next_plan_id}
                </Text>
                {getNextPlan(currentSubscription, subscriptionPlans) && (
                  <Text size="xs" c="dimmed">
                    {getNextPlan(currentSubscription, subscriptionPlans)!.price === 0
                      ? 'Free'
                      : `${formatCurrency([getNextPlan(currentSubscription, subscriptionPlans)!.currency as Currency, getNextPlan(currentSubscription, subscriptionPlans)!.price])}/mo`}
                  </Text>
                )}
              </Group>
              {getNextPlan(currentSubscription, subscriptionPlans) &&
                getNextPlan(currentSubscription, subscriptionPlans)!.allowances.length > 0 && (
                  <Text size="xs" c="dimmed">
                    {getNextPlan(currentSubscription, subscriptionPlans)!
                    .allowances.map((allowance: PlanAllowance) => {
                        const formatAmount = (resource: string, amount: number) => {
                          if (amount === -1) return 'Unlimited';
                          if (resource === 'file_upload') {
                            const mb = amount / 1024;
                            return mb.toLocaleString('en-US').replace(/,/g, ' ') + ' MB';
                          }
                          return amount.toLocaleString('en-US').replace(/,/g, ' ');
                        };
                      return `${formatAmount(allowance.service, allowance.limit)} ${allowance.service.replace('_', ' ')}`;
                      })
                      .join(' • ')}
                  </Text>
                )}
            </div>
          </Alert>
        </>
      )}

      {/* {currentSubscription.status.toLowerCase() === 'active' &&
        !currentSubscription.cancel_at_period_end && (
          <Group mt="sm">
            {isPaidPlan(currentSubscription, subscriptionPlans) ? (
              <Button
                variant="light"
                color="blue"
                size="sm"
                leftSection={<IconExternalLink size="0.9rem" />}
                loading={openingPortal}
                onClick={handleOpenCustomerPortal}
              >
                Manage via Stripe
              </Button>
            ) : (
              <Button
                variant="light"
                color="red"
                size="sm"
                leftSection={<IconX size="0.9rem" />}
                loading={canceling}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            )}
          </Group>
        )} */}

      {currentSubscription.status.toLowerCase() === 'active' && (
        <Group mt="sm">
          {isPaidPlan(currentSubscription, subscriptionPlans) ? (
            <Button
              variant="light"
              color="blue"
              size="sm"
              leftSection={<IconExternalLink size="0.9rem" />}
              loading={openingPortal}
              onClick={handleOpenCustomerPortal}
            >
              Manage via Stripe
            </Button>
          ) : (
            <Button
              variant="light"
              color="red"
              size="sm"
              leftSection={<IconX size="0.9rem" />}
              loading={canceling}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          )}
        </Group>
        )}
    </Card>
  );
}
