import { fieldTypes } from '../../lib/field-types';
import { renderInputField } from '../../lib/form-spec-to-html';
import { FormField, FormSettings } from '../../lib/form-specs';
import {
  Box,
  Button,
  ButtonGroup,
  Collapse,
  Divider,
  NativeSelect,
  Pill,
  PillsInput,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import {
  IconCircle,
  IconCircleCheck,
  IconCircleMinus,
  IconCircleX,
  IconChevronDown,
  IconChevronUp,
} from '@tabler/icons-react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function renderHtmlFormFieldPreview(props: { formField: FormField }) {
  const { formField } = props;
  const { t } = useTranslation();

  return (
    <Box>
      <Text size="sm" fw="bold" mb="xs">
        {t('specField.htmlPreview')}
      </Text>
      <Text
        size="xs"
        p="sm"
        className="rusty-form"
        style={{ border: '1px solid var(--mantine-color-gray-2)', borderRadius: '5px' }}
        dangerouslySetInnerHTML={{ __html: renderInputField(formField) }}
      />

      <Text size="sm" fw="bold" mt="md" mb="xs">
        {t('specField.htmlCode')}
      </Text>
      <Box style={{ border: '1px solid var(--mantine-color-gray-2)', borderRadius: '5px' }}>
        <CodeEditor value={renderInputField(formField)} language="html" readOnly />
      </Box>
    </Box>
  );
}

export interface ValidationGroupProps {
  value: boolean | undefined;
  onChange: (props: {
    fieldName: string;
    fieldKey: keyof FormField;
    value: string | boolean | number | string[] | undefined;
  }) => void;
  label: string;
  fieldKey: keyof FormField;
  fieldName: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  description?: string;
}

export function ValidationGroup({
  value,
  label,
  fieldKey,
  fieldName,
  onChange,
  disabled = false,
  style,
  description,
}: ValidationGroupProps) {
  const color = value === true ? 'green' : value === false ? 'red' : 'gray';
  const icon =
    value === true ? <IconCircleCheck /> : value === false ? <IconCircleX /> : <IconCircle />;

  return (
    <>
      <ButtonGroup style={style}>
        <Button
          onClick={() => onChange({ fieldName, fieldKey, value: !value })}
          variant="light"
          size="xs"
          color={color}
          leftSection={icon}
          disabled={disabled}
        >
          {label}
        </Button>
        <Button
          onClick={() => onChange({ fieldName, fieldKey, value: undefined })}
          variant="light"
          size="xs"
          disabled={value === undefined}
        >
          <IconCircleMinus />
        </Button>
      </ButtonGroup>
      {description && (
        <Text size="xs" c="gray" mt="xs">
          {description}
        </Text>
      )}
    </>
  );
}

export interface FormSpecFieldChange {
  // for ex. "Name"
  fieldName: string;
  // for ex. "name"; so of the "Name" field, the "name" field
  fieldKey: keyof FormField;
  value: string | boolean | number | string[] | undefined;
}

export interface FormSpecFieldNameChange {
  oldFieldName: string;
  newFieldName: string;
}

export interface FormSpecSettingsChange {
  fieldKey: keyof FormSettings;
  value: boolean;
}

