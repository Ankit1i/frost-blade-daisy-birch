import { create } from "zustand";
import { emptyTaste, learnFrom } from "@/lib/recommend";
import type { CatalogTitle, LibraryItem, TasteProfile, Tier, WatchStatus } from "@/lib/types";

const STORAGE_KEY = "aether-vault-v2";

interface Persisted {
  items: Record<string, LibraryItem>;
  taste: TasteProfile;
  hidden: string[];
}

interface VaultState {
  ready: boolean;
  items: Record<string, LibraryItem>;
  taste: TasteProfile;
  hidden: string[];
  hydrate: () => void;
  persist: () => void;
  applyStatus: (
    title: CatalogTitle,
    status: WatchStatus,
    rating?: Tier | null,
    partial?: boolean,
  ) => void;
}

function toItem(
  title: CatalogTitle,
  status: WatchStatus,
  rating: Tier | null,
  partial: boolean,
  prev?: LibraryItem,
): LibraryItem {
  return {
    ...title,
    status,
    rating: partial ? (prev?.rating ?? null) : (rating ?? prev?.rating ?? null),
    partialRating: partial ? rating : (status === "watching" ? prev?.partialRating ?? null : null),
    addedAt: prev?.addedAt ?? Date.now(),
    updatedAt: Date.now(),
  };
}

export const useVault = create<VaultState>((set, get) => ({
  ready: false,
  items: {},
  taste: emptyTaste(),
  hidden: [],
  hydrate: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Persisted;
        set({
          items: parsed.items ?? {},
          taste: parsed.taste ?? emptyTaste(),
          hidden: parsed.hidden ?? [],
          ready: true,
        });
        return;
      }
    } catch {
      // fresh vault
    }
    set({ ready: true });
  },
  persist: () => {
    if (typeof window === "undefined") return;
    const { items, taste, hidden } = get();
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, taste, hidden } satisfies Persisted));
    } catch {
      // quota — keep running in memory
    }
  },
  applyStatus: (title, status, rating = null, partial = false) => {
    const current = get().items[title.id];
    const item = toItem(title, status, rating, partial, current);
    const hidden = new Set(get().hidden);
    if (status === "passed") hidden.add(title.id);
    const taste = learnFrom(get().taste, title, status, rating);
    set({
      items: { ...get().items, [title.id]: item },
      taste,
      hidden: [...hidden],
    });
    get().persist();
  },
}));

export function hiddenSet(state: Pick<VaultState, "items" | "hidden">): Set<string> {
  const next = new Set(state.hidden);
  for (const item of Object.values(state.items)) {
    if (item.status !== "plan") next.add(item.id);
  }
  return next;
}
