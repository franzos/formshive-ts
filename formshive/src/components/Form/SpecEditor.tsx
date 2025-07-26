import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Title,
  Grid,
  Stack,
  Group,
  Text,
  ActionIcon,
  Paper,
  ScrollArea,
} from '@mantine/core';
import {
  IconBorderBottom,
  IconCalendar,
  IconCalendarCheck,
  IconCheckbox,
  IconFileText,
  IconForms,
  IconLink,
  IconNumber,
  IconPhone,
  IconRadio,
  IconRecordMail,
  IconSelect,
  IconTrash,
  IconGripVertical,
  IconSettings,
  IconShield,
} from '@tabler/icons-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  FormSpecFieldChange,
  FormSpecSettingsChange,
  FormSpecFieldNameChange,
  SpecField,
} from './SpecField';
import { FormField, FormSpec, dumpFormSpecToToml, parseTomlToFormSpec } from '../../lib/form-specs';
import { sanitizeFieldName } from '../../lib/sanitize-field';
import { renderInputField } from '../../lib/form-spec-to-html';
import { useTranslation } from 'react-i18next';

export interface SpecEditorProps {
  spec?: string;
  onChange: (spec: string) => void;
}

interface FieldTypeButton {
  type: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

// This will be populated in the component since we need access to t()
let fieldTypeButtons: FieldTypeButton[] = [];

interface SortableFieldItemProps {
  fieldKey: string;
  field: FormField;
  isSelected: boolean;
  hasError: boolean;
  onSelect: (key: string | null, trigger: string) => void;
  onDelete: (key: string) => void;
  fieldIcon: (field: FormField) => React.ReactNode;
}

function SortableFieldItem({
  fieldKey,
  field,
  isSelected,
  hasError,
  onSelect,
  onDelete,
}: SortableFieldItemProps) {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: fieldKey,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Paper
      ref={setNodeRef}
      style={{
        ...style,
        cursor: 'pointer',
        backgroundColor: isSelected ? 'var(--mantine-color-blue-0)' : undefined,
        borderColor: isSelected
          ? 'var(--mantine-color-blue-3)'
          : hasError
            ? 'var(--mantine-color-red-3)'
            : undefined,
      }}
      p="sm"
      withBorder
      onClick={() => onSelect(isSelected ? null : fieldKey, 'fieldClick')}
    >
      <Group gap="xs" align="flex-start">
        <Box
          {...attributes}
          {...listeners}
          style={{ cursor: 'grab', display: 'flex', alignItems: 'center' }}
        >
          <IconGripVertical size={16} style={{ color: 'var(--mantine-color-gray-5)' }} />
        </Box>

        {/* Field Preview */}
        <Box
          style={{
            flex: 1,
            fontSize: '12px',
            overflow: 'hidden',
            transform: 'scale(0.85)',
            transformOrigin: 'top left',
          }}
          onClick={(e) => e.stopPropagation()} // Prevent triggering field selection
        >
          <Box
            className="rusty-form"
            dangerouslySetInnerHTML={{ __html: renderInputField(field) }}
            style={{
              pointerEvents: 'none', // Disable interactions in preview
            }}
          />
        </Box>
        <ActionIcon
          variant="subtle"
          color="red"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(fieldKey);
          }}
        >
          <IconTrash size={14} />
        </ActionIcon>
      </Group>

      <Box>
        <Group gap="xs">
          {field.check_spam && (
            <IconShield
              size={14}
              style={{ color: 'var(--mantine-color-blue-6)' }}
              title={t('specField.checkSpam')}
            />
          )}
          {hasError && (
            <Text size="xs" c="red">
              {t('formSpec.editor.optionsRequired')}
            </Text>
          )}
        </Group>
      </Box>
    </Paper>
  );
}

export interface FieldSettingsProps {
  spec: FormSpec;
  selectedFieldKey: string;
  onChange: (change: FormSpecFieldChange) => void;
  onDelete: (fieldName: string) => void;
  onFieldNameChange: (change: FormSpecFieldNameChange) => void;
  style?: React.CSSProperties;
}

const FieldSettings = ({
  spec,
  selectedFieldKey,
  onChange,
  onDelete,
  onFieldNameChange,
  style,
}: FieldSettingsProps) => {
  const { t } = useTranslation();

  return (
    <Card withBorder h="100%" p="md" style={style}>
      <Group justify="space-between" mb="md">
        <Title order={4}>{t('formSpec.editor.fieldSettings')}</Title>
        {selectedFieldKey && <IconSettings size={16} />}
      </Group>

      <SpecField
        fieldKey={selectedFieldKey}
        fields={spec.fields[selectedFieldKey]}
        onChange={onChange}
        onDelete={onDelete}
        onFieldNameChange={onFieldNameChange}
      />
    </Card>
  );
};

