import { VerifiedEmail } from '@gofranz/common';
import { IsVerified } from '@gofranz/common-components';
import { ActionIcon, Grid, Group, Text } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

export interface FormsRecipientProps {
  verifiedEmail: VerifiedEmail;
  form_id: string;
  isBusy: boolean;
  deleteCb: (formId: string, integrationId: string) => Promise<void>;
}

export function FormRecipient(props: FormsRecipientProps) {
  const { verifiedEmail, form_id } = props;

  return (
    <Grid>
      <Grid.Col span={5}>
        <Group>
          <ActionIcon
            color="red"
            onClick={() => props.deleteCb(form_id, verifiedEmail.id)}
            loading={props.isBusy}
            variant="filled"
            aria-label="Delete"
          >
            <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
          <Text>{verifiedEmail.email}</Text>
        </Group>
      </Grid.Col>
      <Grid.Col span="auto">
        <IsVerified isVerified={verifiedEmail.is_verified} />
      </Grid.Col>
    </Grid>
  );
}
