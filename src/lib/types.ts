export type CatalogKind = "anime" | "movie" | "series";
export type CatalogSource = "tvmaze" | "anilist";
export type WatchStatus = "plan" | "watching" | "watched" | "passed";
export type MediaFilter = "all" | "movie" | "series";
export type Tier = "S" | "A" | "B" | "C" | "D" | "F";
export type AppView = "foryou" | "browse" | "list";
export type SortMode = "match" | "score" | "year" | "az";

export const TIERS: Tier[] = ["S", "A", "B", "C", "D", "F"];

export const TIER_WEIGHT: Record<Tier, number> = {
  S: 6,
  A: 4,
  B: 2,
  C: 0.4,
  D: -2,
  F: -4.5,
};

export interface CatalogTitle {
  id: string;
  source: CatalogSource;
  externalId: number;
  title: string;
  poster: string | null;
  kind: CatalogKind;
  score: number | null;
  year: string | null;
  genres: string[];
  summary: string;
  episodes: number | null;
  ongoing: boolean;
}

export interface LibraryItem extends CatalogTitle {
  status: WatchStatus;
  rating: Tier | null;
  partialRating: Tier | null;
  addedAt: number;
  updatedAt: number;
}

export interface TasteProfile {
  genres: Record<string, number>;
  kinds: Record<string, number>;
  answers: number;
  quizDone: boolean;
}

export interface GenreTile {
  genre: string;
  poster: string | null;
  sampleTitle: string;
}
