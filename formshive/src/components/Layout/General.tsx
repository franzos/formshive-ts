import { useLanguageAwareRouting } from '@gofranz/common-components';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useRustyState } from '../../state';
import { AccountLayout } from './Account';
import { PublicNavigation } from './PublicNavigation';

export interface GeneralLayoutProps {
  children: React.ReactNode;
}

export function GeneralLayout({ children }: GeneralLayoutProps) {
  const isLoggedIn = useRustyState((state) => state.api?.auth?.getSession().isLoggedIn || false);
  const location = useLocation();
  const { createLanguageURL } = useLanguageAwareRouting();

  // Handle referral code from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const referralCode = urlParams.get('ref');

    if (referralCode && !isLoggedIn) {
      // Store referral code in localStorage for use during signup/login
      localStorage.setItem('pendingReferralCode', referralCode);
      console.log('Stored referral code:', referralCode);
    }
  }, [location.search, isLoggedIn]);

  // Clear referral code from localStorage when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      const storedReferralCode = localStorage.getItem('pendingReferralCode');
      if (storedReferralCode) {
        localStorage.removeItem('pendingReferralCode');
        console.log('Cleared referral code after login');
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn && location.pathname.startsWith('/account')) {
      window.location.replace(createLanguageURL('/'));
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn && location.pathname.startsWith('/account')) {
      window.location.replace(createLanguageURL('/'));
    }
  }, [isLoggedIn, location, createLanguageURL]);

  return (
    <>
      {isLoggedIn ? (
        <AccountLayout isLoggedIn>{children}</AccountLayout>
      ) : (
        <>
          <PublicNavigation />
          {children}
        </>
      )}
    </>
  );
}
