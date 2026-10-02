import { Team } from './types';

// Capa de datos con fallback offline (localStorage) para uso sin internet
const KEY = 'utopia_teams';
let offline = false;

export const isOffline = () => offline;

function readLocal(): Team[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

function writeLocal(teams: Team[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(teams));
}

export async function getTeams(): Promise<Team[]> {
  try {
    const res = await fetch('/api/teams');
    if (!res.ok) throw new Error('API error');
    const data: Team[] = await res.json();
    offline = false;
    writeLocal(data);
    return data;
  } catch {
    offline = true;
    return readLocal();
  }
}

export async function addTeam(name: string): Promise<Team | null> {
  try {
    const res = await fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error('API error');
    const team: Team = await res.json();
    offline = false;
    writeLocal([team, ...readLocal()]);
    return team;
  } catch {
    offline = true;
    const team: Team = {
      id: -Date.now(),
      name: name.trim(),
      points: 0,
      created_at: new Date().toISOString(),
    };
    writeLocal([team, ...readLocal()]);
    return team;
  }
}

export async function removeTeam(id: number): Promise<void> {
  try {
    const res = await fetch(`/api/teams?id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('API error');
    offline = false;
  } catch {
    offline = true;
  }
  writeLocal(readLocal().filter((t) => t.id !== id));
}

export async function addPoints(id: number, delta: number): Promise<void> {
  try {
    const res = await fetch('/api/teams', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, delta }),
    });
    if (!res.ok) throw new Error('API error');
    offline = false;
  } catch {
    offline = true;
  }
  writeLocal(
    readLocal().map((t) =>
      t.id === id ? { ...t, points: Math.max(0, t.points + delta) } : t
    )
  );
}

const SETTINGS_KEY = 'utopia_settings';

export interface AppSettings {
  title?: string;
  logo?: string | null;
  logo2?: string | null;
}

function readLocalSettings(): AppSettings {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeLocalSettings(s: AppSettings) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

export async function getSettings(): Promise<AppSettings> {
  try {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('API error');
    const data: AppSettings = await res.json();
    offline = false;
    writeLocalSettings(data);
    return data;
  } catch {
    offline = true;
    return readLocalSettings();
  }
}

export async function saveSetting(key: 'title' | 'logo' | 'logo2', value: string | null): Promise<void> {
  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
    if (!res.ok) throw new Error('API error');
    offline = false;
  } catch {
    offline = true;
  }
  writeLocalSettings({ ...readLocalSettings(), [key]: value });
}

export async function resetPoints(): Promise<void> {
  try {
    const res = await fetch('/api/teams', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reset: true }),
    });
    if (!res.ok) throw new Error('API error');
    offline = false;
  } catch {
    offline = true;
  }
  writeLocal(readLocal().map((t) => ({ ...t, points: 0 })));
}
