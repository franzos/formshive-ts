import { useLanguageAwareRouting, usePagination } from '@gofranz/common-components';
import { Button, Flex, Group, Text, Select, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { FormsTable } from '../../../components/Form/Table';
import { useRustyState } from '../../../state';
import { Form, UpdateForm } from '@gofranz/formshive-common';

export function AccountFormsStartPage() {
  const { t } = useTranslation();
  const { api } = useRustyState.getState();
  const nav = useNavigate();
  const { createLanguageURL } = useLanguageAwareRouting();

  const [perPage, setPerPage] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('formshive.forms.pagination');
      return saved ? parseInt(saved, 10) : 10;
    }
    return 10;
  });

  const perPageRef = useRef(perPage);

  const fetchForms = async (params: { nextPage: number; [key: string]: any }) => {
    const { nextPage, ...otherParams } = params;
    const currentPerPage = perPageRef.current;
    const apiParams = {
      offset: nextPage === 1 ? 0 : currentPerPage * (nextPage - 1),
      limit: currentPerPage,
      ...otherParams,
    };

    const res = await api.getForms(apiParams);
    return {
      data: res.data,
      total: res.total,
    };
  };

  const pagination = usePagination({
    perPage,
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

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    perPageRef.current = newPerPage; // Update ref immediately
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('formshive.forms.pagination', newPerPage.toString());
    }
  };

  const paginationOptions = [
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '30', label: '30' },
    { value: '40', label: '40' },
    { value: '50', label: '50' },
  ];

  return (
    <>

      <Title order={2} mb="md">
        Forms
      </Title>
      <Flex justify="space-between" align="center" mt="lg" mb="lg">
        <Group>
          <Button onClick={openCreate}>
            {t('accountPages.newForm')}
          </Button>
          <Text>{t('accountPages.formsDescription')}</Text>
        </Group>
        <Select
          data={paginationOptions}
          value={perPage.toString()}
          onChange={(value) => {
            const newPerPage = parseInt(value || '10', 10);
            handlePerPageChange(newPerPage);
          }}
          size="sm"
          w={80}
        />
      </Flex>
      <FormsTable
        pagination={pagination.paginationConfig}
        onChange={handleFormsChange}
        openRowPage={openForm}
        updateCb={updateCb}
        deleteCb={api.deleteForm}
        perPage={perPage}
        onPerPageChange={handlePerPageChange}
      />
    </>
  );
}
