const BY_NAME: Record<string, string> = {
  Action: "oklch(0.58 0.14 32)",
  Adventure: "oklch(0.56 0.12 75)",
  Comedy: "oklch(0.62 0.13 95)",
  Crime: "oklch(0.48 0.1 280)",
  Drama: "oklch(0.52 0.12 350)",
  Fantasy: "oklch(0.55 0.14 300)",
  Horror: "oklch(0.46 0.12 18)",
  Mystery: "oklch(0.5 0.11 250)",
  Romance: "oklch(0.58 0.13 8)",
  "Sci-Fi": "oklch(0.54 0.12 210)",
  "Slice of Life": "oklch(0.6 0.1 145)",
  Sports: "oklch(0.56 0.13 145)",
  Supernatural: "oklch(0.5 0.13 290)",
  Thriller: "oklch(0.5 0.12 25)",
  War: "oklch(0.48 0.08 70)",
  Western: "oklch(0.54 0.11 55)",
};

const FALLBACK = [
  "oklch(0.55 0.13 250)",
  "oklch(0.54 0.12 20)",
  "oklch(0.56 0.12 160)",
  "oklch(0.57 0.12 80)",
  "oklch(0.53 0.13 300)",
  "oklch(0.52 0.11 200)",
];

export function genreLook(genre: string, index: number, total: number): { color: string; tint: string } {
  let hash = 0;
  for (const ch of genre) hash = (hash + ch.charCodeAt(0) * 17) % 997;
  const color = BY_NAME[genre] ?? FALLBACK[hash % FALLBACK.length];
  const t = total <= 1 ? 58 : 62 - (index / (total - 1)) * 24;
  return { color, tint: `${Math.round(t)}%` };
}
