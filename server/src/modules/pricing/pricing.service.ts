import prisma from '../../config/db';

export interface PriceResult {
  base_price: number;
  surge_multiplier: number;
  final_price: number;
  surge_reasons: string[];
  is_surge: boolean;
}

const DEFAULT_RULES = [
  { name: 'Peak Morning', type: 'peak_hour',   multiplier: 1.20, config_json: { hours: [7, 8, 9] } },
  { name: 'Peak Evening', type: 'peak_hour',   multiplier: 1.20, config_json: { hours: [17, 18, 19] } },
  { name: 'Weekend',      type: 'weekend',     multiplier: 1.10, config_json: { days: [0, 6] } },
  { name: 'High Demand',  type: 'demand',      multiplier: 1.15, config_json: { threshold: 5 } },
  { name: 'Waterless',    type: 'waterless',   multiplier: 1.05, config_json: {} },
  { name: 'SUV Premium',  type: 'vehicle_type', multiplier: 1.30, config_json: { types: ['suv', 'SUV'] } },
  { name: 'Sedan',        type: 'vehicle_type', multiplier: 1.10, config_json: { types: ['sedan', 'Sedan'] } },
];

export async function calculate(params: {
  plan_id: number;
  scheduled_at: string;
  pincode: string;
  vehicle_type?: string;
}): Promise<PriceResult> {
  const plan = await prisma.plan.findUniqueOrThrow({ where: { id: params.plan_id } });
  const basePrice = Number(plan.price);

  // Load active pricing rules (use defaults if none seeded)
  const dbRules = await prisma.pricingRule.findMany({ where: { is_active: true } });
  const rules = dbRules.length > 0
    ? dbRules.map(r => ({ ...r, config_json: r.config_json as Record<string, unknown> }))
    : DEFAULT_RULES;

  const dt = new Date(params.scheduled_at);
  const hour = dt.getHours();
  const day = dt.getDay(); // 0=Sun, 6=Sat

  let multiplier = 1.0;
  const reasons: string[] = [];

  for (const rule of rules) {
    const cfg = (rule.config_json ?? {}) as Record<string, unknown>;

    if (rule.type === 'peak_hour') {
      const hours = (cfg.hours as number[]) ?? [];
      if (hours.includes(hour)) {
        multiplier = Math.max(multiplier, Number(rule.multiplier));
        reasons.push(`${rule.name} (+${Math.round((Number(rule.multiplier) - 1) * 100)}%)`);
      }
    }

    if (rule.type === 'weekend') {
      const days = (cfg.days as number[]) ?? [0, 6];
      if (days.includes(day)) {
        multiplier = Math.max(multiplier, Number(rule.multiplier));
        reasons.push(`Weekend surge (+${Math.round((Number(rule.multiplier) - 1) * 100)}%)`);
      }
    }

    if (rule.type === 'demand') {
      const threshold = (cfg.threshold as number) ?? 5;
      const activeCount = await prisma.booking.count({
        where: {
          pincode: params.pincode,
          status: { in: ['confirmed', 'assigned', 'en_route', 'started'] },
        },
      });
      if (activeCount >= threshold) {
        multiplier = Math.max(multiplier, Number(rule.multiplier));
        reasons.push(`High demand in your area (+${Math.round((Number(rule.multiplier) - 1) * 100)}%)`);
      }
    }

    if (rule.type === 'waterless' && plan.is_waterless) {
      multiplier = Math.max(multiplier, Number(rule.multiplier));
      reasons.push(`Waterless premium (+${Math.round((Number(rule.multiplier) - 1) * 100)}%)`);
    }

    if (rule.type === 'vehicle_type' && params.vehicle_type) {
      const types = (cfg.types as string[]) ?? [];
      if (types.some(t => t.toLowerCase() === params.vehicle_type!.toLowerCase())) {
        multiplier = Math.max(multiplier, Number(rule.multiplier));
        reasons.push(`${rule.name} (+${Math.round((Number(rule.multiplier) - 1) * 100)}%)`);
      }
    }
  }

  const finalPrice = Math.round(basePrice * multiplier);

  return {
    base_price: basePrice,
    surge_multiplier: Math.round(multiplier * 100) / 100,
    final_price: finalPrice,
    surge_reasons: reasons,
    is_surge: multiplier > 1.0,
  };
}

export const listRules = () =>
  prisma.pricingRule.findMany({ orderBy: { type: 'asc' } });

export const upsertRule = (data: {
  id?: number; name: string; type: string; multiplier: number;
  config_json?: object; is_active?: boolean;
}) => {
  if (data.id) {
    return prisma.pricingRule.update({ where: { id: data.id }, data });
  }
  return prisma.pricingRule.create({ data: { ...data, id: undefined } });
};

export const seedDefaultRules = async () => {
  const count = await prisma.pricingRule.count();
  if (count > 0) return;
  await prisma.pricingRule.createMany({ data: DEFAULT_RULES });
};
