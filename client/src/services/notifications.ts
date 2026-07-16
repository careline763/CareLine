import api from './api';

export async function subscribeToPush(): Promise<void> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

  try {
    const reg = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    // Fetch VAPID public key
    const { data: keyRes } = await api.get('/notifications/vapid-key');
    const vapidKey: string = keyRes.data;
    if (!vapidKey) return;

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      // @ts-ignore - Type compatibility issue with ArrayBuffer
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });

    const json = sub.toJSON();
    await api.post('/notifications/push-subscribe', {
      endpoint: json.endpoint,
      keys: { p256dh: json.keys?.p256dh, auth: json.keys?.auth },
      device: navigator.userAgent.slice(0, 100),
    });
  } catch {
    // Push subscribe is best-effort — silently ignore
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}
