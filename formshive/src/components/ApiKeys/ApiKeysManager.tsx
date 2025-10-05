import { ApiKeyCreateRequest, ApiKeyResponse, ApiKeyUpdateRequest } from '@gofranz/common';
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  CopyButton,
  Group,
  Modal,
  MultiSelect,
  NumberInput,
  Stack,
  Switch,
  Text,
  TextInput,
  Tooltip,
  useComputedColorScheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconCheck,
  IconCopy,
  IconEdit,
  IconKey,
  IconPlus,
  IconTrash,
  IconAlertCircle,
} from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { useRustyState } from '../../state';

const SCOPE_OPTIONS = [
  { value: 'forms:read', label: 'Forms (Read)' },
  { value: 'forms:write', label: 'Forms (Write)' },
  { value: 'forms:*', label: 'Forms (All)' },
  { value: 'messages:read', label: 'Messages (Read)' },
  { value: 'messages:write', label: 'Messages (Write)' },
  { value: 'messages:*', label: 'Messages (All)' },
  { value: 'integrations:read', label: 'Integrations (Read)' },
  { value: 'integrations:write', label: 'Integrations (Write)' },
  { value: 'integrations:*', label: 'Integrations (All)' },
];

export function ApiKeysManager() {
  const { api } = useRustyState.getState();
  const computedColorScheme = useComputedColorScheme('light');
  const isDark = computedColorScheme === 'dark';

  const [apiKeys, setApiKeys] = useState<ApiKeyResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<ApiKeyResponse | null>(null);
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  const createForm = useForm<ApiKeyCreateRequest>({
    initialValues: {
      name: '',
      scope: [],
      expires_in_days: 30,
    },
    validate: {
      name: (value) => (value.length < 3 ? 'Name must be at least 3 characters' : null),
      expires_in_days: (value) =>
        value && (value < 1 || value > 365) ? 'Must be between 1 and 365 days' : null,
    },
  });

  const editForm = useForm<ApiKeyUpdateRequest>({
    initialValues: {
      name: '',
      is_active: true,
      scope: [],
    },
  });

  const loadApiKeys = async () => {
    setLoading(true);
    try {
      const keys = await api.listApiKeys();
      setApiKeys(keys);
    } catch (error) {
      console.error('Failed to load API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApiKeys();
  }, []);

  const handleCreate = async (values: ApiKeyCreateRequest) => {
    setLoading(true);
    try {
      const response = await api.createApiKey(values);
      setCreatedKey(response.key || null);
      await loadApiKeys();
      createForm.reset();
      setCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create API key:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (values: ApiKeyUpdateRequest) => {
    if (!selectedKey) return;
    setLoading(true);
    try {
      await api.updateApiKey(selectedKey.id, values);
      await loadApiKeys();
      setEditModalOpen(false);
      setSelectedKey(null);
    } catch (error) {
      console.error('Failed to update API key:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedKey) return;
    setLoading(true);
    try {
      await api.deleteApiKey(selectedKey.id);
      await loadApiKeys();
      setDeleteModalOpen(false);
      setSelectedKey(null);
    } catch (error) {
      console.error('Failed to delete API key:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (key: ApiKeyResponse) => {
    setSelectedKey(key);
    editForm.setValues({
      name: key.name,
      is_active: key.is_active,
      scope: key.scope || [],
    });
    setEditModalOpen(true);
  };

  const openDeleteModal = (key: ApiKeyResponse) => {
    setSelectedKey(key);
    setDeleteModalOpen(true);
  };

  const columns = [
    {
      accessor: 'name',
      title: 'Name',
      render: (row: ApiKeyResponse) => (
        <Group gap="xs">
          <IconKey size={16} />
          <Text fw={500}>{row.name}</Text>
        </Group>
      ),
    },
    {
      accessor: 'scope',
      title: 'Scope',
      render: (row: ApiKeyResponse) => (
        <Group gap="xs">
          {row.scope && row.scope.length > 0 ? (
            row.scope.slice(0, 3).map((s, idx) => (
              <Badge key={idx} size="sm" variant="light">
                {s}
              </Badge>
            ))
          ) : (
            <Text size="sm" c="dimmed">
              No scope
            </Text>
          )}
          {row.scope && row.scope.length > 3 && (
            <Badge size="sm" variant="light">
              +{row.scope.length - 3}
            </Badge>
          )}
        </Group>
      ),
    },
    {
      accessor: 'is_active',
      title: 'Status',
      render: (row: ApiKeyResponse) => (
        <Badge color={row.is_active ? 'green' : 'gray'} variant="light">
          {row.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      accessor: 'created_at',
      title: 'Created',
      render: (row: ApiKeyResponse) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      accessor: 'expires_at',
      title: 'Expires',
      render: (row: ApiKeyResponse) =>
        row.expires_at ? (
          new Date(row.expires_at).toLocaleDateString()
        ) : (
          <Text size="sm" c="dimmed">
            Never
          </Text>
        ),
    },
    {
      accessor: 'actions',
      title: '',
      render: (row: ApiKeyResponse) => (
        <Group gap="xs">
          <ActionIcon
            variant="light"
            color="blue"
            onClick={() => openEditModal(row)}
            aria-label="Edit"
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            variant="light"
            color="red"
            onClick={() => openDeleteModal(row)}
            aria-label="Delete"
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      ),
    },
  ];

  return (
    <Stack gap="md">
      {/* Created Key Alert */}
      {createdKey && (
        <Alert
          color="green"
          title="API Key Created Successfully"
          icon={<IconAlertCircle />}
          withCloseButton
          onClose={() => setCreatedKey(null)}
        >
          <Text size="sm" mb="xs">
            This is your API key. Copy it now - you won't be able to see it again!
          </Text>
          <Group gap="md" align="center">
            <Text
              size="sm"
              ff="monospace"
              p="sm"
              style={{
                backgroundColor: isDark ? 'var(--mantine-color-gray-9)' : 'var(--mantine-color-gray-1)',
                borderRadius: '6px',
                border: isDark
                  ? '1px solid var(--mantine-color-gray-6)'
                  : '1px solid var(--mantine-color-gray-3)',
                wordBreak: 'break-all',
                flexGrow: 1,
              }}
            >
              {createdKey}
            </Text>
            <CopyButton value={createdKey} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied!' : 'Copy'} withArrow position="right">
                  <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy} size="lg">
                    {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </Group>
        </Alert>
      )}

      {/* Create Button */}
      <Group justify="flex-end">
        <Button leftSection={<IconPlus size={16} />} onClick={() => setCreateModalOpen(true)}>
          Create API Key
        </Button>
      </Group>

      {/* API Keys Table */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <DataTable
          withTableBorder
          borderRadius="md"
          records={apiKeys}
          columns={columns}
          fetching={loading}
          loadingText="Loading API keys..."
          noRecordsText="No API keys found. Create your first one!"
          page={1}
          onPageChange={() => {}}
          totalRecords={apiKeys.length}
          recordsPerPage={apiKeys.length || 10}
        />
      </Card>

      {/* Create Modal */}
      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create API Key"
        size="lg"
      >
        <form onSubmit={createForm.onSubmit(handleCreate)}>
          <Stack gap="md">
            <TextInput
              label="Name"
              placeholder="My API Key"
              required
              {...createForm.getInputProps('name')}
            />
            <MultiSelect
              label="Scope"
              placeholder="Select permissions"
              data={SCOPE_OPTIONS}
              searchable
              {...createForm.getInputProps('scope')}
            />
            <TextInput
              label="Budget Allowance (optional)"
              placeholder="allowance:50000"
              description="Format: allowance:amount (e.g., allowance:50000 for 500 EUR limit)"
              onChange={(e) => {
                const value = e.target.value;
                if (value && !value.startsWith('allowance:')) {
                  return;
                }
                const currentScope = createForm.values.scope || [];
                const filteredScope = currentScope.filter((s) => !s.startsWith('allowance:'));
                if (value) {
                  createForm.setFieldValue('scope', [...filteredScope, value]);
                } else {
                  createForm.setFieldValue('scope', filteredScope);
                }
              }}
            />
            <NumberInput
              label="Expires in (days)"
              placeholder="30"
              min={1}
              max={365}
              {...createForm.getInputProps('expires_in_days')}
            />
            <Text size="sm" c="dimmed">
              Leave empty for no expiration
            </Text>
            <Group justify="flex-end">
              <Button variant="default" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Create
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit API Key"
        size="lg"
      >
        <form onSubmit={editForm.onSubmit(handleEdit)}>
          <Stack gap="md">
            <TextInput label="Name" placeholder="My API Key" {...editForm.getInputProps('name')} />
            <MultiSelect
              label="Scope"
              placeholder="Select permissions"
              data={SCOPE_OPTIONS}
              searchable
              {...editForm.getInputProps('scope')}
            />
            <Switch
              label="Active"
              description="Inactive keys cannot be used"
              {...editForm.getInputProps('is_active', { type: 'checkbox' })}
            />
            <Group justify="flex-end">
              <Button variant="default" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Update
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete API Key"
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to delete <strong>{selectedKey?.name}</strong>? This action cannot
            be undone.
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button color="red" onClick={handleDelete} loading={loading}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}