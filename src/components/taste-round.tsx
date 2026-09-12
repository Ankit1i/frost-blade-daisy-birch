import { useMemo, useState } from "react";
import { SkipForward, X } from "lucide-react";
import { CircularSlider } from "@/components/circular-slider";
import { TierSlider } from "@/components/tier-slider";
import { Button } from "@/components/ui/button";
import type { CatalogTitle, Tier, WatchStatus } from "@/lib/types";
import { canPartialRate } from "@/lib/utils";

interface TasteRoundProps {
  pool: CatalogTitle[];
  hidden: Set<string>;
  onClose: () => void;
  onAnswer: (title: CatalogTitle, status: WatchStatus, rating: Tier | null, partial: boolean) => void;
}

export function TasteRound({ pool, hidden, onClose, onAnswer }: TasteRoundProps) {
  const [cursor, setCursor] = useState(0);
  const [skipped, setSkipped] = useState<Set<string>>(new Set());
  const [answered, setAnswered] = useState(0);
  const [status, setStatus] = useState<WatchStatus>("plan");
  const [tier, setTier] = useState<Tier>("B");
  const [ratingOpen, setRatingOpen] = useState(false);

  const queue = useMemo(
    () => pool.filter((title) => title.poster && !hidden.has(title.id) && !skipped.has(title.id)),
    [pool, hidden, skipped],
  );
  const current = queue[cursor] ?? queue[0];
  const remaining = Math.max(0, 20 - answered);

  const advance = () => {
    setRatingOpen(false);
    setStatus("watched");
    setCursor((c) => c + 1);
  };

  const finishIfDone = (count: number) => {
    if (count >= 20) onClose();
  };

  const save = (title: CatalogTitle, next: WatchStatus, rating: Tier | null, partial: boolean) => {
    onAnswer(title, next, rating, partial);
    const count = answered + 1;
    setAnswered(count);
    advance();
    finishIfDone(count);
  };

  const onPick = (next: WatchStatus) => {
    setStatus(next);
    if (!current) return;
    if (next === "watched") setRatingOpen(true);
    else if (next === "watching" && canPartialRate(current)) setRatingOpen(true);
    else setRatingOpen(false);
  };

  const skip = () => {
    if (!current) return;
    setSkipped((prev) => new Set(prev).add(current.id));
    setRatingOpen(false);
  };

  if (!current) {
    return (
      <div className="overlay-in fixed inset-0 z-50 grid place-items-center bg-background/80 p-4">
        <div className="liquid-glass w-full max-w-md rounded-2xl p-6 text-center">
          <p className="text-lg font-semibold">Need more titles</p>
          <p className="mt-2 text-sm text-muted">Come back in a moment — the shelf is still filling.</p>
          <Button className="mt-5" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="overlay-in fixed inset-0 z-50 overflow-y-auto bg-background/80 p-3 sm:p-6">
      <div className="modal-in mx-auto grid min-h-full max-w-lg place-items-center">
        <div className="liquid-glass relative w-full overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="liquid-title rounded-full px-3 py-1 text-xs">{answered} / 20</p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid size-11 place-items-center rounded-full liquid-title"
            >
              <X className="size-4" />
            </button>
          </div>
          {current.poster ? (
            <img src={current.poster} alt="" className="aspect-2/3 max-h-80 w-full object-cover" />
          ) : null}
          <div className="flex flex-col gap-4 p-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">{current.title}</h2>
              <p className="mt-1 line-clamp-3 text-sm text-muted">{current.summary}</p>
            </div>
            {ratingOpen ? (
              <TierSlider
                value={tier}
                onChange={setTier}
                onConfirm={() =>
                  save(current, status, tier, status === "watching")
                }
                onCancel={() => setRatingOpen(false)}
              />
            ) : (
              <>
                <CircularSlider value={status} onChange={onPick} />
                {status === "watching" && !canPartialRate(current) ? (
                  <p className="text-center text-xs text-muted">
                    Still airing — watching is saved without a partial rating.
                  </p>
                ) : null}
                <div className="flex gap-2">
                  <Button variant="glass" className="flex-1" onClick={skip}>
                    <SkipForward className="size-4" />
                    Skip
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      if (status === "watched" || (status === "watching" && canPartialRate(current))) {
                        setRatingOpen(true);
                        return;
                      }
                      save(current, status, null, false);
                    }}
                  >
                    Next · {remaining} left
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
