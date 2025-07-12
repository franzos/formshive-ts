import { Box, Button, Checkbox, TextInput, Text } from '@mantine/core';
import { Currency, formatCurrency } from '@gofranz/common';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const feeMessage = 500;
const feeNotification = 300;
const feeSpamCheck = 500;
const feeIntegration = 50;

const discounts = [
  {
    min: 10000,
    discount: 0.85,
  },
  {
    min: 20000,
    discount: 0.8,
  },
  {
    min: 30000,
    discount: 0.75,
  },
  {
    min: 100000,
    discount: 0.7,
  },
];

export function FeeCalculator() {
  const { t } = useTranslation();
  const [totalFee, setTotalFee] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0); // [currency, amount
  const [feeAfterDiscount, setFeeAfterDiscount] = useState(0); // [currency, amount
  const [feePerMessage, setFeePerMessage] = useState(0); // [currency, amount

  const [totalMessages, setTotalMessages] = useState(1000);

  const [useNotifications, setUseNotifications] = useState(true);
  const [useSpamCheck, setUseSpamCheck] = useState(true);
  const [useIntegration, setUseIntegration] = useState(true);

  const calculate = () => {
    let fee = feeMessage;
    if (useNotifications) {
      fee += feeNotification;
    }
    if (useSpamCheck) {
      fee += feeSpamCheck;
    }
    if (useIntegration) {
      fee += feeIntegration;
    }

    const subtotal = fee * totalMessages;
    let discount = 1;
    for (const d of discounts) {
      if (totalMessages >= d.min) {
        discount = d.discount;
      }
    }
    setTotalDiscount(subtotal * (1 - discount));
    setTotalFee(subtotal);
    setFeeAfterDiscount(subtotal * discount);
    setFeePerMessage((subtotal * discount) / totalMessages);
  };

  useEffect(() => {
    calculate();
  }, []);

  useEffect(() => {
    calculate();
  }, [totalMessages, useNotifications, useSpamCheck, useIntegration]);

  return (
    <Box>
      <TextInput
        label={t('billing.totalMessages')}
        type="number"
        value={totalMessages}
        onChange={(e) => setTotalMessages(parseInt(e.currentTarget.value))}
        mb="xs"
      />
      <Text size="sm" mb="xs" color="gray">
        {t('billing.usageDescription')}
      </Text>
      <Checkbox
        label={t('billing.checkSpam')}
        checked={useSpamCheck}
        onChange={(e) => setUseSpamCheck(e.currentTarget.checked)}
        mb="xs"
      />
      <Checkbox
        label={t('billing.emailNotifications')}
        checked={useNotifications}
        onChange={(e) => setUseNotifications(e.currentTarget.checked)}
        mb="xs"
      />
      <Checkbox
        label={t('billing.webhook')}
        checked={useIntegration}
        onChange={(e) => setUseIntegration(e.currentTarget.checked)}
        mb="xs"
      />
      <Button onClick={calculate} mb="xs">
        {t('glob_buttons.calculate')}
      </Button>
      {totalDiscount <= 0 ? (
        <Text>
          {t('billing.cost')}
          {formatCurrency([Currency.EUR, totalFee])} (
          {formatCurrency([Currency.EUR, feePerMessage])} /msg)
        </Text>
      ) : (
        <Text>
          {t('billing.costWithDiscount')}
          <s>{formatCurrency([Currency.EUR, totalFee])}</s>{' '}
          {formatCurrency([Currency.EUR, feeAfterDiscount])} (
          {formatCurrency([Currency.EUR, feePerMessage])} /msg)
        </Text>
      )}
    </Box>
  );
}
