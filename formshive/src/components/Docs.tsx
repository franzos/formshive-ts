import { Text, Stack, Accordion, Group, ThemeIcon, Alert, Card, Grid, Code, Box, Anchor } from '@mantine/core';
import {
  IconForms,
  IconInfoCircle,
  IconSettings,
  IconCode,
  IconBox,
  IconFrame,
  IconLink,
  IconMail,
  IconShield,
  IconFileCode,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export interface DocsProps {
  colorScheme?: 'light' | 'dark' | undefined;
}

export function Docs() {
  const { t } = useTranslation();
  return (
    <Stack gap="xl">
      {/* Getting Started */}
      <Accordion variant="contained" chevronPosition="right">
        <Accordion.Item value="what-is-formshive">
          <Accordion.Control>
            <Group wrap="nowrap">
              <ThemeIcon size="lg" radius="xl" color="blue">
                <IconForms size={20} />
              </ThemeIcon>
              <div>
                <Text fw={500}>{t('docs.whatIsFormshive.title')}</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  {t('docs.whatIsFormshive.subtitle')}
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>
                {t('docs.whatIsFormshive.description')}
              </Text>

              <Alert icon={<IconInfoCircle size={16} />} title={t('docs.whatIsFormshive.keyBenefits.title')} color="blue">
                <Text size="sm">
                  • {t('docs.whatIsFormshive.keyBenefits.noCoding')}
                  <br />
                  • {t('docs.whatIsFormshive.keyBenefits.multipleWays')}
                  <br />
                  • {t('docs.whatIsFormshive.keyBenefits.spamProtection')}
                  <br />• {t('docs.whatIsFormshive.keyBenefits.emailNotifications')}
                </Text>
              </Alert>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="forms-with-without-fields">
          <Accordion.Control>
            <Group wrap="nowrap">
              <ThemeIcon size="lg" radius="xl" color="green">
                <IconSettings size={20} />
              </ThemeIcon>
              <div>
                <Text fw={500}>{t('docs.formsWithWithoutFields.title')}</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  {t('docs.formsWithWithoutFields.subtitle')}
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="lg">
              <div>
                <Text fw={500} mb="xs">
                  {t('docs.formsWithWithoutFields.withFields.title')}
                </Text>
                <Text size="sm" mb="md">
                  {t('docs.formsWithWithoutFields.withFields.description')}
                </Text>
                <Card withBorder p="sm" bg="green.0">
                  <Text size="sm" fw={500} mb="xs">
                    {t('docs.formsWithWithoutFields.withFields.benefits.title')}
                  </Text>
                  <Text size="xs">
                    • {t('docs.formsWithWithoutFields.withFields.benefits.professionalLooking')}
                    <br />
                    • {t('docs.formsWithWithoutFields.withFields.benefits.emailValidation')}
                    <br />
                    • {t('docs.formsWithWithoutFields.withFields.benefits.requiredFields')}
                    <br />
                    • {t('docs.formsWithWithoutFields.withFields.benefits.dropdowns')}
                    <br />• {t('docs.formsWithWithoutFields.withFields.benefits.spamProtection')}
                  </Text>
                </Card>
              </div>

              <div>
                <Text fw={500} mb="xs">
                  {t('docs.formsWithWithoutFields.withoutFields.title')}
                </Text>
                <Text size="sm" mb="md">
                  {t('docs.formsWithWithoutFields.withoutFields.description')}
                </Text>
                <Card withBorder p="sm" bg="yellow.0">
                  <Text size="sm" fw={500} mb="xs">
                    {t('docs.formsWithWithoutFields.withoutFields.bestFor.title')}
                  </Text>
                  <Text size="xs">
                    • {t('docs.formsWithWithoutFields.withoutFields.bestFor.quickContact')}
                    <br />
                    • {t('docs.formsWithWithoutFields.withoutFields.bestFor.existingHtml')}
                    <br />
                    • {t('docs.formsWithWithoutFields.withoutFields.bestFor.maxFlexibility')}
                    <br />• {t('docs.formsWithWithoutFields.withoutFields.bestFor.feedback')}
                  </Text>
                </Card>
              </div>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="form-submission">
          <Accordion.Control>
            <Group wrap="nowrap">
              <ThemeIcon size="lg" radius="xl" color="blue">
                <IconCode size={20} />
              </ThemeIcon>
              <div>
                <Text fw={500}>{t('docs.formSubmission.title')}</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  {t('docs.formSubmission.subtitle')}
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="lg">
              <Text>
                {t('docs.formSubmission.description')}
              </Text>

              <Box>
                <Text fw={500} mb="xs">
                  {t('docs.formSubmission.validation.title')}
                </Text>
                <Text size="sm" mb="md">
                  {t('docs.formSubmission.validation.description')}
                </Text>
                <Card withBorder p="sm" bg="blue.0">
                  <Text size="sm" fw={500} mb="xs">
                    {t('docs.formSubmission.validation.steps.title')}
                  </Text>
                  <Text size="xs">
                    {t('docs.formSubmission.validation.steps.formExists')}
                    <br />
                    {t('docs.formSubmission.validation.steps.captcha')}
                    <br />
                    {t('docs.formSubmission.validation.steps.fieldValidation')}
                    <br />
                    {t('docs.formSubmission.validation.steps.spamDetection')}
                  </Text>
                </Card>
              </Box>

              <Box>
                <Text fw={500} mb="xs">
                  {t('docs.formSubmission.errorHandling.title')}
                </Text>
                <Text size="sm" mb="md">
                  {t('docs.formSubmission.errorHandling.description')}
                </Text>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card withBorder p="sm">
                      <Text fw={500} size="sm" mb="xs">
                        {t('docs.formSubmission.errorHandling.htmlForms.title')}
                      </Text>
                      <Text size="xs">
                        • {t('docs.formSubmission.errorHandling.htmlForms.seeErrorPage')}
                        <br />
                        • {t('docs.formSubmission.errorHandling.htmlForms.inputPreserved')}
                        <br />
                        • {t('docs.formSubmission.errorHandling.htmlForms.fieldErrors')}
                        <br />
                        • {t('docs.formSubmission.errorHandling.htmlForms.clearExplanation')}
                      </Text>
                    </Card>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card withBorder p="sm">
                      <Text fw={500} size="sm" mb="xs">
                        {t('docs.formSubmission.errorHandling.apiRequests.title')}
                      </Text>
                      <Text size="xs">
                        • {t('docs.formSubmission.errorHandling.apiRequests.detailedError')}
                        <br />
                        • {t('docs.formSubmission.errorHandling.apiRequests.fieldSpecific')}
                        <br />
                        • {t('docs.formSubmission.errorHandling.apiRequests.machineReadable')}
                        <br />
                        • {t('docs.formSubmission.errorHandling.apiRequests.perfectForDynamic')}
                      </Text>
                    </Card>
                  </Grid.Col>
                </Grid>
              </Box>

              <Box>
                <Text fw={500} mb="xs">
                  {t('docs.formSubmission.afterSubmission.title')}
                </Text>
                <Text size="sm" mb="md">
                  {t('docs.formSubmission.afterSubmission.description')}
                  <br /><small>{t('docs.formSubmission.afterSubmission.diagramNote')} <Anchor size='xs' target='_blank' href="https://mermaid.live/edit#pako:eNqNlF9vmzAUxb-K5eckBZuUPw-b2pBomtZuavKykWjy4CYwgc1soywj-e5zzJrRilblAYE4v3PvuVxocSoywBHelmKf5kxqtIrXHJnjJlkIWaFl86MqlCoE36Dx-B26bSVkhYRUo5pJVoEG-f7UId359qw75roqj2iW3JR7dlDow-ruE3oAVQuuYNMJZ9Zw5ibLJk1BqcioVl8QcVy0L3TeMap7ZortnnEkWbCibCT84zzH6XEgpZB9qt8cFxyOKG5twpwp9JjpeyPLxzSxlX4FZZRDPX5cfr7vCvbpTR--F4YlAyxUtT4Y7sk8LINiOpDL1rKRBtNopEAf0fz1QPP_geZuYr2pQy5SpMVQkvklyaJ9gF8NKI1mgmvgerw61PD05S-smtV1WaRMm625-qkEN6z71im86EDePpfOY2uGMc6YZlcmzRj4edUzY0QHWnlp11538gZaer59eIR3sshwtGWlghGuQFbsfI_bc4k11jlUsMaRuSyLXa7XeM1PhqoZ_yZEhSMtG8NJ0ezyi0tTm3YgLtjOfIMXCfAM5Ew0XOMopFPrgaMW_8aR6wSTwPVDbxq61L-mhI7wAUfEoxM_oNPw2vNJ4HnkNMJ_bFVnElASGiEJCJn6TjDCZjm0kHfdH8P-OE5_AYJ6VO0">{t('docs.formSubmission.afterSubmission.diagramLink')}</Anchor></small>
                </Text>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Card withBorder p="sm" bg="green.0">
                      <Text fw={500} size="sm" mb="xs">
                        {t('docs.formSubmission.afterSubmission.customThankYou.title')}
                      </Text>
                      <Text size="xs">
                        {t('docs.formSubmission.afterSubmission.customThankYou.description')}
                      </Text>
                    </Card>
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Card withBorder p="sm" bg="blue.0">
                      <Text fw={500} size="sm" mb="xs">
                        {t('docs.formSubmission.afterSubmission.builtInSuccess.title')}
                      </Text>
                      <Text size="xs">
                        {t('docs.formSubmission.afterSubmission.builtInSuccess.description')}
                      </Text>
                    </Card>
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Card withBorder p="sm" bg="gray.0">
                      <Text fw={500} size="sm" mb="xs">
                        {t('docs.formSubmission.afterSubmission.forDevelopers.title')}
                      </Text>
                      <Text size="xs">
                        {t('docs.formSubmission.afterSubmission.forDevelopers.description')}
                      </Text>
                    </Card>
                  </Grid.Col>
                </Grid>

                <Alert icon={<IconInfoCircle size={16} />} title={t('docs.formSubmission.afterSubmission.overrideOptions.title')} color="blue" mt="sm">
                  <Text size="sm">
                    {t('docs.formSubmission.afterSubmission.overrideOptions.description')}
                    <br />{t('docs.formSubmission.afterSubmission.overrideOptions.redirectHtml')}
                    <br />{t('docs.formSubmission.afterSubmission.overrideOptions.redirectNone')}
                  </Text>
                </Alert>
              </Box>

              <Box>
                <Text fw={500} mb="xs">
                  {t('docs.formSubmission.integrationExamples.title')}
                </Text>
                <Text size="sm" mb="md">
                  {t('docs.formSubmission.integrationExamples.description')}
                </Text>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card withBorder p="sm">
                      <Text fw={500} size="sm" mb="xs">
                        {t('docs.formSubmission.integrationExamples.javascript.title')}
                      </Text>
                      <Code block>
                        {`fetch('/v1/digest/form-id', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    message: 'Hello!'
  })
})`}
                      </Code>
                      <Text size="xs" mt="xs" c="blue">
                        {t('docs.formSubmission.integrationExamples.javascript.success')}<br />
                        {t('docs.formSubmission.integrationExamples.javascript.error')}
                      </Text>
                    </Card>
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card withBorder p="sm">
                      <Text fw={500} size="sm" mb="xs">
                        {t('docs.formSubmission.integrationExamples.htmlForm.title')}
                      </Text>
                      <Code block>
                        {`<form action="/v1/digest/form-id" 
      method="POST">
  <input name="email" type="email">
  <input name="message">
  <button type="submit">Send</button>
</form>`}
                      </Code>
                      <Text size="xs" mt="xs" c="green">
                        {t('docs.formSubmission.integrationExamples.htmlForm.success')}<br />
                        {t('docs.formSubmission.integrationExamples.htmlForm.error')}
                      </Text>
                    </Card>
                  </Grid.Col>
                </Grid>
              </Box>

              <Alert icon={<IconInfoCircle size={16} />} title={t('docs.formSubmission.proTips.title')} color="blue">
                <Text size="sm">
                  {t('docs.formSubmission.proTips.setRedirect')}
                  <br />
                  {t('docs.formSubmission.proTips.testForms')}
                  <br />
                  {t('docs.formSubmission.proTips.helpfulErrors')}
                  <br />
                  {t('docs.formSubmission.proTips.monitor')}
                </Text>
              </Alert>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="integration-types">
          <Accordion.Control>
            <Group wrap="nowrap">
              <ThemeIcon size="lg" radius="xl" color="violet">
                <IconCode size={20} />
              </ThemeIcon>
              <div>
                <Text fw={500}>{t('docs.integrationMethods.title')}</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  {t('docs.integrationMethods.subtitle')}
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="lg">
              <Text>
                {t('docs.integrationMethods.description')}
              </Text>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="md" radius="sm">
                    <Group mb="sm">
                      <IconCode size={20} />
                      <Text fw={500} size="sm">
                        {t('docs.integrationMethods.manual.title')}
                      </Text>
                    </Group>
                    <Group gap="xs" mb="sm">
                      <Text size="xs" px="xs" py={2} bg="blue.1" c="blue.8" style={{ borderRadius: '12px', fontWeight: 500 }}>
                        {t('docs.integrationMethods.manual.tags.existingForms')}
                      </Text>
                      <Text size="xs" px="xs" py={2} bg="green.1" c="green.8" style={{ borderRadius: '12px', fontWeight: 500 }}>
                        {t('docs.integrationMethods.manual.tags.veryFlexible')}
                      </Text>
                      <Text size="xs" px="xs" py={2} bg="purple.1" c="purple.8" style={{ borderRadius: '12px', fontWeight: 500 }}>
                        {t('docs.integrationMethods.manual.tags.customDesign')}
                      </Text>
                    </Group>
                    <Text size="xs" mb="sm">
                      {t('docs.integrationMethods.manual.description')}
                    </Text>
                    <Code block>
                      {`<form action="your-form-url" method="POST">
  <input name="email" type="email">
  <button type="submit">Send</button>
</form>`}
                    </Code>
                    <Alert color="green" mt="sm">
                      <Text size="xs">
                        {t('docs.integrationMethods.manual.success')}
                      </Text>
                    </Alert>
                    <Alert color="yellow" mt="xs">
                      <Text size="xs">
                        {t('docs.integrationMethods.manual.validation')}
                      </Text>
                    </Alert>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="md" radius="sm">
                    <Group mb="sm">
                      <IconBox size={20} />
                      <Text fw={500} size="sm">
                        {t('docs.integrationMethods.javascript.title')}
                      </Text>
                    </Group>
                    <Group gap="xs" mb="sm">
                      <Text size="xs" px="xs" py={2} bg="orange.1" c="orange.8" style={{ borderRadius: '12px', fontWeight: 500 }}>
                        {t('docs.integrationMethods.javascript.tags.bestUx')}
                      </Text>
                      <Text size="xs" px="xs" py={2} bg="teal.1" c="teal.8" style={{ borderRadius: '12px', fontWeight: 500 }}>
                        {t('docs.integrationMethods.javascript.tags.noPageReloads')}
                      </Text>
                      <Text size="xs" px="xs" py={2} bg="pink.1" c="pink.8" style={{ borderRadius: '12px', fontWeight: 500 }}>
                        {t('docs.integrationMethods.javascript.tags.dynamic')}
                      </Text>
                    </Group>
                    <Text size="xs" mb="sm">
                      {t('docs.integrationMethods.javascript.description')}
                    </Text>
                    <Code block>
                      {`<div id="formshive" form-id="your-id">
</div>
<script src="formshive-embed.js">
</script>`}
                    </Code>
                    <Alert color="green" mt="sm">
                      <Text size="xs">
                        {t('docs.integrationMethods.javascript.success')}
                      </Text>
                    </Alert>
                    <Alert color="yellow" mt="xs">
                      <Text size="xs">
                        {t('docs.integrationMethods.javascript.validation')}
                      </Text>
                    </Alert>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="md" radius="sm">
                    <Group mb="sm">
                      <IconFrame size={20} />
                      <Text fw={500} size="sm">
                        {t('docs.integrationMethods.iframe.title')}
                      </Text>
                    </Group>
                    <Group gap="xs" mb="sm">
                      <Text size="xs" px="xs" py={2} bg="green.1" c="green.8" style={{ borderRadius: '12px', fontWeight: 500 }}>
                        {t('docs.integrationMethods.iframe.tags.veryEasy')}
                      </Text>
                      <Text size="xs" px="xs" py={2} bg="blue.1" c="blue.8" style={{ borderRadius: '12px', fontWeight: 500 }}>
                        {t('docs.integrationMethods.iframe.tags.worksEverywhere')}
                      </Text>
                      <Text size="xs" px="xs" py={2} bg="gray.1" c="gray.8" style={{ borderRadius: '12px', fontWeight: 500 }}>
                        {t('docs.integrationMethods.iframe.tags.copyPaste')}
                      </Text>
                    </Group>
                    <Text size="xs" mb="sm">
                      {t('docs.integrationMethods.iframe.description')}
                    </Text>
                    <Code block>
                      {`<iframe 
  src="your-form-url"
  width="100%" height="350">
</iframe>`}
                    </Code>
                    <Alert color="green" mt="sm">
                      <Text size="xs">
                        {t('docs.integrationMethods.iframe.success')}
                      </Text>
                    </Alert>
                    <Alert color="yellow" mt="xs">
                      <Text size="xs">
                        {t('docs.integrationMethods.iframe.validation')}
                      </Text>
                    </Alert>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="md" radius="sm">
                    <Group mb="sm">
                      <IconLink size={20} />
                      <Text fw={500} size="sm">
                        {t('docs.integrationMethods.directLink.title')}
                      </Text>
                    </Group>
                    <Group gap="xs" mb="sm">
                      <Text size="xs" px="xs" py={2} bg="green.1" c="green.8" style={{ borderRadius: '12px', fontWeight: 500 }}>
                        {t('docs.integrationMethods.directLink.tags.veryEasy')}
                      </Text>
                      <Text size="xs" px="xs" py={2} bg="violet.1" c="violet.8" style={{ borderRadius: '12px', fontWeight: 500 }}>
                        {t('docs.integrationMethods.directLink.tags.socialMedia')}
                      </Text>
                      <Text size="xs" px="xs" py={2} bg="indigo.1" c="indigo.8" style={{ borderRadius: '12px', fontWeight: 500 }}>
                        {t('docs.integrationMethods.directLink.tags.standalone')}
                      </Text>
                    </Group>
                    <Text size="xs" mb="sm">
                      {t('docs.integrationMethods.directLink.description')}
                    </Text>
                    <Code block>
                      {`https://formshive.com/link.html
?form_id=your-form-id
&title=Contact%20Us`}
                    </Code>
                    <Alert color="green" mt="sm">
                      <Text size="xs">
                        {t('docs.integrationMethods.directLink.success')}
                      </Text>
                    </Alert>
                    <Alert color="yellow" mt="xs">
                      <Text size="xs">
                        {t('docs.integrationMethods.directLink.validation')}
                      </Text>
                    </Alert>
                  </Card>
                </Grid.Col>
              </Grid>

              <Alert
                icon={<IconInfoCircle size={16} />}
                title={t('docs.integrationMethods.whichMethod.title')}
                color="violet"
              >
                <Text size="sm">
                  {t('docs.integrationMethods.whichMethod.beginners')}
                  <br />
                  {t('docs.integrationMethods.whichMethod.existingForms')}
                  <br />
                  {t('docs.integrationMethods.whichMethod.advancedUsers')}
                </Text>
              </Alert>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="email-setup">
          <Accordion.Control>
            <Group wrap="nowrap">
              <ThemeIcon size="lg" radius="xl" color="orange">
                <IconMail size={20} />
              </ThemeIcon>
              <div>
                <Text fw={500}>{t('docs.emailSetup.title')}</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  {t('docs.emailSetup.subtitle')}
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>
                {t('docs.emailSetup.description')}
              </Text>

              <Alert
                icon={<IconInfoCircle size={16} />}
                title={t('docs.emailSetup.verification.title')}
                color="orange"
              >
                <Text size="sm">
                  {t('docs.emailSetup.verification.description')}
                </Text>
              </Alert>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  {t('docs.emailSetup.howItWorks.title')}
                </Text>
                <Text size="sm">
                  {t('docs.emailSetup.howItWorks.addEmail')}
                  <br />
                  {t('docs.emailSetup.howItWorks.checkInbox')}
                  <br />
                  {t('docs.emailSetup.howItWorks.clickVerify')}
                  <br />
                  {t('docs.emailSetup.howItWorks.ready')}
                </Text>
              </Card>

              <div>
                <Text fw={500} size="sm" mb="xs">
                  {t('docs.emailSetup.multipleRecipients.title')}
                </Text>
                <Text size="sm">
                  {t('docs.emailSetup.multipleRecipients.description')}
                </Text>
              </div>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="captcha-setup">
          <Accordion.Control>
            <Group wrap="nowrap">
              <ThemeIcon size="lg" radius="xl" color="red">
                <IconShield size={20} />
              </ThemeIcon>
              <div>
                <Text fw={500}>{t('docs.captchaSetup.title')}</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  {t('docs.captchaSetup.subtitle')}
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>
                {t('docs.captchaSetup.description')}
              </Text>

              <Alert icon={<IconInfoCircle size={16} />} title={t('docs.captchaSetup.howItWorks.title')} color="blue">
                <Text size="sm">
                  {t('docs.captchaSetup.howItWorks.description')}
                </Text>
              </Alert>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  {t('docs.captchaSetup.setup.title')}
                </Text>
                <Text size="sm">
                  {t('docs.captchaSetup.setup.enable')}
                  <br />
                  {t('docs.captchaSetup.setup.updateWebsite')}
                  <br />
                  {t('docs.captchaSetup.setup.test')}
                </Text>
              </Card>

              <div>
                <Text fw={500} size="sm" mb="xs">
                  {t('docs.captchaSetup.benefits.title')}
                </Text>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card withBorder p="sm" bg="green.0">
                      <Text size="xs">
                        {t('docs.captchaSetup.benefits.left.blocksSpam')}
                        <br />{t('docs.captchaSetup.benefits.left.noTracking')}
                        <br />{t('docs.captchaSetup.benefits.left.free')}
                      </Text>
                    </Card>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card withBorder p="sm" bg="blue.0">
                      <Text size="xs">
                        {t('docs.captchaSetup.benefits.right.quickForUsers')}
                        <br />{t('docs.captchaSetup.benefits.right.worksEverywhere')}
                        <br />{t('docs.captchaSetup.benefits.right.alwaysImproving')}
                      </Text>
                    </Card>
                  </Grid.Col>
                </Grid>
              </div>

              <Alert icon={<IconInfoCircle size={16} />} title={t('docs.captchaSetup.technicalHelp.title')} color="red">
                <Text size="sm">
                  {t('docs.captchaSetup.technicalHelp.description')}
                </Text>
              </Alert>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="field-configuration">
          <Accordion.Control>
            <Group wrap="nowrap">
              <ThemeIcon size="lg" radius="xl" color="teal">
                <IconSettings size={20} />
              </ThemeIcon>
              <div>
                <Text fw={500}>{t('docs.fieldConfiguration.title')}</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  {t('docs.fieldConfiguration.subtitle')}
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>
                {t('docs.fieldConfiguration.description')}
              </Text>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder p="sm">
                    <Text fw={500} size="sm" mb="xs">
                      {t('docs.fieldConfiguration.fieldTypes.title')}
                    </Text>
                    <Text size="xs">
                      {t('docs.fieldConfiguration.fieldTypes.text')}
                      <br />{t('docs.fieldConfiguration.fieldTypes.email')}
                      <br />{t('docs.fieldConfiguration.fieldTypes.textarea')}
                      <br />{t('docs.fieldConfiguration.fieldTypes.number')}
                      <br />{t('docs.fieldConfiguration.fieldTypes.phone')}
                      <br />{t('docs.fieldConfiguration.fieldTypes.url')}
                      <br />{t('docs.fieldConfiguration.fieldTypes.date')}
                      <br />{t('docs.fieldConfiguration.fieldTypes.file')}
                      <br />{t('docs.fieldConfiguration.fieldTypes.select')}
                      <br />{t('docs.fieldConfiguration.fieldTypes.radio')}
                      <br />{t('docs.fieldConfiguration.fieldTypes.checkbox')}
                    </Text>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder p="sm">
                    <Text fw={500} size="sm" mb="xs">
                      {t('docs.fieldConfiguration.validationOptions.title')}
                    </Text>
                    <Text size="xs">
                      {t('docs.fieldConfiguration.validationOptions.required')}
                      <br />{t('docs.fieldConfiguration.validationOptions.emailValidation')}
                      <br />{t('docs.fieldConfiguration.validationOptions.urlValidation')}
                      <br />{t('docs.fieldConfiguration.validationOptions.customOptions')}
                      <br />{t('docs.fieldConfiguration.validationOptions.helpText')}
                      <br />{t('docs.fieldConfiguration.validationOptions.placeholders')}
                    </Text>
                  </Card>
                </Grid.Col>
              </Grid>

              <Alert icon={<IconInfoCircle size={16} />} title={t('docs.fieldConfiguration.proTip.title')} color="teal">
                <Text size="sm">
                  {t('docs.fieldConfiguration.proTip.description')}
                </Text>
              </Alert>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="toml-configuration">
          <Accordion.Control>
            <Group wrap="nowrap">
              <ThemeIcon size="lg" radius="xl" color="grape">
                <IconFileCode size={20} />
              </ThemeIcon>
              <div>
                <Text fw={500}>{t('docs.tomlConfiguration.title')}</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  {t('docs.tomlConfiguration.subtitle')}
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Alert
                icon={<IconInfoCircle size={16} />}
                title={t('docs.tomlConfiguration.advancedOnly.title')}
                color="grape"
              >
                <Text size="sm">
                  {t('docs.tomlConfiguration.advancedOnly.description')}
                </Text>
              </Alert>

              <Text>
                {t('docs.tomlConfiguration.description')}
              </Text>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  {t('docs.tomlConfiguration.basicExample.title')}
                </Text>
                <Code block>
                  {`[field]
name = "email"
field = "email"
label = "Your Email"
placeholder = "Enter your email address"
required = true
is_email = true

[field]
name = "message"
field = "textarea"
label = "Message"
placeholder = "Tell us what you think"
required = true
is_min = 10`}
                </Code>
              </Card>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder p="sm">
                    <Text fw={500} size="sm" mb="xs">
                      {t('docs.tomlConfiguration.fieldTypesAvailable.title')}
                    </Text>
                    <Text size="xs">
                      {t('docs.tomlConfiguration.fieldTypesAvailable.text')}
                      <br />{t('docs.tomlConfiguration.fieldTypesAvailable.email')}
                      <br />{t('docs.tomlConfiguration.fieldTypesAvailable.textarea')}
                      <br />{t('docs.tomlConfiguration.fieldTypesAvailable.select')}
                      <br />{t('docs.tomlConfiguration.fieldTypesAvailable.checkbox')}
                      <br />{t('docs.tomlConfiguration.fieldTypesAvailable.number')}
                    </Text>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder p="sm">
                    <Text fw={500} size="sm" mb="xs">
                      {t('docs.tomlConfiguration.validationOptions.title')}
                    </Text>
                    <Text size="xs">
                      {t('docs.tomlConfiguration.validationOptions.required')}
                      <br />{t('docs.tomlConfiguration.validationOptions.isEmail')}
                      <br />{t('docs.tomlConfiguration.validationOptions.isMin')}
                      <br />{t('docs.tomlConfiguration.validationOptions.isMax')}
                      <br />{t('docs.tomlConfiguration.validationOptions.options')}
                      <br />{t('docs.tomlConfiguration.validationOptions.checkSpam')}
                    </Text>
                  </Card>
                </Grid.Col>
              </Grid>

              <div>
                <Text fw={500} size="sm" mb="xs">
                  {t('docs.tomlConfiguration.benefits.title')}
                </Text>
                <Card withBorder p="sm" bg="grape.0">
                  <Text size="xs">
                    {t('docs.tomlConfiguration.benefits.versionControl')}
                    <br />{t('docs.tomlConfiguration.benefits.reusable')}
                    <br />{t('docs.tomlConfiguration.benefits.preciseControl')}
                    <br />{t('docs.tomlConfiguration.benefits.teamCollaboration')}
                    <br />{t('docs.tomlConfiguration.benefits.advancedFeatures')}
                  </Text>
                </Card>
              </div>

              <Alert icon={<IconInfoCircle size={16} />} title={t('docs.tomlConfiguration.gettingStarted.title')} color="grape">
                <Text size="sm">
                  {t('docs.tomlConfiguration.gettingStarted.description')}
                </Text>
              </Alert>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}
