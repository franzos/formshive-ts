import { Text, Grid, ActionIcon, Group } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { HttpIntegration } from '../../lib/models';
import { useTranslation } from 'react-i18next';

export interface FormsIntegrationProps {
  integration: HttpIntegration;
  form_id: string;
  isBusy: boolean;
  deleteCb: (formId: string, integrationId: string) => Promise<void>;
}

export function FormIntegration(props: FormsIntegrationProps) {
  const { t } = useTranslation();
  const { integration, form_id } = props;

  return (
    <Grid>
      <Grid.Col span={5}>
        <Group>
          <ActionIcon
            color="red"
            onClick={() => props.deleteCb(form_id, integration.id)}
            loading={props.isBusy}
            variant="filled"
            aria-label={t('integration.delete')}
          >
            <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
          <Text>{integration.title}</Text>
        </Group>
      </Grid.Col>
      <Grid.Col span="auto">
        <Text>{integration.data}</Text>
      </Grid.Col>
    </Grid>
  );
}
