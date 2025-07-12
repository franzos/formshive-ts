import { Code, Container, Text, Title } from '@mantine/core';
import CodeEditor from '@uiw/react-textarea-code-editor';
import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from 'react';
import { Footer } from '../components/Layout/Footer';

const specFile = '/public/form-specs.md';
const exampleSimple = `[first_name]
name = 'first_name'
field = 'text'
required = true

[last_name]
name = 'last_name'
field = 'text'
required = true

[email]
name = 'email'
field = 'text'
label = 'Email'
placeholder = 'Email'
required = true
pattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

[settings]
discard_additional_fields = false`;
const exampleComplex = `[first_name]
name = 'first_name'
field = 'text'
label = 'First Name'
placeholder = 'First Name'
required = true

[last_name]
name = 'last_name'
field = 'text'
label = 'Last Name'
placeholder = 'Last Name'
required = true

[email_rl]
name = 'email'
field = 'text'
label = 'Email'
placeholder = 'Email'
required = true
is_email = true
on_fail = 'spam'
map_to = 'email'

[enquiry_type]
name = 'enquiry_type'
field = 'select'
label = 'Enquiry Type'
options = 'general,sales,support'

[send_more_information_on]
name = 'send_more_information_on'
field = 'radio'
label = 'Send More Information On'
options = 'email,phone'
multiple = true

[email]
name = 'email'
field = 'text'
is_email = true
on_fail = 'spam'
hidden = true

[message]
name = 'message'
field = 'textarea'
label = 'Message'
check_spam = true

[settings]
discard_additional_fields = true`;
const exampleReject = `[first_name]
name = 'first_name'
field = 'text'
required = true
on_fail = 'reject'

[last_name]
name = 'last_name'
field = 'text'
required = true
on_fail = 'reject'

[email]
name = 'email'
field = 'text'
label = 'Email'
placeholder = 'Email'
required = true
pattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
on_fail = 'reject'

[age]
name = 'age'
field = 'number'
label = 'Age'
required = true
is_min = 18
is_max = 120
on_fail = 'reject'

[settings]
discard_additional_fields = false`;

export function FormSpecsPage() {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    fetch(specFile)
      .then((response) => response.text())
      .then((text) => setMarkdown(text));
  }, []);

  return (
    <>
      <Container mt="xl" mb="xl">
        <Title order={1}>Form Specs</Title>
        <ReactMarkdown>{markdown}</ReactMarkdown>

        <Title order={2} mt="lg">
          Simple Example
        </Title>

        <Text>This is what a typical contact form looks like.</Text>

        <CodeEditor
          language="toml"
          value={exampleSimple}
          padding={15}
          style={{
            fontFamily:
              'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
          }}
        />

        <Title order={2} mt="lg">
          Complex Example
        </Title>

        <Text>A more complex contact form, with a dropdown and honeypot.</Text>

        <CodeEditor
          language="toml"
          value={exampleComplex}
          padding={15}
          style={{
            fontFamily:
              'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
          }}
        />

        <Title order={2} mt="lg">
          Bad Request Example
        </Title>

        <Text>
          By default submissions always pass, and a status code <Code>201</Code> is returned. To
          actually reject submissions with that fail validation, mark the field{' '}
          <Code>on_fail: reject</Code> to generate a bad request error status code <Code>400</Code>.
        </Text>

        <CodeEditor
          language="toml"
          value={exampleReject}
          padding={15}
          style={{
            fontFamily:
              'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
          }}
        />
      </Container>
      <Footer />
    </>
  );
}
