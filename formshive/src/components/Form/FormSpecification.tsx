import {
  Checkbox,
  Group,
  Button,
  Space,
  Text,
  Notification,
  Tabs,
  Alert,
  Code,
} from '@mantine/core';
import {
  IconChecks,
  IconTemplate,
  IconDeviceFloppy,
  IconCopy,
  IconDragDrop,
  IconToml,
  IconAlertCircle,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react';
import { VisualSpecEditor } from './SpecEditor';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { generateHtmlFromSpecV2 } from '../../lib/form-spec-to-html';
import {
  parseAndValidateFormSpec,
  parseTomlToFormSpec,
  specsPlaceholder,
} from '../../lib/form-specs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UpdateForm } from '@gofranz/formshive-common';

export interface FormSpecificationsProps {
  isEditing: boolean;
  isBusy: boolean;
  hasError: string;
  submitSection: () => Promise<void>;
  form: {
    values: UpdateForm;
    setFieldValue: (field: string, value: any) => void;
  };
  formSubmitUrl: string;
  formChallengeUrl: string;
  formChallengeUrlNoTrack?: string;
  hasUnsavedChanges: boolean;
  onCancel: () => void;
}

export function FormSpecifications(props: FormSpecificationsProps) {
  const { t } = useTranslation();
  const [specErrors = new Map<string, string>(), setSpecErrors] = useState<Map<string, string>>();
  const [specIsValid, setSpecIsValid] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>('visual');

  // Find the field with spam checking enabled
  const getSpamCheckField = (): string | null => {
    try {
      const spec = parseTomlToFormSpec(props.form.values.specs);
      if (spec) {
        const spamField = Object.entries(spec.fields).find(([_, field]) => field.check_spam);
        return spamField ? spamField[1].name || spamField[0] : null;
      }
    } catch (e) {
      // Ignore parsing errors here
    }
    return null;
  };

  const changeTab = (value: string) => {
    if (props.hasUnsavedChanges) {
      alert(t('formSpec.unsavedChangesAlert'));
      return;
    }
    setCurrentTab(value);
  };

  const useTemplate = () => {
    props.form.setFieldValue('specs', specsPlaceholder);
  };

  const checkSpecs = () => {
    try {
      const res = parseAndValidateFormSpec(props.form.values.specs);
      if (!res.isValid) {
        setSpecErrors(res.errors);
        setSpecIsValid(false);
      } else {
        setSpecErrors(new Map());
        setSpecIsValid(true);
      }
    } catch (e) {
      const errorMsg = (e as any).message;
      setSpecErrors(new Map([['error', errorMsg]]));
    }
  };

  const copyHtmlToClipboard = () => {
    const spec = parseTomlToFormSpec(props.form.values.specs);
    if (spec) {
      const html = generateHtmlFromSpecV2(
        spec,
        props.formSubmitUrl,
        props.form.values.check_specs,
        props.formChallengeUrl
      );
      navigator.clipboard.writeText(html);
      alert(t('formSpec.htmlCopied'));
    }
  };
  return (
    <>
      {props.form.values.filter_spam && (
        <Alert color="yellow" icon={<IconAlertCircle size={20} />} mb="xs" mt="xs">
          {(() => {
            const spamField = getSpamCheckField();
            if (spamField) {
              return (
                <>
                  {t('formSpec.spamFilterEnabledWithField')} <Code>{spamField}</Code>.
                </>
              );
            } else {
              return t('formSpec.spamFilterEnabledNoField');
            }
          })()}
        </Alert>
      )}
      {!props.form.values.check_specs && (
        <Alert color="primary" icon={<IconInfoCircle size={20} />} mb="xs" mt="xs">
          {t('formSpec.formFieldsDisabled')}
        </Alert>
      )}

      <Checkbox
        label={t('formSpec.checkFormFields')}
        checked={props.form.values.check_specs}
        onChange={(event) => props.form.setFieldValue('check_specs', event.currentTarget.checked)}
        mb="xs"
        description={t('formSpec.checkFormFieldsDescription')}
      />

      {props.hasUnsavedChanges && (
        <Alert color="yellow" icon={<IconAlertCircle size={20} />} mb="xs" mt="xs">
          {t('formSpec.unsavedChanges')}
        </Alert>
      )}

      <Tabs
        defaultValue="visual"
        onChange={(value) => changeTab(value || 'visual')}
        value={currentTab}
      >
        <Tabs.List>
          <Tabs.Tab value="visual" leftSection={<IconDragDrop size={12} />}>
            {t('formSpec.visualEditor')}
          </Tabs.Tab>
          <Tabs.Tab value="code" leftSection={<IconToml size={12} />}>
            {t('formSpec.toml')}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="visual">
          <VisualSpecEditor
            spec={props.form.values.specs}
            onChange={(value) => props.form.setFieldValue('specs', value)}
          />
        </Tabs.Panel>

        <Tabs.Panel value="code">
          <>
            <CodeEditor
              value={props.form.values.specs}
              language="js"
              placeholder="Enter your form specification, or use template."
              onChange={(evn) => props.form.setFieldValue('specs', evn.target.value)}
              padding={15}
              style={{
                fontFamily:
                  'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
              }}
            />
            {specErrors?.size > 0 && (
              <Notification title={t('formSpec.specsErrors')} color="red" mb="md" mt="sm">
                {Array.from(specErrors || []).map(([key, value]) => (
                  <div key={`spec-error-${key}`}>
                    <Text c="red">
                      {key}: {value}
                    </Text>
                  </div>
                ))}
              </Notification>
            )}

            {specIsValid && (
              <Notification title={t('formSpec.noErrors')} color="green" mb="md" mt="sm">
                <Text color="green">{t('formSpec.specsValid')}</Text>
              </Notification>
            )}

            <Group>
              <Button
                onClick={checkSpecs}
                mt="sm"
                size="sm"
                variant="light"
                leftSection={<IconChecks />}
              >
                {t('formSpec.checkValidity')}
              </Button>
              <Button
                onClick={useTemplate}
                mt="sm"
                size="sm"
                variant="subtle"
                leftSection={<IconTemplate />}
              >
                {t('formSpec.prefillExample')}
              </Button>
            </Group>
          </>
        </Tabs.Panel>
      </Tabs>

      <Space h="md" mt="md" />
      <Group>
        <Button
          onClick={props.submitSection}
          loading={props.isBusy}
          disabled={props.isBusy}
          leftSection={<IconDeviceFloppy />}
          color={props.hasUnsavedChanges ? 'yellow' : ''}
        >
          {props.isEditing
            ? props.hasUnsavedChanges
              ? t('glob_buttons.updateUnsaved')
              : t('glob_buttons.update')
            : t('glob_buttons.create')}
        </Button>
        {props.hasUnsavedChanges && (
          <Button
            onClick={props.onCancel}
            loading={props.isBusy}
            disabled={props.isBusy}
            leftSection={<IconX />}
            color="red"
          >
            {t('glob_buttons.cancel')}
          </Button>
        )}
        {props.isEditing && (
          <Button
            onClick={copyHtmlToClipboard}
            loading={props.isBusy}
            disabled={props.isBusy || !props.form.values.specs}
            leftSection={<IconCopy />}
            variant="light"
          >
            {t('formSpec.copyHtmlForm')}
          </Button>
        )}
      </Group>

      {props.hasError && props.hasError !== '' && <Text c="red">{props.hasError}</Text>}
    </>
  );
}
