import { useEffect } from 'react';
import { Card, Text, Group, CopyButton, ActionIcon, Tooltip, Stack } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { useRustyState } from '../../state';
import { ReferralStats } from './ReferralStats';

export function ReferralDashboard() {
  const { referralCode, referralStats, getAndSetReferralCode, getAndSetReferralStats } =
    useRustyState();

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([getAndSetReferralCode(), getAndSetReferralStats()]);
      } catch (error) {
        console.error('Failed to load referral data:', error);
      }
    };
    loadData();
  }, []);

  if (!referralCode) {
    return <Text>Loading referral information...</Text>;
  }

  return (
    <Stack gap="md">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text size="lg" fw={600} mb="md">
          Your Referral Code
        </Text>

        <Group gap="md" align="center">
          <Text
            size="xl"
            fw={700}
            ff="monospace"
            p="sm"
            style={{
              backgroundColor: 'var(--mantine-color-gray-1)',
              borderRadius: '6px',
              border: '1px solid var(--mantine-color-gray-3)',
            }}
          >
            {referralCode.code}
          </Text>

          <CopyButton value={referralCode.code} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy} size="lg">
                  {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>

        <Text size="sm" c="dimmed" mt="sm" mb="md">
          Or share this direct signup link:
        </Text>

        <Group gap="md" align="center">
          <Text
            size="sm"
            ff="monospace"
            p="sm"
            style={{
              backgroundColor: 'var(--mantine-color-blue-0)',
              borderRadius: '6px',
              border: '1px solid var(--mantine-color-blue-3)',
              wordBreak: 'break-all',
              flexGrow: 1,
            }}
          >
            {`${window.location.origin}/#/?ref=${referralCode.code}`}
          </Text>

          <CopyButton
            value={`${window.location.origin}/#/?ref=${referralCode.code}`}
            timeout={2000}
          >
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Link Copied' : 'Copy Link'} withArrow position="right">
                <ActionIcon color={copied ? 'teal' : 'blue'} onClick={copy} size="lg">
                  {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>

        <Text size="sm" c="dimmed" mt="md">
          When someone signs up with your referral link and makes their first subscription payment
          or deposit, you earn 10% of that amount, and they receive a 10% bonus.
        </Text>
      </Card>

      {referralStats && <ReferralStats stats={referralStats} />}
    </Stack>
  );
}
