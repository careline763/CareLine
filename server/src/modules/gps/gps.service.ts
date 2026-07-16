import prisma from '../../config/db';

interface Waypoint { lat: number; lng: number; ts: number }

function haversineKm(a: Waypoint, b: Waypoint): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function calcTotalKm(waypoints: Waypoint[]): number {
  let total = 0;
  for (let i = 1; i < waypoints.length; i++) {
    total += haversineKm(waypoints[i - 1], waypoints[i]);
  }
  return Math.round(total * 100) / 100;
}

export async function appendWaypoint(bookingId: number, lat: number, lng: number) {
  const newPoint: Waypoint = { lat, lng, ts: Date.now() };

  const existing = await prisma.gpsRoute.findUnique({ where: { booking_id: bookingId } });
  if (existing) {
    const waypoints = [...(existing.waypoints as unknown as Waypoint[]), newPoint];
    return prisma.gpsRoute.update({
      where: { booking_id: bookingId },
      data: { waypoints: waypoints as unknown as object[], total_km: calcTotalKm(waypoints) },
    });
  }

  return prisma.gpsRoute.create({
    data: {
      booking_id: bookingId,
      waypoints: [newPoint] as unknown as object[],
      started_at: new Date(),
      total_km: 0,
    },
  });
}

export async function finaliseRoute(bookingId: number) {
  const route = await prisma.gpsRoute.findUnique({ where: { booking_id: bookingId } });
  if (!route) return;
  return prisma.gpsRoute.update({
    where: { booking_id: bookingId },
    data: { ended_at: new Date() },
  });
}

export async function getRoute(bookingId: number) {
  return prisma.gpsRoute.findUnique({ where: { booking_id: bookingId } });
}
