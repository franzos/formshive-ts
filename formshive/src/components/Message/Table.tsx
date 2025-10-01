import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'mantine-datatable';
import { useTranslation } from 'react-i18next';
import { Badge, Box, Button, Code, Group, Slider, Text, Tooltip, NavLink } from '@mantine/core';
import { IconCapture, IconDownload, IconTrash, IconWorld } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useRustyState } from '../../state';
import { CommonTableProps } from '../../lib/table';
import { File, Form, FormView, HttpUpdateMessage, Message, LocationInfo } from '@gofranz/formshive-common';

interface SpamFilter {
  value: number;
  label: string;
}

export function MessagesTable(
  props: CommonTableProps<
    {
      msg: Message;
      form: Form | undefined;
      files: File[];
    },
    HttpUpdateMessage
  >
) {
  const { t } = useTranslation();
  const [isBusy, setIsBusy] = useState(false);
  const [records, setRecords] = useState<Message[] | []>([]);
  const [forms, setForms] = useState<Form[] | []>([]);
  const [files, setFiles] = useState<File[] | []>([]);
  const [viewData, setViewData] = useState<Map<string, FormView | null>>(new Map());
  const [loadingViews, setLoadingViews] = useState<Set<string>>(new Set());
  const page = useRef(1);
  const spamFilter = useRef(0);

  const SPAM_FILTER: SpamFilter[] = [
    { value: 0, label: t('messageTable.spamAndHam') },
    { value: 1, label: t('messageTable.spam') },
    { value: 2, label: t('messageTable.ham') },
  ];

  const fetchMessageView = async (messageId: string) => {
    if (viewData.has(messageId) || loadingViews.has(messageId)) {
      return; // Already loaded or loading
    }

    setLoadingViews(prev => new Set(prev).add(messageId));
    
    try {
      const view = await useRustyState.getState().api.getMessageView(messageId);
      setViewData(prev => new Map(prev).set(messageId, view));
    } catch (error) {
      console.error('Failed to fetch message view:', error);
      setViewData(prev => new Map(prev).set(messageId, null));
    } finally {
      setLoadingViews(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }
  };

  const loadRecords = async () => {
    setIsBusy(true);
    try {
      if (page.current === 1) {
        await useRustyState.getState().getAndSetForms();
      }

      const data =
        spamFilter.current === 0
          ? await props.onChange({
              nextPage: page.current,
            })
          : await props.onChange({
              nextPage: page.current,
              is_spam: spamFilter.current === 1,
            });
      const msgs: Message[] = [];
      const newForms: Form[] = [];
      let newFiles: File[] = [];
      data.forEach((d) => {
        if (d.msg) {
          msgs.push(d.msg);
        }
        if (d.form && !newForms.includes(d.form)) {
          newForms.push(d.form);
        }
        if (d.files) {
          newFiles = [...newFiles, ...d.files];
        }
      });
      setRecords(msgs);
      setForms(newForms);
      setFiles(newFiles);
    } catch (e) {
      alert(e);
      console.error(e);
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    const doIt = async () => {
      await loadRecords();
    };
    doIt();
  }, []);

  const toggleSpam = async (message: Message) => {
    setIsBusy(true);
    if (!props.updateCb) {
      alert(t('messageTable.couldNotToggleSpam'));
      return;
    }

    const customNotification = {
      onSuccess: {
        title: t('messageTable.messageUpdated'),
        message: `Message ${message.is_spam ? t('messageTable.markedAsHam') : t('messageTable.markedAsSpam')}`,
      }
    };

    await props.updateCb(message.id, { user_marked_spam: !message.is_spam }, customNotification);
    setRecords((prev) =>
      prev.map((m) => {
        if (m.id === message.id) {
          return { ...m, is_spam: !m.is_spam };
        }
        return m;
      })
    );
    setIsBusy(false);
  };

  const deleteCb = async (id: string) => {
    setIsBusy(true);
    await props.deleteCb(id);
    setRecords((prev) => prev.filter((m) => m.id !== id));
    setIsBusy(false);
  };

  const messagePreview = (message: Message) => {
    const msgData = JSON.parse(message.data);
    let data = '';
    Object.keys(msgData).map((key) => (data += `${key}: ${msgData[key]}, `));
    return `${data.substring(0, 120)}...`;
  };

  const filesPreview = (message_id: string) => {
    const msgFiles = files.filter((f) => f.message_id === message_id);
    return msgFiles.length > 0 ? `${msgFiles.length}x` : '-';
  };

  const downloadFile = async (id: string) => {
    const signedUrl = await useRustyState.getState().downloadFile(id);
    console.log(signedUrl);
    if (signedUrl) {
      const link = document.createElement('a');
      link.href = signedUrl;
      link.setAttribute('download', 'true'); // Optional: Suggests to the browser to download rather than navigate.
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const messageHasFiles = (message_id: string) =>
    files.filter((f) => f.message_id === message_id).length > 0;

  const filesDownload = (message_id: string) => {
    const msgFiles = files.filter((f) => f.message_id === message_id);
    return (
      <Group>
        {msgFiles.map((f) => (
          <Button
            leftSection={<IconDownload style={{ width: '70%', height: '70%' }} />}
            key={`files-to-download-${message_id}-${f.id}`}
            color="gray"
            size="compact-sm"
            onClick={() => downloadFile(f.id)}
          >
            Download {f.filename} ({f.size} bytes)
          </Button>
        ))}
      </Group>
    );
  };

  const formPreview = (form_id: string) => {
    const form = forms.find((f) => f.id === form_id);
    return form ? (
      <NavLink component={Link} to={`/account/forms/${form_id}`} label={form.title} />
    ) : (
      '-'
    );
  };

  const dateTime = (date: Date) => (
    <Tooltip inline label={date.toLocaleString()}>
      <Text>{date.toLocaleDateString()}</Text>
    </Tooltip>
  );

  const spamBadge = (is_spam: boolean, spamScore: number) => (
    <Badge color={is_spam ? 'red' : 'green'}>{spamScore.toFixed(2)}</Badge>
  );

  const locationColumn = (location?: LocationInfo) => {
    if (!location?.country_code) {
      return (
        <Tooltip label="Location unknown">
          <IconWorld size={16} color="gray" />
        </Tooltip>
      );
    }

    const locationText = [
      location.country_code,
      location.city
    ].filter(Boolean).join(', ');

    return (
      <Tooltip label={locationText}>
        <Group gap="xs">
          <IconWorld size={16} />
          <Text size="sm">{location.country_code}</Text>
        </Group>
      </Tooltip>
    );
  };

  const formatLocationDetails = (location?: LocationInfo) => {
    if (!location) {
      return (
        <Text size="xs" c="dimmed">
          Unknown
        </Text>
      );
    }

    const locationParts = [
      location.city,
      location.region_name,
      location.country_name || location.country_code
    ].filter(Boolean);

    return (
      <Box>
        <Text size="xs" c="dimmed">
          Location: <Text span fw={500}>{locationParts.join(', ') || 'Unknown'}</Text>
        </Text>
        {location.timezone && (
          <Text size="xs" c="dimmed">
            Timezone: <Text span fw={500}>{location.timezone}</Text>
          </Text>
        )}
        {location.latitude && location.longitude && (
          <Text size="xs" c="dimmed">
            Coordinates: <Text span fw={500}>{location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</Text>
          </Text>
        )}
      </Box>
    );
  };

  const columns = [
    {
      accessor: 'Content',
      title: t('messageTable.content'),
      render: (row: Message) => messagePreview(row),
    },
    {
      accessor: 'Location',
      title: "",
      render: (row: Message) => locationColumn(row.location),
    },
    {
      accessor: 'Form',
      title: t('messageTable.form'),
      render: (row: Message) => formPreview(row.form_id),
    },
    {
      accessor: 'Files',
      title: t('messageTable.files'),
      render: (row: Message) => filesPreview(row.id),
    },
    {
      accessor: 'is_spam',
      title: t('messageTable.spam'),
      render: (row: Message) => spamBadge(row.is_spam, row.spam_score),
    },
    {
      accessor: 'created_at',
      title: t('messageTable.createdAt'),
      render: (row: Message) => dateTime(new Date(row.created_at)),
    },
  ];

  const formatTimeDifference = (viewTime: string, messageTime: string): string => {
    const viewDate = new Date(viewTime);
    const messageDate = new Date(messageTime);
    const diffMs = messageDate.getTime() - viewDate.getTime();
    
    if (diffMs < 0) {
      return 'Message submitted before view (unusual)';
    }
    
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} after view`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} after view`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} after view`;
    } else {
      return `${diffSeconds} second${diffSeconds > 1 ? 's' : ''} after view`;
    }
  };

  const downloadMessage = (message: Message, format: 'json' | 'txt') => {
    const msgData = JSON.parse(message.data);
    let data = '';
    if (format === 'json') {
      data = JSON.stringify(msgData, null, 2);
    } else {
      Object.keys(msgData).map((key) => (data += `${key}: ${msgData[key]}\n`));
    }

    const element = document.createElement('a');
    const file = new Blob([data], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `rusty-forms-message-${message.id}.${format}`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const expandedRowHtml = (
    row: Message,
    loading: boolean,
    toggleSpamCb: (record: Message) => void,
    deleteCbRow: (id: string) => void
  ) => {
    const data = JSON.parse(row.data);
    return (
      <Box>
        <Code block>
          {Object.keys(data).map((key) => (
            <Box key={`data-${key}`}>
              <Text>
                {key}: {Array.isArray(data[key]) ? data[key].join(', ') : data[key]}
              </Text>
            </Box>
          ))}
        </Code>

        {messageHasFiles(row.id) && (
          <Box mt="md">
            <Text size="sm">Files:</Text>
            {filesDownload(row.id)}
          </Box>
        )}

        {/* View Analytics Section */}
        <Box mt="md">
          <Text size="sm" fw={500} mb="xs">View Analytics:</Text>
          {(() => {
            const view = viewData.get(row.id);
            const isLoading = loadingViews.has(row.id);
            
            if (isLoading) {
              return <Text size="sm" c="dimmed">Loading view data...</Text>;
            }
            
            if (view === null) {
              return <Text size="sm" c="dimmed">No associated form view found</Text>;
            }
            
            if (view === undefined) {
              // Not loaded yet, trigger fetch
              fetchMessageView(row.id);
              return <Text size="sm" c="dimmed">Click to load view data...</Text>;
            }
            
            return (
              <Box>
                <Group gap="md" mb="xs">
                  <Badge color="blue" variant="light">
                    {view.device_type || 'Unknown'} Device
                  </Badge>
                  <Badge color="green" variant="light">
                    {view.browser_name || 'Unknown'} Browser
                  </Badge>
                  {view.location?.country_code && (
                    <Badge color="orange" variant="light">
                      {view.location.country_code}
                    </Badge>
                  )}
                </Group>
                <Text size="xs" c="dimmed">
                  Form submitted{' '}
                  <Text span fw={500}>
                    {formatTimeDifference(view.created_at, row.created_at)}
                  </Text>
                </Text>
                {view.traffic_source && (
                  <Text size="xs" c="dimmed">
                    Traffic source: <Text span fw={500}>{view.traffic_source}</Text>
                  </Text>
                )}
                <Box mb="sm" mt="sm">
                  <Text size="xs" fw={500} c="orange">Location:</Text>
                  {formatLocationDetails(row.location)}
                </Box>
              </Box>
            );
          })()}
        </Box>

        <Group mt="md">
          <Button
            onClick={() => downloadMessage(row, 'json')}
            loading={loading}
            color="blue"
            mb="xs"
            size="compact-sm"
            leftSection={<IconDownload style={{ width: '70%', height: '70%' }} />}
          >
            {t('messageTable.downloadJson')}
          </Button>
          <Button
            onClick={() => downloadMessage(row, 'txt')}
            loading={loading}
            color="blue"
            mb="xs"
            size="compact-sm"
            leftSection={<IconDownload style={{ width: '70%', height: '70%' }} />}
          >
            {t('messageTable.downloadTxt')}
          </Button>
          <Button
            onClick={() => toggleSpamCb(row)}
            loading={loading}
            color={row.is_spam ? 'teal' : 'red'}
            mb="xs"
            size="compact-sm"
            leftSection={<IconCapture style={{ width: '70%', height: '70%' }} />}
          >
            {row.is_spam ? t('messageTable.markAsHam') : t('messageTable.markAsSpam')}
          </Button>
          <Button
            onClick={() => deleteCbRow(row.id)}
            loading={loading}
            color="red"
            mb="xs"
            size="compact-sm"
            leftSection={<IconTrash style={{ width: '70%', height: '70%' }} />}
          >
            {t('messageTable.delete')}
          </Button>
        </Group>
      </Box>
    );
  };

  function getSpamFilterLabelOrDefault(value: number) {
    return SPAM_FILTER.find((mark) => mark.value === value)?.label || t('messageTable.spamAndHam');
  }

  // Handle perPage change triggered from parent
  useEffect(() => {
    if (props.perPage) {
      page.current = 1;
      loadRecords();
    }
  }, [props.perPage]);

  return (
    <Box>
      <Box style={{ position: 'relative' }}>
        <Slider
          labelAlwaysOn
          p="xl"
          maw={400}
          label={(val) => getSpamFilterLabelOrDefault(val)}
          defaultValue={0}
          step={1}
          min={0}
          max={2}
          marks={SPAM_FILTER}
          styles={{ markLabel: { display: 'none' } }}
          onChange={(value) => {
            page.current = 1;
            spamFilter.current = value;
            loadRecords();
          }}
        />
        <Box style={{ position: 'absolute', top: '20px', right: '0' }}>
          {props.headerActions}
        </Box>
      </Box>
      <DataTable
        withTableBorder
        borderRadius="md"
        shadow="xs"
        records={records}
        columns={columns}
        totalRecords={props.pagination.total}
        recordsPerPage={props.pagination.perPage}
        page={page.current}
        onPageChange={(p) => {
          page.current = p;
          loadRecords();
        }}
        fetching={isBusy}
        loadingText={t('messageTable.loading')}
        noRecordsText={t('messageTable.noMessagesFound')}
        rowExpansion={{
          content: ({ record }) => (
            <Box p="md">
              <pre>{expandedRowHtml(record, isBusy, toggleSpam, deleteCb)}</pre>
            </Box>
          ),
        }}
      />
    </Box>
  );
}
