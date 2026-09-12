import { useState } from "react";
import { X } from "lucide-react";
import { CircularSlider } from "@/components/circular-slider";
import { TierSlider } from "@/components/tier-slider";
import { Button } from "@/components/ui/button";
import type { CatalogTitle, Tier, WatchStatus } from "@/lib/types";
import { canPartialRate, kindLabel } from "@/lib/utils";

interface ExpandCardProps {
  title: CatalogTitle;
  intent?: "open" | "watched";
  onClose: () => void;
  onSave: (status: WatchStatus, rating: Tier | null, partial: boolean) => void;
}

export function ExpandCard({ title, intent = "open", onClose, onSave }: ExpandCardProps) {
  const [status, setStatus] = useState<WatchStatus>(intent === "watched" ? "watched" : "plan");
  const [tier, setTier] = useState<Tier>("B");
  const [ratingOpen, setRatingOpen] = useState(intent === "watched");
  const needsFull = status === "watched";
  const needsPartial = status === "watching" && canPartialRate(title);

  const commit = (withRating: boolean) => {
    if (status === "watched") {
      onSave("watched", withRating ? tier : null, false);
      return;
    }
    if (status === "watching" && needsPartial && withRating) {
      onSave("watching", tier, true);
      return;
    }
    onSave(status, null, false);
  };

  const onPick = (next: WatchStatus) => {
    setStatus(next);
    if (next === "watched") setRatingOpen(true);
    else if (next === "watching" && canPartialRate(title)) setRatingOpen(true);
    else setRatingOpen(false);
  };

  return (
    <div
      className="overlay-in fixed inset-0 z-50 grid place-items-end bg-background/70 p-3 sm:place-items-center"
      onClick={onClose}
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      <div
        className="modal-in liquid-glass relative w-full max-w-lg overflow-hidden rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 grid size-11 place-items-center rounded-full liquid-title"
        >
          <X className="size-4" />
        </button>
        <div className="grid gap-4 sm:grid-cols-2">
          {title.poster ? (
            <img src={title.poster} alt="" className="aspect-2/3 w-full object-cover sm:rounded-none" />
          ) : (
            <div className="aspect-2/3 bg-card" />
          )}
          <div className="flex flex-col gap-3 px-4 pb-5 pt-12 sm:pt-5">
            <p className="liquid-title w-fit rounded-full px-3 py-1 text-xs text-muted">
              {kindLabel(title.kind)} {title.year ? `· ${title.year}` : ""}
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">{title.title}</h2>
            <p className="line-clamp-4 text-sm text-muted">{title.summary || "No synopsis."}</p>
            {ratingOpen && (needsFull || needsPartial) ? (
              <TierSlider
                value={tier}
                onChange={setTier}
                onConfirm={() => commit(true)}
                onCancel={() => {
                  setRatingOpen(false);
                  if (needsFull) setStatus("plan");
                }}
              />
            ) : (
              <>
                <CircularSlider value={status} onChange={onPick} />
                {status === "watching" && !canPartialRate(title) ? (
                  <p className="text-center text-xs text-muted">
                    Still airing — no partial rating until a season is finished.
                  </p>
                ) : null}
                <Button onClick={() => commit(false)}>Save</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
