self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'SparkWash Partner';
  const options = {
    body: data.body || '',
    icon: data.icon || '/favicon.svg',
    badge: '/favicon.svg',
    data: data.data || {},
    vibrate: [300, 100, 300, 100, 300],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const bookingId = event.notification.data?.bookingId;
  const url = bookingId ? `/jobs/${bookingId}` : '/jobs';
  event.waitUntil(clients.openWindow(url));
});
