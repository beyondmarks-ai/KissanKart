const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type VerifyPaymentBody = {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  invoice?: InvoiceRequest;
};

type InvoiceRequest = {
  customer?: {
    userId?: string | null;
    name?: string;
    phone?: string;
    email?: string | null;
    address?: string;
    city?: string;
    pincode?: string;
  };
  items?: Array<{
    productId?: string;
    name?: string;
    quantity?: number;
    unitPrice?: number;
    unit?: string;
  }>;
};

type RazorpayPaymentDetails = {
  amount?: number;
  currency?: string;
  order_id?: string;
  status?: string;
  method?: string;
  created_at?: number;
};

type InvoiceInsertRow = {
  invoice_number: string;
  customer_user_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  billing_address: string;
  billing_city: string;
  billing_pincode: string;
  items: Array<{
    product_id: string;
    name: string;
    quantity: number;
    unit: string;
    unit_price: number;
    line_total: number;
  }>;
  subtotal: number;
  shipping_amount: number;
  total_amount: number;
  currency: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  razorpay_payment_status: string | null;
  razorpay_payment_method: string | null;
  paid_at: string;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

function buildBasicAuth(keyId: string, keySecret: string) {
  return `Basic ${btoa(`${keyId}:${keySecret}`)}`;
}

function hex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function createSignature(orderId: string, paymentId: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(`${orderId}|${paymentId}`));
  return hex(signature);
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let index = 0; index < a.length; index += 1) {
    result |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return result === 0;
}

function formatInvoiceNumber() {
  const date = new Date();
  const datePart = date.toISOString().slice(0, 10).replaceAll('-', '');
  const randomPart = crypto.randomUUID().slice(0, 6).toUpperCase();
  return `KK-${datePart}-${randomPart}`;
}

function amountFromPaise(paise: number) {
  return Number((paise / 100).toFixed(2));
}

function normalizeInvoice(
  invoice: InvoiceRequest,
  payment: RazorpayPaymentDetails,
  paymentId: string,
  orderId: string,
  signature: string
): InvoiceInsertRow {
  const customer = invoice.customer;
  const items = invoice.items;

  if (!customer?.name || !customer.phone || !customer.address || !customer.city || !customer.pincode) {
    throw new Error('Invoice customer details are missing.');
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Invoice items are missing.');
  }

  const normalizedItems = items.map((item) => {
    const quantity = Number(item.quantity);
    const unitPrice = Number(item.unitPrice);

    if (!item.productId || !item.name || !Number.isInteger(quantity) || quantity < 1) {
      throw new Error('Invoice contains an invalid product quantity.');
    }

    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      throw new Error('Invoice contains an invalid product price.');
    }

    return {
      product_id: item.productId,
      name: item.name,
      quantity,
      unit: item.unit || 'kg',
      unit_price: amountFromPaise(Math.round(unitPrice * 100)),
      line_total: amountFromPaise(Math.round(unitPrice * 100) * quantity),
    };
  });

  const subtotalPaise = normalizedItems.reduce(
    (sum, item) => sum + Math.round(item.unit_price * 100) * item.quantity,
    0
  );
  const paidAmountPaise = Number(payment.amount);

  if (!Number.isFinite(paidAmountPaise) || paidAmountPaise < 100) {
    throw new Error('Verified Razorpay payment amount is invalid.');
  }

  if (subtotalPaise !== paidAmountPaise) {
    throw new Error('Invoice total does not match the verified Razorpay payment amount.');
  }

  return {
    invoice_number: formatInvoiceNumber(),
    customer_user_id: customer.userId || null,
    customer_name: customer.name.trim(),
    customer_phone: customer.phone.trim(),
    customer_email: customer.email?.trim() || null,
    billing_address: customer.address.trim(),
    billing_city: customer.city.trim(),
    billing_pincode: customer.pincode.trim(),
    items: normalizedItems,
    subtotal: amountFromPaise(subtotalPaise),
    shipping_amount: 0,
    total_amount: amountFromPaise(paidAmountPaise),
    currency: payment.currency || 'INR',
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
    razorpay_payment_status: payment.status || null,
    razorpay_payment_method: payment.method || null,
    paid_at: payment.created_at ? new Date(payment.created_at * 1000).toISOString() : new Date().toISOString(),
  };
}

