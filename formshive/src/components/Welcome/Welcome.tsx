import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useLanguageAwareRouting } from '@gofranz/common-components';
import 'altcha';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function Welcome() {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const { createLanguageURL } = useLanguageAwareRouting();

  return (
    <>
      <Container>
        <Image
          src="/logo.svg"
          fit="contain"
          alt={t('brand.logoAlt')}
          mt={100}
          width={200}
          height={200}
        />
        <Title size={50} ta="center">
          <>
            <Text
              inherit
              variant="gradient"
              component="span"
              gradient={{ from: theme.colors['brand-secondary'][6], to: theme.colors['brand-secondary'][6] }}
            >
              {t('brand.name')}
            </Text>
            <Text
              inherit
              variant="gradient"
              component="span"
              gradient={{ from: theme.colors['brand-primary'][6], to: theme.colors['brand-primary'][6] }}
            >
              {t('brand.nameSecond')}
            </Text>
          </>
        </Title>
        <Text ta="center" size="xl" maw={580} mx="auto" mt="xl" lh="xs">
          <b>{t('welcome.tagline')}</b>
          <br />
          {t('welcome.description')}
        </Text>
        <Text c="dimmed" ta="center" size="lg" maw={680} mx="auto" mt="md">
          {t('welcome.subDescription')}
        </Text>
      </Container>

      {/* Social Proof Stats Section */}
      <Container mt="xl" mb="xl">
        <Title order={3} ta="center" mb="lg" fw={600}>
          {t('welcome.stats.title')}
        </Title>
        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="xl">
          <Box ta="center">
            <Text size="2.5rem" fw={700} c={theme.colors['brand-secondary'][6]}>
              {t('welcome.stats.activeUsers')}
            </Text>
            <Text size="sm" c="dimmed" fw={500}>
              {t('welcome.stats.activeUsersLabel')}
            </Text>
          </Box>
          <Box ta="center">
            <Text size="2.5rem" fw={700} c={theme.colors['brand-primary'][6]}>
              {t('welcome.stats.formsProcessed')}
            </Text>
            <Text size="sm" c="dimmed" fw={500}>
              {t('welcome.stats.formsProcessedLabel')}
            </Text>
          </Box>
          <Box ta="center">
            <Text size="2.5rem" fw={700} c={theme.colors['brand-secondary'][6]}>
              {t('welcome.stats.uptime')}
            </Text>
            <Text size="sm" c="dimmed" fw={500}>
              {t('welcome.stats.uptimeLabel')}
            </Text>
          </Box>
          <Box ta="center">
            <Text size="2.5rem" fw={700} c={theme.colors['brand-primary'][6]}>
              {t('welcome.stats.responseTime')}
            </Text>
            <Text size="sm" c="dimmed" fw={500}>
              {t('welcome.stats.responseTimeLabel')}
            </Text>
          </Box>
        </SimpleGrid>

        {/* Additional CTA after stats */}
        <Box ta="center" mt="xl">
          <Button
            size="lg"
            variant="outline"
            component={Link}
            to={createLanguageURL('/signup')}
            radius="md"
            px={40}
          >
            {t('welcome.cta.buttonAlt')}
          </Button>
        </Box>
      </Container>

      {/* <Image
        src={isDark ? '/glen-carrie-_oNISBwMTwo_dark.jpg' : '/glen-carrie-_oNISBwMTwo.jpg'}
        width="100%"
        style={{
          marginTop: '20px',
        }}
      />
      <Text size="xs" color="var(--mantine-color-gray-3)">
        @glencarrie, Kruger Park, South Africa
      </Text> */}

      <Divider mt="md" mb="md" />

      {/* Use Cases Section */}
      <Container mt="xl" mb="xl">
        <Title order={3} ta="center" mb="md" fw={600}>
          {t('welcome.useCases.title')}
        </Title>
        <Text c="dimmed" ta="center" size="lg" mb="xl">
          {t('welcome.useCases.subtitle')}
        </Text>
        <SimpleGrid cols={{ base: 2, sm: 3, md: 6 }} spacing="lg">
          <Box ta="center">
            <Text fw={600} size="sm" mb="xs">
              {t('welcome.useCases.contactForms')}
            </Text>
          </Box>
          <Box ta="center">
            <Text fw={600} size="sm" mb="xs">
              {t('welcome.useCases.surveys')}
            </Text>
          </Box>
          <Box ta="center">
            <Text fw={600} size="sm" mb="xs">
              {t('welcome.useCases.fileUploads')}
            </Text>
          </Box>
          <Box ta="center">
            <Text fw={600} size="sm" mb="xs">
              {t('welcome.useCases.aiAgents')}
            </Text>
          </Box>
          <Box ta="center">
            <Text fw={600} size="sm" mb="xs">
              {t('welcome.useCases.webhooks')}
            </Text>
          </Box>
          <Box ta="center">
            <Text fw={600} size="sm" mb="xs">
              {t('welcome.useCases.apis')}
            </Text>
          </Box>
        </SimpleGrid>
      </Container>

      <Divider my="xl" />

      {/* Enhanced Features Section */}
      <Container mt="xl" mb="xl">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
          <Box>
            <Title order={4} mb="sm">{t('welcome.features.instant.title')}</Title>
            <Text>{t('welcome.features.instant.description')}</Text>
          </Box>

          <Box>
            <Title order={4} mb="sm">{t('welcome.features.developer.title')}</Title>
            <Text>{t('welcome.features.developer.description')}</Text>
          </Box>

          <Box>
            <Title order={4} mb="sm">{t('welcome.features.security.title')}</Title>
            <Text>{t('welcome.features.security.description')}</Text>
          </Box>

          <Box>
            <Title order={4} mb="sm">{t('welcome.features.pricing.title')}</Title>
            <Text>{t('welcome.features.pricing.description')}</Text>
          </Box>

          <Box>
            <Title order={4} mb="sm">{t('welcome.features.freedom.title')}</Title>
            <Text>{t('welcome.features.freedom.description')}</Text>
          </Box>

          <Box>
            <Title order={4} mb="sm">{t('welcome.features.features.title')}</Title>
            <Text>{t('welcome.features.features.description')}</Text>
          </Box>
        </SimpleGrid>
      </Container>

      <Divider my="xl" />

      {/* Comparison Section */}
      <Container mt="xl" mb="xl" maw={800} mx="auto">
        <Title order={3} ta="center" mb="md" fw={600}>
          {t('welcome.comparison.title')}
        </Title>
        <Text c="dimmed" ta="center" size="lg" mb="xl">
          {t('welcome.comparison.subtitle')}
        </Text>

        <Stack>
          <SimpleGrid cols={3} spacing="lg">
            <Text fw={600} size="sm">{t('welcome.comparison.feature')}</Text>
            <Text fw={600} size="sm" ta="center" c={theme.colors['brand-secondary'][6]}>
              {t('welcome.comparison.formshive')}
            </Text>
            <Text fw={600} size="sm" ta="center">{t('welcome.comparison.others')}</Text>
          </SimpleGrid>

          <Divider size="xs" />

          <SimpleGrid cols={3} spacing="lg">
            <Text size="sm">Pricing</Text>
            <Text size="sm" ta="center" fw={600} c={theme.colors['brand-primary'][6]}>
              {t('welcome.comparison.pricing')}
            </Text>
            <Text size="sm" ta="center" c="dimmed">{t('welcome.comparison.pricingOthers')}</Text>
          </SimpleGrid>

          <SimpleGrid cols={3} spacing="lg">
            <Text size="sm">Setup Time</Text>
            <Text size="sm" ta="center" fw={600} c={theme.colors['brand-primary'][6]}>
              {t('welcome.comparison.setup')}
            </Text>
            <Text size="sm" ta="center" c="dimmed">{t('welcome.comparison.setupOthers')}</Text>
          </SimpleGrid>

          <SimpleGrid cols={3} spacing="lg">
            <Text size="sm">Self-Hosting</Text>
            <Text size="sm" ta="center" fw={600} c={theme.colors['brand-primary'][6]}>
              {t('welcome.comparison.selfHost')}
            </Text>
            <Text size="sm" ta="center" c="dimmed">{t('welcome.comparison.selfHostOthers')}</Text>
          </SimpleGrid>

          <SimpleGrid cols={3} spacing="lg">
            <Text size="sm">Privacy</Text>
            <Text size="sm" ta="center" fw={600} c={theme.colors['brand-primary'][6]}>
              {t('welcome.comparison.privacy')}
            </Text>
            <Text size="sm" ta="center" c="dimmed">{t('welcome.comparison.privacyOthers')}</Text>
          </SimpleGrid>

          <SimpleGrid cols={3} spacing="lg">
            <Text size="sm">Support</Text>
            <Text size="sm" ta="center" fw={600} c={theme.colors['brand-primary'][6]}>
              {t('welcome.comparison.support')}
            </Text>
            <Text size="sm" ta="center" c="dimmed">{t('welcome.comparison.supportOthers')}</Text>
          </SimpleGrid>
        </Stack>
      </Container>

      <Container ta="center" mt="xl" mb="xl">
        <Button
          variant="light"
          size="md"
          component={Link}
          to={createLanguageURL('/docs')}
          radius="md"
        >
          📚 Learn How Formshive Works
        </Button>
        <Text c="dimmed" mt="xs" size="sm">
          New to Formshive? Check out our beginner-friendly guide
        </Text>
      </Container>

      <Container ta="center" mt="4rem" mb="4rem" maw={600} mx="auto">
        <Title order={3} mb="sm" fw={600} ta="center">
          {t('welcome.cta.title')}
        </Title>
        <Text c="dimmed" mt="sm" mb="lg" size="md" fw={500} ta="center">
          {t('welcome.cta.descriptionUrgent')}
        </Text>
        <Button
          size="xl"
          variant="gradient"
          gradient={{ from: theme.colors['brand-primary'][6], to: theme.colors['brand-secondary'][6] }}
          component={Link}
          to={createLanguageURL('/signup')}
          radius="md"
          px={50}
          mx="auto"
          style={{ display: 'block' }}
        >
          {t('welcome.cta.buttonAlt')}
        </Button>
        <Text c="dimmed" mt="sm" size="sm" fw={500} ta="center">
          <Text component="span" c="#FFB800" fw={700}>
            {t('welcome.cta.credit')}
          </Text>
          <br />
          {t('welcome.cta.description')}
        </Text>

        <Divider my="xl" />

        <Card shadow="xs" padding="lg" radius="md" withBorder maw={360} w="100%" mx="auto">
          <Stack align="center">
            <Title order={4} ta="center" mb={0} fw={500}>
              {t('welcome.cta.loginTitle')}
            </Title>
            <Text c="dimmed" ta="center" size="sm" maw={280} mx="auto">
              {t('welcome.cta.loginDescription')}
            </Text>
            <Button
              component={Link}
              to={createLanguageURL('/login')}
              variant="outline"
              size="md"
              radius="md"
              px={30}
            >
              {t('welcome.cta.loginButton')}
            </Button>
          </Stack>
        </Card>
      </Container>
    </>
  );
}
