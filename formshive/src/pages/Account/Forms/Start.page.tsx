import { useLanguageAwareRouting, usePagination } from '@gofranz/common-components';
import { Button, Flex, Group, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FormsTable } from '../../../components/Form/Table';
import { Form, UpdateForm } from '../../../lib/models';
import { useRustyState } from '../../../state';

export function AccountFormsStartPage() {
  const { t } = useTranslation();
  const { api } = useRustyState.getState();
  const nav = useNavigate();
  const { createLanguageURL } = useLanguageAwareRouting();

  const fetchForms = async (params: { nextPage: number; [key: string]: any }) => {
    const { nextPage, ...otherParams } = params;
    const apiParams = {
      offset: nextPage === 1 ? 0 : 10 * (nextPage - 1),
      limit: 10,
      ...otherParams,
    };

    const res = await api.getForms(apiParams);
    return {
      data: res.data,
      total: res.total,
    };
  };

  const pagination = usePagination({
    perPage: 10,
    fetchData: fetchForms,
  });

  const openCreate = () => {
    nav(createLanguageURL('/account/forms/create'));
  };

  const openForm = (form: Form) => {
    nav(createLanguageURL(`/account/forms/${form.id}`));
  };

  const updateCb = async (id: string, _: UpdateForm) => {
    console.warn(`Not implemented: ${id}`);
    return undefined;
  };

  const handleFormsChange = async (params: { nextPage: number; [key: string]: any }) => {
    return await pagination.loadPage(params.nextPage, params);
  };

  return (
    <>
      <Flex>
        <Group mt="lg" mb="lg">
          <Button onClick={openCreate} mb="md">
            {t('accountPages.newForm')}
          </Button>
          <Text mb="sm">{t('accountPages.formsDescription')}</Text>
        </Group>
      </Flex>
      <FormsTable
        pagination={pagination.paginationConfig}
        onChange={handleFormsChange}
        openRowPage={openForm}
        updateCb={updateCb}
        deleteCb={api.deleteForm}
      />
    </>
  );
}
