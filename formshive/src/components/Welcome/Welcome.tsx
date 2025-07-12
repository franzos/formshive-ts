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

      {/* <Container mt="xl">
        <Group justify="center">
          <Box maw={340}>
            <Title order={2} mb="xs">
              Example Contact Form
            </Title>
            <Switch
              defaultChecked={showHtml}
              onChange={() => setShowHtml((prev) => !prev)}
              label="Show HTML"
              mb="xs"
            />
            {showHtml ? (
              <Code block>
                {exampleFormHtmlSimpleWithCaptcha(exampleFormUrlCaptcha, exampleFormChallengeUrl)}
              </Code>
            ) : (
              <form action={exampleFormUrlCaptcha} method="POST">
                <TextInput
                  label="Email"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your-email@gmail.com"
                  required
                />
                <TextInput
                  label="Name"
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Mike"
                  required
                />
                <Textarea
                  label="Message"
                  id="message"
                  name="message"
                  placeholder="Hi there, I'm looking to renovate my living room and was told you're the person to contact. Let's have a call to discuss."
                  mb="md"
                  required
                />
                <altcha-widget challengeurl={exampleFormChallengeUrl} hidefooter hidelogo />
                <Button type="submit" value="Submit" mt="xs">
                  Submit
                </Button>
              </form>
            )}
          </Box>
        </Group>
      </Container> */}

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

      <Container mt="xl" mb="xl">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
          <Box>
            <Title order={4}>{t('welcome.features.noFields.title')}</Title>
            <Text>{t('welcome.features.noFields.description')}</Text>
          </Box>

          <Box>
            <Title order={4}>{t('welcome.features.flexible.title')}</Title>
            <Text>{t('welcome.features.flexible.description')}</Text>
          </Box>

          <Box>
            <Title order={4}>{t('welcome.features.protection.title')}</Title>
            <Text>{t('welcome.features.protection.description')}</Text>
          </Box>

          <Box>
            <Title order={4}>{t('welcome.features.privacy.title')}</Title>
            <Text>
              Your data stays yours. We don’t collect personal info, with secure EU hosting focused
              on your privacy and trust.
            </Text>
          </Box>

          <Box>
            <Title order={4}>{t('welcome.features.integrations.title')}</Title>
            <Text>
              Connect instantly with email notifications, webhooks, and more — keeping your
              workflows flowing smoothly.
            </Text>
          </Box>

          <Box>
            <Title order={4}>{t('welcome.features.pricing.title')}</Title>
            <Text>
              Start at just €0.005 per submission or self-host for €590/year. No hidden fees, no
              investors, no upsells.
            </Text>
          </Box>
        </SimpleGrid>
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
        <Button
          size="lg"
          variant="gradient"
          gradient={{ from: theme.colors['brand-gold'][6], to: theme.colors['brand-blue'][6] }}
          component={Link}
          to={createLanguageURL('/signup')}
          radius="md"
          px={40}
          mx="auto"
          style={{ display: 'block' }}
        >
          {t('welcome.cta.button')}
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
