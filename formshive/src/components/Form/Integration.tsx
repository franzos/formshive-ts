import { API_BASE_URL } from '../../constants';
import {
  Accordion,
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
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconAlertCircle,
  IconBox,
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

export interface EmbedFormProps {
  formId: string;
}

export function EmbedForm({ formId }: EmbedFormProps) {
  const { t } = useTranslation();
  const [framework, setFramework] = useState('bulma');
  const frameworkOptions = [
    { value: 'bulma', label: 'Bulma' },
    { value: 'bootstrap', label: 'Bootstrap' },
  ];

  return (
    <>
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
        value={`<div id="formshive" form-id="${formId}" framework="${framework}"><a href="https://formshive.com/link.html?form_id=${formId}&framework=${framework}">Fill out my form</a></div><script type="text/javascript" async src="https://formshive.com/embed.js"></script>`}
        readOnly
        label={t('formIntegration.htmlTag')}
        mb="md"
        description={t('formIntegration.htmlTagDescription')}
      />
    </>
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

  const iframeUrl = `${API_BASE_URL}/forms/${form.id}/html?css_framework=${framework}&_reload=${counter}`;

  useEffect(() => {
    setCounter((prev) => prev + 1);
  }, [form]);
  return (
    <>
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
        value={`<iframe src="${iframeUrl}" frameborder="0" width="100%" height=350></iframe>`}
        readOnly
        label={t('formIntegration.scriptTag')}
        description={t('formIntegration.scriptTagDescription')}
      />
      <Text fw="bold" mt="md">
        {t('formIntegration.preview')}
      </Text>
      <Card shadow="xs">
        <Box
          mb="md"
          p="xs"
          dangerouslySetInnerHTML={{
            __html: `<iframe src="${iframeUrl}" frameborder="0" width="100%" height=250></iframe>`,
          }}
        />
      </Card>
    </>
  );
}

export function LinkToForm({ formId }: EmbedFormProps) {
  const { t } = useTranslation();
  const [framework, setFramework] = useState('bulma');
  const [title, setTitle] = useState('My Web Form');
  const frameworkOptions = [
    { value: 'bulma', label: 'Bulma' },
    { value: 'bootstrap', label: 'Bootstrap' },
  ];

  const encodedTitle = encodeURIComponent(title);
  const linkUrl = `https://formshive.com/link.html?form_id=${formId}&framework=${framework}&title=${encodedTitle}`;

  return (
    <>
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
      <TextInput
        value={linkUrl}
        readOnly
        label={t('formIntegration.linkLabel')}
        mb="md"
        description={t('formIntegration.linkDescription')}
      />
      <Button
        component="a"
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        variant="light"
        mb="md"
      >
        {t('formIntegration.preview')}
      </Button>
    </>
  );
}

export interface IntegrationProps {
  form: {
    id: string;
    check_challenge: boolean;
  };
  url: string;
  challengeUrl: string;
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
  return (
    <Box mb="md">
      <Title order={2}>{t('formIntegration.integration')}</Title>

      <Tabs defaultValue="manual">
        <Tabs.List>
          <Tabs.Tab value="manual" leftSection={<IconHtml size={12} />}>
            {t('formIntegration.manual')}
          </Tabs.Tab>
          <Tabs.Tab value="embed" leftSection={<IconBox size={12} />}>
            {t('formIntegration.javascript')}
          </Tabs.Tab>
          <Tabs.Tab value="iframe" leftSection={<IconFrame size={12} />}>
            {t('formIntegration.iframe')}
          </Tabs.Tab>
          <Tabs.Tab value="link" leftSection={<IconLink size={12} />}>
            {t('formIntegration.link')}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="manual">
          <Text mb="xs" mt="md">
            {t('formIntegration.manualDescription')}
          </Text>
          <TextInput
            value={url}
            readOnly
            label={t('formIntegration.formUrl')}
            mb="md"
            description={t('formIntegration.formUrlDescription')}
          />

          <TextInput
            value={challengeUrl}
            readOnly
            label={t('formIntegration.captchaUrl')}
            mb="md"
            disabled={!form.check_challenge}
            description={
              form.check_challenge
                ? t('formIntegration.captchaDescription')
                : t('formIntegration.captchaDisabledDescription')
            }
          />

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
                      dangerouslySetInnerHTML={{ __html: formExample }}
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
                        dangerouslySetInnerHTML={{ __html: formExampleFileUpload }}
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
