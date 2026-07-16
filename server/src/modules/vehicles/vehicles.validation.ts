import { z } from 'zod';

export const createVehicleSchema = z.object({
  type: z.enum(['hatchback', 'sedan', 'suv', 'muv', 'luxury']),
  model: z.string().min(2),
  plate_number: z.string().min(4).max(15),
});
