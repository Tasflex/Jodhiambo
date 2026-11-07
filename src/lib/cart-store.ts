"use client";

import { useSyncExternalStore } from "react";

/**
 * The cart is a list of product IDs ("course:<slug>" or "plan:<id>"); everything
 * is digital, so quantity is always 1, and at most one All-Access plan is kept.
 * It lives in localStorage and is read through useSyncExternalStore, which keeps
 * server and client renders consistent and syncs changes across open tabs.
 */

const KEY = "jodhiambo.cart.v2";
const isPlan = (id: string) => id.startsWith("plan:");
const EMPTY: readonly string[] = Object.freeze([]);
const listeners = new Set<() => void>();

let cachedRaw: string | null = null;
let cachedValue: readonly string[] = EMPTY;

function read(): readonly string[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return cachedValue; // storage blocked (private mode etc.): fall back to memory
  }
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cachedValue = Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : EMPTY;
  } catch {
    cachedValue = EMPTY;
  }
  return cachedValue;
}

function write(next: readonly string[]) {
  cachedValue = next;
  cachedRaw = JSON.stringify(next);
  try {
    window.localStorage.setItem(KEY, cachedRaw);
  } catch {
    /* keep the in-memory value */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => e.key === KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export const cart = {
  add(id: string) {
    const items = read();
    if (items.includes(id)) return;
    // Only one All-Access plan at a time: a new plan replaces the old one.
    const kept = isPlan(id) ? items.filter((i) => !isPlan(i)) : items;
    write([...kept, id]);
  },
  remove(id: string) {
    write(read().filter((i) => i !== id));
  },
  clear() {
    write(EMPTY);
  },
};

export function useCart(): readonly string[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

/** False during SSR and the hydration pass; true once the real cart can be shown. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
