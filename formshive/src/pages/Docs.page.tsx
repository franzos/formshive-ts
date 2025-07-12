import { LargeTitleWithText } from '@gofranz/common-components';
import { Container } from '@mantine/core';
import { Docs } from '../components/Docs';
import { Footer } from '../components/Layout/Footer';

export function DocsPage() {
  return (
    <>
      <Container mt="xl" mb="xl">
        <LargeTitleWithText
          title="Docs"
          text="Connect your forms to the tools you already use. Send form submissions to CRM systems, email marketing platforms, team chat, spreadsheets, and thousands of other apps."
          mb="xl"
        />
        <Docs />
      </Container>
      <Footer />
    </>
  );
}
