declare global {
  interface Window {
    gtag: (command: string, action: string, params?: Record<string, unknown>) => void;
  }
}

type GTagEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

export const trackingEvent = ({ action, category, label, value }: GTagEvent) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
};
