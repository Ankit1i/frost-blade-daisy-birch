import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Filter, Search, Sparkle } from "lucide-react";
import { toast } from "sonner";
import { ExpandCard } from "@/components/expand-card";
import { TasteRound } from "@/components/taste-round";
import { TitleGrid } from "@/components/title-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildGenreBoard, filterByGenre, loadCatalogPool, loadExtraPool, searchCatalog } from "@/lib/catalog";
import { genreLook } from "@/lib/genre-color";
import { rankTitles } from "@/lib/recommend";
import { hiddenSet, useVault } from "@/lib/store";
import type { AppView, CatalogTitle, MediaFilter, SortMode, Tier, WatchStatus } from "@/lib/types";
import { cn, matchesFilter } from "@/lib/utils";

const PAGE = 50;

export function AetherApp() {
  const hydrate = useVault((s) => s.hydrate);
  const applyStatus = useVault((s) => s.applyStatus);
  const items = useVault((s) => s.items);
  const taste = useVault((s) => s.taste);
  const hidden = useVault((s) => s.hidden);

  const [view, setView] = useState<AppView>("foryou");
  const [pool, setPool] = useState<CatalogTitle[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [quiz, setQuiz] = useState(false);
  const [open, setOpen] = useState<CatalogTitle | null>(null);
  const [rateDirect, setRateDirect] = useState<CatalogTitle | null>(null);
  const [media, setMedia] = useState<MediaFilter>("all");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CatalogTitle[] | null>(null);
  const [genre, setGenre] = useState<string | null>(null);
  const [sort, setSort] = useState<SortMode>("match");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [listStatus, setListStatus] = useState<WatchStatus>("watched");
  const [extraRound, setExtraRound] = useState(1);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    let cancelled = false;
    void loadCatalogPool()
      .then((list) => {
        if (!cancelled) setPool(list);
      })
      .catch(() => {
        if (!cancelled) toast.error("Catalog is taking a moment. Retry shortly.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults(null);
      return;
    }
    const handle = setTimeout(() => {
      void searchCatalog(q)
        .then(setResults)
        .catch(() => setResults([]));
    }, 280);
    return () => clearTimeout(handle);
  }, [query]);

  const blocked = useMemo(() => hiddenSet({ items, hidden }), [items, hidden]);
  const ranked = useMemo(() => rankTitles(pool, taste, blocked), [pool, taste, blocked]);

  const forYou = useMemo(() => {
    const list = ranked.filter((t) => matchesFilter(t, "all"));
    return list.slice(0, page * PAGE);
  }, [ranked, page]);

  const genres = useMemo(() => buildGenreBoard(), []);

  const browseList = useMemo(() => {
    let list = results ?? (genre ? filterByGenre(pool, genre, media) : []);
    if (!results) list = list.filter((t) => matchesFilter(t, media));
    else list = list.filter((t) => matchesFilter(t, media));
    if (sort === "az") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "year") list = [...list].sort((a, b) => Number(b.year ?? 0) - Number(a.year ?? 0));
    if (sort === "score") list = [...list].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    return list.slice(0, page * PAGE);
  }, [results, genre, pool, media, sort, page]);

  const listItems = useMemo(
    () =>
      Object.values(items)
        .filter((item) => item.status === listStatus)
        .sort((a, b) => b.updatedAt - a.updatedAt),
    [items, listStatus],
  );

  const save = (title: CatalogTitle, status: WatchStatus, rating: Tier | null, partial: boolean) => {
    applyStatus(title, status, rating, partial);
    setOpen(null);
    setRateDirect(null);
    if (status === "watched") toast.success(`Saved ${title.title}`);
  };

  const loadMoreForYou = () => {
    if (forYou.length >= ranked.length) {
      void loadExtraPool(extraRound).then((more) => {
        setPool((prev) => {
          const seen = new Set(prev.map((t) => t.id));
          return [...prev, ...more.filter((t) => !seen.has(t.id))];
        });
        setExtraRound((n) => n + 1);
      });
    }
    setPage((n) => n + 1);
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-3 pb-24 pt-3 sm:px-4 sm:pb-10">
      <header className="liquid-glass sticky top-3 z-30 flex flex-col gap-2 rounded-2xl px-2 py-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQuiz(true)}
            aria-label="Taste round"
            className="grid size-11 place-items-center rounded-xl liquid-title"
          >
            <Sparkle className="size-5 text-accent" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-xs tracking-wide text-muted uppercase">Aether</p>
            <h1 className="truncate text-sm font-medium">Dark glass watchlist</h1>
          </div>
        </div>
        <nav className="flex rounded-full bg-background/50 p-1">
          {(
            [
              ["foryou", "For You"],
              ["browse", "Browse"],
              ["list", "List"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setView(id);
                setPage(1);
                setGenre(null);
              }}
              className={cn(
                "h-10 flex-1 rounded-full text-xs font-medium transition-colors duration-200",
                view === id ? "liquid-title text-foreground" : "text-muted",
              )}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mt-5 flex-1">
        {view === "foryou" ? (
          <section className="stagger-in flex flex-col gap-4">
            <div>
              <p className="text-sm text-muted">
                {taste.quizDone
                  ? `Tuned from ${taste.answers} answers. It sharpens as you rate.`
                  : "Tap the mark in the corner for 20 titles — then this grid gets personal."}
              </p>
            </div>
            <TitleGrid
              titles={forYou}
              loading={loading}
              canMore={!loading && forYou.length > 0 && (forYou.length >= page * PAGE || extraRound < 4)}
              onMore={loadMoreForYou}
              onOpen={setOpen}
              onWatched={setRateDirect}
            />
          </section>
        ) : null}

        {view === "browse" ? (
          <section className="stagger-in flex flex-col gap-4">
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
                <Input
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search titles"
                  className="liquid-title rounded-full border-0 pl-9 ring-0"
                />
              </div>
              <button
                type="button"
                aria-label="Filters"
                onClick={() => setFiltersOpen((v) => !v)}
                className="grid size-11 place-items-center rounded-full liquid-title"
              >
                <Filter className="size-4" />
              </button>
            </div>

            {filtersOpen ? (
              <div className="liquid-glass flex flex-wrap gap-2 rounded-2xl p-3">
                {(["match", "score", "year", "az"] as SortMode[]).map((mode) => (
                  <Button
                    key={mode}
                    size="sm"
                    variant={sort === mode ? "default" : "glass"}
                    onClick={() => setSort(mode)}
                    className="rounded-full capitalize"
                  >
                    {mode === "az" ? "A–Z" : mode}
                  </Button>
                ))}
              </div>
            ) : null}

            <div className="flex rounded-full bg-background/40 p-1">
              {(["all", "movie", "series"] as MediaFilter[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setMedia(id);
                    setPage(1);
                  }}
                  className={cn(
                    "h-9 flex-1 rounded-full text-xs font-medium capitalize transition-colors duration-200",
                    media === id ? "liquid-title" : "text-muted",
                  )}
                >
                  {id}
                </button>
              ))}
            </div>

            {query.trim().length >= 2 || genre ? (
              <>
                {genre && query.trim().length < 2 ? (
                  <button
                    type="button"
                    onClick={() => setGenre(null)}
                    className="self-start text-xs text-muted"
                  >
                    ← Genres
                  </button>
                ) : null}
                <TitleGrid
                  titles={browseList}
                  loading={loading}
                  canMore={browseList.length >= page * PAGE}
                  onMore={() => setPage((n) => n + 1)}
                  onOpen={setOpen}
                  onWatched={setRateDirect}
                />
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {genres.map((tile, index) => {
                  const look = genreLook(tile.genre, index, genres.length);
                  return (
                    <button
                      key={tile.genre}
                      type="button"
                      onClick={() => {
                        setGenre(tile.genre);
                        setPage(1);
                      }}
                      className="glass-card genre-glass flex min-h-28 items-end p-4 text-left transition-transform duration-200 active:scale-[0.96] sm:min-h-32"
                      style={
                        {
                          "--genre": look.color,
                          "--genre-tint": look.tint,
                        } as CSSProperties
                      }
                    >
                      <span className="text-lg font-semibold leading-snug tracking-tight">{tile.genre}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        ) : null}

        {view === "list" ? (
          <section className="stagger-in flex flex-col gap-4">
            <div className="flex rounded-full bg-background/40 p-1">
              {(
                [
                  ["watched", "Watched"],
                  ["watching", "Watching"],
                  ["plan", "Plan"],
                  ["passed", "Skip"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setListStatus(id)}
                  className={cn(
                    "h-9 flex-1 rounded-full text-xs font-medium transition-colors duration-200",
                    listStatus === id ? "liquid-title" : "text-muted",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <TitleGrid
              titles={listItems}
              onOpen={setOpen}
              onWatched={setRateDirect}
            />
          </section>
        ) : null}
      </main>

      {open ? (
        <ExpandCard
          title={open}
          onClose={() => setOpen(null)}
          onSave={(status, rating, partial) => save(open, status, rating, partial)}
        />
      ) : null}

      {rateDirect ? (
        <ExpandCard
          title={rateDirect}
          intent="watched"
          onClose={() => setRateDirect(null)}
          onSave={(status, rating, partial) => save(rateDirect, status, rating, partial)}
        />
      ) : null}

      {quiz ? (
        <TasteRound
          pool={ranked.length ? ranked : pool}
          hidden={blocked}
          onClose={() => setQuiz(false)}
          onAnswer={(title, status, rating, partial) => applyStatus(title, status, rating, partial)}
        />
      ) : null}
    </div>
  );
}
