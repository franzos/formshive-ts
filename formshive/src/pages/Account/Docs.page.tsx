import { Title } from '@mantine/core';
import { Docs } from '../../components/Docs';

export function AccountDocsPage() {
  return (
    <>
      <Title order={2} mb="md">
        Documentation
      </Title>
      <Docs />
    </>
  );
}