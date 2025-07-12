import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Code,
  Group,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { IconAlertCircle, IconDeviceFloppy, IconX } from '@tabler/icons-react';
import { parseTomlToFormSpec } from '../../lib/form-specs';
import { validateTemplateString } from '../../lib/template-validation';

export interface AutoResponseProps {
  isBusy: boolean;
  hasError: string;
  submitCb: () => Promise<void>;
  form: UseFormReturnType<{
    title: string;
    filter_spam: boolean;
    check_challenge: boolean;
    check_specs: boolean;
    specs: string;
    redirect_url: string;
    auto_response_enabled: boolean;
    auto_response_subject: string | null;
    auto_response_text: string | null;
  }>;
  hasUnsavedChanges: boolean;
  onCancel: () => void;
  hasEmailRecipients?: boolean;
}

export function AutoResponse(props: AutoResponseProps) {
  // Parse form specs to get available fields
  const formSpec =
    props.form.values.specs && props.form.values.specs.trim() !== ''
      ? parseTomlToFormSpec(props.form.values.specs)
      : null;

  const hasFormSpec =
    formSpec !== null && formSpec.fields && Object.keys(formSpec.fields).length > 0;

  // Dynamic template variables based on form spec
  const availableVariables = hasFormSpec
    ? Object.entries(formSpec.fields).map(([fieldName, field]) => ({
        name: fieldName,
        description: field.label || `Field: ${fieldName}`,
      }))
    : [
        { name: 'name', description: "Submitter's name" },
        { name: 'email', description: "Submitter's email address" },
        { name: 'message', description: 'Message content' },
        { name: 'company', description: 'Company/organization name' },
        { name: 'phone', description: 'Phone number' },
        { name: 'subject', description: 'Subject or topic' },
      ];

  // Dynamic template examples based on available variables
  const templateExamples = hasFormSpec
    ? [
        `Hello {{ ${availableVariables[0]?.name || 'name'} | "there" }}, thank you for your message!`,
        availableVariables.length > 1
          ? `Hi {{ ${availableVariables[0]?.name || 'name'} | "friend" }}, we received your ${availableVariables[1]?.name ? `{{ ${availableVariables[1].name} | "inquiry" }}` : 'message'}.`
          : `Thank you {{ ${availableVariables[0]?.name || 'name'} | "there" }} for reaching out!`,
        availableVariables.length > 2
          ? `Thank you {{ ${availableVariables[0]?.name || 'name'} | "there" }} for your {{ ${availableVariables[2]?.name} | "submission" }}. We'll get back to you soon!`
          : `We appreciate your contact and will respond promptly.`,
      ].filter((example) => example.length > 10) // Filter out very short examples
    : [
        'Hello {{ name | "there" }}, thank you for your message!',
        'Hi {{ name | "friend" }}, we received your inquiry about {{ subject | "our services" }}.',
        'Thank you {{ name | "there" }} for contacting {{ company | "us" }}! We\'ll respond to {{ email | "you" }} within 24 hours.',
      ];

  const captchaRequired = !props.form.values.check_challenge;
  const noEmailRecipients = !props.hasEmailRecipients;

  // Check if an email field exists in the form spec
  const hasEmailField =
    hasFormSpec &&
    Object.values(formSpec.fields).some(
      (field) => field.field === 'email' || field.name.toLowerCase().includes('email')
    );

  // Validate template syntax in real-time
  const textTemplateValidation = props.form.values.auto_response_text
    ? validateTemplateString(props.form.values.auto_response_text)
    : { isValid: true, errors: [], warnings: [] };

  const titleTemplateValidation = props.form.values.auto_response_subject
    ? validateTemplateString(props.form.values.auto_response_subject)
    : { isValid: true, errors: [], warnings: [] };

  const autoResponseDisabled = captchaRequired || noEmailRecipients;

  return (
    <>
      <form
        onSubmit={props.form.onSubmit(() => {
          props.submitCb();
        })}
      >
        <Stack gap="md">
          {captchaRequired && (
            <Alert icon={<IconAlertCircle size={16} />} title="Captcha Required" color="orange">
              Auto-response requires captcha to be enabled for security. Please enable captcha in
              the General settings first.
            </Alert>
          )}

          {noEmailRecipients && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Email Recipients Required"
              color="orange"
            >
              Auto-response requires at least one email notification recipient to be configured.
              Please add email recipients in the Email Notifications section first.
            </Alert>
          )}

          {props.form.values.check_specs && hasFormSpec && !hasEmailField && (
            <Alert icon={<IconAlertCircle size={16} />} title="Email Field Required" color="red">
              Auto-responses need an email field to know where to send the message. Please add an
              email field to your form specification.
            </Alert>
          )}

          {!props.form.values.check_specs && (
            <Alert icon={<IconAlertCircle size={16} />} title="Email Field Important" color="blue">
              Make sure your form includes an <Code>email</Code> field so auto-responses can be sent
              to the right address.
            </Alert>
          )}

          <Checkbox
            label="Enable Auto-Response"
            description="Send automated responses to form submitters"
            checked={props.form.values.auto_response_enabled}
            onChange={(event) =>
              props.form.setFieldValue('auto_response_enabled', event.currentTarget.checked)
            }
            disabled={autoResponseDisabled}
          />

          {props.form.values.auto_response_enabled && (
            <Box>
              <TextInput
                label="Auto-Response Email Subject"
                placeholder={`Thank you for your message - {{ name | "Valued Customer" }}`}
                value={props.form.values.auto_response_subject || ''}
                onChange={(event) =>
                  props.form.setFieldValue('auto_response_subject', event.currentTarget.value)
                }
                error={props.form.errors.auto_response_subject}
                description="Subject line for the auto-response email (supports template variables)"
                required
                mb="md"
              />

              {/* Title template validation alerts */}
              {props.form.values.auto_response_subject &&
                titleTemplateValidation.errors.length > 0 && (
                  <Alert icon={<IconAlertCircle size={16} />} color="red" mt="xs" mb="md">
                    <Text size="sm" fw={500} mb="xs">
                      Subject Template Syntax Errors:
                    </Text>
                    {titleTemplateValidation.errors.map((error, index) => (
                      <Text key={index} size="xs">
                        • {error}
                      </Text>
                    ))}
                  </Alert>
                )}

              {props.form.values.auto_response_subject &&
                titleTemplateValidation.warnings.length > 0 &&
                titleTemplateValidation.errors.length === 0 && (
                  <Alert icon={<IconAlertCircle size={16} />} color="yellow" mt="xs" mb="md">
                    <Text size="sm" fw={500} mb="xs">
                      Subject Template Suggestions:
                    </Text>
                    {titleTemplateValidation.warnings.map((warning, index) => (
                      <Text key={index} size="xs">
                        • {warning}
                      </Text>
                    ))}
                  </Alert>
                )}

              <Textarea
                label="Auto-Response Message"
                placeholder={`Hello {{ name | "there" }},

Thank you for contacting us! We've received your message and appreciate you reaching out.

If you have any urgent questions, please don't hesitate to call us directly.

Best regards,
The Support Team`}
                value={props.form.values.auto_response_text || ''}
                onChange={(event) =>
                  props.form.setFieldValue('auto_response_text', event.currentTarget.value)
                }
                error={props.form.errors.auto_response_text}
                rows={8}
                description="Message sent to form submitters (supports template variables)"
              />

              {/* Template validation alerts */}
              {props.form.values.auto_response_text && textTemplateValidation.errors.length > 0 && (
                <Alert icon={<IconAlertCircle size={16} />} color="red" mt="xs">
                  <Text size="sm" fw={500} mb="xs">
                    Message Template Syntax Errors:
                  </Text>
                  {textTemplateValidation.errors.map((error, index) => (
                    <Text key={index} size="xs">
                      • {error}
                    </Text>
                  ))}
                </Alert>
              )}

              {props.form.values.auto_response_text &&
                textTemplateValidation.warnings.length > 0 &&
                textTemplateValidation.errors.length === 0 && (
                  <Alert icon={<IconAlertCircle size={16} />} color="yellow" mt="xs">
                    <Text size="sm" fw={500} mb="xs">
                      Message Template Suggestions:
                    </Text>
                    {textTemplateValidation.warnings.map((warning, index) => (
                      <Text key={index} size="xs">
                        • {warning}
                      </Text>
                    ))}
                  </Alert>
                )}

              <Card withBorder mt="md" p="sm">
                <Title order={5} size="sm" mb="xs">
                  Template Variables
                </Title>
                <Text size="xs" mb="sm" c="dimmed">
                  Use these variables in your message. Provide fallback text after the | symbol.
                </Text>

                {hasFormSpec ? (
                  <Alert icon={<IconAlertCircle size={14} />} color="blue" mb="sm">
                    <Text size="xs">
                      These variables are based on your form fields. Each field in your form
                      specification can be used as a template variable.
                    </Text>
                  </Alert>
                ) : (
                  <Alert icon={<IconAlertCircle size={14} />} color="yellow" mb="sm">
                    <Text size="xs">
                      These are example variables. Define form fields in the "Form Fields" section
                      to see your actual available variables here.
                    </Text>
                  </Alert>
                )}

                <Stack gap="xs">
                  {availableVariables.map((variable) => (
                    <Group key={variable.name} gap="xs">
                      <Code>{`{{ ${variable.name} | "fallback" }}`}</Code>
                      <Text size="xs" c="dimmed">
                        {variable.description}
                      </Text>
                    </Group>
                  ))}
                </Stack>

                <Title order={6} size="xs" mt="md" mb="xs">
                  Example Subject Templates:
                </Title>
                <Stack gap="xs" mb="md">
                  <Code block>{`Thank you for your message - {{ name | "Valued Customer" }}`}</Code>
                  <Code
                    block
                  >{`Re: {{ subject | "Your inquiry" }} - We've received your message`}</Code>
                  <Code
                    block
                  >{`{{ company | "Our Team" }} - Confirmation of your submission`}</Code>
                </Stack>

                <Title order={6} size="xs" mt="md" mb="xs">
                  {hasFormSpec
                    ? 'Example Message Templates (using your form fields):'
                    : 'Example Message Templates:'}
                </Title>
                {templateExamples.map((example, index) => (
                  <Box key={index} mb="xs">
                    <Code block>{example}</Code>
                  </Box>
                ))}
              </Card>

              {props.form.values.auto_response_text &&
                props.form.values.auto_response_text.length > 1800 && (
                  <Alert icon={<IconAlertCircle size={16} />} color="yellow" mt="xs">
                    Message is getting long ({props.form.values.auto_response_text.length}/2000
                    characters). Consider keeping it concise for better delivery.
                  </Alert>
                )}
            </Box>
          )}

          {props.hasError && (
            <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
              {props.hasError}
            </Alert>
          )}

          {props.hasUnsavedChanges && (
            <Group justify="flex-end">
              <Button variant="outline" onClick={props.onCancel} leftSection={<IconX size={16} />}>
                Cancel
              </Button>
              <Button
                type="submit"
                loading={props.isBusy}
                leftSection={<IconDeviceFloppy size={16} />}
              >
                Save Changes
              </Button>
            </Group>
          )}
        </Stack>
      </form>
    </>
  );
}
