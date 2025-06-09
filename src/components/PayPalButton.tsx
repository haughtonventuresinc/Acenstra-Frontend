import React from 'react';

// Minimal PayPalNamespace type for TypeScript
interface PayPalNamespace {
  Buttons: (options: {
    createOrder: (
      _data: Record<string, unknown>,
      actions: { order: { create: (opts: Record<string, unknown>) => Promise<string> } }
    ) => Promise<string>;
    onApprove: (
      _data: Record<string, unknown>,
      actions: { order: { capture: () => Promise<Record<string, unknown>> } }
    ) => void;
    onError: (err: unknown) => void;
  }) => { render: (selector: string) => void };
}

// PayPal SDK script loader
const loadPayPalScript = (clientId: string, currency: string = 'USD') => {
  if (document.getElementById('paypal-sdk')) return;
  const script = document.createElement('script');
  script.id = 'paypal-sdk';
  script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}`;
  script.async = true;
  document.body.appendChild(script);
};

interface PayPalButtonProps {
  amount: string;
  onSuccess?: (details: Record<string, unknown>) => void;
  onError?: (error: unknown) => void;
  className?: string;
}

const PAYPAL_CLIENT_ID = 'sb'; // Use 'sb' for PayPal sandbox. Replace with live client ID for production.
const RECEIVER_EMAIL = 'mosesstone@icloud.com';

export const PayPalButton: React.FC<PayPalButtonProps> = ({ amount, onSuccess, onError, className }) => {
  // Generate a unique id for each instance
  const uniqueId = React.useMemo(() => `paypal-button-container-${Math.random().toString(36).substr(2, 9)}`, []);

  React.useEffect(() => {
    loadPayPalScript(PAYPAL_CLIENT_ID);

    const interval = setInterval(() => {
      if ((window as unknown as { paypal: PayPalNamespace }).paypal && document.getElementById(uniqueId)) {
        clearInterval(interval);
        (window as unknown as { paypal: PayPalNamespace }).paypal.Buttons({
          createOrder: (_data: Record<string, unknown>, actions: { order: { create: (opts: Record<string, unknown>) => Promise<string> } }) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: { value: amount },
                  payee: { email_address: RECEIVER_EMAIL },
                },
              ],
            });
          },
          onApprove: async (_data: Record<string, unknown>, actions: { order: { capture: () => Promise<Record<string, unknown>> } }) => {
            const details = await actions.order.capture();
            if (onSuccess) onSuccess(details);
          },
          onError: (err: unknown) => {
            if (onError) onError(err);
          },
        }).render(`#${uniqueId}`);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [amount, onSuccess, onError, uniqueId]);

  return <div id={uniqueId} className={className} />;
};

export default PayPalButton;
