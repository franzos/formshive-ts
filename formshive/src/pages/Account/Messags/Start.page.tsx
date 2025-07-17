import { MessagesTable } from '../../../components/Message/Table';
import { useRustyState } from '../../../state';
import { LineChart } from '@mantine/charts';
import { Flex, Group, Text } from '@mantine/core';
import { useLanguageAwareRouting, usePagination } from '@gofranz/common-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Form, Message, MessageCountByDay } from '@gofranz/formshive-common';

export interface AccountFormsStartPageProps {
  formId?: string;
  showTableInfo?: boolean;
}

export function AccountMessagesStartPage(props: AccountFormsStartPageProps) {
  const { t } = useTranslation();
  const { api } = useRustyState.getState();
  const nav = useNavigate();
  const { createLanguageURL } = useLanguageAwareRouting();

  const [messageCount, setMessageCount] = useState<MessageCountByDay[]>([]);

  const getCount = async (params?: { is_spam?: boolean }) => {
    const formId = props.formId ? [props.formId] : undefined;
    const countParams: {
      form_ids?: string[];
      is_spam?: boolean;
    } = {};
    if (formId) {
      countParams.form_ids = formId;
    }
    if (params?.hasOwnProperty('is_spam') && params.is_spam !== undefined) {
      countParams.is_spam = params.is_spam;
    }

    const res = await api.getMessageCountByDay(countParams);
    setMessageCount(res);
  };

  const fetchMessages = async (params: { nextPage: number; [key: string]: any }) => {
    const { nextPage, ...otherParams } = params;
    const apiParams: any = {
      offset: nextPage === 1 ? 0 : 10 * (nextPage - 1),
      limit: 10,
      ...otherParams,
    };

    if (props.formId) {
      apiParams.form_id = props.formId;
    }

    const [, messagesResult] = await Promise.all([
      getCount({ is_spam: params.is_spam }),
      useRustyState.getState().getMessagesWithForms(apiParams),
    ]);

    return {
      data: messagesResult.data,
      total: messagesResult.total,
    };
  };

  const pagination = usePagination({
    perPage: 10,
    fetchData: fetchMessages,
  });

  useEffect(() => {
    api.getForms({ limit: 25, offset: 0 });
  }, []);

  const openForm = (data: { msg: Message; form: Form | undefined }) => {
    nav(createLanguageURL(`/account/message/${data.msg.id}`));
  };

  const handleMessagesChange = async (params: { nextPage: number; [key: string]: any }) => {
    return await pagination.loadPage(params.nextPage, params);
  };

  return (
    <>
      <LineChart
        h={150}
        pr="lg"
        pb="lg"
        dataKey="date"
        data={messageCount.map((item) => ({
          date: item.date,
          Messages: item.message_count,
        }))}
        curveType="monotone"
        tickLine="none"
        gridAxis="y"
        withYAxis={false}
        series={[{ name: t('accountPages.messagesChartLabel'), color: 'indigo.6' }]}
      />
      {props.showTableInfo && (
        <Flex justify="flex-end">
          <Group>
            <Text mb="sm">{t('accountPages.messagesDescription')}</Text>
          </Group>
        </Flex>
      )}
      <MessagesTable
        pagination={pagination.paginationConfig}
        onChange={handleMessagesChange}
        openRowPage={openForm}
        updateCb={api.updateMessage}
        deleteCb={api.deleteMessage}
      />
    </>
  );
}
