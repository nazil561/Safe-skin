import type { CheckResult, Prescribed } from "@/lib/rules";

export type SavedCheck = {
  id: string;
  createdAt: string;
  labelText: string;
  hasPanel: boolean;
  prescribed: Prescribed;
  result: CheckResult;
};

export type SkinProfile = {
  feel: string[];
  goals: string[];
  flags: string[];
};

const CHECKS_KEY = "ss_checks_v1";
const PROFILE_KEY = "ss_profile_v1";

const EMPTY_CHECKS: SavedCheck[] = [];
const EMPTY_PROFILE: SkinProfile = { feel: [], goals: [], flags: [] };
let checksCache: SavedCheck[] = [];
let checksLoaded = false;
let profileCache: SkinProfile = EMPTY_PROFILE;
let profileLoaded = false;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("ss-store"));
  } catch {
    return;
  }
}

export function loadChecks(): SavedCheck[] {
  const list = read<SavedCheck[]>(CHECKS_KEY, []);
  return Array.isArray(list) ? list : [];
}

export function subscribeStore(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  function handleChange() {
    checksCache = loadChecks();
    checksLoaded = true;
    profileCache = loadProfile();
    profileLoaded = true;
    onChange();
  }
  window.addEventListener("ss-store", handleChange);
  window.addEventListener("storage", handleChange);
  return () => {
    window.removeEventListener("ss-store", handleChange);
    window.removeEventListener("storage", handleChange);
  };
}

export function getServerChecks(): SavedCheck[] {
  return EMPTY_CHECKS;
}

export function getChecksSnapshot(): SavedCheck[] {
  if (typeof window === "undefined") return checksCache;
  if (!checksLoaded) {
    checksCache = loadChecks();
    checksLoaded = true;
  }
  return checksCache;
}

export function getServerProfile(): SkinProfile {
  return EMPTY_PROFILE;
}

export function getProfileSnapshot(): SkinProfile {
  if (typeof window === "undefined") return profileCache;
  if (!profileLoaded) {
    profileCache = loadProfile();
    profileLoaded = true;
  }
  return profileCache;
}

export function getServerSelectedCheck(): string | null {
  return null;
}

export function getSelectedCheckSnapshot(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("check");
}

export function saveCheck(entry: Omit<SavedCheck, "id" | "createdAt">): SavedCheck[] {
  const saved: SavedCheck = {
    ...entry,
    id: typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  const next = [saved, ...loadChecks()].slice(0, 50);
  checksCache = next;
  checksLoaded = true;
  write(CHECKS_KEY, next);
  return next;
}

export function removeCheck(id: string): SavedCheck[] {
  const next = loadChecks().filter((item) => item.id !== id);
  checksCache = next;
  checksLoaded = true;
  write(CHECKS_KEY, next);
  return next;
}

export function clearChecks(): void {
  checksCache = [];
  checksLoaded = true;
  write(CHECKS_KEY, []);
}

export function loadProfile(): SkinProfile {
  const profile = read<SkinProfile>(PROFILE_KEY, { feel: [], goals: [], flags: [] });
  return {
    feel: Array.isArray(profile.feel) ? profile.feel : [],
    goals: Array.isArray(profile.goals) ? profile.goals : [],
    flags: Array.isArray(profile.flags) ? profile.flags : [],
  };
}

export function saveProfile(profile: SkinProfile): void {
  profileCache = profile;
  profileLoaded = true;
  write(PROFILE_KEY, profile);
}
