// data/channels.ts
export interface Channel {
  id: string;
  name: string;
  description: string;
  badgeColor?: string;
}

const DEFAULT_CHANNELS: Channel[] = [
  { id: 'cs101', name: 'CS101: Web Architectures', description: 'Core web architecture & Next.js lectures' },
  { id: 'cs102', name: 'CS102: Systems & Deployment', description: 'Backend systems, Docker, and API design' },
  { id: 'general', name: 'General Announcements', description: 'Department-wide technical updates' },
];

const STORAGE_KEY = 'lms_mock_channels';

function loadChannels(): Channel[] {
  if (typeof window === 'undefined') return DEFAULT_CHANNELS;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch {}
  }
  return DEFAULT_CHANNELS;
}

// Mutable live reference exported under the exact same variable name
export const CHANNELS: Channel[] = new Proxy(DEFAULT_CHANNELS, {
  get(target, prop) {
    const current = loadChannels();
    const value = Reflect.get(current, prop);
    return typeof value === 'function' ? value.bind(current) : value;
  },
});

export function addChannel(newChannel: Channel) {
  const current = loadChannels();
  const updated = [...current, newChannel];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage')); // Notify active views
  }
}