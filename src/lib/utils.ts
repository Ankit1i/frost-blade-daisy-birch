import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CatalogKind, CatalogTitle, MediaFilter } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&/g, "&")
    .replace(/"/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatScore(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toFixed(1);
}

export function mediaKey(source: string, externalId: number): string {
  return `${source}:${externalId}`;
}

export function matchesFilter(title: CatalogTitle, filter: MediaFilter): boolean {
  if (filter === "all") return true;
  if (filter === "movie") return title.kind === "movie";
  return title.kind === "series" || title.kind === "anime";
}

export function kindLabel(kind: CatalogKind): string {
  if (kind === "movie") return "Movie";
  if (kind === "anime") return "Series";
  return "Series";
}

export function canPartialRate(title: CatalogTitle): boolean {
  return !title.ongoing;
}
