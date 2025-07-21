import { Form, UpdateForm } from '@gofranz/formshive-common';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormDetail } from '../../../components/Form/Detail';
import { useRustyState } from '../../../state';

export function AccountFormViewPage() {
  const { api } = useRustyState.getState();
  const { uuid } = useParams<{ uuid: string }>();
  const [form, setForm] = useState<Form | undefined>(undefined);

  useEffect(() => {
    const getForm = async () => {
      if (!uuid) {
        return;
      }
      const res = await api.getForm(uuid);
      if (res) {
        setForm(res);
      }
    };
    getForm();
  }, []);

  const getFormVerifiedEmails = async () => {
    if (!uuid) {
      return {
        data: [],
        total: 0,
      };
    }
    // TODO: Why query by form ID
    return useRustyState.getState().getAndSetFormVerifiedEmails(uuid);
  };

  const updateForm = async (id: string, data: UpdateForm) => {
    await api.updateForm(id, data);
    const _form = await api.getForm(id);
    if (_form) {
      setForm(_form);
    }
  };

  return (
    <>
      {form && form.id && (
        <FormDetail
          form={form}
          submitFormCb={updateForm}
          submitFormRecipientCb={api.newFormRecipient}
          deleteCb={api.deleteForm}
          getVerifiedEmails={useRustyState.getState().getAndSetVerifiedEmails}
          getFormVerifiedEmails={getFormVerifiedEmails}
          deleteRecipientCp={api.deleteFormRecipient}
          submitFormIntegrationCb={api.newFormsIntegration}
          getIntegrations={api.getIntegrations}
          getFormIntegrations={api.getFormsIntegrations}
          deleteFormIntegrationCb={api.deleteFormsIntegration}
        />
      )}
    </>
  );
}
