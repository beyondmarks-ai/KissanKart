import { supabase } from '@/integrations/supabase/client';
import { reviewInputSchema, type ReviewInput } from './reviews.schema';

export type ReviewRow = {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
};

// Helper to check if an ID is a valid UUID (not a mock ID)
function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export async function fetchReviews(productId: string) {
  // Skip query for mock product IDs to avoid UUID validation errors
  if (!isValidUUID(productId)) {
    return [] as ReviewRow[];
  }

  const { data, error } = await supabase
    .from('reviews')
    .select('id, product_id, user_id, rating, comment, created_at, updated_at')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as ReviewRow[];
}

export async function fetchMyReview(productId: string, userId: string) {
  // Skip query for mock product IDs to avoid UUID validation errors
  if (!isValidUUID(productId)) {
    return null as ReviewRow | null;
  }

  const { data, error } = await supabase
    .from('reviews')
    .select('id, product_id, user_id, rating, comment, created_at, updated_at')
    .eq('product_id', productId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return (data || null) as ReviewRow | null;
}

export async function upsertReview(params: {
  productId: string;
  userId: string;
  input: ReviewInput;
  existingId?: string;
}) {
  // Avoid DB errors when the app is showing demo/mock products (non-UUID IDs like "mock-8")
  if (!isValidUUID(params.productId)) {
    throw new Error('Reviews are unavailable for demo products.');
  }

  const parsed = reviewInputSchema.parse(params.input);

  if (params.existingId) {
    const { data, error } = await supabase
      .from('reviews')
      .update({ rating: parsed.rating, comment: parsed.comment })
      .eq('id', params.existingId)
      .select('id, product_id, user_id, rating, comment, created_at, updated_at')
      .single();

    if (error) throw error;
    return data as ReviewRow;
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      product_id: params.productId,
      user_id: params.userId,
      rating: parsed.rating,
      comment: parsed.comment,
    })
    .select('id, product_id, user_id, rating, comment, created_at, updated_at')
    .single();

  if (error) throw error;
  return data as ReviewRow;
}

export async function deleteReview(reviewId: string) {
  const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
  if (error) throw error;
}
