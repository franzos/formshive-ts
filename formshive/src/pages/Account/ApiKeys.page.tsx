import { Title } from '@mantine/core';
import { ApiKeysManager } from '../../components/ApiKeys/ApiKeysManager';

export function AccountApiKeysPage() {
  return <>
    <Title order={2} mb="md">
      API Keys
    </Title>
    <ApiKeysManager />
  </>
}