export interface GlobalSettingsProps {
  spec: FormSpec | null;
  onSettingsChange: (change: FormSpecSettingsChange) => void;
  style?: React.CSSProperties;
}

const GlobalSettings = ({ spec, onSettingsChange, style }: GlobalSettingsProps) => {
  const { t } = useTranslation();

  return (
    <Card withBorder h="100%" p="md" style={style}>
      <Group justify="space-between" mb="md">
        <Title order={4}>{t('formSpec.editor.formSettings')}</Title>
      </Group>
      <Text size="sm" mb="md" c="dimmed">
        {t('formSpec.editor.selectFieldToEdit')}
      </Text>

      <Title order={4} mb="md">
        {t('formSpec.editor.globalSettings')}
      </Title>
      <Checkbox
        label={t('formSpec.editor.discardAdditionalFields')}
        checked={spec?.settings.discard_additional_fields || false}
        onChange={(event) =>
          onSettingsChange({
            fieldKey: 'discard_additional_fields',
            value: event.currentTarget.checked,
          })
        }
        mb="xs"
        description={t('formSpec.editor.discardAdditionalFieldsDescription')}
      />
    </Card>
  );
};

export function VisualSpecEditor(props: SpecEditorProps) {
  const { t } = useTranslation();
  const [spec, setSpec] = useState<FormSpec | null>(null);
  const [hasSpecs, setHasSpecs] = useState(false);
  const [selectedFieldKey, setSelectedFieldKey] = useState<string | null>(null);

  const onSelectField = (key: string | null, trigger: string) => {
    console.log(`Selected field key: ${key} (trigger: ${trigger})`);
    setSelectedFieldKey(key);
  };

  // Initialize fieldTypeButtons with translations
  fieldTypeButtons = [
    {
      type: 'text',
      label: t('formSpec.editor.fieldTypes.text.label'),
      icon: <IconBorderBottom size={15} />,
      description: t('formSpec.editor.fieldTypes.text.description'),
    },
    {
      type: 'email',
      label: t('formSpec.editor.fieldTypes.email.label'),
      icon: <IconRecordMail size={15} />,
      description: t('formSpec.editor.fieldTypes.email.description'),
    },
    {
      type: 'textarea',
      label: t('formSpec.editor.fieldTypes.textarea.label'),
      icon: <IconFileText size={15} />,
      description: t('formSpec.editor.fieldTypes.textarea.description'),
    },
    {
      type: 'number',
      label: t('formSpec.editor.fieldTypes.number.label'),
      icon: <IconNumber size={15} />,
      description: t('formSpec.editor.fieldTypes.number.description'),
    },
    {
      type: 'url',
      label: t('formSpec.editor.fieldTypes.url.label'),
      icon: <IconLink size={15} />,
      description: t('formSpec.editor.fieldTypes.url.description'),
    },
    {
      type: 'tel',
      label: t('formSpec.editor.fieldTypes.tel.label'),
      icon: <IconPhone size={15} />,
      description: t('formSpec.editor.fieldTypes.tel.description'),
    },
    {
      type: 'select',
      label: t('formSpec.editor.fieldTypes.select.label'),
      icon: <IconSelect size={15} />,
      description: t('formSpec.editor.fieldTypes.select.description'),
    },
    {
      type: 'radio',
      label: t('formSpec.editor.fieldTypes.radio.label'),
      icon: <IconRadio size={15} />,
      description: t('formSpec.editor.fieldTypes.radio.description'),
    },
    {
      type: 'checkbox',
      label: t('formSpec.editor.fieldTypes.checkbox.label'),
      icon: <IconCheckbox size={15} />,
      description: t('formSpec.editor.fieldTypes.checkbox.description'),
    },
    {
      type: 'date',
      label: t('formSpec.editor.fieldTypes.date.label'),
      icon: <IconCalendar size={15} />,
      description: t('formSpec.editor.fieldTypes.date.description'),
    },
    {
      type: 'datetime',
      label: t('formSpec.editor.fieldTypes.datetime.label'),
      icon: <IconCalendarCheck size={15} />,
      description: t('formSpec.editor.fieldTypes.datetime.description'),
    },
    {
      type: 'form',
      label: t('formSpec.editor.fieldTypes.form.label'),
      icon: <IconForms size={15} />,
      description: t('formSpec.editor.fieldTypes.form.description'),
    },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!props.spec) {
      return;
    }
    try {
      const parsedSpec = parseTomlToFormSpec(props.spec);
      if (parsedSpec) {
        setSpec(parsedSpec);
        if (parsedSpec.fields) {
          setHasSpecs(true);
          // Auto-select first field if none selected
          if (!selectedFieldKey && Object.keys(parsedSpec.fields).length > 0) {
            onSelectField(Object.keys(parsedSpec.fields)[0], 'initial');
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [props.spec]);

  const onChange: (change: FormSpecFieldChange) => void = (change) => {
    if (spec) {
      const newSpec = { ...spec };
      if (spec.fields[change.fieldName]) {
        console.log(`Changing ${change.fieldName}.${change.fieldKey} to ${change.value}`);
        if (change.value !== undefined) {
          newSpec.fields[change.fieldName][change.fieldKey] = change.value;
          setSpec(newSpec);
          props.onChange(dumpFormSpecToToml(newSpec));
        } else {
          delete newSpec.fields[change.fieldName][change.fieldKey];
          setSpec(newSpec);
          props.onChange(dumpFormSpecToToml(newSpec));
        }
      }
    }
  };

  const onSettingsChange = (change: FormSpecSettingsChange) => {
    if (spec) {
      const newSpec = { ...spec };
      if (spec.settings[change.fieldKey] !== change.value) {
        newSpec.settings[change.fieldKey] = change.value;
        setSpec(newSpec);
        props.onChange(dumpFormSpecToToml(newSpec));
      }
    }
  };

  const createNewField = (fieldType: string) => {
    const fieldLabel = fieldTypeButtons.find((f) => f.type === fieldType)?.label || fieldType;
    const fieldName = sanitizeFieldName(fieldLabel);

    if (spec && spec.fields) {
      // Check if the field already exists
      let finalFieldName = fieldName;
      let counter = 1;
      while (spec.fields[finalFieldName]) {
        finalFieldName = `${fieldName}_${counter}`;
        counter++;
      }

      const newSpec = { ...spec };
      const newField = {
        name: finalFieldName,
        label: fieldLabel,
        field: fieldType,
        placeholder: '',
        helptext: '',
        on_fail: 'pass',
        // Automatically set validation flags for email and URL fields
        ...(fieldType === 'email' && { is_email: true }),
        ...(fieldType === 'url' && { is_url: true }),
      } as FormSpec['fields']['_'];

      newSpec.fields[finalFieldName] = newField;
      setSpec(newSpec);
      props.onChange(dumpFormSpecToToml(newSpec));
      onSelectField(finalFieldName, 'createNewField');
    } else {
      const newSpec = {
        fields: {
          [fieldName]: {
            name: fieldName,
            label: fieldLabel,
            field: fieldType,
            placeholder: '',
            helptext: '',
            on_fail: 'reject',
            // Automatically set validation flags for email and URL fields
            ...(fieldType === 'email' && { is_email: true }),
            ...(fieldType === 'url' && { is_url: true }),
          } as FormSpec['fields']['_'],
        },
        settings: {
          discard_additional_fields: false,
        },
      };
      setSpec(newSpec);
      props.onChange(dumpFormSpecToToml(newSpec));
      onSelectField(fieldName, 'createNewField');
      setHasSpecs(true);
    }
  };

  const onDelete = (fieldName: string) => {
    if (spec) {
      const newSpec = { ...spec };
      delete newSpec.fields[fieldName];
      setSpec(newSpec);
      props.onChange(dumpFormSpecToToml(newSpec));

      // Update selected field if deleted field was selected
      if (selectedFieldKey === fieldName) {
        const remainingFields = Object.keys(newSpec.fields);
        onSelectField(remainingFields.length > 0 ? remainingFields[0] : null, 'onDelete');
      }

      // Update hasSpecs if no fields remain
      if (Object.keys(newSpec.fields).length === 0) {
        setHasSpecs(false);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && spec?.fields) {
      const fieldKeys = Object.keys(spec.fields);
      const oldIndex = fieldKeys.indexOf(active.id as string);
      const newIndex = fieldKeys.indexOf(over?.id as string);

      const newFieldKeys = arrayMove(fieldKeys, oldIndex, newIndex);

      const newFields: FormSpec['fields'] = {};
      newFieldKeys.forEach((key) => {
        newFields[key] = spec.fields[key];
      });

      const newSpec = { ...spec, fields: newFields };
      setSpec(newSpec);
      props.onChange(dumpFormSpecToToml(newSpec));
    }
  };

  const onFieldNameChange = (change: FormSpecFieldNameChange) => {
    if (spec && spec.fields[change.oldFieldName]) {
      // Check if new field name already exists
      if (spec.fields[change.newFieldName] && change.newFieldName !== change.oldFieldName) {
        alert(t('formSpec.editor.fieldNameExists'));
        return;
      }

      const newSpec = { ...spec };
      const field = newSpec.fields[change.oldFieldName];

      // Update the field's name property
      field.name = change.newFieldName;

      // Create new fields object with updated key
      const newFields: FormSpec['fields'] = {};
      Object.keys(newSpec.fields).forEach((key) => {
        if (key === change.oldFieldName) {
          newFields[change.newFieldName] = field;
        } else {
          newFields[key] = newSpec.fields[key];
        }
      });

      newSpec.fields = newFields;
      setSpec(newSpec);
      props.onChange(dumpFormSpecToToml(newSpec));

      // Update selected field key if it was the renamed field
      if (selectedFieldKey === change.oldFieldName) {
        onSelectField(change.newFieldName, 'onFieldNameChange');
      }
    }
  };

  const fieldIcon = (fields: FormField) => {
    const buttonConfig = fieldTypeButtons.find((btn) => btn.type === fields.field);
    return buttonConfig?.icon || <IconBorderBottom size={15} />;
  };

  const fieldWithOptionsWithoutOptions = (fields: FormField) => {
    if (fields.field === 'radio' || fields.field === 'checkbox' || fields.field === 'select') {
      if (!fields.options || fields.options.length < 2) {
        return true;
      }
      return false;
    }
    return false;
  };

  const FieldTypeSelector = () => (
    <Card withBorder h="100%" p="md">
      <Title order={4} mb="md">
        {t('formSpec.editor.addField')}
      </Title>
      <Stack gap="xs">
        {fieldTypeButtons.map((fieldType) => (
          <Button
            key={fieldType.type}
            variant="light"
            leftSection={fieldType.icon}
            onClick={() => createNewField(fieldType.type)}
            fullWidth
            justify="flex-start"
            size="sm"
            styles={{
              inner: {
                justifyContent: 'flex-start',
              },
              label: {
                textAlign: 'left',
                flex: 1,
              },
            }}
          >
            <Stack gap={2} style={{ textAlign: 'left', width: '100%' }}>
              <Text size="sm" fw={500}>
                {fieldType.label}
              </Text>
              <Text size="xs" c="dimmed">
                {fieldType.description}
              </Text>
            </Stack>
          </Button>
        ))}
      </Stack>
    </Card>
  );

  const FieldList = () => (
    <Card withBorder h="100%" p="md">
      <Title order={4} mb="md">
        {t('formSpec.editor.formFields')}
      </Title>
      {hasSpecs && spec?.fields ? (
        <ScrollArea mah={800}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={Object.keys(spec.fields)}
              strategy={verticalListSortingStrategy}
            >
              <Stack gap="xs">
                {Object.keys(spec.fields).map((key) => {
                  const field = spec.fields[key];
                  const isSelected = selectedFieldKey === key;
                  const hasError = fieldWithOptionsWithoutOptions(field);

                  return (
                    <SortableFieldItem
                      key={key}
                      fieldKey={key}
                      field={field}
                      isSelected={isSelected}
                      hasError={hasError}
                      onSelect={onSelectField}
                      onDelete={onDelete}
                      fieldIcon={fieldIcon}
                    />
                  );
                })}
              </Stack>
            </SortableContext>
          </DndContext>
        </ScrollArea>
      ) : (
        <Text c="dimmed" ta="center" py="xl">
          {t('formSpec.editor.noFieldsAdded')}
        </Text>
      )}
    </Card>
  );

  return (
    <Box mb="xl">
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 12, md: 3 }}>
          <FieldTypeSelector />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 12, md: 4 }}>
          <FieldList />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 12, md: 5 }}>
          <GlobalSettings
            spec={spec}
            onSettingsChange={onSettingsChange}
            style={{ display: selectedFieldKey ? 'none' : 'block' }}
          />
          {spec?.fields &&
            Object.keys(spec.fields).map((fieldKey) => (
              <FieldSettings
                key={fieldKey}
                spec={spec}
                selectedFieldKey={fieldKey}
                onChange={onChange}
                onDelete={onDelete}
                onFieldNameChange={onFieldNameChange}
                style={{ display: selectedFieldKey === fieldKey ? 'block' : 'none' }}
              />
            ))}
        </Grid.Col>
      </Grid>
    </Box>
  );
}
