import { Text, Stack, Accordion, Group, ThemeIcon, Alert, Card, Code, Badge } from '@mantine/core';
import {
  IconWebhook,
  IconInfoCircle,
  IconBrandSlack,
  IconExternalLink,
  IconCheck,
  IconBrandGoogle,
  IconUsers,
  IconMail,
  IconBrandMailgun,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export function IntegrationsHelp() {
  const { t } = useTranslation();
  return (
    <Stack gap="xl">
      <Accordion variant="contained" chevronPosition="right">
        <Accordion.Item value="pipedrive-integration">
          <Accordion.Control>
            <Group wrap="nowrap">
              <ThemeIcon size="lg" radius="xl" color="green">
                <IconUsers size={20} />
              </ThemeIcon>
              <div>
                <Text fw={500}>{t('integrations.pipedrive.title')}</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  {t('integrations.pipedrive.subtitle')}
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>
                {t('integrations.pipedrive.description')}
              </Text>

              <Alert icon={<IconInfoCircle size={16} />} title={t('integrations.pipedrive.howItWorks.title')} color="green">
                <Text size="sm">
                  {t('integrations.pipedrive.howItWorks.description')}
                </Text>
              </Alert>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  {t('integrations.pipedrive.fieldHandling.title')}
                </Text>
                <Text size="sm">
                  {t('integrations.pipedrive.fieldHandling.requiredFields')}
                  <br />{t('integrations.pipedrive.fieldHandling.nameField')}
                  <br />
                  <br />
                  {t('integrations.pipedrive.fieldHandling.optionalFields')}
                  <br />{t('integrations.pipedrive.fieldHandling.emailField')}
                  <br />{t('integrations.pipedrive.fieldHandling.phoneField')}
                  <br />
                  {t('integrations.pipedrive.fieldHandling.customFields')}
                  <br />
                  <br />
                  {t('integrations.pipedrive.fieldHandling.leadCreation')}
                  <br />
                  {t('integrations.pipedrive.fieldHandling.leadTitle')}
                  <br />
                  {t('integrations.pipedrive.fieldHandling.leadLink')}
                  <br />{t('integrations.pipedrive.fieldHandling.leadInherit')}
                </Text>
              </Card>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  {t('integrations.pipedrive.setupSteps.title')}
                </Text>
                <Text size="sm">
                  {t('integrations.pipedrive.setupSteps.getApiToken')}
                  <br />
                  {t('integrations.pipedrive.setupSteps.copyDomain')}
                  <br />
                  {t('integrations.pipedrive.setupSteps.createIntegration')}
                  <br />
                  {t('integrations.pipedrive.setupSteps.configureOptions')}
                  <br />
                  {t('integrations.pipedrive.setupSteps.test')}
                </Text>
              </Card>

              <div>
                <Text fw={500} size="sm" mb="xs">
                  {t('integrations.pipedrive.features.title')}
                </Text>
                <Group gap="xs">
                  <Badge variant="light" color="green">
                    {t('integrations.pipedrive.features.personCreation')}
                  </Badge>
                  <Badge variant="light" color="blue">
                    {t('integrations.pipedrive.features.leadGeneration')}
                  </Badge>
                  <Badge variant="light" color="purple">
                    {t('integrations.pipedrive.features.customFields')}
                  </Badge>
                  <Badge variant="light" color="orange">
                    {t('integrations.pipedrive.features.ownerAssignment')}
                  </Badge>
                  <Badge variant="light" color="red">
                    {t('integrations.pipedrive.features.organizationLinking')}
                  </Badge>
                </Group>
              </div>

              <Alert icon={<IconCheck size={16} />} title={t('integrations.pipedrive.whatYouGet.title')} color="green">
                <Text size="sm">
                  {t('integrations.pipedrive.whatYouGet.automaticCreation')}
                  <br />
                  {t('integrations.pipedrive.whatYouGet.optionalLead')}
                  <br />
                  {t('integrations.pipedrive.whatYouGet.configurableAssignment')}
                  <br />{t('integrations.pipedrive.whatYouGet.customFieldMapping')}
                </Text>
              </Alert>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="mailchimp-integration">
          <Accordion.Control>
            <Group wrap="nowrap">
              <ThemeIcon size="lg" radius="xl" color="yellow">
                <IconMail size={20} />
              </ThemeIcon>
              <div>
                <Text fw={500}>{t('integrations.mailchimp.title')}</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  {t('integrations.mailchimp.subtitle')}
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>
                {t('integrations.mailchimp.description')}
              </Text>

              <Alert icon={<IconInfoCircle size={16} />} title={t('integrations.mailchimp.howItWorks.title')} color="yellow">
                <Text size="sm">
                  {t('integrations.mailchimp.howItWorks.description')}
                </Text>
              </Alert>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  {t('integrations.mailchimp.fieldHandling.title')}
                </Text>
                <Text size="sm">
                  {t('integrations.mailchimp.fieldHandling.requiredFields')}
                  <br />{t('integrations.mailchimp.fieldHandling.emailField')}
                  <br />
                  <br />
                  {t('integrations.mailchimp.fieldHandling.optionalFields')}
                  <br />{t('integrations.mailchimp.fieldHandling.firstNameField')}
                  <br />{t('integrations.mailchimp.fieldHandling.lastNameField')}
                  <br />{t('integrations.mailchimp.fieldHandling.phoneField')}
                  <br />
                  {t('integrations.mailchimp.fieldHandling.customFields')}
                  <br />
                  <br />
                  {t('integrations.mailchimp.fieldHandling.additionalFeatures')}
                  <br />
                  {t('integrations.mailchimp.fieldHandling.tags')}
                  <br />
                  {t('integrations.mailchimp.fieldHandling.status')}
                  <br />{t('integrations.mailchimp.fieldHandling.doubleOptin')}
                </Text>
              </Card>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  {t('integrations.mailchimp.setupSteps.title')}
                </Text>
                <Text size="sm">
                  {t('integrations.mailchimp.setupSteps.getApiKey')}
                  <br />
                  {t('integrations.mailchimp.setupSteps.findListId')}
                  <br />
                  {t('integrations.mailchimp.setupSteps.createIntegration')}
                  <br />
                  {t('integrations.mailchimp.setupSteps.configureFields')}
                  <br />
                  {t('integrations.mailchimp.setupSteps.setOptions')}
                  <br />
                  {t('integrations.mailchimp.setupSteps.test')}
                </Text>
              </Card>

              <div>
                <Text fw={500} size="sm" mb="xs">
                  {t('integrations.mailchimp.features.title')}
                </Text>
                <Group gap="xs">
                  <Badge variant="light" color="yellow">
                    {t('integrations.mailchimp.features.audienceAddition')}
                  </Badge>
                  <Badge variant="light" color="blue">
                    {t('integrations.mailchimp.features.mergeFields')}
                  </Badge>
                  <Badge variant="light" color="purple">
                    {t('integrations.mailchimp.features.tagManagement')}
                  </Badge>
                  <Badge variant="light" color="green">
                    {t('integrations.mailchimp.features.doubleOptin')}
                  </Badge>
                  <Badge variant="light" color="orange">
                    {t('integrations.mailchimp.features.statusControl')}
                  </Badge>
                </Group>
              </div>

              <Alert icon={<IconCheck size={16} />} title={t('integrations.mailchimp.whatYouGet.title')} color="yellow">
                <Text size="sm">
                  {t('integrations.mailchimp.whatYouGet.automaticSubscriber')}
                  <br />
                  {t('integrations.mailchimp.whatYouGet.customMergeField')}
                  <br />
                  {t('integrations.mailchimp.whatYouGet.automaticTagging')}
                  <br />
                  {t('integrations.mailchimp.whatYouGet.doubleOptinCompliance')}
                  <br />{t('integrations.mailchimp.whatYouGet.configurableStatus')}
                </Text>
              </Alert>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="kit-integration">
          <Accordion.Control>
            <Group wrap="nowrap">
              <ThemeIcon size="lg" radius="xl" color="teal">
                <IconBrandMailgun size={20} />
              </ThemeIcon>
              <div>
                <Text fw={500}>{t('integrations.kit.title')}</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  {t('integrations.kit.subtitle')}
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>
                {t('integrations.kit.description')}
              </Text>

              <Alert icon={<IconInfoCircle size={16} />} title={t('integrations.kit.howItWorks.title')} color="teal">
                <Text size="sm">
                  {t('integrations.kit.howItWorks.description')}
                </Text>
              </Alert>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  {t('integrations.kit.fieldHandling.title')}
                </Text>
                <Text size="sm">
                  {t('integrations.kit.fieldHandling.requiredFields')}
                  <br />{t('integrations.kit.fieldHandling.emailField')}
                  <br />
                  <br />
                  {t('integrations.kit.fieldHandling.optionalFields')}
                  <br />{t('integrations.kit.fieldHandling.firstNameField')}
                  <br />{t('integrations.kit.fieldHandling.lastNameField')}
                  <br />{t('integrations.kit.fieldHandling.companyField')}
                  <br />
                  {t('integrations.kit.fieldHandling.customFields')}
                  <br />
                  <br />
                  {t('integrations.kit.fieldHandling.twoStepProcess')}
                  <br />
                  {t('integrations.kit.fieldHandling.stepOne')}
                  <br />
                  {t('integrations.kit.fieldHandling.stepTwo')}
                  <br />{t('integrations.kit.fieldHandling.tagsApplied')}
                </Text>
              </Card>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  {t('integrations.kit.setupSteps.title')}
                </Text>
                <Text size="sm">
                  {t('integrations.kit.setupSteps.getApiKey')}
                  <br />
                  {t('integrations.kit.setupSteps.findFormId')}
                  <br />
                  {t('integrations.kit.setupSteps.createIntegration')}
                  <br />
                  {t('integrations.kit.setupSteps.configureFields')}
                  <br />
                  {t('integrations.kit.setupSteps.setTags')}
                  <br />
                  {t('integrations.kit.setupSteps.test')}
                </Text>
              </Card>

              <div>
                <Text fw={500} size="sm" mb="xs">
                  {t('integrations.kit.features.title')}
                </Text>
                <Group gap="xs">
                  <Badge variant="light" color="teal">
                    {t('integrations.kit.features.subscriberAddition')}
                  </Badge>
                  <Badge variant="light" color="blue">
                    {t('integrations.kit.features.customFields')}
                  </Badge>
                  <Badge variant="light" color="purple">
                    {t('integrations.kit.features.tagManagement')}
                  </Badge>
                  <Badge variant="light" color="green">
                    {t('integrations.kit.features.formIntegration')}
                  </Badge>
                  <Badge variant="light" color="orange">
                    {t('integrations.kit.features.fieldMapping')}
                  </Badge>
                </Group>
              </div>

              <Alert icon={<IconCheck size={16} />} title={t('integrations.kit.whatYouGet.title')} color="teal">
                <Text size="sm">
                  {t('integrations.kit.whatYouGet.automaticSubscriber')}
                  <br />
                  {t('integrations.kit.whatYouGet.customFieldMapping')}
                  <br />
                  {t('integrations.kit.whatYouGet.automaticTagging')}
                  <br />
                  {t('integrations.kit.whatYouGet.twoStepProcess')}
                  <br />{t('integrations.kit.whatYouGet.kitCompatibility')}
                </Text>
              </Alert>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="zapier-integration">
          <Accordion.Control>
            <Group wrap="nowrap">
              <ThemeIcon size="lg" radius="xl" color="orange">
                <IconWebhook size={20} />
              </ThemeIcon>
              <div>
                <Text fw={500}>{t('integrations.zapier.title')}</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  {t('integrations.zapier.subtitle')}
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>
                {t('integrations.zapier.description')}
              </Text>

              <Alert icon={<IconInfoCircle size={16} />} title={t('integrations.zapier.howItWorks.title')} color="blue">
                <Text size="sm">
                  {t('integrations.zapier.howItWorks.description')}
                </Text>
              </Alert>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  {t('integrations.zapier.fieldHandling.title')}
                </Text>
                <Text size="sm">
                  {t('integrations.zapier.fieldHandling.allFieldsIncluded')}
                  <br />
                  {t('integrations.zapier.fieldHandling.jsonPayload')}
                  <br />
                  {t('integrations.zapier.fieldHandling.integrationId')}
                  <br />
                  <br />
                  {t('integrations.zapier.fieldHandling.dataStructure')}
                  <br />{t('integrations.zapier.fieldHandling.integrationField')}
                  <br />{t('integrations.zapier.fieldHandling.dataField')}
                  <br />
                  {t('integrations.zapier.fieldHandling.standardWebhook')}
                  <br />
                  <br />
                  {t('integrations.zapier.fieldHandling.zapierProcessing')}
                  <br />
                  {t('integrations.zapier.fieldHandling.automaticParsing')}
                  <br />
                  {t('integrations.zapier.fieldHandling.filterTransform')}
                  <br />{t('integrations.zapier.fieldHandling.noFieldMapping')}
                </Text>
              </Card>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  {t('integrations.zapier.setupSteps.title')}
                </Text>
                <Text size="sm">
                  {t('integrations.zapier.setupSteps.createWebhook')}
                  <br />
                  {t('integrations.zapier.setupSteps.newZap')}
                  <br />
                  {t('integrations.zapier.setupSteps.selectCatchHook')}
                  <br />
                  {t('integrations.zapier.setupSteps.pasteWebhookUrl')}
                  <br />
                  {t('integrations.zapier.setupSteps.testConnect')}
                  <br />
                  {t('integrations.zapier.setupSteps.addActions')}
                </Text>
              </Card>

              <div>
                <Text fw={500} size="sm" mb="xs">
                  {t('integrations.zapier.popularConnections.title')}
                </Text>
                <Group gap="xs">
                  <Badge variant="light" color="green">
                    {t('integrations.zapier.popularConnections.googleSheets')}
                  </Badge>
                  <Badge variant="light" color="blue">
                    {t('integrations.zapier.popularConnections.mailchimp')}
                  </Badge>
                  <Badge variant="light" color="purple">
                    {t('integrations.zapier.popularConnections.airtable')}
                  </Badge>
                  <Badge variant="light" color="orange">
                    {t('integrations.zapier.popularConnections.trello')}
                  </Badge>
                  <Badge variant="light" color="red">
                    {t('integrations.zapier.popularConnections.gmail')}
                  </Badge>
                  <Badge variant="light" color="gray">
                    {t('integrations.zapier.popularConnections.moreApps')}
                  </Badge>
                </Group>
              </div>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="slack-integration">
          <Accordion.Control>
            <Group wrap="nowrap">
              <ThemeIcon size="lg" radius="xl" color="grape">
                <IconBrandSlack size={20} />
              </ThemeIcon>
              <div>
                <Text fw={500}>{t('integrations.slack.title')}</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  {t('integrations.slack.subtitle')}
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>
                {t('integrations.slack.description')}
              </Text>

              <Alert icon={<IconInfoCircle size={16} />} title={t('integrations.slack.howItWorks.title')} color="grape">
                <Text size="sm">
                  {t('integrations.slack.howItWorks.description')}
                </Text>
              </Alert>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  {t('integrations.slack.fieldHandling.title')}
                </Text>
                <Text size="sm">
                  {t('integrations.slack.fieldHandling.allFieldsDisplayed')}
                  <br />
                  {t('integrations.slack.fieldHandling.allDataIncluded')}
                  <br />
                  {t('integrations.slack.fieldHandling.formattedBlocks')}
                  <br />
                  {t('integrations.slack.fieldHandling.timestampIncluded')}
                  <br />
                  <br />
                  {t('integrations.slack.fieldHandling.messageStructure')}
                  <br />
                  {t('integrations.slack.fieldHandling.headerEmoji')}
                  <br />
                  {t('integrations.slack.fieldHandling.fieldDisplay')}
                  <br />
                  {t('integrations.slack.fieldHandling.submissionTimestamp')}
                  <br />
                  {t('integrations.slack.fieldHandling.optionalLink')}
                  <br />
                  <br />
                  {t('integrations.slack.fieldHandling.instantDelivery')}
                  <br />
                  {t('integrations.slack.fieldHandling.immediateMessages')}
                  <br />
                  {t('integrations.slack.fieldHandling.noPolling')}
                  <br />{t('integrations.slack.fieldHandling.channelVisibility')}
                </Text>
              </Card>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  {t('integrations.slack.setupSteps.title')}
                </Text>
                <Text size="sm">
                  {t('integrations.slack.setupSteps.openSlack')}
                  <br />
                  {t('integrations.slack.setupSteps.createWebhook')}
                  <br />
                  {t('integrations.slack.setupSteps.chooseChannel')}
                  <br />
                  {t('integrations.slack.setupSteps.copyWebhookUrl')}
                  <br />
                  {t('integrations.slack.setupSteps.addToFormshive')}
                  <br />
                  {t('integrations.slack.setupSteps.test')}
                </Text>
              </Card>

              <div>
                <Text fw={500} size="sm" mb="xs">
                  {t('integrations.slack.slackPreview.title')}
                </Text>
                <Code block>
                  {t('integrations.slack.slackPreview.exampleMessage')}
                </Code>
              </div>

              <Alert icon={<IconCheck size={16} />} title={t('integrations.slack.proTips.title')} color="green">
                <Text size="sm">
                  {t('integrations.slack.proTips.differentChannels')}
                  <br />
                  {t('integrations.slack.proTips.mentionSetup')}
                  <br />{t('integrations.slack.proTips.instantWebhooks')}
                </Text>
              </Alert>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="google-sheets-integration">
          <Accordion.Control>
            <Group wrap="nowrap">
              <ThemeIcon size="lg" radius="xl" color="green">
                <IconBrandGoogle size={20} />
              </ThemeIcon>
              <div>
                <Text fw={500}>{t('integrations.googleSheets.title')}</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  {t('integrations.googleSheets.subtitle')}
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>
                {t('integrations.googleSheets.description')}
              </Text>

              <Alert icon={<IconInfoCircle size={16} />} title={t('integrations.googleSheets.howItWorks.title')} color="green">
                <Text size="sm">
                  {t('integrations.googleSheets.howItWorks.description')}
                </Text>
              </Alert>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  {t('integrations.googleSheets.fieldHandling.title')}
                </Text>
                <Text size="sm">
                  {t('integrations.googleSheets.fieldHandling.allFieldsAsColumns')}
                  <br />
                  {t('integrations.googleSheets.fieldHandling.separateColumns')}
                  <br />
                  {t('integrations.googleSheets.fieldHandling.headersAutocreated')}
                  <br />
                  {t('integrations.googleSheets.fieldHandling.dynamicGeneration')}
                  <br />
                  <br />
                  {t('integrations.googleSheets.fieldHandling.standardColumns')}
                  <br />{t('integrations.googleSheets.fieldHandling.timestampColumn')}
                  <br />{t('integrations.googleSheets.fieldHandling.formTitleColumn')}
                  <br />
                  {t('integrations.googleSheets.fieldHandling.customFieldsIncluded')}
                  <br />
                  <br />
                  {t('integrations.googleSheets.fieldHandling.dataStorage')}
                  <br />
                  {t('integrations.googleSheets.fieldHandling.oneRowPerSubmission')}
                  <br />
                  {t('integrations.googleSheets.fieldHandling.dataPreserved')}
                  <br />
                  {t('integrations.googleSheets.fieldHandling.fullFunctionality')}
                  <br />{t('integrations.googleSheets.fieldHandling.realtimeUpdates')}
                </Text>
              </Card>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  {t('integrations.googleSheets.setupSteps.title')}
                </Text>
                <Text size="sm">
                  {t('integrations.googleSheets.setupSteps.openGoogleSheets')}
                  <br />
                  {t('integrations.googleSheets.setupSteps.openAppsScript')}
                  <br />
                  {t('integrations.googleSheets.setupSteps.addCode')}
                  <br />
                  {t('integrations.googleSheets.setupSteps.deploy')}
                  <br />
                  {t('integrations.googleSheets.setupSteps.copyUrl')}
                  <br />
                  {t('integrations.googleSheets.setupSteps.addToFormshive')}
                </Text>
              </Card>

              <div>
                <Text fw={500} size="sm" mb="xs">
                  {t('integrations.googleSheets.appsScriptCode.title')}
                </Text>
                <Code block>
                  {t('integrations.googleSheets.appsScriptCode.code')}
                </Code>
              </div>

              <Alert icon={<IconCheck size={16} />} title={t('integrations.googleSheets.whatYouGet.title')} color="green">
                <Text size="sm">
                  {t('integrations.googleSheets.whatYouGet.automaticSpreadsheet')}
                  <br />
                  {t('integrations.googleSheets.whatYouGet.fieldColumns')}
                  <br />
                  {t('integrations.googleSheets.whatYouGet.realtimeUpdates')}
                  <br />{t('integrations.googleSheets.whatYouGet.fullFunctionality')}
                </Text>
              </Alert>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="webhook-integration">
          <Accordion.Control>
            <Group wrap="nowrap">
              <ThemeIcon size="lg" radius="xl" color="blue">
                <IconExternalLink size={20} />
              </ThemeIcon>
              <div>
                <Text fw={500}>{t('integrations.webhook.title')}</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  {t('integrations.webhook.subtitle')}
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>
                {t('integrations.webhook.description')}
              </Text>

              <Alert icon={<IconInfoCircle size={16} />} title={t('integrations.webhook.howItWorks.title')} color="blue">
                <Text size="sm">
                  {t('integrations.webhook.howItWorks.description')}
                </Text>
              </Alert>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  {t('integrations.webhook.fieldHandling.title')}
                </Text>
                <Text size="sm">
                  {t('integrations.webhook.fieldHandling.completeFormData')}
                  <br />
                  {t('integrations.webhook.fieldHandling.allFieldsSent')}
                  <br />
                  {t('integrations.webhook.fieldHandling.formMetadata')}
                  <br />
                  {t('integrations.webhook.fieldHandling.integrationDetails')}
                  <br />
                  <br />
                  {t('integrations.webhook.fieldHandling.standardHttpPost')}
                  <br />{t('integrations.webhook.fieldHandling.contentTypeHeader')}
                  <br />
                  {t('integrations.webhook.fieldHandling.jsonBody')}
                  <br />
                  {t('integrations.webhook.fieldHandling.successResponse')}
                  <br />
                  <br />
                  {t('integrations.webhook.fieldHandling.flexibleProcessing')}
                  <br />
                  {t('integrations.webhook.fieldHandling.parseJson')}
                  <br />
                  {t('integrations.webhook.fieldHandling.integrateAnyApi')}
                  <br />
                  {t('integrations.webhook.fieldHandling.customLogic')}
                  <br />{t('integrations.webhook.fieldHandling.businessWorkflows')}
                </Text>
              </Card>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  {t('integrations.webhook.payloadFormat.title')}
                </Text>
                <Code block>
                  {t('integrations.webhook.payloadFormat.examplePayload')}
                </Code>
              </Card>

              <div>
                <Text fw={500} size="sm" mb="xs">
                  {t('integrations.webhook.requirements.title')}
                </Text>
                <Text size="sm">
                  {t('integrations.webhook.requirements.acceptPost')}
                  <br />
                  {t('integrations.webhook.requirements.responseStatus')}
                  <br />
                  {t('integrations.webhook.requirements.handleJson')}
                  <br />{t('integrations.webhook.requirements.httpsRecommended')}
                </Text>
              </div>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}
