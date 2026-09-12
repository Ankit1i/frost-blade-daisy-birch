import { mediaKey, stripHtml } from "@/lib/utils";
import type { CatalogKind, CatalogTitle, GenreTile, MediaFilter } from "@/lib/types";

interface TvMazeShow {
  id: number;
  name: string;
  type?: string;
  genres?: string[];
  runtime?: number | null;
  averageRuntime?: number | null;
  premiered?: string | null;
  status?: string | null;
  rating?: { average?: number | null } | null;
  image?: { medium?: string | null; original?: string | null } | null;
  summary?: string | null;
}

interface AniListMedia {
  id: number;
  title?: { romaji?: string | null; english?: string | null };
  coverImage?: { extraLarge?: string | null; large?: string | null };
  genres?: string[] | null;
  averageScore?: number | null;
  episodes?: number | null;
  status?: string | null;
  seasonYear?: number | null;
  startDate?: { year?: number | null };
  format?: string | null;
  description?: string | null;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson<T>(url: string, retries = 1): Promise<T> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
      });
      if (res.status === 429 && attempt < retries) {
        await wait(1000 * (attempt + 1));
        continue;
      }
      if (!res.ok) throw new Error(`Catalog request failed (${res.status})`);
      return (await res.json()) as T;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error("Catalog request failed");
      if (attempt < retries) {
        await wait(400 * (attempt + 1));
        continue;
      }
    }
  }
  throw lastError ?? new Error("Catalog request failed");
}

function yearFrom(value?: string | number | null): string | null {
  if (value == null) return null;
  const text = String(value).slice(0, 4);
  return /^\d{4}$/.test(text) ? text : null;
}

