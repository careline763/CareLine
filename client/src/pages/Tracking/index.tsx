import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Car, CheckCircle, Clock, Phone, Navigation, Wifi, WifiOff, Route } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { BookingStatus } from '../../types';
import { connectSocket, disconnectSocket } from '../../services/socket';
import { useAuthStore } from '../../features/authStore';
import api from '../../services/api';

// Fix Leaflet default icon path broken by bundlers
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const STATUS_STEPS: { status: BookingStatus; label: string; desc: string }[] = [
  { status: 'confirmed', label: 'Booking Confirmed', desc: 'Your booking is confirmed.' },
  { status: 'assigned', label: 'Partner Assigned', desc: 'A cleaner has been assigned to your booking.' },
  { status: 'en_route', label: 'Partner En Route', desc: 'Your cleaner is on the way.' },
  { status: 'started', label: 'Cleaning Started', desc: 'Your car is being cleaned right now.' },
  { status: 'completed', label: 'Completed', desc: 'All done! Your car is sparkling clean.' },
];

const MOCK_PARTNER = { name: 'Rajan Kumar', phone: '+91 98765 43210', rating: 4.8, jobs: 312 };
const SERVICE_LOCATION = { lat: 19.1196, lng: 72.8468 }; // Andheri West, Mumbai

interface Location { lat: number; lng: number }

