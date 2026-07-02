# Razorpay Test Payment Setup

This project uses Razorpay Checkout from the React checkout page and Supabase Edge Functions for the server-only Razorpay calls.

## Environment Variables

Add the public Razorpay key ID to the Vite app:

```env
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

Set the Razorpay server keys as Supabase function secrets:

```bash
supabase secrets set RAZORPAY_KEY_ID=rzp_test_your_key_id
supabase secrets set RAZORPAY_KEY_SECRET=your_test_key_secret
```

Do not put `RAZORPAY_KEY_SECRET` in `.env` with a `VITE_` prefix. Vite exposes `VITE_*` values to the browser.

## Deploy Functions

```bash
supabase functions deploy create-razorpay-order
supabase functions deploy verify-razorpay-payment
```

## Local Notes

The checkout flow is:

1. Customer fills shipping information.
2. React calls `create-razorpay-order`.
3. The Edge Function creates a Razorpay order in INR paise.
4. Razorpay Checkout opens with the returned `order_id`.
5. On success, React calls `verify-razorpay-payment`.
6. The Edge Function verifies the HMAC SHA256 signature with `RAZORPAY_KEY_SECRET`.

Razorpay requires a server-created order before Checkout. Payments without an `order_id` cannot be captured reliably.
