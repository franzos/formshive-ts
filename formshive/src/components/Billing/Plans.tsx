import { Table } from '@mantine/core';

const data = [
  {
    kind: 'Cost (entry plan)',
    rusty: '$210 / year',
    wufoo: '$264 / Year',
    formspree: '$180 / Year',
  },
  {
    kind: 'Forms',
    rusty: 'Unlimited',
    wufoo: 10,
    formspree: 5,
  },
  {
    kind: 'Entries',
    rusty: '2000 / Month',
    wufoo: '1000 / Month',
    formspree: '200 / Month',
  },
  {
    kind: 'Users',
    rusty: 'Unlimited',
    wufoo: 1,
    formspree: 1,
  },
  {
    kind: 'Reports',
    rusty: 'Unlimited',
    wufoo: 'Unlimited',
    formspree: 'Unlimited',
  },
  {
    kind: 'File Storage',
    rusty: '500MB / Month',
    wufoo: '1GB',
    formspree: '1GB',
  },
  {
    kind: 'File Upload Limit',
    rusty: '100MB',
    wufoo: '25MB',
    formspree: '25MB',
  },
  {
    kind: 'API Requests',
    rusty: 'Unlimited',
    wufoo: 10000,
    formspree: 'Unlimited?',
  },
  {
    kind: 'Confirmation Email',
    rusty: '✔️',
    wufoo: '✔️',
    formspree: '✔️',
  },
  {
    kind: 'Redirects',
    rusty: '✔️',
    wufoo: '✔️',
    formspree: '✔️',
  },
  {
    kind: 'Autoresponse',
    rusty: '✔️',
    wufoo: '✔️',
    formspree: '❌',
  },
  {
    kind: 'Captcha',
    rusty: 'Altcha (Private)',
    wufoo: 'reCAPTCHA (Google)',
    formspree: 'reCAPTCHA (Google)',
  },
];

export function Plans() {
  const rows = data.map((element) => (
    <Table.Tr key={`plan-${element.kind}`}>
      <Table.Td>
        <strong>{element.kind}</strong>
      </Table.Td>
      <Table.Td>{element.rusty}</Table.Td>
      <Table.Td>{element.wufoo}</Table.Td>
      <Table.Td>{element.formspree}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th />
            <Table.Th>Formshive</Table.Th>
            <Table.Th>Wufoo</Table.Th>
            <Table.Th>Formspree</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
}
