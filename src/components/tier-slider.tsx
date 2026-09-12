import { useCallback, useId, useRef, type KeyboardEvent, type PointerEvent } from "react";
import { TIERS, type Tier } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const TIER_COLOR: Record<Tier, string> = {
  S: "text-tier-s",
  A: "text-tier-a",
  B: "text-tier-b",
  C: "text-tier-c",
  D: "text-tier-d",
  F: "text-tier-f",
};

interface TierSliderProps {
  value: Tier;
  onChange: (tier: Tier) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

function yToIndex(clientY: number, rect: DOMRect): number {
  const t = (clientY - rect.top) / rect.height;
  const i = Math.round(Math.min(1, Math.max(0, t)) * (TIERS.length - 1));
  return i;
}

export function TierSlider({ value, onChange, onConfirm, onCancel }: TierSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const index = TIERS.indexOf(value);

  const applyFromEvent = useCallback(
    (clientY: number) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) return;
      onChange(TIERS[yToIndex(clientY, rect)]);
    },
    [onChange],
  );

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    applyFromEvent(event.clientY);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    applyFromEvent(event.clientY);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      onChange(TIERS[Math.max(0, index - 1)]);
    }
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      onChange(TIERS[Math.min(TIERS.length - 1, index + 1)]);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs tracking-wide text-muted uppercase">Rate this title</p>
          <p id={labelId} className="text-sm text-subtle">
            Drag the handle. S at the top, F at the bottom.
          </p>
        </div>
        <div
          className={cn("tier-letter text-6xl font-semibold leading-none", TIER_COLOR[value])}
          aria-hidden="true"
        >
          {value}
        </div>
      </div>

      <div className="flex items-stretch gap-5">
        <div className="flex flex-col justify-between py-1 text-xs font-medium text-muted">
          {TIERS.map((tier) => (
            <span key={tier} className={cn(tier === value && TIER_COLOR[tier])}>
              {tier}
            </span>
          ))}
        </div>
        <div
          ref={trackRef}
          role="slider"
          tabIndex={0}
          aria-labelledby={labelId}
          aria-valuemin={0}
          aria-valuemax={TIERS.length - 1}
          aria-valuenow={index}
          aria-valuetext={`${value}-Tier`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onKeyDown={onKeyDown}
          className="relative h-64 w-10 cursor-ns-resize touch-none rounded-full bg-foreground/8 ring-1 ring-foreground/12"
        >
          <div
            className="absolute inset-x-1 rounded-full bg-accent/30"
            style={{ top: 4, bottom: `calc(${100 - (index / (TIERS.length - 1)) * 100}% )` }}
          />
          <div
            className="absolute left-1/2 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[var(--shadow-glow)] ring-2 ring-foreground/40"
            style={{ top: `${(index / (TIERS.length - 1)) * 100}%` }}
          />
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <p className={cn("tier-letter text-5xl font-semibold", TIER_COLOR[value])}>{value}-Tier</p>
          <p className="mt-2 text-sm text-muted">
            {value === "S" && "Masterpiece. Permanent rotation."}
            {value === "A" && "Excellent. Easy to recommend."}
            {value === "B" && "Solid. Worth the time."}
            {value === "C" && "Fine. Not a rewatch."}
            {value === "D" && "A slog. Barely finished."}
            {value === "F" && "Dropped in spirit, even if you finished."}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>
          Skip
        </Button>
        <Button onClick={onConfirm}>Save rating</Button>
      </div>
    </div>
  );
}

export { TIER_COLOR };
