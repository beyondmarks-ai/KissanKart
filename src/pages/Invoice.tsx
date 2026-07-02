import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Download, Loader2, Printer } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartPanel } from '@/components/CartPanel';
import { Button } from '@/components/ui/button';
import { getInvoiceByToken, getInvoiceItems, type Invoice } from '@/lib/invoices';

function formatMoney(amount: number, currency = 'INR') {
  if (currency === 'INR') {
    return `Rs.${amount.toFixed(2)}`;
  }

  return `${currency} ${amount.toFixed(2)}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function InvoicePage() {
  const { invoiceId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get('token') || '';

  useEffect(() => {
    let isMounted = true;

    async function loadInvoice() {
      if (!invoiceId || !token) {
        setError('Invoice link is invalid.');
        setIsLoading(false);
        return;
      }

      try {
        const invoiceData = await getInvoiceByToken(invoiceId, token);
        if (!isMounted) {
          return;
        }

        if (!invoiceData) {
          setError('Invoice was not found.');
          return;
        }

        setInvoice(invoiceData);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : 'Unable to load invoice.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadInvoice();

    return () => {
      isMounted = false;
    };
  }, [invoiceId, token]);

  const invoiceItems = useMemo(() => (invoice ? getInvoiceItems(invoice) : []), [invoice]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <CartPanel />
        <main className="flex flex-1 items-center justify-center pt-[108px]">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading invoice...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <CartPanel />
        <main className="flex flex-1 items-center justify-center px-4 pt-[108px]">
          <div className="max-w-md text-center">
            <h1 className="mb-3 text-2xl font-bold">Invoice unavailable</h1>
            <p className="mb-6 text-muted-foreground">{error}</p>
            <Button onClick={() => navigate('/shop')}>
              <ArrowLeft className="h-4 w-4" />
              Back to Shop
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <div className="print:hidden">
        <Navbar />
        <CartPanel />
      </div>

      <main className="flex-1 py-8 pt-[116px] print:bg-white print:py-0 print:pt-0">
        <div className="container mx-auto max-w-5xl px-4 print:max-w-none print:px-0">
          <div className="mb-6 flex flex-col gap-4 print:hidden sm:flex-row sm:items-center sm:justify-between">
            <Button variant="ghost" asChild>
              <Link to="/shop">
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button onClick={handlePrint}>
                <Download className="h-4 w-4" />
                Save PDF
              </Button>
            </div>
          </div>

          <section className="rounded-lg border border-border bg-background p-6 shadow-sm print:rounded-none print:border-0 print:p-8 print:shadow-none">
            <div className="mb-8 flex flex-col gap-6 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-medium text-primary">KissanKart</p>
                <h1 className="mt-2 text-3xl font-bold">Invoice</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Invoice generated after verified Razorpay payment.
                </p>
              </div>

              <div className="text-sm sm:text-right">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                  Paid
                </div>
                <p className="font-semibold">{invoice.invoice_number}</p>
                <p className="text-muted-foreground">{formatDate(invoice.paid_at)}</p>
              </div>
            </div>

            <div className="mb-8 grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Billed To
                </h2>
                <p className="font-semibold">{invoice.customer_name}</p>
                {invoice.customer_email && <p className="text-sm">{invoice.customer_email}</p>}
                <p className="text-sm">{invoice.customer_phone}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {invoice.billing_address}
                  <br />
                  {invoice.billing_city} - {invoice.billing_pincode}
                </p>
              </div>

              <div className="md:text-right">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Payment
                </h2>
                <p className="text-sm">
                  <span className="text-muted-foreground">Payment ID:</span>{' '}
                  {invoice.razorpay_payment_id}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Order ID:</span>{' '}
                  {invoice.razorpay_order_id}
                </p>
                {invoice.razorpay_payment_method && (
                  <p className="text-sm capitalize">
                    <span className="text-muted-foreground">Method:</span>{' '}
                    {invoice.razorpay_payment_method}
                  </p>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-y border-border bg-muted/40">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Item</th>
                    <th className="px-4 py-3 text-right font-semibold">Qty</th>
                    <th className="px-4 py-3 text-right font-semibold">Rate</th>
                    <th className="px-4 py-3 text-right font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceItems.map((item) => (
                    <tr key={item.product_id} className="border-b border-border">
                      <td className="px-4 py-4">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Unit: {item.unit}</p>
                      </td>
                      <td className="px-4 py-4 text-right">{item.quantity}</td>
                      <td className="px-4 py-4 text-right">
                        {formatMoney(item.unit_price, invoice.currency)}
                      </td>
                      <td className="px-4 py-4 text-right font-medium">
                        {formatMoney(item.line_total, invoice.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="ml-auto mt-6 w-full max-w-sm space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatMoney(invoice.subtotal, invoice.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{formatMoney(invoice.shipping_amount, invoice.currency)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-lg font-bold">
                <span>Total Paid</span>
                <span className="text-primary">
                  {formatMoney(invoice.total_amount, invoice.currency)}
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
