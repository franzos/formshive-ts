import { Card, Title } from '@mantine/core';
import { Docs } from '../../components/Docs';

export function AccountDocsPage() {
  return (
    <>
      <Title order={1} mb="lg">
        Documentation
      </Title>
      <Card shadow="xs" padding="lg" radius="md" withBorder>
        <Docs />
      </Card>
    </>
  );
}