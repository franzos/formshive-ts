import { LargeTitleWithText } from '@gofranz/common-components';
import { Container } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IntegrationsHelp } from '../components/Integrations';
import { Footer } from '../components/Layout/Footer';

export function IntegrationsPage() {
  const { t } = useTranslation();

  return (
    <>
      <Container size="lg" py="xl">
        <LargeTitleWithText
          title={t('glob_navigation.integrations')}
          text={t('integrations.description')}
          mb="xl"
        />
        <IntegrationsHelp />
      </Container>

      <Footer />
    </>
  );
}
