import { VerifiedEmail } from '@gofranz/common';
import { Alert, Card } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useRustyState } from '../../state';
import { CreateFormsRecipient } from './Create';
import { FormRecipient } from './Recipient';
import { Form, FormsRecipientsResponse, NewFormsRecipient } from '@gofranz/formshive-common';

export interface FormsRecipientDetailProps {
  submitFormCb: (newForm: NewFormsRecipient) => Promise<void>;
  getVerifiedEmails: () => Promise<FormsRecipientsResponse>;
  getFormVerifiedEmails: () => Promise<FormsRecipientsResponse>;
  deleteRecipientCp: (formId: string, recipientId: string) => Promise<void>;
  form: Form;
  onRecipientsChange?: () => Promise<void>;
}

export function FormsRecipientDetail(props: FormsRecipientDetailProps) {
  const [isBusy, setIsBusy] = useState(false);
  // TODO: Use error
  const [_, setError] = useState('');

  const [verifiedEmails, setVerifiedEmails] = useState<VerifiedEmail[]>([]);

  const submitCb = async (recipient: NewFormsRecipient) => {
    try {
      setIsBusy(true);
      await props.submitFormCb(recipient);
      const data = await props.getFormVerifiedEmails();
      setVerifiedEmails(data.data);
      if (props.onRecipientsChange) {
        await props.onRecipientsChange();
      }
    } catch (e) {
      setError(`Error: ${e}`);
      console.error(e);
    } finally {
      setIsBusy(false);
    }
  };

  const deleteCb = async (formId: string, recipientId: string) => {
    try {
      setIsBusy(true);
      await props.deleteRecipientCp(formId, recipientId);
      const data = await props.getFormVerifiedEmails();
      setVerifiedEmails(data.data);
      if (props.onRecipientsChange) {
        await props.onRecipientsChange();
      }
    } catch (e) {
      setError(`Error: ${e}`);
      console.error(e);
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    const getVerifiedEmails = async () => {
      setIsBusy(true);
      try {
        const data = await props.getFormVerifiedEmails();
        setVerifiedEmails(data.data);
      } catch (e) {
        setError(`Error: ${e}`);
        console.error(e);
      } finally {
        setIsBusy(false);
      }
    };
    getVerifiedEmails();
  }, []);

  const FormRecipients = () =>
    verifiedEmails.map((verifiedEmail) => (
      <Card key={verifiedEmail.id} shadow="xs" radius="md" mb="md" withBorder>
        <FormRecipient
          key={`verified-email-${verifiedEmail.id}`}
          verifiedEmail={verifiedEmail}
          form_id={props.form.id}
          deleteCb={deleteCb}
          isBusy={isBusy}
        />
      </Card>
    ));

  const FormRecipientsNotFound = () => (
    <Alert color="primary" icon={<IconAlertCircle size={20} />} mb="xs" mt="xs">
      Forwarding has not been setup.
    </Alert>
  );

  return (
    <>
      {verifiedEmails && verifiedEmails.length > 0 ? (
        <FormRecipients />
      ) : (
        <FormRecipientsNotFound />
      )}
      <CreateFormsRecipient
        submitFormCb={submitCb}
        getVerifiedEmails={useRustyState.getState().getAndSetVerifiedEmails}
        form={props.form}
      />
    </>
  );
}
