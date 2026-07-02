const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type CartItem = {
  productId: string;
  name?: string;
  quantity: number;
  price?: number;
};

type CreateOrderBody = {
  items?: CartItem[];
  customer?: {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    pincode?: string;
  };
};

type ProductRow = {
  id: string;
  name: string;
  price: number | string;
  is_available: boolean;
};

function isValidUUID(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

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

function normalizeItems(items: CartItem[] | undefined) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Cart is empty.');
  }

  return items.map((item) => {
    const quantity = Number(item.quantity);
    if (!item.productId || !Number.isInteger(quantity) || quantity < 1) {
      throw new Error('Cart contains an invalid product quantity.');
    }

    return {
      ...item,
      quantity,
    };
  });
}

async function fetchProducts(productIds: string[]) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  const ids = productIds.map((id) => encodeURIComponent(id)).join(',');
  const response = await fetch(
    `${supabaseUrl}/rest/v1/products?id=in.(${ids})&select=id,name,price,is_available`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Unable to validate cart products.');
  }

  return (await response.json()) as ProductRow[];
}

async function calculateAmountPaise(items: CartItem[]) {
  const databaseItems = items.filter((item) => isValidUUID(item.productId));
  const demoItems = items.filter((item) => !isValidUUID(item.productId));
  const productIds = databaseItems.map((item) => item.productId);
  const products = productIds.length ? await fetchProducts(productIds) : null;

  const calculateSubmittedPriceTotal = (submittedItems: CartItem[]) =>
    submittedItems.reduce((sum, item) => {
      const price = Number(item.price);
      if (!Number.isFinite(price) || price <= 0) {
        throw new Error('Product price is required for demo products.');
      }

      return sum + price * item.quantity;
    }, 0);

  if (products) {
    const productsById = new Map(products.map((product) => [product.id, product]));

    const databaseTotal = databaseItems.reduce((sum, item) => {
      const product = productsById.get(item.productId);
      if (!product || !product.is_available) {
        throw new Error(`Product is not available: ${item.name || item.productId}`);
      }

      return sum + Number(product.price) * item.quantity;
    }, 0);
    const demoTotal = calculateSubmittedPriceTotal(demoItems);

    return Math.round((databaseTotal + demoTotal) * 100);
  }

  const total = calculateSubmittedPriceTotal(items);

  return Math.round(total * 100);
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405);
  }

  try {
    const keyId = Deno.env.get('RAZORPAY_KEY_ID');
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!keyId || !keySecret) {
      return jsonResponse({ error: 'Razorpay server keys are not configured.' }, 500);
    }

    const body = (await request.json()) as CreateOrderBody;
    const items = normalizeItems(body.items);
    const amount = await calculateAmountPaise(items);

    if (amount < 100) {
      return jsonResponse({ error: 'Order total must be at least INR 1.00.' }, 400);
    }

    const receipt = `kk_${Date.now().toString(36)}_${crypto.randomUUID().slice(0, 8)}`.slice(0, 40);

    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: buildBasicAuth(keyId, keySecret),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt,
        notes: {
          customer_name: body.customer?.name || '',
          customer_phone: body.customer?.phone || '',
          item_count: String(items.length),
        },
      }),
    });

    const data = await razorpayResponse.json();

    if (!razorpayResponse.ok) {
      return jsonResponse(
        { error: data?.error?.description || 'Razorpay order creation failed.' },
        razorpayResponse.status
      );
    }

    return jsonResponse({
      id: data.id,
      amount: data.amount,
      currency: data.currency,
      receipt: data.receipt,
    });
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : 'Unable to create order.' },
      400
    );
  }
});
