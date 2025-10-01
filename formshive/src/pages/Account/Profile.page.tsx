import { Balance, formatCurrency, LOGIN_METHOD } from '@gofranz/common';
import { VerifiedEmailDetail } from '@gofranz/common-components';
import {
  Anchor,
  Button,
  Notification,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NewDepositForm } from '../../components/Billing/Deposit';
import { useRustyState } from '../../state';

export interface AccountProfilePageProps {
  serviceDomain: string;
  serviceEmail: string;
}

export function AccountProfilePage({ serviceEmail }: AccountProfilePageProps) {
  const { t } = useTranslation();
  const { api } = useRustyState.getState();
  const session = useRustyState((state) => state.api?.auth?.getSession());
  const loginMethod = session?.method;
  const publicKey = session?.publicKey;
  // const [privateKey, setPrivateKey] = useState('');
  const [balance, setBalance] = useState<Balance[]>([]);
  const [addMoney, setAddMoney] = useState(false);

  const [depositStatus, setDepositStatus] = useState<'success' | 'cancel' | ''>('');

  useEffect(() => {
    const url = new URL(window.location.href);
    const hashParams = new URLSearchParams(url.hash.split('?')[1]);
    const deposit = hashParams.get('deposit');

    if (deposit && (deposit === 'success' || deposit === 'cancel')) {
      setDepositStatus(deposit);
    }

    const getBalance = async () => {
      const res = await api.getAccountBalance();
      setBalance(res);
    };
    getBalance();
  }, []);

  const BalanceComponent = (props: { bal: Balance }) => <Text>{formatCurrency(props.bal)}</Text>;

  const Balances = (props: { balances?: Balance[] }) => {
    if (!props.balances || props.balances.length === 0) {
      return <Text>{t('profile.noBalanceFound')}</Text>;
    }
    return (
      <>
        {props.balances.map((bal, index) => (
          <BalanceComponent bal={bal} key={`balance-${index}`} />
        ))}
      </>
    );
  };

  const LoginMethodInfo = () => {
    switch (loginMethod) {
      case LOGIN_METHOD.NOSTR:
        return (
          <>
            <TextInput
              label={t('profile.publicKey')}
              type="text"
              id="publicKey"
              name="publicKey"
              value={publicKey}
              readOnly
            />
            <Text size="sm" mb="xs" color="gray">
              {t('profile.publicKeyDescription')}
            </Text>
          </>
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      {depositStatus === 'success' && (
        <Notification color="green" title={t('profile.depositSuccess')} mb="md">
          {t('profile.depositSuccessMessage')}
        </Notification>
      )}
      <Title order={2} mb="xs">
        {t('profile.balance')}
      </Title>
      {balance && <Balances balances={balance} />}
      {addMoney ? (
        <>
          <Title order={4} mb="xs" mt="md">
            {t('profile.addMoney')}
          </Title>
          <NewDepositForm onCancelCb={() => setAddMoney(false)} />
          <Text size="sm" mt="xs">
            {t('profile.wirePaymentInfo')}{' '}
            <Anchor href={`mailto:${serviceEmail}`}>{serviceEmail}</Anchor>
          </Text>
        </>
      ) : (
        <Button onClick={() => setAddMoney(true)} mt="md">
          {t('profile.addMoney')}
        </Button>
      )}
      <Title order={2} mb="xs" mt="md">
        {t('profile.personalInformation')}
      </Title>
      <Text>
        {t('profile.personalInfoMessage')}
        <br /> {t('profile.personalInfoContact')}{' '}
        <Anchor href={`mailto:${serviceEmail}`}>{serviceEmail}</Anchor>{' '}
        {t('profile.personalInfoGreeting')}
      </Text>
      <Title order={2} mb="xs" mt="md">
        {t('profile.emails')}
      </Title>
      <VerifiedEmailDetail
        submitFormCb={api.newVerifiedEmail}
        deleteCb={api.deleteVerifiedEmail}
        verifyCb={api.verifyVerifiedEmail}
        getVerifiedEmails={api.getVerifiedEmails}
      />
      <Title order={2} mb="xs" mt="md">
        {t('profile.loginInformation')}
      </Title>
      <Text mb="md">
        {t('profile.currentlyLoggedIn')} <b>{loginMethod}</b>.
      </Text>
      {LoginMethodInfo()}
    </>
  );
}
