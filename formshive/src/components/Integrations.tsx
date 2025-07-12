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

export function IntegrationsHelp() {
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
                <Text fw={500}>Pipedrive CRM Integration</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  Automatically create contacts and leads in your CRM
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>
                Connect your forms directly to Pipedrive CRM. Every form submission automatically
                creates a person in your CRM, and optionally creates a lead for your sales team to
                follow up on.
              </Text>

              <Alert icon={<IconInfoCircle size={16} />} title="How it works" color="green">
                <Text size="sm">
                  Using Pipedrive's REST API, your form submissions are instantly converted into CRM
                  contacts. You can configure whether to create just a person, or both a person and
                  a lead for sales follow-up.
                </Text>
              </Alert>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  Field Handling & Data Storage:
                </Text>
                <Text size="sm">
                  <strong>Required Fields:</strong>
                  <br />• <Code>name</Code> or <Code>first_name + last_name</Code> - Person's full
                  name (stored as Pipedrive person.name)
                  <br />
                  <br />
                  <strong>Optional Fields (automatically mapped):</strong>
                  <br />• <Code>email</Code> - Stored in person.email array
                  <br />• <Code>phone</Code> - Stored in person.phone array
                  <br />
                  • Custom fields via field mapping - Stored in person custom fields
                  <br />
                  <br />
                  <strong>Lead Creation (if enabled):</strong>
                  <br />
                  • Lead title uses template (default: "Web Form Lead: Form Name")
                  <br />
                  • Links to created person automatically
                  <br />• Inherits owner and organization settings
                </Text>
              </Card>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  Setup Steps:
                </Text>
                <Text size="sm">
                  1. <strong>Get API Token:</strong> Go to Settings → Personal Preferences → API in
                  your Pipedrive account
                  <br />
                  2. <strong>Copy Domain:</strong> Your Pipedrive URL (e.g.,
                  yourcompany.pipedrive.com)
                  <br />
                  3. <strong>Create Integration:</strong> Add new Pipedrive integration in Formshive
                  <br />
                  4. <strong>Configure Options:</strong> Set up lead creation, owners, and custom
                  fields
                  <br />
                  5. <strong>Test:</strong> Submit a form to verify the integration works
                </Text>
              </Card>

              <div>
                <Text fw={500} size="sm" mb="xs">
                  Features:
                </Text>
                <Group gap="xs">
                  <Badge variant="light" color="green">
                    Person Creation
                  </Badge>
                  <Badge variant="light" color="blue">
                    Lead Generation
                  </Badge>
                  <Badge variant="light" color="purple">
                    Custom Fields
                  </Badge>
                  <Badge variant="light" color="orange">
                    Owner Assignment
                  </Badge>
                  <Badge variant="light" color="red">
                    Organization Linking
                  </Badge>
                </Group>
              </div>

              <Alert icon={<IconCheck size={16} />} title="What you'll get" color="green">
                <Text size="sm">
                  • Automatic contact creation with email, phone, and custom data
                  <br />
                  • Optional lead creation for sales follow-up
                  <br />
                  • Configurable owner and organization assignment
                  <br />• Custom field mapping for advanced data capture
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
                <Text fw={500}>Mailchimp Email Marketing</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  Add form submitters to your email marketing lists
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>
                Automatically add form submissions to your Mailchimp audience lists. Perfect for
                newsletter signups, lead magnets, and building your email marketing database with
                proper segmentation.
              </Text>

              <Alert icon={<IconInfoCircle size={16} />} title="How it works" color="yellow">
                <Text size="sm">
                  Using Mailchimp's Marketing API, form submissions are added as subscribers to your
                  chosen audience. You can configure merge fields, tags, and double opt-in settings
                  for compliance and organization.
                </Text>
              </Alert>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  Field Handling & Data Storage:
                </Text>
                <Text size="sm">
                  <strong>Required Fields:</strong>
                  <br />• <Code>email</Code> - Subscriber email address (stored as Mailchimp
                  member.email_address)
                  <br />
                  <br />
                  <strong>Optional Fields (via merge field mapping):</strong>
                  <br />• <Code>first_name</Code> - Maps to FNAME merge field by default
                  <br />• <Code>last_name</Code> - Maps to LNAME merge field by default
                  <br />• <Code>phone</Code> - Maps to PHONE merge field by default
                  <br />
                  • Any custom form fields - Map to custom Mailchimp merge fields
                  <br />
                  <br />
                  <strong>Additional Features:</strong>
                  <br />
                  • Tags - Applied automatically for segmentation
                  <br />
                  • Status - "subscribed" (immediate) or "pending" (double opt-in)
                  <br />• Double opt-in - Sends confirmation email for GDPR compliance
                </Text>
              </Card>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  Setup Steps:
                </Text>
                <Text size="sm">
                  1. <strong>Get API Key:</strong> Go to Account → Extras → API Keys in your
                  Mailchimp account
                  <br />
                  2. <strong>Find List ID:</strong> Go to Audience → Settings → Audience name and
                  defaults
                  <br />
                  3. <strong>Create Integration:</strong> Add new Mailchimp integration in Formshive
                  <br />
                  4. <strong>Configure Fields:</strong> Map form fields to Mailchimp merge fields
                  <br />
                  5. <strong>Set Options:</strong> Configure tags, double opt-in, and subscriber
                  status
                  <br />
                  6. <strong>Test:</strong> Submit a form to verify the subscriber is added
                </Text>
              </Card>

              <div>
                <Text fw={500} size="sm" mb="xs">
                  Features:
                </Text>
                <Group gap="xs">
                  <Badge variant="light" color="yellow">
                    Audience Addition
                  </Badge>
                  <Badge variant="light" color="blue">
                    Merge Fields
                  </Badge>
                  <Badge variant="light" color="purple">
                    Tag Management
                  </Badge>
                  <Badge variant="light" color="green">
                    Double Opt-in
                  </Badge>
                  <Badge variant="light" color="orange">
                    Status Control
                  </Badge>
                </Group>
              </div>

              <Alert icon={<IconCheck size={16} />} title="What you'll get" color="yellow">
                <Text size="sm">
                  • Automatic subscriber addition to your audience
                  <br />
                  • Custom merge field mapping (name, phone, etc.)
                  <br />
                  • Automatic tagging for segmentation
                  <br />
                  • Double opt-in compliance support
                  <br />• Configurable subscriber status (subscribed/pending)
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
                <Text fw={500}>Kit (ConvertKit) Integration</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  Add subscribers to your Kit email marketing forms
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>
                Automatically add form submissions to your Kit (formerly ConvertKit) email marketing
                forms. Perfect for newsletter signups, lead magnets, and building your subscriber
                base with proper segmentation and tagging.
              </Text>

              <Alert icon={<IconInfoCircle size={16} />} title="How it works" color="teal">
                <Text size="sm">
                  Using Kit's v4 API, form submissions are added as subscribers to your specified
                  forms. You can configure custom fields, tags, and field mappings for advanced
                  subscriber management.
                </Text>
              </Alert>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  Field Handling & Data Storage:
                </Text>
                <Text size="sm">
                  <strong>Required Fields:</strong>
                  <br />• <Code>email</Code> - Subscriber email address (stored as Kit
                  subscriber.email_address)
                  <br />
                  <br />
                  <strong>Optional Fields (via custom field mapping):</strong>
                  <br />• <Code>first_name</Code> - Maps to first_name custom field by default
                  <br />• <Code>last_name</Code> - Maps to last_name custom field by default
                  <br />• <Code>company</Code> - Maps to company custom field by default
                  <br />
                  • Any custom form fields - Map to Kit custom fields via field mapping
                  <br />
                  <br />
                  <strong>Two-Step Process:</strong>
                  <br />
                  • Step 1: Create/update subscriber with custom fields and tags
                  <br />
                  • Step 2: Add subscriber to specified form for automation triggers
                  <br />• Tags applied automatically for segmentation and automation
                </Text>
              </Card>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  Setup Steps:
                </Text>
                <Text size="sm">
                  1. <strong>Get API Key:</strong> Go to Account Settings → API Keys in your Kit
                  account
                  <br />
                  2. <strong>Find Form ID:</strong> Go to Forms → Select your form → Copy the form
                  ID from the URL
                  <br />
                  3. <strong>Create Integration:</strong> Add new Kit integration in Formshive
                  <br />
                  4. <strong>Configure Fields:</strong> Map form fields to Kit custom fields
                  <br />
                  5. <strong>Set Tags:</strong> Configure default tags for subscriber segmentation
                  <br />
                  6. <strong>Test:</strong> Submit a form to verify the subscriber is added
                </Text>
              </Card>

              <div>
                <Text fw={500} size="sm" mb="xs">
                  Features:
                </Text>
                <Group gap="xs">
                  <Badge variant="light" color="teal">
                    Subscriber Addition
                  </Badge>
                  <Badge variant="light" color="blue">
                    Custom Fields
                  </Badge>
                  <Badge variant="light" color="purple">
                    Tag Management
                  </Badge>
                  <Badge variant="light" color="green">
                    Form Integration
                  </Badge>
                  <Badge variant="light" color="orange">
                    Field Mapping
                  </Badge>
                </Group>
              </div>

              <Alert icon={<IconCheck size={16} />} title="What you'll get" color="teal">
                <Text size="sm">
                  • Automatic subscriber addition to your Kit forms
                  <br />
                  • Custom field mapping (name, phone, company, etc.)
                  <br />
                  • Automatic tagging for advanced segmentation
                  <br />
                  • Two-step process: create subscriber then add to form
                  <br />• Full Kit v4 API compatibility
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
                <Text fw={500}>Zapier Integration</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  Connect to 8,000+ apps with zero coding
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>
                Zapier lets your form submissions trigger actions in thousands of other apps like
                Google Sheets, Mailchimp, Airtable, and more. Set up once, and your forms will
                automatically send data wherever you need it.
              </Text>

              <Alert icon={<IconInfoCircle size={16} />} title="How it works" color="blue">
                <Text size="sm">
                  Create a webhook integration in Formshive, then use that URL in Zapier as a
                  "Webhooks by Zapier" trigger. Zapier will automatically receive your form
                  submissions and can forward them to any connected app.
                </Text>
              </Alert>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  Field Handling & Data Format:
                </Text>
                <Text size="sm">
                  <strong>All Form Fields Included:</strong>
                  <br />
                  • All form submission data sent as JSON payload
                  <br />
                  • Integration ID and metadata included for tracking
                  <br />
                  <br />
                  <strong>Data Structure:</strong>
                  <br />• <Code>integration</Code> - Contains integration ID and tracking info
                  <br />• <Code>data</Code> - All form fields with their values
                  <br />
                  • Standard webhook format compatible with most Zapier automations
                  <br />
                  <br />
                  <strong>Zapier Processing:</strong>
                  <br />
                  • Zapier automatically parses all fields for use in subsequent actions
                  <br />
                  • Can filter, transform, or route data to 8,000+ connected apps
                  <br />• No field mapping required - all data is automatically available
                </Text>
              </Card>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  Setup Steps:
                </Text>
                <Text size="sm">
                  1. <strong>Create Webhook Integration:</strong> In Formshive, create a new webhook
                  integration and copy the URL
                  <br />
                  2. <strong>New Zap in Zapier:</strong> Create a new Zap and choose "Webhooks by
                  Zapier" as the trigger
                  <br />
                  3. <strong>Select "Catch Hook":</strong> Choose this option to receive webhook
                  data
                  <br />
                  4. <strong>Paste Webhook URL:</strong> Use the URL from step 1 as your webhook URL
                  <br />
                  5. <strong>Test & Connect:</strong> Submit a test form to verify the connection
                  works
                  <br />
                  6. <strong>Add Actions:</strong> Connect to any of Zapier's 8,000+ apps
                </Text>
              </Card>

              <div>
                <Text fw={500} size="sm" mb="xs">
                  Popular Zapier Connections:
                </Text>
                <Group gap="xs">
                  <Badge variant="light" color="green">
                    Google Sheets
                  </Badge>
                  <Badge variant="light" color="blue">
                    Mailchimp
                  </Badge>
                  <Badge variant="light" color="purple">
                    Airtable
                  </Badge>
                  <Badge variant="light" color="orange">
                    Trello
                  </Badge>
                  <Badge variant="light" color="red">
                    Gmail
                  </Badge>
                  <Badge variant="light" color="gray">
                    +8,000 more
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
                <Text fw={500}>Slack Integration</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  Get instant notifications in your Slack channels
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>
                Send form submissions directly to your Slack channels. Perfect for team
                notifications, lead alerts, or any time you need instant visibility into form
                activity.
              </Text>

              <Alert icon={<IconInfoCircle size={16} />} title="How it works" color="grape">
                <Text size="sm">
                  Slack provides incoming webhook URLs that let you send messages to specific
                  channels. When someone submits your form, Formshive will automatically post a
                  formatted message to your chosen Slack channel.
                </Text>
              </Alert>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  Field Handling & Message Format:
                </Text>
                <Text size="sm">
                  <strong>All Form Fields Displayed:</strong>
                  <br />
                  • All submitted form data included in Slack message
                  <br />
                  • Formatted as readable message blocks with clear field labels
                  <br />
                  • Timestamp and form title automatically included
                  <br />
                  <br />
                  <strong>Message Structure:</strong>
                  <br />
                  • Header with emoji and form name
                  <br />
                  • Each form field displayed with label and value
                  <br />
                  • Submission timestamp for tracking
                  <br />
                  • Optional link to full submission (if configured)
                  <br />
                  <br />
                  <strong>Instant Delivery:</strong>
                  <br />
                  • Messages appear immediately when form is submitted
                  <br />
                  • No polling or delays - real-time notifications
                  <br />• Channel members get instant visibility into form activity
                </Text>
              </Card>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  Setup Steps:
                </Text>
                <Text size="sm">
                  1. <strong>Open Slack:</strong> Go to your Slack workspace
                  <br />
                  2. <strong>Create Webhook:</strong> Visit{' '}
                  <Text component="span" c="blue" td="underline">
                    https://api.slack.com/messaging/webhooks
                  </Text>
                  <br />
                  3. <strong>Choose Channel:</strong> Select which channel should receive form
                  notifications
                  <br />
                  4. <strong>Copy Webhook URL:</strong> Copy the webhook URL that Slack provides
                  <br />
                  5. <strong>Add to Formshive:</strong> Create a new Slack integration and paste the
                  webhook URL
                  <br />
                  6. <strong>Test:</strong> Submit a test form to see the notification in Slack
                </Text>
              </Card>

              <div>
                <Text fw={500} size="sm" mb="xs">
                  What you'll see in Slack:
                </Text>
                <Code block>
                  {`🎯 New Contact Form Submission

📧 Email: john@example.com
👤 Name: John Doe
💬 Message: Hello, I'm interested in your services!

🔗 View Full Submission → [Link]`}
                </Code>
              </div>

              <Alert icon={<IconCheck size={16} />} title="Pro Tips" color="green">
                <Text size="sm">
                  • Use different channels for different forms (sales, support, feedback)
                  <br />
                  • Set up @channel or @here mentions for urgent form types
                  <br />• Slack webhooks work instantly - no delays or polling
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
                <Text fw={500}>Google Sheets Integration</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  Automatically add form submissions to Google Sheets
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>
                Send form submissions directly to Google Sheets rows. Perfect for lead tracking,
                data collection, or any time you need form data in a spreadsheet format.
              </Text>

              <Alert icon={<IconInfoCircle size={16} />} title="How it works" color="green">
                <Text size="sm">
                  Google Apps Script can create webhook URLs that automatically append data to your
                  Google Sheets. Each form submission becomes a new row with all the form fields as
                  columns.
                </Text>
              </Alert>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  Field Handling & Spreadsheet Format:
                </Text>
                <Text size="sm">
                  <strong>All Form Fields as Columns:</strong>
                  <br />
                  • Each form field becomes a separate column in your sheet
                  <br />
                  • Headers automatically created on first submission
                  <br />
                  • Dynamic column generation based on form structure
                  <br />
                  <br />
                  <strong>Standard Columns Always Included:</strong>
                  <br />• <Code>Timestamp</Code> - When the form was submitted
                  <br />• <Code>Form Title</Code> - Name of the form that was submitted
                  <br />
                  • All custom form fields with their original names
                  <br />
                  <br />
                  <strong>Data Storage:</strong>
                  <br />
                  • Each submission = one new row appended to sheet
                  <br />
                  • Data preserved exactly as submitted (no transformation)
                  <br />
                  • Full Google Sheets functionality available for analysis
                  <br />• Real-time updates when forms are submitted
                </Text>
              </Card>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  Setup Steps:
                </Text>
                <Text size="sm">
                  1. <strong>Open Google Sheets:</strong> Create a new spreadsheet or open an
                  existing one
                  <br />
                  2. <strong>Open Apps Script:</strong> Go to Extensions → Apps Script
                  <br />
                  3. <strong>Add Code:</strong> Paste the webhook script (see below)
                  <br />
                  4. <strong>Deploy:</strong> Click Deploy → New deployment → Execute as: Me,
                  Access: Anyone
                  <br />
                  5. <strong>Copy URL:</strong> Copy the deployment webhook URL
                  <br />
                  6. <strong>Add to Formshive:</strong> Create a new webhook integration with this
                  URL
                </Text>
              </Card>

              <div>
                <Text fw={500} size="sm" mb="xs">
                  Google Apps Script Code:
                </Text>
                <Code block>
                  {`function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  // Add headers if first row
  if (sheet.getLastRow() === 0) {
    const headers = ['Timestamp', 'Form Title'];
    Object.keys(data.data || {}).forEach(key => headers.push(key));
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  
  // Add form data as new row
  const row = [
    new Date(data.submitted_at),
    data.form_title || 'Untitled Form'
  ];
  
  Object.values(data.data || {}).forEach(value => row.push(value));
  sheet.appendRow(row);
  
  return ContentService.createTextOutput('Success');
}`}
                </Code>
              </div>

              <Alert icon={<IconCheck size={16} />} title="What you'll get" color="green">
                <Text size="sm">
                  • Automatic spreadsheet with timestamps
                  <br />
                  • Each form field becomes a column
                  <br />
                  • Real-time data updates
                  <br />• Full Google Sheets functionality for analysis
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
                <Text fw={500}>Custom Webhook Integration</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  Send data to any API or webhook endpoint
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>
                For developers and advanced users: send form submissions to any HTTP endpoint.
                Perfect for custom integrations, internal APIs, or services not covered by other
                integration types.
              </Text>

              <Alert icon={<IconInfoCircle size={16} />} title="How it works" color="blue">
                <Text size="sm">
                  When someone submits your form, Formshive will make a POST request to your webhook
                  URL with the form data as JSON. Your endpoint can then process this data however
                  you need.
                </Text>
              </Alert>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  Field Handling & Data Format:
                </Text>
                <Text size="sm">
                  <strong>Complete Form Data Included:</strong>
                  <br />
                  • All form fields sent with original names and values
                  <br />
                  • Form metadata (ID, title, submission timestamp)
                  <br />
                  • Integration details for tracking and processing
                  <br />
                  <br />
                  <strong>Standard HTTP POST:</strong>
                  <br />• <Code>Content-Type: application/json</Code> header
                  <br />
                  • JSON body with structured form data
                  <br />
                  • Your endpoint must respond with 200-299 status for success
                  <br />
                  <br />
                  <strong>Flexible Processing:</strong>
                  <br />
                  • Parse JSON to access any form field by name
                  <br />
                  • Integrate with any API, database, or service
                  <br />
                  • Custom validation, transformation, and routing logic
                  <br />• Perfect for complex business workflows
                </Text>
              </Card>

              <Card withBorder p="md">
                <Text fw={500} size="sm" mb="xs">
                  JSON Payload Format:
                </Text>
                <Code block>
                  {`{
  "form_id": "your-form-id",
  "form_title": "Contact Form",
  "submitted_at": "2024-06-28T10:30:00Z",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello world"
  },
  "integration": {
    "id": "integration-id",
    "title": "My Webhook"
  }
}`}
                </Code>
              </Card>

              <div>
                <Text fw={500} size="sm" mb="xs">
                  Requirements:
                </Text>
                <Text size="sm">
                  • Your endpoint must accept POST requests
                  <br />
                  • Must respond with HTTP 200-299 status codes for success
                  <br />
                  • Should handle JSON content-type
                  <br />• HTTPS URLs recommended for security
                </Text>
              </div>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}
