/* eslint-disable no-restricted-globals */
/* global self, clients */

self.addEventListener("push", (event) => {
  let title = "찾아줘!";
  let body = "";
  let url = "/";

  if (event.data) {
    try {
      const payload = event.data.json();
      title = payload.title ?? payload.notification?.title ?? payload.subject ?? title;
      body = payload.body ?? payload.message ?? payload.content ?? payload.notification?.body ?? "";
      url = payload.url ?? payload.link ?? payload.click_action ?? payload.data?.url ?? "/";
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

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      let openUrl = raw;
      if (typeof raw === "string" && !raw.startsWith("http")) {
        openUrl = self.location.origin + (raw.startsWith("/") ? raw : "/" + raw);
      }

      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(openUrl);
      }
    })
  );
});