async function fetchRazorpayPayment(
  paymentId: string,
  orderId: string,
  keyId: string,
  keySecret: string
) {
  const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: buildBasicAuth(keyId, keySecret),
    },
  });

  const data = (await response.json()) as RazorpayPaymentDetails & { error?: { description?: string } };

  if (!response.ok) {
    throw new Error(data.error?.description || 'Unable to fetch Razorpay payment details.');
  }

  if (data.order_id !== orderId) {
    throw new Error('Razorpay payment does not belong to this order.');
  }

  if (data.status && !['authorized', 'captured'].includes(data.status)) {
    throw new Error('Razorpay payment is not successful.');
  }

  return data;
}

async function fetchExistingInvoice(supabaseUrl: string, serviceRoleKey: string, paymentId: string) {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/invoices?razorpay_payment_id=eq.${encodeURIComponent(paymentId)}&select=id,invoice_number,invoice_token&limit=1`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Unable to check existing invoice.');
  }

  const rows = (await response.json()) as Array<{
    id: string;
    invoice_number: string;
    invoice_token: string;
  }>;

  return rows[0] || null;
}

async function createInvoice(
  supabaseUrl: string,
  serviceRoleKey: string,
  invoice: InvoiceInsertRow
) {
  const response = await fetch(`${supabaseUrl}/rest/v1/invoices`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(invoice),
  });

  const rows = (await response.json()) as Array<{
    id: string;
    invoice_number: string;
    invoice_token: string;
  }> | { message?: string };

  if (!response.ok) {
    throw new Error(!Array.isArray(rows) && rows.message ? rows.message : 'Unable to create invoice.');
  }

  if (!Array.isArray(rows) || !rows[0]) {
    throw new Error('Invoice response was empty.');
  }

  return rows[0];
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405);
  }

  try {
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!keySecret) {
      return jsonResponse({ error: 'Razorpay key secret is not configured.' }, 500);
    }

    const body = (await request.json()) as VerifyPaymentBody;
    const paymentId = body.razorpay_payment_id;
    const orderId = body.razorpay_order_id;
    const signature = body.razorpay_signature;

    if (!paymentId || !orderId || !signature) {
      return jsonResponse({ error: 'Payment verification fields are missing.' }, 400);
    }

    const generatedSignature = await createSignature(orderId, paymentId, keySecret);
    const verified = timingSafeEqual(generatedSignature, signature);

    if (!verified) {
      return jsonResponse({ verified: false, error: 'Payment signature mismatch.' }, 400);
    }

    if (!body.invoice) {
      return jsonResponse({ verified: true });
    }

    const keyId = Deno.env.get('RAZORPAY_KEY_ID');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!keyId || !supabaseUrl || !serviceRoleKey) {
      return jsonResponse({ error: 'Invoice generation is not configured.' }, 500);
    }

    const existingInvoice = await fetchExistingInvoice(supabaseUrl, serviceRoleKey, paymentId);
    if (existingInvoice) {
      return jsonResponse({ verified: true, invoice: existingInvoice });
    }

    const payment = await fetchRazorpayPayment(paymentId, orderId, keyId, keySecret);
    const invoice = normalizeInvoice(body.invoice, payment, paymentId, orderId, signature);
    const createdInvoice = await createInvoice(supabaseUrl, serviceRoleKey, invoice);

    return jsonResponse({ verified: true, invoice: createdInvoice });
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : 'Unable to verify payment.' },
      400
    );
  }
});