export function uniqueTitles(list: CatalogTitle[]): CatalogTitle[] {
  const seen = new Set<string>();
  const out: CatalogTitle[] = [];
  for (const item of list) {
    if (!item.title || !item.poster || seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
}

function tvKind(show: TvMazeShow): CatalogKind {
  const type = (show.type ?? "").toLowerCase();
  if (type === "movie" || (show.averageRuntime ?? show.runtime ?? 0) >= 85) return "movie";
  if (type.includes("animation") && (show.genres ?? []).some((g) => g.toLowerCase() === "anime")) {
    return "anime";
  }
  return "series";
}

export function fromTvMaze(show: TvMazeShow): CatalogTitle {
  const status = (show.status ?? "").toLowerCase();
  return {
    id: mediaKey("tvmaze", show.id),
    source: "tvmaze",
    externalId: show.id,
    title: show.name,
    poster: show.image?.original ?? show.image?.medium ?? null,
    kind: tvKind(show),
    score: show.rating?.average ?? null,
    year: yearFrom(show.premiered),
    genres: show.genres ?? [],
    summary: stripHtml(show.summary),
    episodes: null,
    ongoing: status === "running" || status === "in development",
  };
}

function fromAniList(media: AniListMedia): CatalogTitle {
  const format = (media.format ?? "").toUpperCase();
  const kind: CatalogKind = format === "MOVIE" ? "movie" : "anime";
  const status = (media.status ?? "").toUpperCase();
  return {
    id: mediaKey("anilist", media.id),
    source: "anilist",
    externalId: media.id,
    title: media.title?.english || media.title?.romaji || "Untitled",
    poster: media.coverImage?.extraLarge ?? media.coverImage?.large ?? null,
    kind,
    score: media.averageScore != null ? media.averageScore / 10 : null,
    year: yearFrom(media.seasonYear ?? media.startDate?.year ?? null),
    genres: media.genres ?? [],
    summary: stripHtml(media.description),
    episodes: media.episodes ?? null,
    ongoing: status === "RELEASING" || status === "NOT_YET_RELEASED",
  };
}

async function loadAniListPage(page: number, perPage = 50, format?: string): Promise<CatalogTitle[]> {
  const query = format
    ? `
    query ($page: Int, $perPage: Int, $format: MediaFormat) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: POPULARITY_DESC, isAdult: false, format: $format) {
          id title { romaji english } coverImage { extraLarge large }
          genres averageScore episodes status seasonYear startDate { year } format
          description(asHtml: false)
        }
      }
    }`
    : `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
          id title { romaji english } coverImage { extraLarge large }
          genres averageScore episodes status seasonYear startDate { year } format
          description(asHtml: false)
        }
      }
    }`;
  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      query,
      variables: format ? { page, perPage, format } : { page, perPage },
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`AniList failed (${res.status})`);
  const json = (await res.json()) as { data?: { Page?: { media?: AniListMedia[] } } };
  return uniqueTitles((json.data?.Page?.media ?? []).map(fromAniList));
}

async function loadTvPage(page: number): Promise<CatalogTitle[]> {
  const shows = await fetchJson<TvMazeShow[]>(`https://api.tvmaze.com/shows?page=${page}`, 1);
  return uniqueTitles(shows.map(fromTvMaze));
}

const FILM_QUERIES = [
  "Chernobyl",
  "Band of Brothers",
  "The Queen's Gambit",
  "Watchmen",
  "Fargo",
  "Shogun",
  "True Detective",
  "The Last of Us",
  "Dune",
  "Spirited Away",
  "Parasite",
  "The Dark Knight",
];

async function loadCinematicTitles(): Promise<CatalogTitle[]> {
  const results = await Promise.allSettled(
    FILM_QUERIES.map((q) =>
      fetchJson<{ show: TvMazeShow }[]>(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(q)}`),
    ),
  );
  const titles: CatalogTitle[] = [];
  for (const res of results) {
    if (res.status !== "fulfilled") continue;
    const hit = res.value.find((row) => row.show.image);
    if (hit) titles.push({ ...fromTvMaze(hit.show), kind: "movie" });
  }
  return uniqueTitles(titles);
}

export async function loadCatalogPool(): Promise<CatalogTitle[]> {
  const results = await Promise.allSettled([
    loadTvPage(0),
    loadAniListPage(1, 50),
    loadAniListPage(2, 50),
    loadAniListPage(1, 50, "MOVIE"),
    loadAniListPage(2, 50, "MOVIE"),
    loadCinematicTitles(),
  ]);
  const merged: CatalogTitle[] = [];
  for (const res of results) {
    if (res.status === "fulfilled") merged.push(...res.value);
  }
  return uniqueTitles(merged);
}

export async function loadExtraPool(round: number): Promise<CatalogTitle[]> {
  const results = await Promise.allSettled([loadTvPage(round), loadAniListPage(round + 2, 50)]);
  const merged: CatalogTitle[] = [];
  for (const res of results) {
    if (res.status === "fulfilled") merged.push(...res.value);
  }
  return uniqueTitles(merged);
}

export async function searchCatalog(query: string): Promise<CatalogTitle[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const aniQuery = `
    query ($q: String) {
      Page(page: 1, perPage: 20) {
        media(type: ANIME, search: $q, isAdult: false, sort: SEARCH_MATCH) {
          id
          title { romaji english }
          coverImage { extraLarge large }
          genres
          averageScore
          episodes
          status
          seasonYear
          startDate { year }
          format
          description(asHtml: false)
        }
      }
    }
  `;

  const [tvRes, aniRes] = await Promise.allSettled([
    fetchJson<{ show: TvMazeShow }[]>(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(q)}`, 1),
    fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ query: aniQuery, variables: { q } }),
      signal: AbortSignal.timeout(8000),
    }).then(async (res) => {
      if (!res.ok) throw new Error("AniList search failed");
      return (await res.json()) as { data?: { Page?: { media?: AniListMedia[] } } };
    }),
  ]);

  const tv = tvRes.status === "fulfilled" ? tvRes.value.map((row) => fromTvMaze(row.show)) : [];
  const ani =
    aniRes.status === "fulfilled" ? (aniRes.value.data?.Page?.media ?? []).map(fromAniList) : [];
  return uniqueTitles([...ani, ...tv]).slice(0, 50);
}

const GENRE_ALIASES: Record<string, string[]> = {
  "sci-fi": ["sci-fi", "science-fiction", "science fiction", "sci fi"],
  "slice of life": ["slice of life", "slice-of-life"],
};

export const CANON_GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
  "War",
  "Western",
];

function genreMatches(genres: string[], needle: string): boolean {
  const key = needle.toLowerCase();
  const names = GENRE_ALIASES[key] ?? [key];
  return genres.some((g) => names.includes(g.toLowerCase()));
}

export function filterByGenre(pool: CatalogTitle[], genre: string, media: MediaFilter): CatalogTitle[] {
  return pool.filter((title) => {
    if (media === "movie" && title.kind !== "movie") return false;
    if (media === "series" && title.kind === "movie") return false;
    return genreMatches(title.genres, genre);
  });
}

export function buildGenreBoard(): GenreTile[] {
  return CANON_GENRES.map((genre) => ({ genre, poster: null, sampleTitle: "" }));
}
