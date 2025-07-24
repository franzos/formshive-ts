import { useLanguageAwareRouting, usePagination } from '@gofranz/common-components';
import { Form, FormAnalyticsResponse, FormAnalyticsAggregateResponse, Message } from '@gofranz/formshive-common';
import { LineChart } from '@mantine/charts';
import { Anchor, Card, Collapse, Flex, Group, LoadingOverlay, SimpleGrid, Stack, Text } from '@mantine/core';
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
  const [aggregateAnalytics, setAggregateAnalytics] = useState<FormAnalyticsAggregateResponse | null>(null);
  const [showAnalyticsBreakdown, setShowAnalyticsBreakdown] = useState(false);
  const [loadingAggregateAnalytics, setLoadingAggregateAnalytics] = useState(false);

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

  const getAggregateAnalytics = async (params?: { is_spam?: boolean }) => {
    try {
      setLoadingAggregateAnalytics(true);
      const aggregateParams: {
        form_ids?: string[];
        is_spam?: boolean;
      } = {};
      
      if (props.formId) {
        aggregateParams.form_ids = [props.formId];
      }
      if (params?.hasOwnProperty('is_spam') && params.is_spam !== undefined) {
        aggregateParams.is_spam = params.is_spam;
      }

      const res = await api.getAnalyticsAggregate(aggregateParams);
      setAggregateAnalytics(res);
    } finally {
      setLoadingAggregateAnalytics(false);
    }
  };

  const toggleAnalyticsBreakdown = async () => {
    if (!showAnalyticsBreakdown) {
      // Opening the breakdown
      setShowAnalyticsBreakdown(true);
      if (!aggregateAnalytics) {
        // Load data when opening for the first time
        await getAggregateAnalytics();
      }
    } else {
      // Closing the breakdown
      setShowAnalyticsBreakdown(false);
    }
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

    // Update aggregate analytics if breakdown is currently shown
    if (showAnalyticsBreakdown) {
      await getAggregateAnalytics({ is_spam: params.is_spam });
    }

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

        <Flex justify="space-between" align="center">
          <Text size="lg" fw={600}>{t('accountPages.analyticsBreakdown')}</Text>
          <Anchor onClick={toggleAnalyticsBreakdown} size="sm">
            {showAnalyticsBreakdown ? t('accountPages.seeLess') : t('accountPages.seeMore')}
          </Anchor>
        </Flex>

        <Collapse in={showAnalyticsBreakdown}>
          <div style={{ position: 'relative', minHeight: loadingAggregateAnalytics ? '400px' : 'auto' }}>
            <LoadingOverlay visible={loadingAggregateAnalytics} />
            {aggregateAnalytics && (
              <Stack gap="md">
            
            <SimpleGrid cols={4}>
              <Card padding="md" withBorder>
                <Text size="sm" c="dimmed" mb="xs">{t('accountPages.avgTimeToSubmit')}</Text>
                <Text size="xl" fw={700}>
                  {aggregateAnalytics.average_time_to_submit_message.average_time_seconds.toFixed(1)}s
                </Text>
              </Card>
              
              <Card padding="md" withBorder>
                <Text size="sm" c="dimmed" mb="xs">{t('accountPages.topCountry')}</Text>
                <Text size="lg" fw={600}>
                  {aggregateAnalytics.top_countries[0]?.country || 'N/A'}
                </Text>
                <Text size="xs" c="dimmed">
                  {aggregateAnalytics.top_countries[0]?.count || 0} {t('accountPages.submissions')}
                </Text>
              </Card>
              
              <Card padding="md" withBorder>
                <Text size="sm" c="dimmed" mb="xs">{t('accountPages.topCity')}</Text>
                <Text size="lg" fw={600}>
                  {aggregateAnalytics.top_cities[0]?.city || 'N/A'}
                </Text>
                <Text size="xs" c="dimmed">
                  {aggregateAnalytics.top_cities[0]?.count || 0} {t('accountPages.submissions')}
                </Text>
              </Card>
              
              <Card padding="md" withBorder>
                <Text size="sm" c="dimmed" mb="xs">{t('accountPages.topBrowser')}</Text>
                <Text size="lg" fw={600}>
                  {aggregateAnalytics.top_browsers[0]?.browser || 'N/A'}
                </Text>
                <Text size="xs" c="dimmed">
                  {aggregateAnalytics.top_browsers[0]?.count || 0} {t('accountPages.submissions')}
                </Text>
              </Card>
            </SimpleGrid>

            <SimpleGrid cols={3} spacing="md">
              <Card padding="md" withBorder>
                <Text size="sm" fw={600} mb="sm">{t('accountPages.topCountries')}</Text>
                <Stack gap="xs">
                  {aggregateAnalytics.top_countries.slice(0, 5).map((country) => (
                    <Flex key={country.country} justify="space-between" align="center">
                      <Text size="sm">{country.country}</Text>
                      <Text size="sm" fw={500}>{country.count}</Text>
                    </Flex>
                  ))}
                </Stack>
              </Card>
              
              <Card padding="md" withBorder>
                <Text size="sm" fw={600} mb="sm">{t('accountPages.topCities')}</Text>
                <Stack gap="xs">
                  {aggregateAnalytics.top_cities.slice(0, 5).map((city) => (
                    <Flex key={city.city} justify="space-between" align="center">
                      <Text size="sm">{city.city}</Text>
                      <Text size="sm" fw={500}>{city.count}</Text>
                    </Flex>
                  ))}
                </Stack>
              </Card>
              
              <Card padding="md" withBorder>
                <Text size="sm" fw={600} mb="sm">{t('accountPages.topBrowsers')}</Text>
                <Stack gap="xs">
                  {aggregateAnalytics.top_browsers.slice(0, 5).map((browser) => (
                    <Flex key={browser.browser} justify="space-between" align="center">
                      <Text size="sm">{browser.browser}</Text>
                      <Text size="sm" fw={500}>{browser.count}</Text>
                    </Flex>
                  ))}
                </Stack>
              </Card>
            </SimpleGrid>
              </Stack>
            )}
          </div>
        </Collapse>

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
