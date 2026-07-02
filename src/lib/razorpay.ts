import { supabase } from '@/integrations/supabase/client';

const CHECKOUT_SCRIPT_ID = 'razorpay-checkout-js';
const CHECKOUT_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

export interface RazorpayOrderRequestItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface RazorpayOrderRequest {
  items: RazorpayOrderRequestItem[];
  customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
}

export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayInvoiceRequest {
  customer: {
    userId?: string | null;
    name: string;
    phone: string;
    email?: string | null;
    address: string;
    city: string;
    pincode: string;
  };
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    unit: string;
  }>;
}

export interface RazorpayPaymentVerificationRequest extends RazorpayPaymentResponse {
  invoice?: RazorpayInvoiceRequest;
}

export interface RazorpayInvoiceResponse {
  id: string;
  invoice_number: string;
  invoice_token: string;
}

export interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    contact: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color: string;
  };
  handler: (response: RazorpayPaymentResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

type RazorpayPaymentFailedResponse = {
  error?: {
    code?: string;
    description?: string;
    source?: string;
    step?: string;
    reason?: string;
    metadata?: Record<string, string>;
  };
};

interface RazorpayCheckoutInstance {
  open: () => void;
  on: (
    event: 'payment.failed',
    callback: (response: RazorpayPaymentFailedResponse) => void
  ) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayCheckoutInstance;
  }
}

export const getRazorpayKeyId = () => import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined;

async function getFunctionErrorMessage(error: unknown, fallback: string) {
  const context = (error as { context?: Response })?.context;

  if (context) {
    try {
      const body = await context.clone().json();
      if (typeof body?.error === 'string') {
        return body.error;
      }
    } catch {
      // Keep the SDK error when the response is not JSON.
    }
  }

  return error instanceof Error ? error.message || fallback : fallback;
}

export function loadRazorpayCheckout() {
  return new Promise<void>((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const existingScript = document.getElementById(CHECKOUT_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Unable to load Razorpay checkout.')), {
        once: true,
      });
      return;
    }

    const script = document.createElement('script');
    script.id = CHECKOUT_SCRIPT_ID;
    script.src = CHECKOUT_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Unable to load Razorpay checkout.'));
    document.body.appendChild(script);
  });
}

export async function createRazorpayOrder(body: RazorpayOrderRequest) {
  const { data, error } = await supabase.functions.invoke<RazorpayOrderResponse>(
    'create-razorpay-order',
    { body }
  );

  if (error) {
    throw new Error(await getFunctionErrorMessage(error, 'Unable to create Razorpay order.'));
  }

  if (!data?.id) {
    throw new Error('Razorpay order response was empty.');
  }

  return data;
}

export async function verifyRazorpayPayment(body: RazorpayPaymentVerificationRequest) {
  const { data, error } = await supabase.functions.invoke<{
    verified: boolean;
    invoice?: RazorpayInvoiceResponse;
  }>(
    'verify-razorpay-payment',
    { body }
  );

  if (error) {
    throw new Error(await getFunctionErrorMessage(error, 'Unable to verify Razorpay payment.'));
  }

  if (!data?.verified) {
    throw new Error('Payment verification failed.');
  }

  return data;
}
