import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartPanel } from '@/components/CartPanel';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  createRazorpayOrder,
  getRazorpayKeyId,
  loadRazorpayCheckout,
  verifyRazorpayPayment,
} from '@/lib/razorpay';
import { ArrowLeft, CreditCard, Loader2, Shield, Truck } from 'lucide-react';
import { toast } from 'sonner';

const initialShippingForm = {
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  pincode: '',
  phone: '',
};

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shippingForm, setShippingForm] = useState(initialShippingForm);
  const [isPaying, setIsPaying] = useState(false);

  const customerName = `${shippingForm.firstName} ${shippingForm.lastName}`.trim();

  const updateShippingField = (field: keyof typeof shippingForm, value: string) => {
    setShippingForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const validateShippingForm = () => {
    const requiredFields: Array<keyof typeof shippingForm> = [
      'firstName',
      'lastName',
      'address',
      'city',
      'pincode',
      'phone',
    ];

    const missingField = requiredFields.find((field) => !shippingForm[field].trim());
    if (missingField) {
      toast.error('Please complete the shipping information before payment.');
      return false;
    }

    if (!/^[0-9]{6}$/.test(shippingForm.pincode.trim())) {
      toast.error('Please enter a valid 6 digit PIN code.');
      return false;
    }

    if (!/^[0-9+\-\s()]{8,15}$/.test(shippingForm.phone.trim())) {
      toast.error('Please enter a valid phone number.');
      return false;
    }

    return true;
  };

  const handlePayWithRazorpay = async () => {
    if (!validateShippingForm()) {
      return;
    }

    const keyId = getRazorpayKeyId();
    if (!keyId) {
      toast.error('Razorpay key ID is not configured.', {
        description: 'Add VITE_RAZORPAY_KEY_ID to your environment variables.',
      });
      return;
    }

    setIsPaying(true);

    try {
      await loadRazorpayCheckout();

      if (!window.Razorpay) {
        throw new Error('Razorpay checkout is unavailable.');
      }

      const order = await createRazorpayOrder({
        items: items.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
        customer: {
          name: customerName,
          phone: shippingForm.phone.trim(),
          address: shippingForm.address.trim(),
          city: shippingForm.city.trim(),
          pincode: shippingForm.pincode.trim(),
        },
      });

      const checkout = new window.Razorpay({
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'KissanKart',
        description: 'Farm fresh produce order',
        order_id: order.id,
        prefill: {
          name: customerName,
          contact: shippingForm.phone.trim(),
        },
        notes: {
          receipt: order.receipt,
        },
        theme: {
          color: '#16a34a',
        },
        handler: async (response) => {
          try {
            const verification = await verifyRazorpayPayment({
              ...response,
              invoice: {
                customer: {
                  userId: user?.id || null,
                  name: customerName,
                  phone: shippingForm.phone.trim(),
                  email: user?.email || null,
                  address: shippingForm.address.trim(),
                  city: shippingForm.city.trim(),
                  pincode: shippingForm.pincode.trim(),
                },
                items: items.map((item) => ({
                  productId: item.product.id,
                  name: item.product.name,
                  quantity: item.quantity,
                  unitPrice: item.product.price,
                  unit: item.product.unit,
                })),
              },
            });
            toast.success('Payment successful!', {
              description: `Payment ID: ${response.razorpay_payment_id}`,
            });
            clearCart();
            if (verification.invoice) {
              navigate(
                `/invoice/${verification.invoice.id}?token=${verification.invoice.invoice_token}`,
                {
                  state: {
                    invoiceNumber: verification.invoice.invoice_number,
                  },
                }
              );
            } else {
              navigate('/shop');
            }
          } catch (error) {
            toast.error('Payment verification failed.', {
              description:
                error instanceof Error
                  ? error.message
                  : 'Please contact support with your Razorpay payment ID.',
            });
          } finally {
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: () => setIsPaying(false),
        },
      });

      checkout.on('payment.failed', (response) => {
        setIsPaying(false);
        console.error('Razorpay payment failed', response.error);

        const diagnostic = [
          response.error?.code,
          response.error?.source,
          response.error?.step,
          response.error?.reason,
        ]
          .filter(Boolean)
          .join(' / ');

        toast.error('Payment failed.', {
          description:
            response.error?.description ||
            diagnostic ||
            response.error?.reason ||
            'Please try again with another payment method.',
        });
      });

      checkout.open();
    } catch (error) {
      setIsPaying(false);
      toast.error('Unable to start Razorpay payment.', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <CartPanel />
        <main className="flex flex-1 items-center justify-center pt-[108px]">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">Your cart is empty</h1>
            <p className="mb-6 text-muted-foreground">
              Add some products to proceed with checkout.
            </p>
            <Button asChild>
              <Link to="/shop">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <CartPanel />

      <main className="flex-1 py-8 pt-[116px]">
        <div className="container mx-auto px-4">
          <Link
            to="/shop"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>

          <h1 className="mb-8 text-2xl font-bold md:text-3xl">Checkout</h1>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-6 rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Truck className="h-5 w-5 text-primary" />
                  Shipping Information
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={shippingForm.firstName}
                      onChange={(event) => updateShippingField('firstName', event.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={shippingForm.lastName}
                      onChange={(event) => updateShippingField('lastName', event.target.value)}
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Farm Road"
                      value={shippingForm.address}
                      onChange={(event) => updateShippingField('address', event.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Mumbai"
                      value={shippingForm.city}
                      onChange={(event) => updateShippingField('city', event.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode">PIN Code</Label>
                    <Input
                      id="pincode"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="400001"
                      value={shippingForm.pincode}
                      onChange={(event) => updateShippingField('pincode', event.target.value)}
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={shippingForm.phone}
                      onChange={(event) => updateShippingField('phone', event.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Method
                </h2>

                <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Razorpay Secure Checkout</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Pay with UPI, card, net banking, or wallet after confirming your order.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-24">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

                <div className="mb-4 max-h-60 space-y-3 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <img
                        src={item.product.image_url || '/placeholder.svg'}
                        alt={item.product.name}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} x Rs.{item.product.price}
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        Rs.{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>Rs.{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-primary">Free</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">Rs.{totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  variant="cart"
                  className="mt-6 w-full"
                  size="lg"
                  onClick={handlePayWithRazorpay}
                  disabled={isPaying}
                >
                  {isPaying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Opening Razorpay...
                    </>
                  ) : (
                    `Pay Rs.${totalPrice.toFixed(2)}`
                  )}
                </Button>

                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Payment is completed through Razorpay secure checkout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
