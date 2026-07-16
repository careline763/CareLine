import prisma from '../../config/db';

export interface QualityScore {
  total: number;
  rating_component: number;
  completion_component: number;
  on_time_component: number;
  photo_component: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
}

export function getTier(score: number): QualityScore['tier'] {
  if (score >= 85) return 'Platinum';
  if (score >= 70) return 'Gold';
  if (score >= 50) return 'Silver';
  return 'Bronze';
}

export async function recalculate(partnerId: number): Promise<QualityScore> {
  const partner = await prisma.partner.findUniqueOrThrow({
    where: { id: partnerId },
    include: {
      bookings: {
        where: { status: { in: ['completed', 'cancelled', 'assigned'] } },
        include: { review: true },
      },
    },
  });

  const allJobs = partner.bookings;
  const completed = allJobs.filter(b => b.status === 'completed');
  const assigned = allJobs.filter(b => b.status !== 'cancelled');
  const withPhotos = completed.filter(b => b.before_photo_url && b.after_photo_url);
  const withReviews = completed.filter(b => b.review);

  // Completion rate: completed / (assigned + completed)
  const completionRate = assigned.length > 0
    ? (completed.length / assigned.length) * 100
    : 0;

  // Rating component: avg rating / 5 * 50 (max 50 pts)
  const avgRating = withReviews.length > 0
    ? withReviews.reduce((s, b) => s + (b.review?.rating ?? 0), 0) / withReviews.length
    : 0;
  const ratingComponent = (avgRating / 5) * 50;

  // Completion component: max 20 pts
  const completionComponent = (completionRate / 100) * 20;

  // On-time rate: approximate — bookings started within 15 min of scheduled_at
  // For now use 80% as baseline since we don't track arrival time separately
  const onTimeRate = completed.length > 0 ? 80 : 0;
  const onTimeComponent = (onTimeRate / 100) * 20;

  // Photo submission: max 10 pts
  const photoRate = completed.length > 0
    ? (withPhotos.length / completed.length) * 100
    : 0;
  const photoComponent = (photoRate / 100) * 10;

  const total = Math.round(ratingComponent + completionComponent + onTimeComponent + photoComponent);

  await prisma.partner.update({
    where: { id: partnerId },
    data: {
      quality_score: total,
      completion_rate: Math.round(completionRate * 100) / 100,
      on_time_rate: onTimeRate,
      photo_submission_rate: Math.round(photoRate * 100) / 100,
      score_updated_at: new Date(),
    },
  });

  return {
    total,
    rating_component: Math.round(ratingComponent * 10) / 10,
    completion_component: Math.round(completionComponent * 10) / 10,
    on_time_component: Math.round(onTimeComponent * 10) / 10,
    photo_component: Math.round(photoComponent * 10) / 10,
    tier: getTier(total),
  };
}

export async function getScoreBreakdown(partnerId: number) {
  const partner = await prisma.partner.findUniqueOrThrow({ where: { id: partnerId } });
  const score = Number(partner.quality_score);
  return {
    total: score,
    tier: getTier(score),
    completion_rate: Number(partner.completion_rate),
    on_time_rate: Number(partner.on_time_rate),
    photo_submission_rate: Number(partner.photo_submission_rate),
    score_updated_at: partner.score_updated_at,
  };
}
