import { News } from '@gofranz/common-components';
import {
  Anchor,
  Button,
  Card,
  Center,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { IconFileText, IconMail, IconPlug, IconPlus, IconUser } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Docs } from '../../components/Docs';
import { useRustyState } from '../../state';

export function AccountHomePage() {
  const { t } = useTranslation();
  const theme = useMantineTheme();

  useEffect(() => {
    useRustyState.getState().getAndSetVerifiedEmails();
    useRustyState.getState().getAndSetForms();
  }, []);

  const GetStarted = () => (
    <Card shadow="xs" padding="lg" radius="md" mb="md" withBorder>
      <Title order={2} mb="md">
        {t('account.newHereTitle')}
      </Title>

      <Group>
        <Button
          component="a"
          href="/#/account/forms/create"
          color="blue"
          leftSection={<IconPlus />}
          variant="primary"
        >
          {t('account.createForm')}
        </Button>
      </Group>
      <Text mt="sm">
        {t('account.questions')}{' '}
        <Anchor href="mailto:support@formshive.com">support@formshive.com</Anchor>
      </Text>
    </Card>
  );

  const QuickActions = () => (
    <SimpleGrid cols={{ base: 1, xs: 2, sm: 4 }} spacing="md" mb="md">
      <Card shadow="xs" padding="lg" radius="md" withBorder>
        <Stack align="center" gap="sm">
          <Center>
            <IconFileText size={32} color={theme.colors.primary[6]} />
          </Center>
          <Title order={4} ta="center">
            {t('account.formsTitle')}
          </Title>
          <Text size="sm" ta="center" c="dimmed">
            {t('account.formsDescription')}
          </Text>
          <Button component="a" href="/#/account/forms" variant="light" size="sm" fullWidth>
            {t('account.goToForms')}
          </Button>
        </Stack>
      </Card>

      <Card shadow="xs" padding="lg" radius="md" withBorder>
        <Stack align="center" gap="sm">
          <Center>
            <IconPlug size={32} color={theme.colors.primary[6]} />
          </Center>
          <Title order={4} ta="center">
            {t('account.integrationsTitle')}
          </Title>
          <Text size="sm" ta="center" c="dimmed">
            {t('account.integrationsDescription')}
          </Text>
          <Button component="a" href="/#/account/integrations" variant="light" size="sm" fullWidth>
            {t('account.goToIntegrations')}
          </Button>
        </Stack>
      </Card>

      <Card shadow="xs" padding="lg" radius="md" withBorder>
        <Stack align="center" gap="sm">
          <Center>
            <IconMail size={32} color={theme.colors.primary[6]} />
          </Center>
          <Title order={4} ta="center">
            {t('account.messagesTitle')}
          </Title>
          <Text size="sm" ta="center" c="dimmed">
            {t('account.messagesDescription')}
          </Text>
          <Button component="a" href="/#/account/messages" variant="light" size="sm" fullWidth>
            {t('account.goToMessages')}
          </Button>
        </Stack>
      </Card>

      <Card shadow="xs" padding="lg" radius="md" withBorder>
        <Stack align="center" gap="sm">
          <Center>
            <IconUser size={32} color={theme.colors.primary[6]} />
          </Center>
          <Title order={4} ta="center">
            {t('account.profileTitle')}
          </Title>
          <Text size="sm" ta="center" c="dimmed">
            {t('account.profileDescription')}
          </Text>
          <Button component="a" href="/#/account/profile" variant="light" size="sm" fullWidth>
            {t('account.goToProfile')}
          </Button>
        </Stack>
      </Card>
    </SimpleGrid>
  );

  return (
    <>
      <Title order={1} mb="lg">
        <>
          <Text inherit component="span">
            {t('account.welcome')}{' '}
          </Text>
          <Text
            inherit
            variant="gradient"
            component="span"
            gradient={{ from: theme.colors['brand-blue'][6], to: theme.colors['brand-blue'][6] }}
          >
            {t('brand.name')}
          </Text>
          <Text
            inherit
            variant="gradient"
            component="span"
            gradient={{ from: theme.colors['brand-gold'][6], to: theme.colors['brand-gold'][6] }}
          >
            {t('brand.nameSecond')}!
          </Text>
        </>
      </Title>
      <GetStarted />
      <Card shadow="xs" padding="lg" radius="md" mb="lg" withBorder>
        <Docs />
      </Card>
      <QuickActions />
      <Card shadow="xs" padding="lg" radius="md" withBorder>
        <News blogBaseUrl="https://blog.formshive.com" />
      </Card>
    </>
  );
}
