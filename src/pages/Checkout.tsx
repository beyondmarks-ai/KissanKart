import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartPanel } from '@/components/CartPanel';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CreditCard, Truck, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();

  const handlePlaceOrder = () => {
    toast.success('Order placed successfully! (Demo)', {
      description: 'This is a visual demo. Payment processing coming soon!',
    });
    clearCart();
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
          {/* Back Link */}
          <Link
            to="/shop"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>

          <h1 className="mb-8 text-2xl font-bold md:text-3xl">Checkout</h1>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form Section */}
            <div className="lg:col-span-2">
              {/* Shipping Info */}
              <div className="mb-6 rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Truck className="h-5 w-5 text-primary" />
                  Shipping Information
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="123 Farm Road" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Mumbai" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">PIN Code</Label>
                    <Input id="pincode" placeholder="400001" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+91 98765 43210" />
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Method
                </h2>
                <div className="rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center">
                  <Shield className="mx-auto mb-3 h-12 w-12 text-primary/50" />
                  <p className="font-medium text-foreground">
                    Payment Integration Coming Soon
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    This is a visual demo. Real payment processing will be added.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-24">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
                
                <div className="mb-4 max-h-60 space-y-3 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={item.product.image_url || '/placeholder.svg'}
                        alt={item.product.name}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} × ₹{item.product.price}
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-primary">Free</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  variant="cart"
                  className="mt-6 w-full"
                  size="lg"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </Button>

                <p className="mt-3 text-center text-xs text-muted-foreground">
                  By placing an order, you agree to our terms and conditions.
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
