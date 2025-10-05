import { isOfficialLoginMethod, LoginRequest, Session } from '@gofranz/common';
import {
  LoginCallbackPage,
  LoginPage,
  MagicLinkLoginPage,
  NewsPage,
  PrivacyPage,
  SignupPage,
  SupportPage,
  TermsPage,
} from '@gofranz/common-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';
import { AccountBillingSubscriptionsPage } from '../../pages/Account/Billing/Subscriptions.page';
import { AccountBillingUsagePage } from '../../pages/Account/Billing/Usage.page';
import { AccountDocsPage } from '../../pages/Account/Docs.page';
import { AccountFormCreatePage } from '../../pages/Account/Forms/Create.page';
import { AccountFormsStartPage } from '../../pages/Account/Forms/Start.page';
import { AccountFormViewPage } from '../../pages/Account/Forms/View.page';
import { AccountHomePage } from '../../pages/Account/Home.page';
import { AccountIntegrationCreatePage } from '../../pages/Account/Integrations/Create.page';
import { AccountIntegrationsStartPage } from '../../pages/Account/Integrations/Start.page';
import { AccountIntegrationViewPage } from '../../pages/Account/Integrations/View.page';
import { AccountMessagesStartPage } from '../../pages/Account/Messags/Start.page';
import { AccountProfilePage } from '../../pages/Account/Profile.page';
import { AccountApiKeysPage } from '../../pages/Account/ApiKeys.page';
import { AccountReferralsPage } from '../../pages/Account/Referrals.page';
import { DocsPage } from '../../pages/Docs.page';
import { HomePage } from '../../pages/Home.page';
import { IntegrationsPage } from '../../pages/Integrations.page';
import { PricingPage } from '../../pages/Pricing.page';
import { useRustyState } from '../../state';
import classes from '../Common/Title.module.css';
import { Footer } from './Footer';
import { useComputedColorScheme } from '@mantine/core';
import { LOGIN_METHOD } from '@gofranz/common';

interface LanguageRoutesProps {
  languagePrefix?: string;
}

export function LanguageRoutes({ languagePrefix }: LanguageRoutesProps) {
  const { i18n } = useTranslation();
  const computedColorScheme = useComputedColorScheme('light');
  const isDark = computedColorScheme === 'dark';

  // Update language when language prefix changes
  React.useEffect(() => {
    if (languagePrefix && languagePrefix !== i18n.language) {
      i18n.changeLanguage(languagePrefix);
    } else if (!languagePrefix && i18n.language !== 'en') {
      i18n.changeLanguage('en');
    }
  }, [languagePrefix, i18n]);

  const setSession = (session: Session) => {
    useRustyState.getState().api.auth?.setSession(session);
  };

  // For nested routes, React Router automatically strips the parent path
  // So when we match `/pt/*`, the nested routes should start from `/`
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/news"
        element={<NewsPage blogBaseUrl="https://blog.formshive.com" footer={<Footer />} />}
      />
      <Route path="/integrations" element={<IntegrationsPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/docs" element={<DocsPage />} />
      <Route
        path="/login"
        element={
          <LoginPage
            login={async (loginRequest: LoginRequest) => {
              if (isOfficialLoginMethod(loginRequest.type)) {
                return await useRustyState.getState().api.auth!.login(loginRequest);
              }
              throw new Error('Unsupported login method');
            }}
            loginChallenge={useRustyState.getState().loginChallenge}
            titleClassName={classes.title}
            backgroundImage={isDark ? '/login-background_dark.jpg' : '/login-background.jpg'}
            loginMethods={[LOGIN_METHOD.NOSTR, LOGIN_METHOD.GITHUB, LOGIN_METHOD.EMAIL_MAGIC_LINK, LOGIN_METHOD.GOOGLE]}
          />
        }
      />
      <Route
        path="/login/callback"
        element={<LoginCallbackPage setSession={setSession} titleClassName={classes.title} />}
      />
      <Route
        path="/login/magic-link"
        element={
          <MagicLinkLoginPage
            loginChallenge={useRustyState.getState().loginChallenge}
            titleGradient={{ from: 'blue', to: 'teal' }}
            titleClassName={classes.title}
          />
        }
      />
      <Route
        path="/privacy"
        element={<PrivacyPage supportEmail="support@formshive.com" footer={<Footer />} />}
      />
      <Route
        path="/terms"
        element={<TermsPage supportEmail="support@formshive.com" footer={<Footer />} />}
      />
      <Route path="/signup" element={<SignupPage
        backgroundImage={isDark ? '/login-background_dark.jpg' : '/login-background.jpg'}
        loginMethods={[LOGIN_METHOD.NOSTR, LOGIN_METHOD.GITHUB, LOGIN_METHOD.EMAIL_MAGIC_LINK]}
      />} />
      <Route path="/account" element={<AccountHomePage />} />
      <Route path="/account/forms" element={<AccountFormsStartPage />} />
      <Route path="/account/forms/create" element={<AccountFormCreatePage />} />
      <Route path="/account/forms/:uuid" element={<AccountFormViewPage />} />
      <Route path="/account/integrations" element={<AccountIntegrationsStartPage />} />
      <Route path="/account/integrations/create" element={<AccountIntegrationCreatePage />} />
      <Route path="/account/integrations/:uuid" element={<AccountIntegrationViewPage />} />
      <Route path="/account/messages" element={<AccountMessagesStartPage />} />
      <Route path="/account/billing/subscriptions" element={<AccountBillingSubscriptionsPage />} />
      <Route path="/account/billing/usage" element={<AccountBillingUsagePage />} />
      <Route path="/account/referrals" element={<AccountReferralsPage />} />
      <Route path="/account/api-keys" element={<AccountApiKeysPage />} />
      <Route path="/account/docs" element={<AccountDocsPage />} />
      <Route
        path="/account/profile"
        element={
          <AccountProfilePage serviceDomain="formshive.com" serviceEmail="hello@formshive.com" />
        }
      />
      <Route
        path="/account/support"
        element={<SupportPage session={useRustyState.getState().api?.auth?.getSession()} serviceName="Formshive" />}
      />
    </Routes>
  );
}
