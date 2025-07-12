import { Text, Stack, Accordion, Group, ThemeIcon, Alert, Card, Grid, Code } from '@mantine/core';
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

export function Docs() {
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
                <Text fw={500}>What is Formshive?</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  Learn the basics of Formshive
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>
                Formshive is a simple tool that helps you create web forms and collect submissions
                from your website visitors. Think of it like a digital mailbox - people fill out
                your forms, and you receive their messages.
              </Text>

              <Alert icon={<IconInfoCircle size={16} />} title="Key Benefits" color="blue">
                <Text size="sm">
                  • No coding required for basic forms
                  <br />
                  • Multiple ways to integrate with your website
                  <br />
                  • Automatic spam protection
                  <br />• Email notifications when someone submits
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
                <Text fw={500}>Forms With & Without Fields</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  Understanding how Formshive handles different types of forms
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="lg">
              <div>
                <Text fw={500} mb="xs">
                  Forms WITH Fields (Structured)
                </Text>
                <Text size="sm" mb="md">
                  When you define specific fields (like "Name", "Email", "Message"), Formshive knows
                  exactly what to expect. This gives you more features like validation, required
                  fields, and prettier form layouts.
                </Text>
                <Card withBorder p="sm" bg="green.0">
                  <Text size="sm" fw={500} mb="xs">
                    ✅ Benefits:
                  </Text>
                  <Text size="xs">
                    • Professional-looking forms
                    <br />
                    • Email validation
                    <br />
                    • Required field checking
                    <br />
                    • Dropdown menus and checkboxes
                    <br />• Better spam protection
                  </Text>
                </Card>
              </div>

              <div>
                <Text fw={500} mb="xs">
                  Forms WITHOUT Fields (Flexible)
                </Text>
                <Text size="sm" mb="md">
                  You can also create a form that accepts ANY content - whatever someone sends,
                  you'll receive. This is perfect for simple contact forms or when you want maximum
                  flexibility.
                </Text>
                <Card withBorder p="sm" bg="yellow.0">
                  <Text size="sm" fw={500} mb="xs">
                    ⚡ Best for:
                  </Text>
                  <Text size="xs">
                    • Quick contact forms
                    <br />
                    • Existing HTML forms
                    <br />
                    • When you need maximum flexibility
                    <br />• Simple feedback collection
                  </Text>
                </Card>
              </div>
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
                <Text fw={500}>Integration Methods</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  Different ways to add forms to your website
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="lg">
              <Text>
                Formshive offers several ways to integrate forms into your website, from simple
                copy-paste solutions to advanced customization.
              </Text>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="md" radius="sm">
                    <Group mb="sm">
                      <IconCode size={20} />
                      <Text fw={500} size="sm">
                        Manual HTML
                      </Text>
                    </Group>
                    <Text size="xs" mb="sm">
                      Write your own HTML form and point it to Formshive. Perfect if you're
                      comfortable with HTML or have an existing form.
                    </Text>
                    <Code block>
                      {`<form action="your-form-url" method="POST">
  <input name="email" type="email">
  <button type="submit">Send</button>
</form>`}
                    </Code>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="md" radius="sm">
                    <Group mb="sm">
                      <IconBox size={20} />
                      <Text fw={500} size="sm">
                        JavaScript Embed
                      </Text>
                    </Group>
                    <Text size="xs" mb="sm">
                      Add a small script to your website and Formshive creates the form
                      automatically. Works great with defined fields.
                    </Text>
                    <Code block>
                      {`<div id="formshive" form-id="your-id">
</div>
<script src="formshive-embed.js">
</script>`}
                    </Code>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="md" radius="sm">
                    <Group mb="sm">
                      <IconFrame size={20} />
                      <Text fw={500} size="sm">
                        IFrame
                      </Text>
                    </Group>
                    <Text size="xs" mb="sm">
                      Embed a complete form as a frame on your page. Easy to add, works everywhere,
                      with different styling options.
                    </Text>
                    <Code block>
                      {`<iframe 
  src="your-form-url"
  width="100%" height="350">
</iframe>`}
                    </Code>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="md" radius="sm">
                    <Group mb="sm">
                      <IconLink size={20} />
                      <Text fw={500} size="sm">
                        Direct Link
                      </Text>
                    </Group>
                    <Text size="xs" mb="sm">
                      Share a direct link to your form. Great for emails, social media, or when you
                      want a standalone form page.
                    </Text>
                    <Code block>
                      {`https://formshive.com/link.html
?form_id=your-form-id
&title=Contact%20Us`}
                    </Code>
                  </Card>
                </Grid.Col>
              </Grid>

              <Alert
                icon={<IconInfoCircle size={16} />}
                title="Which method should I choose?"
                color="violet"
              >
                <Text size="sm">
                  <strong>Beginners:</strong> Start with IFrame or Direct Link - they're the
                  easiest!
                  <br />
                  <strong>Existing forms:</strong> Use Manual HTML to keep your current design
                  <br />
                  <strong>Advanced users:</strong> JavaScript Embed gives you the most flexibility
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
                <Text fw={500}>Email Recipients</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  Getting notified when someone submits your form
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>
                When someone fills out your form, Formshive can send you an email notification. You
                can add multiple email addresses to receive these notifications.
              </Text>

              <Alert
                icon={<IconInfoCircle size={16} />}
                title="Email Verification Required"
                color="orange"
              >
                <Text size="sm">
                  For security, you'll need to verify your email address before you can receive form
                  submissions. This prevents spam and ensures you actually own the email address.
                </Text>
              </Alert>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  How it works:
                </Text>
                <Text size="sm">
                  1. <strong>Add your email:</strong> Enter the email address where you want to
                  receive notifications
                  <br />
                  2. <strong>Check your inbox:</strong> Look for a verification email from Formshive
                  <br />
                  3. <strong>Click to verify:</strong> Click the verification link in the email
                  <br />
                  4. <strong>You're ready!</strong> Start receiving form submissions immediately
                </Text>
              </Card>

              <div>
                <Text fw={500} size="sm" mb="xs">
                  Multiple Recipients
                </Text>
                <Text size="sm">
                  You can add multiple verified email addresses to a single form. This is great for
                  teams where multiple people need to see form submissions.
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
                <Text fw={500}>CAPTCHA Setup</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  Protect your forms from spam and bots
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>
                CAPTCHA is like a security guard for your forms. It helps block spam messages and
                ensures that real people are filling out your forms, not automated bots.
              </Text>

              <Alert icon={<IconInfoCircle size={16} />} title="How CAPTCHA Works" color="blue">
                <Text size="sm">
                  When someone tries to submit your form, they'll need to solve a simple math
                  problem. This takes just a few seconds for humans but stops most spam bots
                  completely.
                </Text>
              </Alert>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  Setting up CAPTCHA (3 easy steps):
                </Text>
                <Text size="sm">
                  1. <strong>Enable CAPTCHA:</strong> Go to your form settings and turn on "Check
                  Challenge"
                  <br />
                  2. <strong>Update your website:</strong> Your website needs a small script to show
                  the CAPTCHA
                  <br />
                  3. <strong>Test it:</strong> Try submitting your form to make sure it works
                </Text>
              </Card>

              <div>
                <Text fw={500} size="sm" mb="xs">
                  Benefits of Using CAPTCHA:
                </Text>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card withBorder p="sm" bg="green.0">
                      <Text size="xs">
                        ✅ <strong>Blocks spam:</strong> Dramatically reduces unwanted messages
                        <br />✅ <strong>No tracking:</strong> Privacy-friendly and GDPR compliant
                        <br />✅ <strong>Free to use:</strong> No extra charges for blocked spam
                      </Text>
                    </Card>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card withBorder p="sm" bg="blue.0">
                      <Text size="xs">
                        ⚡ <strong>Quick for users:</strong> Takes just 2-3 seconds to complete
                        <br />⚡ <strong>Works everywhere:</strong> Compatible with all integration
                        methods
                        <br />⚡ <strong>Always improving:</strong> Automatically updated for better
                        protection
                      </Text>
                    </Card>
                  </Grid.Col>
                </Grid>
              </div>

              <Alert icon={<IconInfoCircle size={16} />} title="Need Technical Help?" color="red">
                <Text size="sm">
                  For detailed setup instructions and code examples, check the{' '}
                  <strong>Integration</strong> tab when editing your form. It has all the technical
                  details and copy-paste code you need.
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
                <Text fw={500}>Field Configuration</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  Customizing your form fields
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>
                When you create forms with defined fields, you can customize each field to behave
                exactly how you want.
              </Text>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder p="sm">
                    <Text fw={500} size="sm" mb="xs">
                      Field Types Available:
                    </Text>
                    <Text size="xs">
                      • <strong>Text:</strong> Single line text input
                      <br />• <strong>Email:</strong> Email with automatic validation
                      <br />• <strong>Textarea:</strong> Multi-line text for longer messages
                      <br />• <strong>Number:</strong> Only accepts numbers
                      <br />• <strong>Phone:</strong> Phone number input
                      <br />• <strong>URL:</strong> Website links with validation
                      <br />• <strong>Date:</strong> Date picker
                      <br />• <strong>Select:</strong> Dropdown menu
                      <br />• <strong>Radio:</strong> Choose one option
                      <br />• <strong>Checkbox:</strong> Multiple selections
                    </Text>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder p="sm">
                    <Text fw={500} size="sm" mb="xs">
                      Validation Options:
                    </Text>
                    <Text size="xs">
                      • <strong>Required fields:</strong> Must be filled out
                      <br />• <strong>Email validation:</strong> Checks for valid email format
                      <br />• <strong>URL validation:</strong> Ensures proper web links
                      <br />• <strong>Custom options:</strong> For dropdowns and selections
                      <br />• <strong>Help text:</strong> Instructions for users
                      <br />• <strong>Placeholders:</strong> Example text in fields
                    </Text>
                  </Card>
                </Grid.Col>
              </Grid>

              <Alert icon={<IconInfoCircle size={16} />} title="Pro Tip" color="teal">
                <Text size="sm">
                  Start simple with just a few fields like Name, Email, and Message. You can always
                  add more fields later as your needs grow!
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
                <Text fw={500}>Programmatic Field Configuration (TOML)</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  Advanced form configuration using code
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Alert
                icon={<IconInfoCircle size={16} />}
                title="For Advanced Users Only"
                color="grape"
              >
                <Text size="sm">
                  This section is for developers and advanced users who prefer to configure forms
                  using code. If you're comfortable with the visual form builder, you can skip this
                  section entirely.
                </Text>
              </Alert>

              <Text>
                Instead of using the visual form builder, you can define your form fields using TOML
                configuration. This gives you more precise control and makes it easier to version
                control your form specifications. TOML (Tom's Obvious, Minimal Language) is a simple
                configuration format that lets you define form fields, validation rules, and
                behavior using structured text instead of clicking through menus.
              </Text>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  Basic Example:
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
                      Field Types Available:
                    </Text>
                    <Text size="xs">
                      • <strong>text:</strong> Single line text input
                      <br />• <strong>email:</strong> Email with validation
                      <br />• <strong>textarea:</strong> Multi-line text area
                      <br />• <strong>select:</strong> Dropdown menu
                      <br />• <strong>checkbox:</strong> Multiple choice options
                      <br />• <strong>number:</strong> Numeric input
                    </Text>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder p="sm">
                    <Text fw={500} size="sm" mb="xs">
                      Validation Options:
                    </Text>
                    <Text size="xs">
                      • <strong>required:</strong> Field must be filled
                      <br />• <strong>is_email:</strong> Validates email format
                      <br />• <strong>is_min:</strong> Minimum length/value
                      <br />• <strong>is_max:</strong> Maximum length/value
                      <br />• <strong>options:</strong> Valid choices for select/checkbox
                      <br />• <strong>check_spam:</strong> Enable spam detection
                    </Text>
                  </Card>
                </Grid.Col>
              </Grid>

              <div>
                <Text fw={500} size="sm" mb="xs">
                  Benefits of TOML Configuration:
                </Text>
                <Card withBorder p="sm" bg="grape.0">
                  <Text size="xs">
                    ✨ <strong>Version Control:</strong> Track changes to your forms over time
                    <br />✨ <strong>Reusable:</strong> Copy configurations between forms easily
                    <br />✨ <strong>Precise Control:</strong> Fine-tune validation and behavior
                    <br />✨ <strong>Team Collaboration:</strong> Share form specs without account
                    access
                    <br />✨ <strong>Advanced Features:</strong> Access to all validation options
                  </Text>
                </Card>
              </div>

              <Alert icon={<IconInfoCircle size={16} />} title="Getting Started" color="grape">
                <Text size="sm">
                  To use TOML configuration, go to your form's{' '}
                  <strong>Form Fields (Optional)</strong> section and paste your TOML specification
                  into the text area. The system will validate your configuration and show any
                  errors that need to be fixed.
                </Text>
              </Alert>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}
