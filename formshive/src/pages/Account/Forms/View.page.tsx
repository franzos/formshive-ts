import { Form, UpdateForm } from '@gofranz/formshive-common';
import { Container, Skeleton, Stack, Card, Group, Title, Tabs, Accordion, Alert, Button, Box } from '@mantine/core';
import { IconHtml, IconBox, IconFrame, IconLink, IconSettings, IconChecklist, IconMailForward, IconMail, IconWebhook, IconAlertCircle, IconFolderOpen } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormDetail } from '../../../components/Form/Detail';
import { useRustyState } from '../../../state';

export function AccountFormViewPage() {
  const { api } = useRustyState.getState();
  const { uuid } = useParams<{ uuid: string }>();
  const [form, setForm] = useState<Form | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getForm = async () => {
      if (!uuid) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const res = await api.getForm(uuid);
        if (res) {
          setForm(res);
        }
      } finally {
        setIsLoading(false);
      }
    };
    getForm();
  }, []);

  const getFormVerifiedEmails = async () => {
    if (!uuid) {
      return {
        data: [],
        total: 0,
      };
    }
    // TODO: Why query by form ID
    return useRustyState.getState().getAndSetFormVerifiedEmails(uuid);
  };

  const updateForm = async (id: string, data: UpdateForm) => {
    await api.updateForm(id, data);
    const _form = await api.getForm(id);
    if (_form) {
      setForm(_form);
    }
  };

  // Fine-grained skeleton loader that accurately mimics FormDetail layout
  const FormDetailSkeleton = () => (
    <Stack gap="xl">

      {/* INTEGRATION SECTION - Detailed skeleton */}
      <Box mb="md">
        <Title order={2} mb="md">Integration</Title>

        {/* Integration alert */}
        <Alert icon={<IconAlertCircle size={16} />} title="Which method should I choose?" color="blue" mb="md">
          <Group gap="md">
            <Skeleton height={14} width="90%" />
            <Skeleton height={14} width="80%" />
            <Skeleton height={14} width="85%" />
          </Group>
        </Alert>

        {/* Integration tabs with realistic tab structure */}
        <Tabs defaultValue="manual">
          <Tabs.List>
            <Tabs.Tab value="manual" leftSection={<IconHtml size={14} />}>
              <Box>
                <Skeleton height={16} width={100} mb={2} />
                <Group gap="4px">
                  <Skeleton height={12} width={80} />
                  <Skeleton height={12} width={70} />
                </Group>
              </Box>
            </Tabs.Tab>
            <Tabs.Tab value="embed" leftSection={<IconBox size={14} />}>
              <Box>
                <Skeleton height={16} width={90} mb={2} />
                <Group gap="4px">
                  <Skeleton height={12} width={60} />
                  <Skeleton height={12} width={55} />
                </Group>
              </Box>
            </Tabs.Tab>
            <Tabs.Tab value="iframe" leftSection={<IconFrame size={14} />}>
              <Box>
                <Skeleton height={16} width={70} mb={2} />
                <Group gap="4px">
                  <Skeleton height={12} width={70} />
                  <Skeleton height={12} width={80} />
                </Group>
              </Box>
            </Tabs.Tab>
            <Tabs.Tab value="link" leftSection={<IconLink size={14} />}>
              <Box>
                <Skeleton height={16} width={60} mb={2} />
                <Group gap="4px">
                  <Skeleton height={12} width={70} />
                  <Skeleton height={12} width={75} />
                </Group>
              </Box>
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="manual" pt="md">
            <Skeleton height={18} width="60%" mb="md" />

            {/* Success/validation alerts */}
            <Group gap="md" mb="md" align="stretch">
              <Alert color="green" style={{ flex: 1 }}>
                <Skeleton height={12} width="90%" />
              </Alert>
              <Alert color="yellow" style={{ flex: 1 }}>
                <Skeleton height={12} width="85%" />
              </Alert>
            </Group>

            {/* Form URL inputs */}
            <Card withBorder p="md" radius="sm" mb="md">
              <Stack gap="md">
                <div>
                  <Skeleton height={14} width={80} mb="xs" />
                  <Skeleton height={36} width="100%" />
                  <Skeleton height={12} width="70%" mt="xs" />
                </div>
                <div>
                  <Skeleton height={14} width={90} mb="xs" />
                  <Skeleton height={36} width="100%" />
                  <Skeleton height={12} width="75%" mt="xs" />
                </div>
              </Stack>
            </Card>

            {/* See examples button */}
            <Group justify="left" mb={5}>
              <Button variant="light" leftSection={<IconFolderOpen />}>
                <Skeleton height={14} width={80} />
              </Button>
            </Group>
          </Tabs.Panel>
        </Tabs>
      </Box>

      {/* SETTINGS SECTION - Detailed accordion skeleton */}
      <div>
        <Title order={2} mb="sm">Settings</Title>

        <Accordion variant="contained">
          <Accordion.Item value="form-fields">
            <Accordion.Control>
              <Group wrap="nowrap">
                <IconSettings size={20} />
                <div>
                  <Skeleton height={16} width={80} mb={4} />
                  <Skeleton height={12} width={150} />
                </div>
              </Group>
            </Accordion.Control>
          </Accordion.Item>

          <Accordion.Item value="specifications">
            <Accordion.Control>
              <Group wrap="nowrap">
                <IconChecklist size={20} />
                <div>
                  <Skeleton height={16} width={120} mb={4} />
                  <Skeleton height={12} width={180} />
                </div>
              </Group>
            </Accordion.Control>
          </Accordion.Item>

          <Accordion.Item value="forwarding">
            <Accordion.Control>
              <Group wrap="nowrap">
                <IconMailForward size={20} />
                <div>
                  <Skeleton height={16} width={130} mb={4} />
                  <Skeleton height={12} width={160} />
                </div>
              </Group>
            </Accordion.Control>
          </Accordion.Item>

          <Accordion.Item value="autoresponse">
            <Accordion.Control>
              <Group wrap="nowrap">
                <IconMail size={20} />
                <div>
                  <Skeleton height={16} width={100} mb={4} />
                  <Skeleton height={12} width={200} />
                </div>
              </Group>
            </Accordion.Control>
          </Accordion.Item>

          <Accordion.Item value="integrations">
            <Accordion.Control>
              <Group wrap="nowrap">
                <IconWebhook size={20} />
                <div>
                  <Skeleton height={16} width={90} mb={4} />
                  <Skeleton height={12} width={170} />
                </div>
              </Group>
            </Accordion.Control>
          </Accordion.Item>
        </Accordion>
      </div>

      {/* MESSAGES SECTION - Realistic skeleton */}
      <div>
        <Title order={2} mt="xl" mb="xs">Messages</Title>

        {/* Analytics cards skeleton */}
        <Stack gap="md" mb="xl">
          <Group grow>
            <Card padding="md" withBorder>
              <Skeleton height={12} width={80} mb="xs" />
              <Skeleton height={32} width={60} />
            </Card>
            <Card padding="md" withBorder>
              <Skeleton height={12} width={100} mb="xs" />
              <Skeleton height={32} width={70} />
            </Card>
            <Card padding="md" withBorder>
              <Skeleton height={12} width={90} mb="xs" />
              <Skeleton height={32} width={50} />
            </Card>
          </Group>

          {/* Chart skeleton */}
          <Skeleton height={200} width="100%" />

          {/* Messages table skeleton */}
          <Card withBorder>
            <Stack gap="md">
              <Group justify="space-between">
                <Skeleton height={16} width={120} />
                <Skeleton height={32} width={80} />
              </Group>
              <Stack gap="xs">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Group key={i} justify="space-between" p="sm" style={{ borderBottom: '1px solid #eee' }}>
                    <div style={{ flex: 1 }}>
                      <Skeleton height={14} width="60%" mb={4} />
                      <Skeleton height={12} width="40%" />
                    </div>
                    <Skeleton height={12} width={80} />
                    <Skeleton height={28} width={60} />
                  </Group>
                ))}
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </div>
    </Stack>
  );

  return (
    <Container fluid>
      {isLoading ? (
        <FormDetailSkeleton />
      ) : form && form.id ? (
        <FormDetail
          form={form}
          submitFormCb={updateForm}
          submitFormRecipientCb={api.newFormRecipient}
          deleteCb={api.deleteForm}
          getVerifiedEmails={useRustyState.getState().getAndSetVerifiedEmails}
          getFormVerifiedEmails={getFormVerifiedEmails}
          deleteRecipientCp={api.deleteFormRecipient}
          submitFormIntegrationCb={api.newFormsIntegration}
          getIntegrations={api.getIntegrations}
          getFormIntegrations={api.getFormsIntegrations}
          deleteFormIntegrationCb={api.deleteFormsIntegration}
        />
      ) : (
        <div>Form not found</div>
      )}
    </Container>
  );
}
