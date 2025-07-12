import { ComboboxItem, Select, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ListResponse } from '../../lib/api';
import {
  Form,
  HttpIntegration,
  HttpNewFormsIntegration,
  IntegrationsQueryParams,
} from '../../lib/models';

export interface FormsRecipient {
  id: string;
  form_id: string;
  email_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateFormsRecipientProps {
  submitFormCb: (newForm: HttpNewFormsIntegration) => Promise<void>;
  getIntegrations: (params: IntegrationsQueryParams) => Promise<ListResponse<HttpIntegration>>;
  form: Form;
}

export function CreateFormsRecipient(props: CreateFormsRecipientProps) {
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<HttpIntegration[]>([]);
  const [dropDownItems, setDropDownItems] = useState<{ label: string; value: string }[]>([]);
  const [selected, setSelected] = useState<ComboboxItem | null>(null);

  const get = async () => {
    const apiData = await props.getIntegrations({
      limit: 100,
      offset: 0,
    });
    if (apiData) {
      setData(apiData.data);
      setDropDownItems(
        apiData.data.map((integration) => ({ label: integration.title, value: integration.id }))
      );
    }
  };

  useEffect(() => {
    get();
  }, []);

  const submitForm = async (email: ComboboxItem) => {
    setSelected(null);
    setIsBusy(true);
    if (!email) {
      console.error('Error: No email selected');
      setError('Error: No email selected');
      return;
    }
    const integration = data.find((vemail) => vemail.id === email.value);

    if (!integration) {
      setError('Error: No email found');
      return;
    }

    const newData = {
      form_id: props.form.id,
      integration_id: integration?.id,
    };
    await props.submitFormCb(newData);
    setIsBusy(false);
    await get();
  };

  return (
    <>
      <Select
        data={dropDownItems}
        placeholder={
          dropDownItems.length > 0
            ? 'Select an integration'
            : 'No integrations found. Add one or more to your account first.'
        }
        value={selected ? selected.value : null}
        onChange={(_value, option) => {
          setSelected(option);
          submitForm(option);
        }}
        mb="md"
      />
      {isBusy && <Text color="blue">Loading...</Text>}
      {error && <Text color="red">{error}</Text>}
    </>
  );
}
