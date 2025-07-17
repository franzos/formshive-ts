import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'mantine-datatable';
import { useTranslation } from 'react-i18next';
import { Badge, Box, Button, Code, Group, Slider, Text, Tooltip, NavLink } from '@mantine/core';
import { IconCapture, IconDownload, IconTrash } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { Link } from 'react-router-dom';
import { useRustyState } from '../../state';
import { CommonTableProps } from '../../lib/table';
import { File, Form, HttpUpdateMessage, Message } from '@gofranz/formshive-common';

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
  const page = useRef(1);
  const spamFilter = useRef(0);

  const SPAM_FILTER: SpamFilter[] = [
    { value: 0, label: t('messageTable.spamAndHam') },
    { value: 1, label: t('messageTable.spam') },
    { value: 2, label: t('messageTable.ham') },
  ];

  const loadRecords = async () => {
    setIsBusy(true);
    try {
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
    await props.updateCb(message.id, { user_marked_spam: !message.is_spam });
    setRecords((prev) =>
      prev.map((m) => {
        if (m.id === message.id) {
          return { ...m, is_spam: !m.is_spam };
        }
        return m;
      })
    );
    setIsBusy(false);
    notifications.show({
      title: t('messageTable.messageUpdated'),
      message: `Message ${message.is_spam ? t('messageTable.markedAsHam') : t('messageTable.markedAsSpam')}`,
      autoClose: 15000,
    });
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

  const columns = [
    {
      accessor: 'Content',
      title: t('messageTable.content'),
      render: (row: Message) => messagePreview(row),
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

  return (
    <Box>
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
