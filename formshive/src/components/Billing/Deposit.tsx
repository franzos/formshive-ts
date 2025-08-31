import { Button, NumberInput, Select, Stack, Group } from '@mantine/core';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js/pure';
import { RedirectToCheckoutClientOptions } from '@stripe/stripe-js';
import { Currency, DepositProvider, NewDepositHttp } from '@gofranz/common';
import { useRustyState } from '../../state';
import { STRIPE_PUBLIC_KEY } from '../../constants';

export interface NewDepositFormProps {
  onCancelCb: () => void;
}

export function NewDepositForm({ onCancelCb }: NewDepositFormProps) {
  const { api } = useRustyState.getState();
  const [isBusy, setIsBusy] = useState(false);
  const [amount, setAmount] = useState(15.00);
  const [provider, setProvider] = useState<DepositProvider>(DepositProvider.STRIPE);
  
  // Helper to get the appropriate currency for the selected provider
  const getCurrencyForProvider = (provider: DepositProvider) => {
    // Both providers use EUR for consistency
    return Currency.EUR;
  };

  const openStripe = async (sessionId: string, options?: RedirectToCheckoutClientOptions) => {
    if (!STRIPE_PUBLIC_KEY) {
      throw new Error('Stripe public key is not set');
    }
    const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
    if (!stripe) {
      throw new Error('Failed to load Stripe');
    }

    await stripe.redirectToCheckout({
      sessionId,
      ...options,
    });
  };

  const startDeposit = async () => {
    setIsBusy(true);
    try {
      const currency = getCurrencyForProvider(provider);
      const newDeposit: NewDepositHttp = {
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        provider,
      };
      const res = await api.newDeposit(newDeposit);
      if (!res) {
        throw new Error('Failed to start deposit: Could not create deposit.');
      }

      if (res.type === 'STRIPE') {
        await openStripe(res.content.checkout_session_id);
      } else if (res.type === 'COINBASE') {
        // Redirect to Coinbase hosted payment page
        window.location.href = res.content.hosted_url;
      }
    } catch (e) {
      console.error(e);
    }
    setIsBusy(false);
  };

  return (
    <Stack>
      <NumberInput
        label="Amount (EUR)"
        prefix="€"
        maw={300}
        mb="xs"
        allowNegative={false}
        allowLeadingZeros={false}
        allowDecimal={true}
        step={0.01}
        decimalScale={2}
        min={0.01}
        value={amount}
        onChange={(e) => setAmount(e as number)}
      />

      <Select
        label="Payment Method"
        value={provider}
        onChange={(value) => setProvider(value as DepositProvider)}
        data={[
          { value: DepositProvider.STRIPE, label: '💳 Credit Card (Stripe)' },
          { value: DepositProvider.COINBASE, label: '₿ Cryptocurrency (Coinbase)' },
        ]}
        maw={300}
        mb="md"
      />

      <Group>
        <Button
          loading={isBusy}
          onClick={startDeposit}
          variant="filled"
        >
          {provider === DepositProvider.STRIPE ? 'Pay with Stripe' : 'Pay with Coinbase'}
        </Button>
        <Button variant="light" onClick={onCancelCb}>
          Cancel
        </Button>
      </Group>
    </Stack>
  );
}