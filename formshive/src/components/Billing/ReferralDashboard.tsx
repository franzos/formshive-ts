import { useEffect } from 'react';
import { Card, Text, Group, CopyButton, ActionIcon, Tooltip, Stack } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useRustyState } from '../../state';
import { ReferralStats } from './ReferralStats';

export function ReferralDashboard() {
  const { referralCode, referralStats, getAndSetReferralCode, getAndSetReferralStats } =
    useRustyState();
  const { t } = useTranslation();

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
    return <Text>{t('glob_billing.loadingReferralInfo')}</Text>;
  }

  return (
    <Stack gap="md">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text size="lg" fw={600} mb="md">
          {t('glob_billing.yourReferralCode')}
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
              <Tooltip label={copied ? t('glob_billing.copied') : t('glob_billing.copy')} withArrow position="right">
                <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy} size="lg">
                  {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>

        <Text size="sm" c="dimmed" mt="sm" mb="md">
          {t('glob_billing.shareDirectLink')}
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
              <Tooltip label={copied ? t('glob_billing.linkCopied') : t('glob_billing.copyLink')} withArrow position="right">
                <ActionIcon color={copied ? 'teal' : 'blue'} onClick={copy} size="lg">
                  {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>

        <Text size="sm" c="dimmed" mt="md">
          {t('glob_billing.referralDescription')}
        </Text>
      </Card>

      {referralStats && <ReferralStats stats={referralStats} />}
    </Stack>
  );
}
