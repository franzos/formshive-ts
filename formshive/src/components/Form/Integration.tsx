import { API_BASE_URL, IS_DEVELOPMENT } from '../../constants';
import {
  Accordion,
  ActionIcon,
  Alert,
  Box,
  Button,
  Card,
  Code,
  Collapse,
  Group,
  Select,
  Tabs,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconAlertCircle,
  IconBox,
  IconCheck,
  IconCopy,
  IconFileUpload,
  IconFolderOpen,
  IconForms,
  IconFrame,
  IconHtml,
  IconLanguage,
  IconLink,
  IconSend,
} from '@tabler/icons-react';
import 'altcha';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Reusable component for text inputs with copy functionality
function CopyableTextInput({
  value,
  label,
  description,
  disabled = false
}: {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <TextInput
      value={value}
      readOnly
      label={label}
      description={description}
      disabled={disabled}
      rightSection={
        <Tooltip label={copied ? 'Copied!' : 'Copy to clipboard'}>
          <ActionIcon
            variant="subtle"
            onClick={handleCopy}
            disabled={disabled}
            color={copied ? 'green' : 'gray'}
          >
            {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
          </ActionIcon>
        </Tooltip>
      }
    />
  );
}

export interface EmbedFormProps {
  formId: string;
}

export function EmbedForm({ formId }: EmbedFormProps) {
  const { t } = useTranslation();
  const [framework, setFramework] = useState('bulma');
  const frameworkOptions = [
    { value: 'bulma', label: 'Bulma' },
    { value: 'bootstrap', label: 'Bootstrap' },
    { value: 'formshive', label: 'Formshive' },
  ];

  return (
    <Card withBorder p="md" radius="sm">
      <Select
        label={t('formIntegration.cssFramework')}
        placeholder={t('formIntegration.selectCssFramework')}
        data={frameworkOptions}
        value={framework}
        onChange={(value) => {
          setFramework(value || 'bulma');
        }}
        mb="md"
      />
      <CopyableTextInput
        value={`<div id="formshive" form-id="${formId}" framework="${framework}"><a href="https://formshive.com/link.html?form_id=${formId}&framework=${framework}">Fill out my form</a></div><script type="text/javascript" async src="https://formshive.com/embed.js"></script>`}
        label={t('formIntegration.htmlTag')}
        description={t('formIntegration.htmlTagDescription')}
      />
    </Card>
  );
}

export interface IFrameFormProps {
  form: {
    id: string;
    check_challenge: boolean;
  };
}

export function IFrameForm({ form }: IFrameFormProps) {
  const { t } = useTranslation();
  const [framework, setFramework] = useState('bulma');
  // Reset iFrame
  const [counter, setCounter] = useState(0);
  const frameworkOptions = [
    { value: 'bulma', label: 'Bulma' },
    { value: 'bootstrap', label: 'Bootstrap' },
    { value: 'formshive', label: 'Formshive' },
  ];

  const iframeUrl = `${API_BASE_URL}/forms/${form.id}/html?iframe=true&css_framework=${framework}&css_embed=true&redirect=html`;
  const iframeUrlNoTrack = iframeUrl + `&track=false&_reload=${counter}`;

  useEffect(() => {
    setCounter((prev) => prev + 1);
  }, [form]);
  return (
    <>
      <Card withBorder p="md" radius="sm" mb="md">
        <Select
          label={t('formIntegration.cssFramework')}
          placeholder={t('formIntegration.selectCssFramework')}
          description="Styling will be automatically included"
          data={frameworkOptions}
          value={framework}
          onChange={(value) => {
            setFramework(value || 'bulma');
          }}
          mb="md"
        />
        <CopyableTextInput
          value={`<iframe src="${iframeUrl}" frameborder="0" width="100%" height=350></iframe>`}
          label={t('formIntegration.scriptTag')}
          description={t('formIntegration.scriptTagDescription')}
        />
      </Card>

      <Card withBorder p="md" radius="sm">
        <Text fw="bold" mb="md">
          {t('formIntegration.preview')}
        </Text>
        <Box
          p="xs"
          style={{ border: '1px solid #e9ecef', borderRadius: '4px' }}
          dangerouslySetInnerHTML={{
            __html: `<iframe src="${iframeUrlNoTrack}" frameborder="0" width="100%" height=250></iframe>`,
          }}
        />
      </Card>
    </>
  );
}

export function makeLinkUrl(formId: string, framework: string, title: string) {
  if (IS_DEVELOPMENT) {
    const browserUrl = window.location.host;
    return `http://${browserUrl}/link.html?form_id=${formId}&framework=${framework}&title=${encodeURIComponent(title)}&api_url=${API_BASE_URL}`;
  }

  return `https://formshive.com/link.html?form_id=${formId}&framework=${framework}&title=${encodeURIComponent(title)}`
}

export function LinkToForm({ formId }: EmbedFormProps) {
  const { t } = useTranslation();
  const [framework, setFramework] = useState('bulma');
  const [title, setTitle] = useState('My Web Form');
  const frameworkOptions = [
    { value: 'bulma', label: 'Bulma' },
    { value: 'bootstrap', label: 'Bootstrap' },
    { value: 'formshive', label: 'Formshive' },
  ];

  const linkUrl = makeLinkUrl(formId, framework, title);

  return (
    <Card withBorder p="md" radius="sm">
      <Select
        label={t('formIntegration.cssFramework')}
        placeholder={t('formIntegration.selectCssFramework')}
        data={frameworkOptions}
        value={framework}
        onChange={(value) => {
          setFramework(value || 'bulma');
        }}
        mb="md"
      />
      <TextInput
        label={t('formIntegration.formTitle')}
        placeholder={t('formIntegration.formTitlePlaceholder')}
        description={t('formIntegration.formTitleDescription')}
        value={title}
        onChange={(event) => setTitle(event.currentTarget.value)}
        mb="md"
      />
      <CopyableTextInput
        value={linkUrl}
        label={t('formIntegration.linkLabel')}
        description={t('formIntegration.linkDescription')}
      />
      <Button
        component="a"
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        variant="light"
        fullWidth
        mt="xs"
      >
        {t('formIntegration.preview')}
      </Button>
    </Card>
  );
}

export interface IntegrationProps {
  form: {
    id: string;
    check_challenge: boolean;
  };
  url: string;
  challengeUrl: string;
  challengeUrlNoTrack?: string;
  hasFormSpec: boolean;
  hasFileField: boolean;
  formExample: string;
  formExampleFileUpload: string;
  curlFormExample: string;
  curlMultipartExample: string;
  curlExample: string;
  llmExample: string;
}

export function IntegrationHelp({
  form,
  url,
  challengeUrl,
  challengeUrlNoTrack,
  hasFormSpec,
  hasFileField,
  formExample,
  formExampleFileUpload,
  curlFormExample,
  curlMultipartExample,
  curlExample,
  llmExample,
}: IntegrationProps) {
  const { t } = useTranslation();
  const [integrationExampleIsOpen, { toggle }] = useDisclosure(false);

  // Create preview versions of form examples using no-track challenge URL for rendered previews
  const formExamplePreview = challengeUrlNoTrack && challengeUrl
    ? formExample.replace(challengeUrl, challengeUrlNoTrack)
    : formExample;

  const formExampleFileUploadPreview = challengeUrlNoTrack && challengeUrl
    ? formExampleFileUpload.replace(challengeUrl, challengeUrlNoTrack)
    : formExampleFileUpload;
  return (
    <Box mb="md">
      <Title order={2}>{t('formIntegration.integration')}</Title>

      <Alert icon={<IconAlertCircle size={16} />} title="Which method should I choose?" color="blue" mb="md">
        <Group gap="md">
          <Text size="sm">
            <Text fw={600} span>Beginners:</Text> Start with <Text fw={600} span color="green">IFrame</Text> or <Text fw={600} span color="violet">Direct Link</Text> - they're the easiest!
          </Text>
          <Text size="sm">
            <Text fw={600} span>Best UX:</Text> Use <Text fw={600} span color="orange">JavaScript Embed</Text> for the smoothest user experience
          </Text>
          <Text size="sm">
            <Text fw={600} span>Existing forms:</Text> Use <Text fw={600} span color="blue">Manual HTML</Text> to keep your current design
          </Text>
        </Group>
      </Alert>

      <Tabs defaultValue="manual">
        <Tabs.List>
          <Tabs.Tab value="manual" leftSection={<IconHtml size={14} />}>
            <Box>
              <Text size="sm" fw={500}>{t('formIntegration.manual')}</Text>
              <Group gap="4px" mt="2px">
                <Text size="xs" px="4px" py="1px" bg="blue.1" c="blue.8" style={{ borderRadius: '8px', fontSize: '10px', fontWeight: 500 }}>
                  Existing Forms
                </Text>
                <Text size="xs" px="4px" py="1px" bg="green.1" c="green.8" style={{ borderRadius: '8px', fontSize: '10px', fontWeight: 500 }}>
                  Very Flexible
                </Text>
              </Group>
            </Box>
          </Tabs.Tab>
          <Tabs.Tab value="embed" leftSection={<IconBox size={14} />}>
            <Box>
              <Text size="sm" fw={500}>{t('formIntegration.javascript')}</Text>
              <Group gap="4px" mt="2px">
                <Text size="xs" px="4px" py="1px" bg="orange.1" c="orange.8" style={{ borderRadius: '8px', fontSize: '10px', fontWeight: 500 }}>
                  Best UX
                </Text>
                <Text size="xs" px="4px" py="1px" bg="teal.1" c="teal.8" style={{ borderRadius: '8px', fontSize: '10px', fontWeight: 500 }}>
                  Dynamic
                </Text>
              </Group>
            </Box>
          </Tabs.Tab>
          <Tabs.Tab value="iframe" leftSection={<IconFrame size={14} />}>
            <Box>
              <Text size="sm" fw={500}>{t('formIntegration.iframe')}</Text>
              <Group gap="4px" mt="2px">
                <Text size="xs" px="4px" py="1px" bg="green.1" c="green.8" style={{ borderRadius: '8px', fontSize: '10px', fontWeight: 500 }}>
                  Very Easy
                </Text>
                <Text size="xs" px="4px" py="1px" bg="gray.1" c="gray.8" style={{ borderRadius: '8px', fontSize: '10px', fontWeight: 500 }}>
                  Copy & Paste
                </Text>
              </Group>
            </Box>
          </Tabs.Tab>
          <Tabs.Tab value="link" leftSection={<IconLink size={14} />}>
            <Box>
              <Text size="sm" fw={500}>{t('formIntegration.link')}</Text>
              <Group gap="4px" mt="2px">
                <Text size="xs" px="4px" py="1px" bg="green.1" c="green.8" style={{ borderRadius: '8px', fontSize: '10px', fontWeight: 500 }}>
                  Very Easy
                </Text>
                <Text size="xs" px="4px" py="1px" bg="violet.1" c="violet.8" style={{ borderRadius: '8px', fontSize: '10px', fontWeight: 500 }}>
                  Social Media
                </Text>
              </Group>
            </Box>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="manual">
          <Text mb="xs" mt="md">
            {t('formIntegration.manualDescription')}
          </Text>

          <Group gap="md" mb="md" align="stretch">
            <Alert color="green" style={{ flex: 1 }}>
              <Text size="xs">
                <Text fw={600} span>✅ Success:</Text> Follows redirect behavior - custom URL redirect or built-in success page.
              </Text>
            </Alert>
            <Alert color="yellow" style={{ flex: 1 }}>
              <Text size="xs">
                <Text fw={600} span>⚠️ Validation errors:</Text> For forms with defined fields - shows helpful error page with your input saved.
              </Text>
            </Alert>
          </Group>

          <Card withBorder p="md" radius="sm" mb="md">
            <CopyableTextInput
              value={url}
              label={t('formIntegration.formUrl')}
              description={t('formIntegration.formUrlDescription')}
            />

            <Box mt="md">
              <CopyableTextInput
                value={challengeUrl}
                label={t('formIntegration.captchaUrl')}
                disabled={!form.check_challenge}
                description={
                  form.check_challenge
                    ? t('formIntegration.captchaDescription')
                    : t('formIntegration.captchaDisabledDescription')
                }
              />
            </Box>
          </Card>

          <Group justify="left" mb={5}>
            <Button onClick={toggle} variant="light" leftSection={<IconFolderOpen />}>
              {t('formIntegration.seeExamples')}
            </Button>
          </Group>

          <Collapse in={integrationExampleIsOpen}>
            {hasFormSpec && (
              <Alert variant="light" color="primary" icon={<IconAlertCircle size={20} />} mb="md">
                {t('formIntegration.examplesFromFields')}
              </Alert>
            )}
            <Accordion variant="contained">
              <Accordion.Item key={`accordion-${1}`} value="html">
                <Accordion.Control icon={<IconHtml />}>
                  {t('formIntegration.simpleHtmlForm')}
                </Accordion.Control>
                <Accordion.Panel>
                  <Title order={5} mb="xs">
                    {t('formIntegration.htmlExample')}
                  </Title>
                  <Code block mb="sm">
                    {formExample}
                  </Code>

                  <Alert
                    variant="light"
                    color="primary"
                    icon={<IconAlertCircle size={20} />}
                    mb="md"
                  >
                    {t('formIntegration.includeScript')}{' '}
                    <Code>
                      {`<script
                      async
                      defer
                      src="https://cdn.jsdelivr.net/npm/altcha/dist/altcha.min.js"
                      type="module"
                    ></script>`}
                    </Code>{' '}
                    {t('formIntegration.inHtmlHead')} <Code>head</Code>{' '}
                    {t('formIntegration.section')}
                  </Alert>

                  <Title order={5} mb="xs">
                    {t('formIntegration.formPreview')}
                  </Title>
                  <Card shadow="xs" maw="280">
                    <Box
                      mb="md"
                      id="plainhtml"
                      className="plainhtml"
                      dangerouslySetInnerHTML={{ __html: formExamplePreview }}
                    />
                  </Card>
                </Accordion.Panel>
              </Accordion.Item>
              {hasFileField ? (
                <Accordion.Item key={`accordion-${2}`} value="htmlfile">
                  <Accordion.Control icon={<IconFileUpload />}>
                    {t('formIntegration.htmlFormWithFile')}
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Title order={5} mb="xs">
                      {t('formIntegration.htmlExample')}
                    </Title>
                    <Text>
                      {t('formIntegration.fileUploadNote')}{' '}
                      <Code>enctype="multipart/form-data"</Code>.
                    </Text>
                    <Code block mb="sm">
                      {formExampleFileUpload}
                    </Code>

                    <Alert
                      variant="light"
                      color="primary"
                      icon={<IconAlertCircle size={20} />}
                      mb="md"
                    >
                      {t('formIntegration.includeScript')}{' '}
                      <Code>
                        {`<script
                      async
                      defer
                      src="https://cdn.jsdelivr.net/npm/altcha/dist/altcha.min.js"
                      type="module"
                    ></script>`}
                      </Code>{' '}
                      {t('formIntegration.inHtmlHead')} <Code>head</Code>{' '}
                      {t('formIntegration.section')}
                    </Alert>

                    <Title order={5} mb="xs">
                      {t('formIntegration.formPreview')}
                    </Title>
                    <Card shadow="xs" maw="280">
                      <Box
                        mb="md"
                        id="plainhtml"
                        className="plainhtml"
                        dangerouslySetInnerHTML={{ __html: formExampleFileUploadPreview }}
                      />
                    </Card>
                  </Accordion.Panel>
                </Accordion.Item>
              ) : (
                <Accordion.Item key={`accordion-${2}`} value="htmlfile">
                  <Accordion.Control icon={<IconFileUpload />}>
                    {t('formIntegration.htmlFormWithFile')}
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text>{t('formIntegration.noFileField')}</Text>
                  </Accordion.Panel>
                </Accordion.Item>
              )}
              {!form.check_challenge && (
                <>
                  <Accordion.Item key={`accordion-${3}`} value="curl">
                    <Accordion.Control icon={<IconForms />}>
                      {t('formIntegration.formSubmissionCurl')}
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Code block mb="sm">
                        {curlFormExample}
                      </Code>
                    </Accordion.Panel>
                  </Accordion.Item>
                  <Accordion.Item key={`accordion-${4}`} value="curlmultipart">
                    <Accordion.Control icon={<IconFileUpload />}>
                      {t('formIntegration.formSubmissionCurlFile')}
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Text>
                        {t('formIntegration.fileUploadCurlNote')}{' '}
                        <Code>Content-Type: multipart/form-data"</Code>.
                      </Text>
                      <Code block mb="sm">
                        {curlMultipartExample}
                      </Code>
                    </Accordion.Panel>
                  </Accordion.Item>
                  <Accordion.Item key={`accordion-${5}`} value="curljson">
                    <Accordion.Control icon={<IconSend />}>
                      {t('formIntegration.jsonSubmissionCurl')}
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Code block mb="sm">
                        {curlExample}
                      </Code>
                      <Text>{t('formIntegration.redirectNotApplicable')}</Text>
                    </Accordion.Panel>
                  </Accordion.Item>
                </>
              )}
              <Accordion.Item key={`accordion-${6}`} value="llm">
                <Accordion.Control icon={<IconLanguage />}>
                  {t('formIntegration.llmIntegration')}
                </Accordion.Control>
                <Accordion.Panel>
                  <Code block mb="sm">
                    {llmExample}
                  </Code>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Collapse>
        </Tabs.Panel>

        <Tabs.Panel value="embed">
          <Text mb="xs" mt="md">
            {t('formIntegration.embedDescription')}
          </Text>

          <Group gap="md" mb="md" align="stretch">
            <Alert color="green" style={{ flex: 1 }}>
              <Text size="xs">
                <Text fw={600} span>✅ Success:</Text> With redirect URL - redirects page. Without redirect URL - shows inline success message and clears form.
              </Text>
            </Alert>
            <Alert color="yellow" style={{ flex: 1 }}>
              <Text size="xs">
                <Text fw={600} span>⚠️ Validation errors:</Text> For forms WITH defined fields - highlights field errors directly with red styling. Best user experience!
              </Text>
            </Alert>
          </Group>
          {hasFormSpec ? (
            <EmbedForm formId={form.id} />
          ) : (
            <Alert icon={<IconAlertCircle size={20} />} mt="md" mb="md">
                {t('formIntegration.needFormFieldsEmbedFeature')}.
            </Alert>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="iframe">
          <Text mb="xs" mt="md">
            {t('formIntegration.iframeDescription')}
          </Text>

          <Group gap="md" mb="md" align="stretch">
            <Alert color="green" style={{ flex: 1 }}>
              <Text size="xs">
                <Text fw={600} span>✅ Success:</Text> Shows built-in success page within the iframe. Users stay on your website.
              </Text>
            </Alert>
            <Alert color="yellow" style={{ flex: 1 }}>
              <Text size="xs">
                <Text fw={600} span>⚠️ Validation errors:</Text> For forms WITH defined fields - shows error page within iframe with field highlighting.
              </Text>
            </Alert>
          </Group>
          {hasFormSpec ? (
            <IFrameForm form={form} />
          ) : (
            <Alert icon={<IconAlertCircle size={20} />} mt="md" mb="md">
                {t('formIntegration.needFormFieldsIframeFeature')}.
            </Alert>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="link">
          <Text mb="xs" mt="md">
            {t('formIntegration.linkDescriptionLong')}
          </Text>

          <Group gap="md" mb="md" align="stretch">
            <Alert color="green" style={{ flex: 1 }}>
              <Text size="xs">
                <Text fw={600} span>✅ Success:</Text> Full-page experience - follows your form's redirect settings (custom URL or success page).
              </Text>
            </Alert>
            <Alert color="yellow" style={{ flex: 1 }}>
              <Text size="xs">
                <Text fw={600} span>⚠️ Validation errors:</Text> For forms WITH defined fields - shows full-page error experience with preserved input.
              </Text>
            </Alert>
          </Group>
          {hasFormSpec ? (
            <LinkToForm formId={form.id} />
          ) : (
            <Alert icon={<IconAlertCircle size={20} />} mt="md" mb="md">
                {t('formIntegration.needFormFieldsLinkFeature')}.
            </Alert>
          )}
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
}
