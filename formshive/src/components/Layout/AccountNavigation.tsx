import { useLanguageAwareRouting } from '@gofranz/common-components';
import { AppShell, NavLink } from '@mantine/core';
import {
  IconBook,
  IconCreditCard,
  IconForms,
  IconHelp,
  IconHome2,
  IconKey,
  IconLogout,
  IconMessage,
  IconRouteAltLeft,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useRustyState } from '../../state';

export function AccountNavigation() {
  const { t } = useTranslation();
  const { createLanguageURL, isActive } = useLanguageAwareRouting();

  const logout = async () => {
    await useRustyState.getState().logout();
    window.location.replace(createLanguageURL('/'));
  };

  return (
    <AppShell.Navbar p="md">
      <NavLink
        component={Link}
        to={createLanguageURL('/account')}
        label={t('glob_navigation.home')}
        leftSection={<IconHome2 size="18" stroke={1.5} />}
        active={isActive('/account')}
      />
      <NavLink
        component={Link}
        to={createLanguageURL('/account/forms')}
        label={t('glob_navigation.forms')}
        leftSection={<IconForms size="18" stroke={1.5} />}
        active={isActive('/account/forms')}
      />
      <NavLink
        component={Link}
        to={createLanguageURL('/account/integrations')}
        label={t('glob_navigation.integrations')}
        leftSection={<IconRouteAltLeft size="18" stroke={1.5} />}
        active={isActive('/account/integrations')}
      />
      <NavLink
        component={Link}
        to={createLanguageURL('/account/messages')}
        label={t('glob_navigation.messages')}
        leftSection={<IconMessage size="18" stroke={1.5} />}
        active={isActive('/account/messages')}
      />
      <NavLink
        label="Billing"
        leftSection={<IconCreditCard size="18" stroke={1.5} />}
        active={isActive('/account/billing/usage') || isActive('/account/billing/subscriptions')}
      >
        <NavLink
          component={Link}
          to={createLanguageURL('/account/billing/usage')}
          label="Usage & Credits"
          active={isActive('/account/billing/usage')}
        />
        <NavLink
          component={Link}
          to={createLanguageURL('/account/billing/subscriptions')}
          label="Subscriptions"
          active={isActive('/account/billing/subscriptions')}
        />
      </NavLink>
      <NavLink
        component={Link}
        to={createLanguageURL('/account/referrals')}
        label="Referrals"
        leftSection={<IconUsers size="18" stroke={1.5} />}
        active={isActive('/account/referrals')}
      />
      <NavLink
        component={Link}
        to={createLanguageURL('/account/api-keys')}
        label="API Keys"
        leftSection={<IconKey size="18" stroke={1.5} />}
        active={isActive('/account/api-keys')}
      />
      <NavLink
        component={Link}
        to={createLanguageURL('/account/profile')}
        label={t('glob_navigation.profile')}
        leftSection={<IconSettings size="18" stroke={1.5} />}
        active={isActive('/account/profile')}
      />
      <NavLink
        component={Link}
        to={createLanguageURL('/account/docs')}
        label="Docs"
        leftSection={<IconBook size="18" stroke={1.5} />}
        active={isActive('/account/docs')}
      />
      <NavLink
        component={Link}
        to={createLanguageURL('/account/support')}
        label={t('glob_navigation.support')}
        leftSection={<IconHelp size="18" stroke={1.5} />}
        active={isActive('/account/support')}
      />
      <NavLink
        onClick={logout}
        href="#"
        label={t('glob_navigation.logout')}
        leftSection={<IconLogout size="18" stroke={1.5} />}
      />
    </AppShell.Navbar>
  );
}
