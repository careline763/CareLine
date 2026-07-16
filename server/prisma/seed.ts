import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed service areas
  await prisma.serviceArea.createMany({
    skipDuplicates: true,
    data: [
      { pincode: '400001', city: 'Mumbai', is_active: true },
      { pincode: '400053', city: 'Mumbai - Andheri', is_active: true },
      { pincode: '110001', city: 'Delhi', is_active: true },
      { pincode: '560001', city: 'Bengaluru', is_active: true },
      { pincode: '500001', city: 'Hyderabad', is_active: true, is_waterless_zone: true },
      { pincode: '600001', city: 'Chennai', is_active: true },
      { pincode: '201310', city: 'Noida', is_active: true },
      { pincode: '201301', city: 'Noida', is_active: true },
      { pincode: '201304', city: 'Greater Noida', is_active: true },
    ],
  });

  // Seed plans
  await prisma.plan.createMany({
    skipDuplicates: true,
    data: [
      {
        name: 'One-Time Wash', type: 'one_time', price: 249, frequency: 'Per visit',
        includes_json: ['Exterior wash', 'Wipe-down & dry', 'Tyre cleaning', 'Glass wipe'],
      },
      {
        name: 'Weekly Plan', type: 'weekly', price: 799, frequency: '4 washes/month',
        includes_json: ['4 exterior washes', 'Dashboard wipe', 'Tyre dressing', 'Free reschedule'],
      },
      {
        name: 'Monthly Pro', type: 'monthly', price: 1499, frequency: 'Daily wash', popular: true,
        includes_json: ['Daily exterior wash', 'Interior vacuum 2x/week', 'Dashboard polish', 'Seat sanitization monthly', 'Priority assignment'],
      },
      {
        name: 'Society Plan', type: 'society', price: 12999, frequency: 'Up to 20 cars',
        includes_json: ['Bulk pricing', 'Dedicated partner team', 'Single billing', 'Weekly reporting'],
      },
    ],
  });

  // Seed services
  await prisma.service.createMany({
    skipDuplicates: true,
    data: [
      { name: 'Exterior Wash', description: 'Full exterior rinse, foam wash, and wipe-down.', price: 149, category: 'exterior' },
      { name: 'Interior Vacuum', description: 'Deep vacuum of seats, floor mats, and boot area.', price: 199, category: 'interior' },
      { name: 'Dashboard Polish', description: 'Dashboard and door panels cleaned with UV protectant.', price: 99, category: 'interior' },
      { name: 'Tyre Dressing', description: 'Tyres cleaned and dressed for a glossy look.', price: 79, category: 'exterior' },
      { name: 'Waterless Wash', description: 'Eco-friendly waterless formula. No water required.', price: 199, category: 'waterless' },
      { name: 'Glass Cleaning', description: 'All windows cleaned inside and out.', price: 99, category: 'exterior' },
      { name: 'Seat Sanitization', description: 'Anti-bacterial spray on all seat surfaces.', price: 149, category: 'interior' },
    ],
  });

  console.log('Seed complete ✓');
}

main().catch(console.error).finally(() => prisma.$disconnect());
