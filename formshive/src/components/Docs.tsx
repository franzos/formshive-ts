import { Text, Stack, Accordion, Group, ThemeIcon, Alert, Card, Grid, Code, Box, Anchor, useComputedColorScheme } from '@mantine/core';
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
  const computedColorScheme = useComputedColorScheme('light');
  const isDark = computedColorScheme === 'dark';
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
                <Card withBorder p="sm" bg={isDark ? "green.9" : "green.0"}>
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
                <Card withBorder p="sm" bg={isDark ? "yellow.9" : "yellow.0"}>
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
                <Card withBorder p="sm" bg={isDark ? "blue.9" : "blue.0"}>
                  <Text size="sm" fw={500} mb="xs">
                    {t('docs.formSubmission.validation.steps.title')}
                  </Text>
                  <Text size="xs">
                    {t('docs.formSubmission.validation.steps.formExists.number')}. <Text span fw={600}>{t('docs.formSubmission.validation.steps.formExists.label')}:</Text> {t('docs.formSubmission.validation.steps.formExists.description')}
                    <br />
                    {t('docs.formSubmission.validation.steps.captcha.number')}. <Text span fw={600}>{t('docs.formSubmission.validation.steps.captcha.label')}:</Text> {t('docs.formSubmission.validation.steps.captcha.description')}
                    <br />
                    {t('docs.formSubmission.validation.steps.fieldValidation.number')}. <Text span fw={600}>{t('docs.formSubmission.validation.steps.fieldValidation.label')}:</Text> {t('docs.formSubmission.validation.steps.fieldValidation.description')}
                    <br />
                    {t('docs.formSubmission.validation.steps.spamDetection.number')}. <Text span fw={600}>{t('docs.formSubmission.validation.steps.spamDetection.label')}:</Text> {t('docs.formSubmission.validation.steps.spamDetection.description')}
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
                    <Card withBorder p="sm" bg={isDark ? "green.9" : "green.0"}>
                      <Text fw={500} size="sm" mb="xs">
                        {t('docs.formSubmission.afterSubmission.customThankYou.title')}
                      </Text>
                      <Text size="xs">
                        {t('docs.formSubmission.afterSubmission.customThankYou.description')}
                      </Text>
                    </Card>
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Card withBorder p="sm" bg={isDark ? "blue.9" : "blue.0"}>
                      <Text fw={500} size="sm" mb="xs">
                        {t('docs.formSubmission.afterSubmission.builtInSuccess.title')}
                      </Text>
                      <Text size="xs">
                        {t('docs.formSubmission.afterSubmission.builtInSuccess.description')}
                      </Text>
                    </Card>
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Card withBorder p="sm" bg={isDark ? "gray.9" : "gray.0"}>
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
                    <br />• <Code>{t('docs.formSubmission.afterSubmission.overrideOptions.redirectHtml.param')}</Code> - {t('docs.formSubmission.afterSubmission.overrideOptions.redirectHtml.description')}
                    <br />• <Code>{t('docs.formSubmission.afterSubmission.overrideOptions.redirectNone.param')}</Code> - {t('docs.formSubmission.afterSubmission.overrideOptions.redirectNone.description')}
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
                  • <Text span fw={600}>{t('docs.formSubmission.proTips.setRedirect.action')}</Text> {t('docs.formSubmission.proTips.setRedirect.description')}
                  <br />
                  • <Text span fw={600}>{t('docs.formSubmission.proTips.testForms.action')}</Text> {t('docs.formSubmission.proTips.testForms.description')}
                  <br />
                  • <Text span fw={600}>{t('docs.formSubmission.proTips.helpfulErrors.action')}</Text> - {t('docs.formSubmission.proTips.helpfulErrors.description')}
                  <br />
                  • <Text span fw={600}>{t('docs.formSubmission.proTips.monitor.action')}</Text> {t('docs.formSubmission.proTips.monitor.description')}
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
                      <Text size="xs" px="xs" py={2} bg={isDark ? "blue.9" : "blue.1"} c={isDark ? "blue.1" : "blue.8"} style={{ borderRadius: '12px', fontWeight: 500 }}>
                        {t('docs.integrationMethods.manual.tags.existingForms')}
                      </Text>
                      <Text size="xs" px="xs" py={2} bg={isDark ? "green.9" : "green.1"} c={isDark ? "green.1" : "green.8"} style={{ borderRadius: '12px', fontWeight: 500 }}>
                        {t('docs.integrationMethods.manual.tags.veryFlexible')}
                      </Text>
                      <Text size="xs" px="xs" py={2} bg={isDark ? "purple.9" : "purple.1"} c={isDark ? "purple.1" : "purple.8"} style={{ borderRadius: '12px', fontWeight: 500 }}>
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
                        {t('docs.integrationMethods.manual.success.icon')} <Text span fw={600}>{t('docs.integrationMethods.manual.success.type')}:</Text> {t('docs.integrationMethods.manual.success.description')}
                      </Text>
                    </Alert>
                    <Alert color="yellow" mt="xs">
                      <Text size="xs">
                        {t('docs.integrationMethods.manual.validation.icon')} <Text span fw={600}>{t('docs.integrationMethods.manual.validation.type')}:</Text> {t('docs.integrationMethods.manual.validation.description')}
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
                      <Text size="xs" px="xs" py={2} bg={isDark ? "orange.9" : "orange.1"} c={isDark ? "orange.1" : "orange.8"} style={{ borderRadius: '12px', fontWeight: 500 }}>
                        {t('docs.integrationMethods.javascript.tags.bestUx')}
                      </Text>
                      <Text size="xs" px="xs" py={2} bg={isDark ? "teal.9" : "teal.1"} c={isDark ? "teal.1" : "teal.8"} style={{ borderRadius: '12px', fontWeight: 500 }}>
                        {t('docs.integrationMethods.javascript.tags.noPageReloads')}
                      </Text>
                      <Text size="xs" px="xs" py={2} bg={isDark ? "pink.9" : "pink.1"} c={isDark ? "pink.1" : "pink.8"} style={{ borderRadius: '12px', fontWeight: 500 }}>
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
                        {t('docs.integrationMethods.javascript.success.icon')} <Text span fw={600}>{t('docs.integrationMethods.javascript.success.type')}:</Text> {t('docs.integrationMethods.javascript.success.description')}
                      </Text>
                    </Alert>
                    <Alert color="yellow" mt="xs">
                      <Text size="xs">
                        {t('docs.integrationMethods.javascript.validation.icon')} <Text span fw={600}>{t('docs.integrationMethods.javascript.validation.type')}:</Text> {t('docs.integrationMethods.javascript.validation.description')}
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
                      <Text size="xs" px="xs" py={2} bg={isDark ? "green.9" : "green.1"} c={isDark ? "green.1" : "green.8"} style={{ borderRadius: '12px', fontWeight: 500 }}>
                        {t('docs.integrationMethods.iframe.tags.veryEasy')}
                      </Text>
                      <Text size="xs" px="xs" py={2} bg={isDark ? "blue.9" : "blue.1"} c={isDark ? "blue.1" : "blue.8"} style={{ borderRadius: '12px', fontWeight: 500 }}>
                        {t('docs.integrationMethods.iframe.tags.worksEverywhere')}
                      </Text>
                      <Text size="xs" px="xs" py={2} bg={isDark ? "gray.9" : "gray.1"} c={isDark ? "gray.1" : "gray.8"} style={{ borderRadius: '12px', fontWeight: 500 }}>
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
                        {t('docs.integrationMethods.iframe.success.icon')} <Text span fw={600}>{t('docs.integrationMethods.iframe.success.type')}:</Text> {t('docs.integrationMethods.iframe.success.description')}
                      </Text>
                    </Alert>
                    <Alert color="yellow" mt="xs">
                      <Text size="xs">
                        {t('docs.integrationMethods.iframe.validation.icon')} <Text span fw={600}>{t('docs.integrationMethods.iframe.validation.type')}:</Text> {t('docs.integrationMethods.iframe.validation.description')}
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
                      <Text size="xs" px="xs" py={2} bg={isDark ? "green.9" : "green.1"} c={isDark ? "green.1" : "green.8"} style={{ borderRadius: '12px', fontWeight: 500 }}>
                        {t('docs.integrationMethods.directLink.tags.veryEasy')}
                      </Text>
                      <Text size="xs" px="xs" py={2} bg={isDark ? "violet.9" : "violet.1"} c={isDark ? "violet.1" : "violet.8"} style={{ borderRadius: '12px', fontWeight: 500 }}>
                        {t('docs.integrationMethods.directLink.tags.socialMedia')}
                      </Text>
                      <Text size="xs" px="xs" py={2} bg={isDark ? "indigo.9" : "indigo.1"} c={isDark ? "indigo.1" : "indigo.8"} style={{ borderRadius: '12px', fontWeight: 500 }}>
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
                        {t('docs.integrationMethods.directLink.success.icon')} <Text span fw={600}>{t('docs.integrationMethods.directLink.success.type')}:</Text> {t('docs.integrationMethods.directLink.success.description')}
                      </Text>
                    </Alert>
                    <Alert color="yellow" mt="xs">
                      <Text size="xs">
                        {t('docs.integrationMethods.directLink.validation.icon')} <Text span fw={600}>{t('docs.integrationMethods.directLink.validation.type')}:</Text> {t('docs.integrationMethods.directLink.validation.description')}
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
                  <Text span fw={600}>{t('docs.integrationMethods.whichMethod.beginners.audience')}:</Text> {t('docs.integrationMethods.whichMethod.beginners.description')}
                  <br />
                  <Text span fw={600}>{t('docs.integrationMethods.whichMethod.existingForms.audience')}:</Text> {t('docs.integrationMethods.whichMethod.existingForms.description')}
                  <br />
                  <Text span fw={600}>{t('docs.integrationMethods.whichMethod.advancedUsers.audience')}:</Text> {t('docs.integrationMethods.whichMethod.advancedUsers.description')}
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
                  {t('docs.emailSetup.howItWorks.addEmail.number')}. <Text span fw={600}>{t('docs.emailSetup.howItWorks.addEmail.action')}:</Text> {t('docs.emailSetup.howItWorks.addEmail.description')}
                  <br />
                  {t('docs.emailSetup.howItWorks.checkInbox.number')}. <Text span fw={600}>{t('docs.emailSetup.howItWorks.checkInbox.action')}:</Text> {t('docs.emailSetup.howItWorks.checkInbox.description')}
                  <br />
                  {t('docs.emailSetup.howItWorks.clickVerify.number')}. <Text span fw={600}>{t('docs.emailSetup.howItWorks.clickVerify.action')}:</Text> {t('docs.emailSetup.howItWorks.clickVerify.description')}
                  <br />
                  {t('docs.emailSetup.howItWorks.ready.number')}. <Text span fw={600}>{t('docs.emailSetup.howItWorks.ready.action')}</Text> {t('docs.emailSetup.howItWorks.ready.description')}
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
                  {t('docs.captchaSetup.setup.enable.number')}. <Text span fw={600}>{t('docs.captchaSetup.setup.enable.action')}:</Text> {t('docs.captchaSetup.setup.enable.description')}
                  <br />
                  {t('docs.captchaSetup.setup.updateWebsite.number')}. <Text span fw={600}>{t('docs.captchaSetup.setup.updateWebsite.action')}:</Text> {t('docs.captchaSetup.setup.updateWebsite.description')}
                  <br />
                  {t('docs.captchaSetup.setup.test.number')}. <Text span fw={600}>{t('docs.captchaSetup.setup.test.action')}:</Text> {t('docs.captchaSetup.setup.test.description')}
                </Text>
              </Card>

              <div>
                <Text fw={500} size="sm" mb="xs">
                  {t('docs.captchaSetup.benefits.title')}
                </Text>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card withBorder p="sm" bg={isDark ? "green.9" : "green.0"}>
                      <Text size="xs">
                        {t('docs.captchaSetup.benefits.left.blocksSpam.icon')} <Text span fw={600}>{t('docs.captchaSetup.benefits.left.blocksSpam.feature')}:</Text> {t('docs.captchaSetup.benefits.left.blocksSpam.description')}
                        <br />{t('docs.captchaSetup.benefits.left.noTracking.icon')} <Text span fw={600}>{t('docs.captchaSetup.benefits.left.noTracking.feature')}:</Text> {t('docs.captchaSetup.benefits.left.noTracking.description')}
                        <br />{t('docs.captchaSetup.benefits.left.free.icon')} <Text span fw={600}>{t('docs.captchaSetup.benefits.left.free.feature')}:</Text> {t('docs.captchaSetup.benefits.left.free.description')}
                      </Text>
                    </Card>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card withBorder p="sm" bg={isDark ? "blue.9" : "blue.0"}>
                      <Text size="xs">
                        {t('docs.captchaSetup.benefits.right.quickForUsers.icon')} <Text span fw={600}>{t('docs.captchaSetup.benefits.right.quickForUsers.feature')}:</Text> {t('docs.captchaSetup.benefits.right.quickForUsers.description')}
                        <br />{t('docs.captchaSetup.benefits.right.worksEverywhere.icon')} <Text span fw={600}>{t('docs.captchaSetup.benefits.right.worksEverywhere.feature')}:</Text> {t('docs.captchaSetup.benefits.right.worksEverywhere.description')}
                        <br />{t('docs.captchaSetup.benefits.right.alwaysImproving.icon')} <Text span fw={600}>{t('docs.captchaSetup.benefits.right.alwaysImproving.feature')}:</Text> {t('docs.captchaSetup.benefits.right.alwaysImproving.description')}
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
                      <Text span fw={600}>{t('docs.fieldConfiguration.fieldTypes.text.name')}</Text> - {t('docs.fieldConfiguration.fieldTypes.text.description')}
                      <br /><Text span fw={600}>{t('docs.fieldConfiguration.fieldTypes.email.name')}</Text> - {t('docs.fieldConfiguration.fieldTypes.email.description')}
                      <br /><Text span fw={600}>{t('docs.fieldConfiguration.fieldTypes.textarea.name')}</Text> - {t('docs.fieldConfiguration.fieldTypes.textarea.description')}
                      <br /><Text span fw={600}>{t('docs.fieldConfiguration.fieldTypes.number.name')}</Text> - {t('docs.fieldConfiguration.fieldTypes.number.description')}
                      <br /><Text span fw={600}>{t('docs.fieldConfiguration.fieldTypes.phone.name')}</Text> - {t('docs.fieldConfiguration.fieldTypes.phone.description')}
                      <br /><Text span fw={600}>{t('docs.fieldConfiguration.fieldTypes.url.name')}</Text> - {t('docs.fieldConfiguration.fieldTypes.url.description')}
                      <br /><Text span fw={600}>{t('docs.fieldConfiguration.fieldTypes.date.name')}</Text> - {t('docs.fieldConfiguration.fieldTypes.date.description')}
                      <br /><Text span fw={600}>{t('docs.fieldConfiguration.fieldTypes.file.name')}</Text> - {t('docs.fieldConfiguration.fieldTypes.file.description')}
                      <br /><Text span fw={600}>{t('docs.fieldConfiguration.fieldTypes.select.name')}</Text> - {t('docs.fieldConfiguration.fieldTypes.select.description')}
                      <br /><Text span fw={600}>{t('docs.fieldConfiguration.fieldTypes.radio.name')}</Text> - {t('docs.fieldConfiguration.fieldTypes.radio.description')}
                      <br /><Text span fw={600}>{t('docs.fieldConfiguration.fieldTypes.checkbox.name')}</Text> - {t('docs.fieldConfiguration.fieldTypes.checkbox.description')}
                    </Text>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder p="sm">
                    <Text fw={500} size="sm" mb="xs">
                      {t('docs.fieldConfiguration.validationOptions.title')}
                    </Text>
                    <Text size="xs">
                      <Text span fw={600}>{t('docs.fieldConfiguration.validationOptions.required.name')}</Text> - {t('docs.fieldConfiguration.validationOptions.required.description')}
                      <br /><Text span fw={600}>{t('docs.fieldConfiguration.validationOptions.emailValidation.name')}</Text> - {t('docs.fieldConfiguration.validationOptions.emailValidation.description')}
                      <br /><Text span fw={600}>{t('docs.fieldConfiguration.validationOptions.urlValidation.name')}</Text> - {t('docs.fieldConfiguration.validationOptions.urlValidation.description')}
                      <br /><Text span fw={600}>{t('docs.fieldConfiguration.validationOptions.customOptions.name')}</Text> - {t('docs.fieldConfiguration.validationOptions.customOptions.description')}
                      <br /><Text span fw={600}>{t('docs.fieldConfiguration.validationOptions.helpText.name')}</Text> - {t('docs.fieldConfiguration.validationOptions.helpText.description')}
                      <br /><Text span fw={600}>{t('docs.fieldConfiguration.validationOptions.placeholders.name')}</Text> - {t('docs.fieldConfiguration.validationOptions.placeholders.description')}
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
                      <Code>{t('docs.tomlConfiguration.fieldTypesAvailable.text.name')}</Code> - {t('docs.tomlConfiguration.fieldTypesAvailable.text.description')}
                      <br /><Code>{t('docs.tomlConfiguration.fieldTypesAvailable.email.name')}</Code> - {t('docs.tomlConfiguration.fieldTypesAvailable.email.description')}
                      <br /><Code>{t('docs.tomlConfiguration.fieldTypesAvailable.textarea.name')}</Code> - {t('docs.tomlConfiguration.fieldTypesAvailable.textarea.description')}
                      <br /><Code>{t('docs.tomlConfiguration.fieldTypesAvailable.select.name')}</Code> - {t('docs.tomlConfiguration.fieldTypesAvailable.select.description')}
                      <br /><Code>{t('docs.tomlConfiguration.fieldTypesAvailable.checkbox.name')}</Code> - {t('docs.tomlConfiguration.fieldTypesAvailable.checkbox.description')}
                      <br /><Code>{t('docs.tomlConfiguration.fieldTypesAvailable.number.name')}</Code> - {t('docs.tomlConfiguration.fieldTypesAvailable.number.description')}
                    </Text>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder p="sm">
                    <Text fw={500} size="sm" mb="xs">
                      {t('docs.tomlConfiguration.validationOptions.title')}
                    </Text>
                    <Text size="xs">
                      <Code>{t('docs.tomlConfiguration.validationOptions.required.name')}</Code> - {t('docs.tomlConfiguration.validationOptions.required.description')}
                      <br /><Code>{t('docs.tomlConfiguration.validationOptions.isEmail.name')}</Code> - {t('docs.tomlConfiguration.validationOptions.isEmail.description')}
                      <br /><Code>{t('docs.tomlConfiguration.validationOptions.isMin.name')}</Code> - {t('docs.tomlConfiguration.validationOptions.isMin.description')}
                      <br /><Code>{t('docs.tomlConfiguration.validationOptions.isMax.name')}</Code> - {t('docs.tomlConfiguration.validationOptions.isMax.description')}
                      <br /><Code>{t('docs.tomlConfiguration.validationOptions.options.name')}</Code> - {t('docs.tomlConfiguration.validationOptions.options.description')}
                      <br /><Code>{t('docs.tomlConfiguration.validationOptions.checkSpam.name')}</Code> - {t('docs.tomlConfiguration.validationOptions.checkSpam.description')}
                    </Text>
                  </Card>
                </Grid.Col>
              </Grid>

              <div>
                <Text fw={500} size="sm" mb="xs">
                  {t('docs.tomlConfiguration.benefits.title')}
                </Text>
                <Card withBorder p="sm" bg={isDark ? "grape.9" : "grape.0"}>
                  <Text size="xs">
                    {t('docs.tomlConfiguration.benefits.versionControl.icon')} <Text span fw={600}>{t('docs.tomlConfiguration.benefits.versionControl.feature')}</Text> - {t('docs.tomlConfiguration.benefits.versionControl.description')}
                    <br />{t('docs.tomlConfiguration.benefits.reusable.icon')} <Text span fw={600}>{t('docs.tomlConfiguration.benefits.reusable.feature')}</Text> - {t('docs.tomlConfiguration.benefits.reusable.description')}
                    <br />{t('docs.tomlConfiguration.benefits.preciseControl.icon')} <Text span fw={600}>{t('docs.tomlConfiguration.benefits.preciseControl.feature')}</Text> - {t('docs.tomlConfiguration.benefits.preciseControl.description')}
                    <br />{t('docs.tomlConfiguration.benefits.teamCollaboration.icon')} <Text span fw={600}>{t('docs.tomlConfiguration.benefits.teamCollaboration.feature')}</Text> - {t('docs.tomlConfiguration.benefits.teamCollaboration.description')}
                    <br />{t('docs.tomlConfiguration.benefits.advancedFeatures.icon')} <Text span fw={600}>{t('docs.tomlConfiguration.benefits.advancedFeatures.feature')}</Text> - {t('docs.tomlConfiguration.benefits.advancedFeatures.description')}
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