export function SpecField(props: {
  fieldKey: string;
  fields: FormField;
  onChange: (change: FormSpecFieldChange) => void;
  onDelete: (fieldName: string) => void;
  onFieldNameChange?: (change: FormSpecFieldNameChange) => void;
}) {
  const { t } = useTranslation();
  const fieldName = props.fieldKey;

  const [hasOptions, setHasOptions] = useState<boolean>(false);
  const [isInputField, setIsInputField] = useState<boolean>(false);
  const [optionsArray, setOptionsArray] = useState<string[]>([]);
  const [newOption, setNewOption] = useState<string>('');
  const [editingFieldName, setEditingFieldName] = useState<string>(props.fields.name);
  const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false);

  // Sync editingFieldName when the field's name property changes
  useEffect(() => {
    setEditingFieldName(props.fields.name);
  }, [props.fields.name]);

  // Local values for placeholder and help text
  const [localPlaceholder, setLocalPlaceholder] = useState<string>(props.fields.placeholder || '');
  const [localHelpText, setLocalHelpText] = useState<string>(props.fields.helptext || '');

  // Debounced values
  const [debouncedPlaceholder] = useDebouncedValue(localPlaceholder, 500);
  const [debouncedHelpText] = useDebouncedValue(localHelpText, 500);

  const fieldTypesFiltered =
    props.fields.field === 'file' ? fieldTypes : fieldTypes.filter((type) => type.value !== 'file');
  const onFailOptions = [
    {
      value: 'spam',
      label: t('specField.onFail.spam'),
    },
    {
      value: 'trash',
      label: t('specField.onFail.trash'),
    },
    {
      value: 'reject',
      label: t('specField.onFail.reject'),
    },
    {
      value: 'pass',
      label: t('specField.onFail.pass'),
    },
  ];

  useEffect(() => {
    if (
      props.fields.field === 'select' ||
      props.fields.field === 'radio' ||
      props.fields.field === 'checkbox'
    ) {
      setHasOptions(true);
    } else {
      setHasOptions(false);
    }
    if (
      props.fields.field === 'text' ||
      props.fields.field === 'textarea' ||
      props.fields.field === 'number' ||
      props.fields.field === 'date' ||
      props.fields.field === 'email' ||
      props.fields.field === 'url' ||
      props.fields.field === 'tel'
    ) {
      setIsInputField(true);
    } else {
      setIsInputField(false);
    }
  }, [props.fields.field]);

  useEffect(() => {
    if (props.fields.options) {
      setOptionsArray(
        props.fields.options
          .split(',')
          .map((option) => option.trim())
          .filter(Boolean)
      );
    } else {
      setOptionsArray([]);
    }
  }, [props.fields.options]);

  // Effect to handle debounced placeholder changes
  useEffect(() => {
    if (debouncedPlaceholder !== props.fields.placeholder) {
      props.onChange({ fieldName, fieldKey: 'placeholder', value: debouncedPlaceholder });
    }
  }, [debouncedPlaceholder, props.fields.placeholder, fieldName, props.onChange]);

  // Effect to handle debounced help text changes
  useEffect(() => {
    if (debouncedHelpText !== props.fields.helptext) {
      props.onChange({ fieldName, fieldKey: 'helptext', value: debouncedHelpText });
    }
  }, [debouncedHelpText, props.fields.helptext, fieldName, props.onChange]);

  const handleAddOption = () => {
    if (newOption && !optionsArray.includes(newOption)) {
      const updatedOptions = [...optionsArray, newOption];
      props.onChange({
        fieldName,
        fieldKey: 'options',
        value: updatedOptions.join(','),
      });
      setNewOption('');
    }
  };

  const handleRemoveOption = (optionToRemove: string) => {
    const updatedOptions = optionsArray.filter((option) => option !== optionToRemove);
    props.onChange({
      fieldName,
      fieldKey: 'options',
      value: updatedOptions.join(','),
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && newOption) {
      event.preventDefault();
      handleAddOption();
    }
  };

  const handleFieldNameChange = (newName: string) => {
    const sanitizedName = newName.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    setEditingFieldName(sanitizedName);
  };

  const handleFieldNameBlur = () => {
    if (editingFieldName !== props.fields.name) {
      // First update the field's name property
      props.onChange({ fieldName, fieldKey: 'name', value: editingFieldName });

      // Then trigger field name change to update the object key
      if (props.onFieldNameChange) {
        props.onFieldNameChange({
          oldFieldName: fieldName,
          newFieldName: editingFieldName,
        });
      }
    }
  };

  return (
    <ScrollArea>
      <Stack gap="md">
        <Box>
          <Stack gap="sm">
            <TextInput
              label={t('specField.labelField')}
              placeholder={t('specField.labelPlaceholder')}
              value={props.fields.label}
              onChange={(event) =>
                props.onChange({ fieldName, fieldKey: 'label', value: event.currentTarget.value })
              }
              required
            />

            {hasOptions && (
              <PillsInput
                label={t('specField.options')}
                description={t('specField.optionsDescription')}
                required
              >
                <Pill.Group>
                  {optionsArray.map((option, index) => (
                    <Pill key={index} withRemoveButton onRemove={() => handleRemoveOption(option)}>
                      {option}
                    </Pill>
                  ))}
                  <PillsInput.Field
                    placeholder={t('specField.addOptionPlaceholder')}
                    value={newOption}
                    onChange={(e) => setNewOption(e.currentTarget.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => newOption && handleAddOption()}
                  />
                </Pill.Group>
              </PillsInput>
            )}

            <TextInput
              label={t('specField.fieldName')}
              placeholder={t('specField.fieldNamePlaceholder')}
              value={editingFieldName}
              onChange={(event) => handleFieldNameChange(event.currentTarget.value)}
              onBlur={handleFieldNameBlur}
              description={t('specField.fieldNameDescription')}
              required
              size="xs"
            />

            <NativeSelect
              label={t('specField.fieldType')}
              value={props.fields.field}
              data={fieldTypesFiltered}
              onChange={(event) => {
                const newFieldType = event.currentTarget.value;
                // Update field type
                props.onChange({ fieldName, fieldKey: 'field', value: newFieldType });

                // Automatically set validation flags based on field type
                if (newFieldType === 'email') {
                  props.onChange({ fieldName, fieldKey: 'is_email', value: true });
                  props.onChange({ fieldName, fieldKey: 'is_url', value: undefined });
                } else if (newFieldType === 'url') {
                  props.onChange({ fieldName, fieldKey: 'is_url', value: true });
                  props.onChange({ fieldName, fieldKey: 'is_email', value: undefined });
                } else {
                  // Clear validation flags for other field types
                  props.onChange({ fieldName, fieldKey: 'is_email', value: undefined });
                  props.onChange({ fieldName, fieldKey: 'is_url', value: undefined });
                }
              }}
              // disabled={props.fields.field === 'file'}
              disabled={true}
              required
              size="xs"
            />

            {isInputField && (
              <TextInput
                label={t('specField.placeholder')}
                placeholder={t('specField.placeholderDescription')}
                value={localPlaceholder}
                onChange={(event) => setLocalPlaceholder(event.currentTarget.value)}
                size="xs"
              />
            )}

            <TextInput
              label={t('specField.helpText')}
              placeholder={t('specField.helpTextPlaceholder')}
              value={localHelpText}
              onChange={(event) => setLocalHelpText(event.currentTarget.value)}
              size="xs"
            />
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Text size="sm" fw="bold" mb="sm">
            {t('specField.validation')}
          </Text>

          <Stack gap="sm">
            <Box>
              <ValidationGroup
                value={props.fields.required}
                label={t('specField.required')}
                fieldKey="required"
                fieldName={fieldName}
                onChange={props.onChange}
                description={t('specField.requiredDescription')}
              />
            </Box>

            <Button
              variant="subtle"
              size="sm"
              leftSection={
                showMoreOptions ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />
              }
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              mt="sm"
            >
              {t('specField.moreOptionsAndPreview')}
            </Button>

            <Collapse in={showMoreOptions}>
              <Stack gap="sm" mt="sm">
                <Box>
                  <NativeSelect
                    label={t('specField.onValidationFailure')}
                    value={props.fields.on_fail}
                    data={onFailOptions}
                    onChange={(event) =>
                      props.onChange({
                        fieldName,
                        fieldKey: 'on_fail',
                        value: event.currentTarget.value,
                      })
                    }
                    disabled={props.fields.field === 'file'}
                    description={t('specField.onValidationFailureDescription')}
                  />
                </Box>

                <Box>
                  <ValidationGroup
                    value={props.fields.check_spam}
                    label={t('specField.checkSpam')}
                    fieldKey="check_spam"
                    fieldName={fieldName}
                    onChange={props.onChange}
                    description={t('specField.checkSpamDescription')}
                  />
                </Box>

                <Divider />

                <Box>
                  {renderHtmlFormFieldPreview({ formField: props.fields })}

                  <Text size="xs" mt="sm" c="gray">
                    {t('specField.optionsNote')}
                  </Text>
                </Box>
              </Stack>
            </Collapse>
          </Stack>
        </Box>
      </Stack>
    </ScrollArea>
  );
}
