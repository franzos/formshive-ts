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

export interface DocsProps {
  colorScheme?: 'light' | 'dark' | undefined;
}

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

        <Accordion.Item value="form-submission">
          <Accordion.Control>
            <Group wrap="nowrap">
              <ThemeIcon size="lg" radius="xl" color="blue">
                <IconCode size={20} />
              </ThemeIcon>
              <div>
                <Text fw={500}>Form Submission</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  How form submissions work and what happens after users submit
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="lg">
              <Text>
                When someone submits your form, Formshive processes the data through several validation
                steps and then responds based on your form configuration and the type of request.
                \              </Text>

              <Box>
                <Text fw={500} mb="xs">
                  Validation Process
                </Text>
                <Text size="sm" mb="md">
                  Every form submission goes through comprehensive validation to ensure data quality
                  and security. If validation fails, users receive detailed error messages.
                </Text>
                <Card withBorder p="sm" bg="blue.0">
                  <Text size="sm" fw={500} mb="xs">
                    Validation Steps:
                  </Text>
                  <Text size="xs">
                    1. <strong>Form exists:</strong> Verifies the form ID is valid
                    <br />
                    2. <strong>CAPTCHA check:</strong> Validates anti-spam challenge (if enabled)
                    <br />
                    3. <strong>Field validation:</strong> Checks required fields, email format, etc. (if enabled)
                    <br />
                    4. <strong>Spam detection:</strong> Analyzes content for spam patterns (if enabled)
                  </Text>
                </Card>
              </Box>

              <Box>
                <Text fw={500} mb="xs">
                  User-Friendly Error Handling
                </Text>
                <Text size="sm" mb="md">
                  When someone makes a mistake filling out your form, Formshive provides helpful,
                  clear error messages. Instead of losing their work, users see exactly what needs
                  to be fixed, with their original input preserved.
                </Text>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card withBorder p="sm">
                      <Text fw={500} size="sm" mb="xs">
                        HTML Forms (Website Visitors):
                      </Text>
                      <Text size="xs">
                        • See a friendly error page with the form
                        <br />
                        • Their input is preserved - no retyping!
                        <br />
                        • Specific field errors highlighted in red
                        <br />
                        • Clear explanation of what went wrong
                      </Text>
                    </Card>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card withBorder p="sm">
                      <Text fw={500} size="sm" mb="xs">
                        API/JSON Requests (Developers):
                      </Text>
                      <Text size="xs">
                        • Detailed error information in JSON format
                        <br />
                        • Field-specific error codes and messages
                        <br />
                        • Machine-readable for custom error handling
                        <br />
                        • Perfect for dynamic forms and apps
                      </Text>
                    </Card>
                  </Grid.Col>
                </Grid>
              </Box>

              <Box>
                <Text fw={500} mb="xs">
                  What Happens After Someone Submits Your Form
                </Text>
                <Text size="sm" mb="md">
                  When someone successfully submits your form, Formshive decides what to show them next.
                  This depends on how your form is set up and how it's being used on your website.
                  <br /><small>If you prefer to see a diagram: <Anchor size='xs' target='_blank' href="https://mermaid.live/edit#pako:eNqNlF9vmzAUxb-K5eckBZuUPw-b2pBomtZuavKykWjy4CYwgc1soywj-e5zzJrRilblAYE4v3PvuVxocSoywBHelmKf5kxqtIrXHJnjJlkIWaFl86MqlCoE36Dx-B26bSVkhYRUo5pJVoEG-f7UId359qw75roqj2iW3JR7dlDow-ruE3oAVQuuYNMJZ9Zw5ibLJk1BqcioVl8QcVy0L3TeMap7ZortnnEkWbCibCT84zzH6XEgpZB9qt8cFxyOKG5twpwp9JjpeyPLxzSxlX4FZZRDPX5cfr7vCvbpTR--F4YlAyxUtT4Y7sk8LINiOpDL1rKRBtNopEAf0fz1QPP_geZuYr2pQy5SpMVQkvklyaJ9gF8NKI1mgmvgerw61PD05S-smtV1WaRMm625-qkEN6z71im86EDePpfOY2uGMc6YZlcmzRj4edUzY0QHWnlp11538gZaer59eIR3sshwtGWlghGuQFbsfI_bc4k11jlUsMaRuSyLXa7XeM1PhqoZ_yZEhSMtG8NJ0ezyi0tTm3YgLtjOfIMXCfAM5Ew0XOMopFPrgaMW_8aR6wSTwPVDbxq61L-mhI7wAUfEoxM_oNPw2vNJ4HnkNMJ_bFVnElASGiEJCJn6TjDCZjm0kHfdH8P-OE5_AYJ6VO0">Form Submission Flow (mermaid.live/edit)</Anchor></small>
                </Text>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Card withBorder p="sm" bg="green.0">
                      <Text fw={500} size="sm" mb="xs">
                        Custom Thank You Page:
                      </Text>
                      <Text size="xs">
                        If you set a "Redirect URL" in your form settings, visitors go directly to your
                        custom thank you page. Perfect for special offers or detailed next steps.
                      </Text>
                    </Card>
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Card withBorder p="sm" bg="blue.0">
                      <Text fw={500} size="sm" mb="xs">
                        Built-in Success Page:
                      </Text>
                      <Text size="xs">
                        If no redirect URL is set, visitors see a simple "Thank you, your message
                        was received" page. Clean and professional, works great for most forms.
                      </Text>
                    </Card>
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Card withBorder p="sm" bg="gray.0">
                      <Text fw={500} size="sm" mb="xs">
                        For Developers (API):
                      </Text>
                      <Text size="xs">
                        JavaScript/AJAX requests get JSON responses instead of page redirects.
                        Perfect for dynamic forms that don't reload the page.
                      </Text>
                    </Card>
                  </Grid.Col>
                </Grid>

                <Alert icon={<IconInfoCircle size={16} />} title="Advanced: Override Options" color="blue" mt="sm">
                  <Text size="sm">
                    You can add special parameters to your form URL to control what happens:
                    <br />• <strong>?redirect=html</strong> - Always show the built-in success page
                    <br />• <strong>?redirect=none</strong> - For developers: return JSON instead of redirecting
                  </Text>
                </Alert>
              </Box>

              <Box>
                <Text fw={500} mb="xs">
                  Integration Examples
                </Text>
                <Text size="sm" mb="md">
                  Here are examples of how different integration methods handle form submissions:
                </Text>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card withBorder p="sm">
                      <Text fw={500} size="sm" mb="xs">
                        JavaScript (AJAX):
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
                        ✅ Success: Gets JSON response<br />
                        ❌ Error: Gets detailed error JSON for custom handling
                      </Text>
                    </Card>
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card withBorder p="sm">
                      <Text fw={500} size="sm" mb="xs">
                        HTML Form:
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
                        ✅ Success: Redirects to thank you page or custom URL<br />
                        ❌ Error: Shows user-friendly error page with form
                      </Text>
                    </Card>
                  </Grid.Col>
                </Grid>
              </Box>

              <Alert icon={<IconInfoCircle size={16} />} title="Pro Tips for Better User Experience" color="blue">
                <Text size="sm">
                  • <strong>Set a redirect URL</strong> to send visitors to a custom thank-you page with next steps
                  <br />
                  • <strong>Test your forms</strong> by filling them out incorrectly to see the error experience
                  <br />
                  • <strong>Keep error messages helpful</strong> - users appreciate clear guidance on how to fix problems
                  <br />
                  • <strong>Monitor submissions</strong> in the Messages tab to spot patterns or common user issues
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
                    <Group gap="xs" mb="sm">
                      <Text size="xs" px="xs" py={2} bg="blue.1" c="blue.8" style={{ borderRadius: '12px', fontWeight: 500 }}>
                        Existing Forms
                      </Text>
                      <Text size="xs" px="xs" py={2} bg="green.1" c="green.8" style={{ borderRadius: '12px', fontWeight: 500 }}>
                        Very Flexible
                      </Text>
                      <Text size="xs" px="xs" py={2} bg="purple.1" c="purple.8" style={{ borderRadius: '12px', fontWeight: 500 }}>
                        Custom Design
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
                    <Alert color="green" mt="sm">
                      <Text size="xs">
                        <strong>✅ Success:</strong> Follows redirect behavior from "Form Submission" - custom URL redirect or built-in success page.
                      </Text>
                    </Alert>
                    <Alert color="yellow" mt="xs">
                      <Text size="xs">
                        <strong>⚠️ Validation errors:</strong> Only for forms WITH defined fields (see "Forms With & Without Fields") - shows user-friendly error page with preserved input and highlighted field errors.
                      </Text>
                    </Alert>
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
                    <Group gap="xs" mb="sm">
                      <Text size="xs" px="xs" py={2} bg="orange.1" c="orange.8" style={{ borderRadius: '12px', fontWeight: 500 }}>
                        Best UX
                      </Text>
                      <Text size="xs" px="xs" py={2} bg="teal.1" c="teal.8" style={{ borderRadius: '12px', fontWeight: 500 }}>
                        No Page Reloads
                      </Text>
                      <Text size="xs" px="xs" py={2} bg="pink.1" c="pink.8" style={{ borderRadius: '12px', fontWeight: 500 }}>
                        Dynamic
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
                    <Alert color="green" mt="sm">
                      <Text size="xs">
                        <strong>✅ Success:</strong> With redirect URL - redirects page. Without redirect URL - shows inline success message and clears form.
                      </Text>
                    </Alert>
                    <Alert color="yellow" mt="xs">
                      <Text size="xs">
                        <strong>⚠️ Validation errors:</strong> For forms WITH defined fields - highlights specific field errors directly in the form with red styling and error messages. Much more user-friendly than page reloads!
                      </Text>
                    </Alert>
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
                    <Group gap="xs" mb="sm">
                      <Text size="xs" px="xs" py={2} bg="green.1" c="green.8" style={{ borderRadius: '12px', fontWeight: 500 }}>
                        Very Easy
                      </Text>
                      <Text size="xs" px="xs" py={2} bg="blue.1" c="blue.8" style={{ borderRadius: '12px', fontWeight: 500 }}>
                        Works Everywhere
                      </Text>
                      <Text size="xs" px="xs" py={2} bg="gray.1" c="gray.8" style={{ borderRadius: '12px', fontWeight: 500 }}>
                        Copy & Paste
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
                    <Alert color="green" mt="sm">
                      <Text size="xs">
                        <strong>✅ Success:</strong> Shows built-in success page within the iframe. Users stay on your website.
                      </Text>
                    </Alert>
                    <Alert color="yellow" mt="xs">
                      <Text size="xs">
                        <strong>⚠️ Validation errors:</strong> For forms WITH defined fields - shows error page within iframe with preserved input and field highlighting. Users stay on your site while fixing errors.
                      </Text>
                    </Alert>
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
                    <Group gap="xs" mb="sm">
                      <Text size="xs" px="xs" py={2} bg="green.1" c="green.8" style={{ borderRadius: '12px', fontWeight: 500 }}>
                        Very Easy
                      </Text>
                      <Text size="xs" px="xs" py={2} bg="violet.1" c="violet.8" style={{ borderRadius: '12px', fontWeight: 500 }}>
                        Social Media
                      </Text>
                      <Text size="xs" px="xs" py={2} bg="indigo.1" c="indigo.8" style={{ borderRadius: '12px', fontWeight: 500 }}>
                        Standalone
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
                    <Alert color="green" mt="sm">
                      <Text size="xs">
                        <strong>✅ Success:</strong> Full-page experience - follows your form's redirect settings from "Form Submission" (custom URL or success page).
                      </Text>
                    </Alert>
                    <Alert color="yellow" mt="xs">
                      <Text size="xs">
                        <strong>⚠️ Validation errors:</strong> For forms WITH defined fields - shows full-page error experience with preserved input and field highlighting. Users can easily fix and resubmit.
                      </Text>
                    </Alert>
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
                      <br />• <strong>File:</strong> File upload
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
