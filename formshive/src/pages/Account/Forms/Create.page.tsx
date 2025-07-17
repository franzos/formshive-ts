import { showSuccessNotification, useLanguageAwareRouting } from '@gofranz/common-components';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { CreateForm } from '../../../components/Form/Create';
import { useRustyState } from '../../../state';
import { HttpNewForm } from '@gofranz/formshive-common';

export function AccountFormCreatePage() {
  const { api } = useRustyState.getState();
  const nav = useNavigate();
  const { createLanguageURL } = useLanguageAwareRouting();

  const submit = async (newForm: HttpNewForm) => {
    const form = await api.newForm(newForm);
    showSuccessNotification(
      'Form Created',
      `Your form "${newForm.title}" has been successfully created and is ready to collect submissions.`,
      notifications
    );
    nav(createLanguageURL(`/account/forms/${form.id}`));
  };

  return <CreateForm submitFormCb={submit} />;
}
