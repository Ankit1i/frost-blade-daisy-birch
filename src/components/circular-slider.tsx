import { useRef, type PointerEvent } from "react";
import type { WatchStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STOPS: { id: WatchStatus; label: string; angle: number }[] = [
  { id: "watched", label: "Watched", angle: -90 },
  { id: "plan", label: "Plan", angle: 0 },
  { id: "watching", label: "Watching", angle: 90 },
  { id: "passed", label: "Pass", angle: 180 },
];

function nearest(angle: number): WatchStatus {
  let best = STOPS[0];
  let bestDelta = 999;
  for (const stop of STOPS) {
    let delta = Math.abs(angle - stop.angle);
    if (delta > 180) delta = 360 - delta;
    if (delta < bestDelta) {
      bestDelta = delta;
      best = stop;
    }
  }
  return best.id;
}

interface CircularSliderProps {
  value: WatchStatus;
  onChange: (status: WatchStatus) => void;
}

export function CircularSlider({ value, onChange }: CircularSliderProps) {
  const ref = useRef<HTMLDivElement>(null);

  const apply = (event: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    onChange(nearest((Math.atan2(y, x) * 180) / Math.PI));
  };

  const knob = STOPS.find((s) => s.id === value) ?? STOPS[0];
  const rad = (knob.angle * Math.PI) / 180;
  const kx = Math.cos(rad) * 42;
  const ky = Math.sin(rad) * 42;

  return (
    <div className="grid grid-cols-3 grid-rows-3 items-center justify-items-center gap-1">
      <span />
      <StopButton active={value === "watched"} onClick={() => onChange("watched")}>
        Watched
      </StopButton>
      <span />
      <StopButton active={value === "passed"} onClick={() => onChange("passed")}>
        Pass
      </StopButton>
      <div
        ref={ref}
        role="slider"
        tabIndex={0}
        aria-valuetext={knob.label}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          apply(event);
        }}
        onPointerMove={(event) => {
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
          apply(event);
        }}
        className="relative size-28 touch-none rounded-full liquid-glass"
      >
        <div className="pointer-events-none absolute inset-3 rounded-full bg-background/70" />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 size-5 rounded-full bg-primary shadow-[var(--shadow-glow)] ring-2 ring-foreground/40"
          style={{ transform: `translate(calc(-50% + ${kx}px), calc(-50% + ${ky}px))` }}
        />
      </div>
      <StopButton active={value === "plan"} onClick={() => onChange("plan")}>
        Plan
      </StopButton>
      <span />
      <StopButton active={value === "watching"} onClick={() => onChange("watching")}>
        Watching
      </StopButton>
      <span />
    </div>
  );
}

function StopButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-10 min-w-20 rounded-full px-3 text-xs font-medium transition-colors duration-150",
        active ? "liquid-title text-foreground" : "text-muted",
      )}
    >
      {children}
    </button>
  );
}
