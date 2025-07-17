import { ComboboxItem, Select, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { VerifiedEmail, VerifiedEmailsResponse } from '@gofranz/common';
import { Form, NewFormsRecipient } from '@gofranz/formshive-common';

export interface FormsRecipient {
  id: string;
  form_id: string;
  email_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateFormsRecipientProps {
  submitFormCb: (newForm: NewFormsRecipient) => Promise<void>;
  getVerifiedEmails: () => Promise<VerifiedEmailsResponse>;
  form: Form;
}

export function CreateFormsRecipient(props: CreateFormsRecipientProps) {
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState('');
  const [verifiedEmails, setVerifiedEmails] = useState<VerifiedEmail[]>([]);
  const [emails, setEmails] = useState<{ label: string; value: string }[]>([]);
  const [selected, setSelected] = useState<ComboboxItem | null>(null);

  const get = async () => {
    const vemails = await props.getVerifiedEmails();
    if (vemails) {
      setVerifiedEmails(vemails.data);
      setEmails(vemails.data.map((email) => ({ label: email.email, value: email.id })));
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
    const vemail = verifiedEmails.find((e) => e.id === email.value);

    if (!vemail) {
      setError('Error: No email found');
      return;
    }

    const newRecipient = {
      form_id: props.form.id,
      verified_email_id: vemail?.id,
    };
    await props.submitFormCb(newRecipient);
    setIsBusy(false);
    await get();
  };

  return (
    <>
      <Select
        data={emails}
        placeholder={
          emails.length > 0
            ? 'Select an email'
            : 'No verified emails found. Add one or more to your account first.'
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
