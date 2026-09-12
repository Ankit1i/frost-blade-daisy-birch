import { TIER_WEIGHT, type CatalogTitle, type TasteProfile, type Tier, type WatchStatus } from "@/lib/types";

export function emptyTaste(): TasteProfile {
  return { genres: {}, kinds: {}, answers: 0, quizDone: false };
}

function bump(map: Record<string, number>, key: string, amount: number) {
  map[key] = (map[key] ?? 0) + amount;
}

export function learnFrom(
  taste: TasteProfile,
  title: CatalogTitle,
  status: WatchStatus,
  rating: Tier | null,
): TasteProfile {
  const genres = { ...taste.genres };
  const kinds = { ...taste.kinds };
  let strength = 0;
  if (status === "watched") strength = rating ? TIER_WEIGHT[rating] : 3;
  else if (status === "watching") strength = rating ? TIER_WEIGHT[rating] * 0.55 : 1.4;
  else if (status === "plan") strength = 1.15;
  else if (status === "passed") strength = -3.2;

  for (const genre of title.genres) bump(genres, genre, strength);
  bump(kinds, title.kind, strength * 0.45);

  return {
    genres,
    kinds,
    answers: taste.answers + 1,
    quizDone: taste.quizDone || taste.answers + 1 >= 20,
  };
}

export function profileStrength(taste: TasteProfile): number {
  let total = 0;
  for (const value of Object.values(taste.genres)) total += Math.abs(value);
  for (const value of Object.values(taste.kinds)) total += Math.abs(value);
  return total;
}

export function scoreTitle(title: CatalogTitle, taste: TasteProfile): number {
  const strength = profileStrength(taste);
  const priorMix = 1 / (1 + strength / 14);
  let learned = 0;
  for (const genre of title.genres) learned += taste.genres[genre] ?? 0;
  learned += (taste.kinds[title.kind] ?? 0) * 0.8;
  const prior = (title.score ?? 6) * 1.1;
  return learned * (1 - priorMix) + prior * priorMix;
}

export function rankTitles(
  pool: CatalogTitle[],
  taste: TasteProfile,
  hidden: Set<string>,
): CatalogTitle[] {
  return [...pool]
    .filter((title) => !hidden.has(title.id) && title.poster)
    .sort((a, b) => scoreTitle(b, taste) - scoreTitle(a, taste));
}
