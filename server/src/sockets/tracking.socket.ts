import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt';
import prisma from '../config/db';
import logger from '../utils/logger';
import { appendWaypoint, finaliseRoute } from '../modules/gps/gps.service';

interface AuthenticatedSocket extends Socket {
  user: { userId: number; role: string };
}

let io: Server | null = null;

// In-memory location cache (Redis would replace this in production)
const partnerLocations = new Map<number, { lat: number; lng: number; ts: number }>();

export function initSocket(server: import('http').Server): Server {
  io = new Server(server, {
    cors: {
      origin: [
        process.env.CLIENT_URL || 'http://localhost:5173',
        'http://localhost:5176',
        'http://localhost:5177',
      ],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const payload = verifyAccessToken(token);
      (socket as AuthenticatedSocket).user = payload;
      next();
    } catch {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const s = socket as AuthenticatedSocket;
    logger.info(`Socket connected: ${socket.id} (user=${s.user.userId} role=${s.user.role})`);

    // ── Customer: join booking room ──
    socket.on('booking:join', (bookingId: number) => {
      socket.join(`booking:${bookingId}`);
      // Send cached location if partner is already en route
      const loc = partnerLocations.get(bookingId);
      if (loc) socket.emit('booking:location', { bookingId, ...loc });
    });

    socket.on('booking:leave', (bookingId: number) => {
      socket.leave(`booking:${bookingId}`);
    });

    // ── Partner: broadcast GPS location ──
    // Emitted every ~10s while job is active
    socket.on('partner:location', async (data: {
      bookingId: number; lat: number; lng: number;
    }) => {
      if (s.user.role !== 'partner') return;

      const { bookingId, lat, lng } = data;
      if (typeof lat !== 'number' || typeof lng !== 'number') return;

      // Cache and relay to customer room
      partnerLocations.set(bookingId, { lat, lng, ts: Date.now() });
      io?.to(`booking:${bookingId}`).emit('booking:location', { bookingId, lat, lng });

      // Store waypoint for GPS route replay
      appendWaypoint(bookingId, lat, lng).catch(() => {});

      // Persist to Partner row (throttled — only if >60s since last update)
      try {
        const booking = await prisma.booking.findUnique({
          where: { id: bookingId },
          select: { partner_id: true, status: true },
        });
        if (booking?.partner_id) {
          const partner = await prisma.partner.findUnique({
            where: { id: booking.partner_id },
            select: { id: true, updated_at: true },
          });
          if (partner) {
            const lastUpdate = partner.updated_at.getTime();
            if (Date.now() - lastUpdate > 60_000) {
              await prisma.partner.update({
                where: { id: partner.id },
                data: { current_lat: lat, current_lng: lng },
              });
            }
          }
          // Finalise route when job completes
          if (booking.status === 'completed') {
            finaliseRoute(bookingId).catch(() => {});
          }
        }
      } catch { /* non-critical */ }
    });

    // ── Partner: clear location on disconnect ──
    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getIO(): Server | null { return io; }

export function getPartnerLocation(bookingId: number) {
  return partnerLocations.get(bookingId) ?? null;
}
