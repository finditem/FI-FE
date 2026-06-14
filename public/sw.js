/* eslint-disable no-restricted-globals */
/* global self, clients */
importScripts("/normalizePushNotificationUrl.js");

self.addEventListener("push", (event) => {
  let title = "찾아줘!";
  let body = "";
  let url = "/";

  if (event.data) {
    try {
      const payload = event.data.json();
      title = payload.title ?? payload.notification?.title ?? payload.subject ?? title;
      body = payload.body ?? payload.message ?? payload.content ?? payload.notification?.body ?? "";
      url = resolvePushNotificationPathFromPayload(payload);
    } catch {
      try {
        const text = event.data.text();
        if (text) body = text;
      } catch {
        // ignore
      }
    }
  }

  const options = {
    body,
    icon: "/pwa/icon-192.png",
    badge: "/favicon/default/favicon-48.png",
    data: { url },
    vibrate: [120, 80, 120],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const raw = event.notification?.data?.url || "/";
  const openUrl = resolvePushNotificationOpenUrl(raw, self.location.origin);

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(async (clientList) => {
        for (const client of clientList) {
          if (client.url.startsWith(self.location.origin) && "focus" in client) {
            await client.focus();
            if ("navigate" in client) {
              return client.navigate(openUrl);
            }
            return;
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(openUrl);
        }
      })
  );
});
