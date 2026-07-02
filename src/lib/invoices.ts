import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Invoice = Tables<'invoices'>;

export type InvoiceLineItem = {
  product_id: string;
  name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  line_total: number;
};

export async function getInvoiceByToken(invoiceId: string, token: string) {
  const { data, error } = await supabase.rpc('get_invoice_by_token', {
    p_invoice_id: invoiceId,
    p_invoice_token: token,
  });

  if (error) {
    throw new Error(error.message || 'Unable to load invoice.');
  }

  return data?.[0] || null;
}

export function getInvoiceItems(invoice: Invoice): InvoiceLineItem[] {
  if (!Array.isArray(invoice.items)) {
    return [];
  }

  return invoice.items
    .map((item) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        return null;
      }

      return {
        product_id: String(item.product_id || ''),
        name: String(item.name || ''),
        quantity: Number(item.quantity || 0),
        unit: String(item.unit || ''),
        unit_price: Number(item.unit_price || 0),
        line_total: Number(item.line_total || 0),
      };
    })
    .filter((item): item is InvoiceLineItem => Boolean(item?.product_id && item.name));
}