export default function Tracking() {
  const { id } = useParams();
  const { token } = useAuthStore();
  const [currentStatus, setCurrentStatus] = useState<BookingStatus>('en_route');
  const [partnerLoc, setPartnerLoc] = useState<Location | null>(null);
  const [connected, setConnected] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const mapDivRef = useRef<HTMLDivElement>(null);
  const partnerMarkerRef = useRef<L.Marker | null>(null);
  const destMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const [routeReplay, setRouteReplay] = useState<{ lat: number; lng: number }[] | null>(null);
  const [routeKm, setRouteKm] = useState<number | null>(null);

  const currentIdx = STATUS_STEPS.findIndex(s => s.status === currentStatus);
  const isLive = currentStatus === 'en_route' || currentStatus === 'started';

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;
    const map = L.map(mapDivRef.current, { zoomControl: false }).setView(
      [SERVICE_LOCATION.lat, SERVICE_LOCATION.lng], 14
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Destination marker (service location)
    const destIcon = L.divIcon({
      className: '',
      html: '<div class="w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center"><svg width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg></div>',
      iconSize: [32, 32], iconAnchor: [16, 16],
    });
    destMarkerRef.current = L.marker([SERVICE_LOCATION.lat, SERVICE_LOCATION.lng], { icon: destIcon })
      .addTo(map)
      .bindPopup('Service Location');

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Update partner marker when location changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !partnerLoc) return;

    const partnerIcon = L.divIcon({
      className: '',
      html: '<div class="w-10 h-10 bg-emerald-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center animate-pulse"><svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/></svg></div>',
      iconSize: [40, 40], iconAnchor: [20, 20],
    });

    if (partnerMarkerRef.current) {
      partnerMarkerRef.current.setLatLng([partnerLoc.lat, partnerLoc.lng]);
    } else {
      partnerMarkerRef.current = L.marker([partnerLoc.lat, partnerLoc.lng], { icon: partnerIcon })
        .addTo(map)
        .bindPopup(MOCK_PARTNER.name);
    }

    // Draw route line
    if (routeLineRef.current) routeLineRef.current.remove();
    routeLineRef.current = L.polyline(
      [[partnerLoc.lat, partnerLoc.lng], [SERVICE_LOCATION.lat, SERVICE_LOCATION.lng]],
      { color: '#6366f1', weight: 3, dashArray: '8 6', opacity: 0.7 }
    ).addTo(map);

    map.fitBounds([[partnerLoc.lat, partnerLoc.lng], [SERVICE_LOCATION.lat, SERVICE_LOCATION.lng]], {
      padding: [40, 40],
    });
  }, [partnerLoc]);

  // Load stored route for completed jobs
  useEffect(() => {
    if (currentStatus !== 'completed' || !id) return;
    api.get(`/gps/${id}/route`)
      .then(({ data }) => {
        const waypoints = data.data?.waypoints as { lat: number; lng: number }[] | undefined;
        if (waypoints && waypoints.length > 1) {
          setRouteReplay(waypoints);
          setRouteKm(data.data?.total_km ?? null);
        }
      })
      .catch(() => {});
  }, [currentStatus, id]);

  // Draw stored route replay on map
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !routeReplay || routeReplay.length < 2) return;
    if (routeLineRef.current) routeLineRef.current.remove();
    routeLineRef.current = L.polyline(
      routeReplay.map(p => [p.lat, p.lng] as [number, number]),
      { color: '#6366f1', weight: 3, opacity: 0.8 }
    ).addTo(map);
    map.fitBounds(routeReplay.map(p => [p.lat, p.lng] as [number, number]), { padding: [30, 30] });
  }, [routeReplay]);

  // Socket: status + GPS
  useEffect(() => {
    if (!token || !id) return;
    const socket = connectSocket(token);
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.emit('booking:join', Number(id));

    socket.on('booking:status', (data: { status: BookingStatus }) => {
      setCurrentStatus(data.status);
    });

    socket.on('booking:location', (data: { lat: number; lng: number }) => {
      setPartnerLoc({ lat: data.lat, lng: data.lng });
    });

    return () => {
      socket.emit('booking:leave', Number(id));
      socket.off('booking:status');
      socket.off('booking:location');
      disconnectSocket();
    };
  }, [token, id]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Live Tracking</h1>
        <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${connected ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400 bg-gray-100'}`}>
          {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
          {connected ? 'Live' : 'Connecting…'}
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-6">Booking #{id}</p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">
        {/* Left: map + partner card */}
        <div className="lg:col-span-3 space-y-5">
          {(isLive || routeReplay) && (
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm" style={{ height: 340 }}>
              <div ref={mapDivRef} className="w-full h-full" />
            </div>
          )}
          {routeReplay && routeKm !== null && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-center gap-3">
              <Route size={16} className="text-indigo-500 flex-shrink-0" />
              <span className="text-sm text-indigo-800 font-medium">Route recorded · {routeKm} km covered</span>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-lg flex-shrink-0">
                {MOCK_PARTNER.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{MOCK_PARTNER.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  ⭐ {MOCK_PARTNER.rating} · {MOCK_PARTNER.jobs} jobs completed
                </p>
                {partnerLoc && isLive && (
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
                    <Navigation size={11} />
                    {partnerLoc.lat.toFixed(5)}, {partnerLoc.lng.toFixed(5)} — Location live
                  </div>
                )}
              </div>
              <a href={`tel:${MOCK_PARTNER.phone}`} className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-2 rounded-xl text-sm font-semibold flex-shrink-0">
                <Phone size={14} /> Call
              </a>
            </div>
          </div>

          {currentStatus === 'en_route' && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center gap-3">
              <Car size={18} className="text-indigo-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-indigo-900">Partner is on the way</p>
                <p className="text-xs text-indigo-600 mt-0.5">Expected arrival in ~15 minutes</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: status timeline */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:sticky lg:top-20">
          <h2 className="font-semibold text-gray-900 mb-5">Status Updates</h2>
          <div className="space-y-0">
            {STATUS_STEPS.map((s, i) => {
              const isDone = i < currentIdx;
              const isActive = i === currentIdx;
              const isPending = i > currentIdx;
              return (
                <div key={s.status} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isDone ? 'bg-emerald-500' : isActive ? 'bg-blue-600 animate-pulse' : 'bg-gray-100'}`}>
                      {isDone ? <CheckCircle size={16} className="text-white" /> :
                       isActive ? <Clock size={16} className="text-white" /> :
                       <div className="w-2 h-2 rounded-full bg-gray-300" />}
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`w-0.5 h-10 mt-1 ${isDone ? 'bg-emerald-400' : 'bg-gray-100'}`} />
                    )}
                  </div>
                  <div className="pb-8 last:pb-0">
                    <p className={`font-medium text-sm ${isPending ? 'text-gray-300' : 'text-gray-900'}`}>{s.label}</p>
                    <p className={`text-xs mt-0.5 ${isPending ? 'text-gray-200' : 'text-gray-400'}`}>{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
