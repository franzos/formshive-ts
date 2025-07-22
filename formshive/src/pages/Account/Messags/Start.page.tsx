import { useLanguageAwareRouting, usePagination } from '@gofranz/common-components';
import { Form, FormAnalyticsResponse, Message } from '@gofranz/formshive-common';
import { LineChart } from '@mantine/charts';
import { Card, Flex, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MessagesTable } from '../../../components/Message/Table';
import { useRustyState } from '../../../state';

export interface AccountFormsStartPageProps {
  formId?: string;
  showTableInfo?: boolean;
}

export function AccountMessagesStartPage(props: AccountFormsStartPageProps) {
  const { t } = useTranslation();
  const { api } = useRustyState.getState();
  const nav = useNavigate();
  const { createLanguageURL } = useLanguageAwareRouting();

  const [analyticsResponse, setAnalyticsResponse] = useState<FormAnalyticsResponse | null>(null);

  const getAnalytics = async (params?: { is_spam?: boolean }) => {
    const formId = props.formId ? [props.formId] : undefined;
    const countParams: {
      form_ids?: string[];
      is_spam?: boolean;
      data_type?: 'views' | 'messages' | 'combined';
    } = {
      data_type: 'combined'
    };
    if (formId) {
      countParams.form_ids = formId;
    }
    if (params?.hasOwnProperty('is_spam') && params.is_spam !== undefined) {
      countParams.is_spam = params.is_spam;
    }

    const res = await api.getMessageCountByDay(countParams) as unknown as FormAnalyticsResponse;
    setAnalyticsResponse(res);
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
      getAnalytics({ is_spam: params.is_spam }),
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
    getAnalytics();
  }, []);

  const openForm = (data: { msg: Message; form: Form | undefined }) => {
    nav(createLanguageURL(`/account/message/${data.msg.id}`));
  };

  const handleMessagesChange = async (params: { nextPage: number; [key: string]: any }) => {
    return await pagination.loadPage(params.nextPage, params);
  };

  return (
    <>
      <Stack gap="md">
        {analyticsResponse && (
          <SimpleGrid cols={3}>
            <Card padding="md" withBorder>
              <Text size="sm" c="dimmed">{t('accountPages.totalViews')}</Text>
              <Text size="xl" fw={700}>
                {analyticsResponse.view_count}
              </Text>
            </Card>
            <Card padding="md" withBorder>
              <Text size="sm" c="dimmed">{t('accountPages.totalMessages')}</Text>
              <Text size="xl" fw={700}>
                {analyticsResponse.message_count}
              </Text>
            </Card>
            <Card padding="md" withBorder>
              <Text size="sm" c="dimmed">{t('accountPages.conversionRate')}</Text>
              <Text size="xl" fw={700}>
                {Math.min(analyticsResponse.conversion_rate, 100).toFixed(1)}%
              </Text>
            </Card>
          </SimpleGrid>
        )}

        <LineChart
          h={200}
          pr="lg"
          pb="lg"
          dataKey="date"
          data={analyticsResponse?.data.map((item) => ({
            date: item.date,
            Views: item.view_count,
            Messages: item.message_count,
          })) || []}
          curveType="monotone"
          tickLine="none"
          gridAxis="y"
          withYAxis={false}
          series={[
            { name: t('accountPages.views'), color: 'blue.6' },
            { name: t('accountPages.messages'), color: 'indigo.6' },
          ]}
        />
      </Stack>
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
