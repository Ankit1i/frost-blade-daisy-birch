import { ChevronDown } from "lucide-react";
import type { CatalogTitle } from "@/lib/types";
import { TitleCard } from "@/components/title-card";
import { Skeleton } from "@/components/ui/skeleton";

interface TitleGridProps {
  titles: CatalogTitle[];
  loading?: boolean;
  canMore?: boolean;
  onMore?: () => void;
  onOpen: (title: CatalogTitle) => void;
  onWatched: (title: CatalogTitle) => void;
}

export function TitleGrid({ titles, loading, canMore, onMore, onOpen, onWatched }: TitleGridProps) {
  if (loading && titles.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-2/3 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!titles.length) {
    return <p className="py-16 text-center text-sm text-muted">Nothing in this shelf yet.</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {titles.map((title) => (
          <TitleCard key={title.id} title={title} onOpen={onOpen} onWatched={onWatched} />
        ))}
      </div>
      {canMore ? (
        <button
          type="button"
          onClick={onMore}
          aria-label="Load more titles"
          className="mx-auto grid size-12 place-items-center rounded-full liquid-glass text-foreground transition-transform duration-150 active:scale-[0.96]"
        >
          <ChevronDown className="size-5" />
        </button>
      ) : null}
    </div>
  );
}
