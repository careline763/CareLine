import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

const EMIT_INTERVAL = 10_000; // 10 seconds

export function useGPS(bookingId: number | null, active: boolean) {
  const { token } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastPos = useRef<GeolocationCoordinates | null>(null);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!bookingId || !active || !token) { stopTracking(); return; }
    if (!('geolocation' in navigator)) return;

    // Create socket if needed
    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000', {
        auth: { token },
        transports: ['websocket'],
      });
    }

    const emit = () => {
      if (!lastPos.current || !socketRef.current?.connected) return;
      socketRef.current.emit('partner:location', {
        bookingId,
        lat: lastPos.current.latitude,
        lng: lastPos.current.longitude,
      });
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      pos => { lastPos.current = pos.coords; },
      () => { /* silently ignore */ },
      { enableHighAccuracy: true, maximumAge: 5000 }
    );

    // Emit on an interval instead of every position update to throttle traffic
    intervalRef.current = setInterval(emit, EMIT_INTERVAL);
    emit(); // emit once immediately

    return stopTracking;
  }, [bookingId, active, token, stopTracking]);

  // Disconnect socket on unmount
  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);
}
