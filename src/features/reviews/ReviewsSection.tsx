import * as React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { MessageSquareText, LogIn, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

import {
  deleteReview,
  fetchMyReview,
  fetchReviews,
  upsertReview,
  type ReviewRow,
} from './reviews.service';
import { reviewInputSchema } from './reviews.schema';
import { RatingStars } from './RatingStars';

interface ReviewsSectionProps {
  productId: string;
  productName: string;
  onStatsChange?: (stats: { average: number; count: number }) => void;
}

export function ReviewsSection({ productId, productName, onStatsChange }: ReviewsSectionProps) {
  const { user } = useAuth();

  const [loading, setLoading] = React.useState(true);
  const [reviews, setReviews] = React.useState<ReviewRow[]>([]);
  const [myReview, setMyReview] = React.useState<ReviewRow | null>(null);

  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const [list, mine] = await Promise.all([
        fetchReviews(productId),
        user ? fetchMyReview(productId, user.id) : Promise.resolve(null),
      ]);

      setReviews(list);
      setMyReview(mine);
      setRating(mine?.rating ?? 0);
      setComment(mine?.comment ?? '');

      const avg = list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : 0;
      onStatsChange?.({ average: avg, count: list.length });
    } catch (e: any) {
      toast.error(e?.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [productId, user, onStatsChange]);

  React.useEffect(() => {
    load();
  }, [load]);

  const stats = React.useMemo(() => {
    const count = reviews.length;
    const average = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const r of reviews) dist[r.rating as 1 | 2 | 3 | 4 | 5] += 1;
    return { count, average, dist };
  }, [reviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to leave a review');
      return;
    }

    // Demo/mock products use non-UUID IDs (e.g. "mock-8"); block submission to prevent backend UUID errors
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(productId)) {
      toast.error('Reviews are unavailable for demo products.');
      return;
    }

    const parsed = reviewInputSchema.safeParse({ rating, comment });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || 'Please check your review');
      return;
    }

    setSaving(true);
    try {
      await upsertReview({
        productId,
        userId: user.id,
        existingId: myReview?.id,
        input: parsed.data,
      });

      toast.success(myReview ? 'Review updated' : 'Review submitted');
      await load();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to submit review');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!myReview) return;
    setSaving(true);
    try {
      await deleteReview(myReview.id);
      toast.success('Review removed');
      setRating(0);
      setComment('');
      await load();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to delete review');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section aria-label="Product reviews" className="space-y-6">
      <header className="flex items-center gap-3">
        <MessageSquareText className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold text-foreground">Customer Reviews</h3>
      </header>

      {/* Summary */}
      <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-muted/30 p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center justify-center text-center sm:min-w-[140px]">
            <div className="text-5xl font-bold text-foreground">
              {stats.average.toFixed(1)}
            </div>
            <RatingStars value={stats.average} size="md" />
            <p className="mt-1 text-sm text-muted-foreground">
              {stats.count} {stats.count === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.dist[star as 1 | 2 | 3 | 4 | 5];
              const pct = stats.count ? (count / stats.count) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="w-10 text-sm font-medium text-muted-foreground">
                    {star} stars
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-kisan-orange transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs text-muted-foreground">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form */}
      {user ? (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {myReview ? 'Update your review' : 'Write a review'}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Share your experience to help other customers.
              </p>
            </div>

            {myReview && (
              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                disabled={saving}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            )}
          </div>

          <div className="mt-5 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Rating
              </label>
              <RatingStars
                value={rating}
                size="lg"
                interactive
                onChange={setRating}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Review <span className="text-muted-foreground">(optional)</span>
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about freshness, packaging, and quality..."
                rows={4}
                maxLength={500}
                className="resize-none"
              />
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Keep it clear and helpful</span>
                <span>{comment.length}/500</span>
              </div>
            </div>

            <Button type="submit" disabled={saving || rating < 1}>
              {saving ? 'Saving...' : myReview ? 'Update Review' : 'Submit Review'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-10">
          <LogIn className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="mb-1 text-lg font-medium text-foreground">Sign in to review</p>
          <p className="mb-5 text-sm text-muted-foreground">
            You need a customer account to review {productName}.
          </p>
          <Button asChild>
            <Link to="/auth?role=customer">Customer Login</Link>
          </Button>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="rounded-2xl border border-border bg-muted/20 py-10 text-center text-muted-foreground">
          No reviews yet — be the first to share your feedback.
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <article
              key={r.id}
              className={cn(
                'rounded-2xl border border-border bg-card p-5',
                myReview?.id === r.id && 'ring-2 ring-primary/20'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <RatingStars value={r.rating} size="sm" />
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {r.rating}/5
                    </span>
                    {myReview?.id === r.id && (
                      <span className="rounded-full bg-kisan-orange/10 px-2 py-0.5 text-xs font-medium text-kisan-orange">
                        Your review
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>

              {r.comment ? (
                <p className="mt-4 leading-relaxed text-foreground">{r.comment}</p>
              ) : (
                <p className="mt-4 italic text-muted-foreground">No written review</p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
