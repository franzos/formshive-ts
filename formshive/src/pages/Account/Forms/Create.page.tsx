import { useLanguageAwareRouting } from '@gofranz/common-components';
import { HttpNewForm } from '@gofranz/formshive-common';
import { useNavigate } from 'react-router-dom';
import { CreateForm } from '../../../components/Form/Create';
import { useRustyState } from '../../../state';

export function AccountFormCreatePage() {
  const { api } = useRustyState.getState();
  const nav = useNavigate();
  const { createLanguageURL } = useLanguageAwareRouting();

  const submit = async (newForm: HttpNewForm) => {
    const form = await api.newForm(newForm);
    nav(createLanguageURL(`/account/forms/${form.id}`));
  };

  return <CreateForm submitFormCb={submit} />;
}
