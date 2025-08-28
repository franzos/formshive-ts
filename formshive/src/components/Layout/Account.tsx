import { ColorSchemeToggle, useSessionCheck } from '@gofranz/common-components';
import {
  AppShell,
  Box,
  Burger,
  Group,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRustyState } from '../../state';
import { LanguageSelector } from '../LanguageSelector/LanguageSelector';
import { AccountNavigation } from './AccountNavigation';

export interface AccountLayoutProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
}

export function AccountLayout({ children, isLoggedIn }: AccountLayoutProps) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  // Use the shared session check hook
  useSessionCheck({
    auth: useRustyState.getState().api.auth,
    isLoggedIn,
    logout: useRustyState.getState().logout,
    checkInterval: 10000, // 10 seconds
  });

  return (
    <Box>
      <AppShell
          header={{ height: 60 }}
          navbar={{
            width: 300,
            breakpoint: 'sm',
            collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
          }}
          padding="md"
        >
          <AppShell.Header>
            <Group h="100%" px="md" justify="space-between">
              <Group>
                <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
                <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
              </Group>
              <Group>
                <LanguageSelector />
                <ColorSchemeToggle />
              </Group>
            </Group>
          </AppShell.Header>
          <AccountNavigation />
          <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </Box>
  );
}
