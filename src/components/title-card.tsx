import { Check } from "lucide-react";
import type { CatalogTitle } from "@/lib/types";
import { cn, kindLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TitleCardProps {
  title: CatalogTitle;
  onOpen: (title: CatalogTitle) => void;
  onWatched: (title: CatalogTitle) => void;
}

export function TitleCard({ title, onOpen, onWatched }: TitleCardProps) {
  return (
    <article className="flex flex-col gap-3">
      <button
        type="button"
        data-open-title
        onClick={() => onOpen(title)}
        className="poster-shell aspect-2/3 w-full text-left transition-transform duration-200 ease-out active:scale-[0.96]"
      >
        {title.poster ? (
          <img src={title.poster} alt="" className="poster-art aspect-2/3" />
        ) : (
          <div className="poster-art aspect-2/3 bg-card" />
        )}
        <span className="poster-glass" aria-hidden="true" />
        <span className="poster-title">
          <span className="block text-lg font-semibold leading-snug tracking-tight text-foreground line-clamp-2">
            {title.title}
          </span>
        </span>
      </button>
      <div className="flex items-center justify-between gap-2 px-0.5">
        <p className="truncate text-sm text-muted">{kindLabel(title.kind)}</p>
        <Button size="sm" variant="glass" className={cn("h-10 rounded-full px-3")} onClick={() => onWatched(title)}>
          <Check className="size-3.5" />
          Watched
        </Button>
      </div>
    </article>
  );
}
