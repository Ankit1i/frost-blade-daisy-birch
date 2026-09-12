import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Search, c as Check, i as SkipForward, o as Funnel, r as Sparkle, s as ChevronDown, t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BH02xAtv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function stripHtml(html) {
	if (!html) return "";
	return html.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&/g, "&").replace(/"/g, "\"").replace(/&#39;/g, "'").replace(/</g, "<").replace(/>/g, ">").replace(/\s+/g, " ").trim();
}
function mediaKey(source, externalId) {
	return `${source}:${externalId}`;
}
function matchesFilter(title, filter) {
	if (filter === "all") return true;
	if (filter === "movie") return title.kind === "movie";
	return title.kind === "series" || title.kind === "anime";
}
function kindLabel(kind) {
	if (kind === "movie") return "Movie";
	if (kind === "anime") return "Series";
	return "Series";
}
function canPartialRate(title) {
	return !title.ongoing;
}
var STOPS = [
	{
		id: "watched",
		label: "Watched",
		angle: -90
	},
	{
		id: "plan",
		label: "Plan",
		angle: 0
	},
	{
		id: "watching",
		label: "Watching",
		angle: 90
	},
	{
		id: "passed",
		label: "Pass",
		angle: 180
	}
];
function nearest(angle) {
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
function CircularSlider({ value, onChange }) {
	const ref = (0, import_react.useRef)(null);
	const apply = (event) => {
		const el = ref.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const x = event.clientX - (rect.left + rect.width / 2);
		const y = event.clientY - (rect.top + rect.height / 2);
		onChange(nearest(Math.atan2(y, x) * 180 / Math.PI));
	};
	const knob = STOPS.find((s) => s.id === value) ?? STOPS[0];
	const rad = knob.angle * Math.PI / 180;
	const kx = Math.cos(rad) * 42;
	const ky = Math.sin(rad) * 42;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-3 grid-rows-3 items-center justify-items-center gap-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StopButton, {
				active: value === "watched",
				onClick: () => onChange("watched"),
				children: "Watched"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StopButton, {
				active: value === "passed",
				onClick: () => onChange("passed"),
				children: "Pass"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref,
				role: "slider",
				tabIndex: 0,
				"aria-valuetext": knob.label,
				onPointerDown: (event) => {
					event.currentTarget.setPointerCapture(event.pointerId);
					apply(event);
				},
				onPointerMove: (event) => {
					if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
					apply(event);
				},
				className: "relative size-28 touch-none rounded-full liquid-glass",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-3 rounded-full bg-background/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute left-1/2 top-1/2 size-5 rounded-full bg-primary shadow-[var(--shadow-glow)] ring-2 ring-foreground/40",
					style: { transform: `translate(calc(-50% + ${kx}px), calc(-50% + ${ky}px))` }
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StopButton, {
				active: value === "plan",
				onClick: () => onChange("plan"),
				children: "Plan"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StopButton, {
				active: value === "watching",
				onClick: () => onChange("watching"),
				children: "Watching"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
		]
	});
}
function StopButton({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("h-10 min-w-20 rounded-full px-3 text-xs font-medium transition-colors duration-150", active ? "liquid-title text-foreground" : "text-muted"),
		children
	});
}
var TIERS = [
	"S",
	"A",
	"B",
	"C",
	"D",
	"F"
];
var TIER_WEIGHT = {
	S: 6,
	A: 4,
	B: 2,
	C: .4,
	D: -2,
	F: -4.5
};
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium outline-none transition-[color,background-color,box-shadow,transform,opacity] duration-150 ease-out disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.96] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow-[var(--shadow-glow)] hover:bg-primary/90",
			glass: "glass text-foreground hover:bg-foreground/10",
			ghost: "text-foreground hover:bg-foreground/8",
			danger: "bg-danger/20 text-danger hover:bg-danger/30"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var TIER_COLOR = {
	S: "text-tier-s",
	A: "text-tier-a",
	B: "text-tier-b",
	C: "text-tier-c",
	D: "text-tier-d",
	F: "text-tier-f"
};
function yToIndex(clientY, rect) {
	const t = (clientY - rect.top) / rect.height;
	return Math.round(Math.min(1, Math.max(0, t)) * (TIERS.length - 1));
}
function TierSlider({ value, onChange, onConfirm, onCancel }) {
	const trackRef = (0, import_react.useRef)(null);
	const labelId = (0, import_react.useId)();
	const index = TIERS.indexOf(value);
	const applyFromEvent = (0, import_react.useCallback)((clientY) => {
		const rect = trackRef.current?.getBoundingClientRect();
		if (!rect) return;
		onChange(TIERS[yToIndex(clientY, rect)]);
	}, [onChange]);
	const onPointerDown = (event) => {
		event.currentTarget.setPointerCapture(event.pointerId);
		applyFromEvent(event.clientY);
	};
	const onPointerMove = (event) => {
		if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
		applyFromEvent(event.clientY);
	};
	const onKeyDown = (event) => {
		if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
			event.preventDefault();
			onChange(TIERS[Math.max(0, index - 1)]);
		}
		if (event.key === "ArrowDown" || event.key === "ArrowRight") {
			event.preventDefault();
			onChange(TIERS[Math.min(TIERS.length - 1, index + 1)]);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-wide text-muted uppercase",
					children: "Rate this title"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					id: labelId,
					className: "text-sm text-subtle",
					children: "Drag the handle. S at the top, F at the bottom."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("tier-letter text-6xl font-semibold leading-none", TIER_COLOR[value]),
					"aria-hidden": "true",
					children: value
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-stretch gap-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col justify-between py-1 text-xs font-medium text-muted",
						children: TIERS.map((tier) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn(tier === value && TIER_COLOR[tier]),
							children: tier
						}, tier))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						ref: trackRef,
						role: "slider",
						tabIndex: 0,
						"aria-labelledby": labelId,
						"aria-valuemin": 0,
						"aria-valuemax": TIERS.length - 1,
						"aria-valuenow": index,
						"aria-valuetext": `${value}-Tier`,
						onPointerDown,
						onPointerMove,
						onKeyDown,
						className: "relative h-64 w-10 cursor-ns-resize touch-none rounded-full bg-foreground/8 ring-1 ring-foreground/12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-x-1 rounded-full bg-accent/30",
							style: {
								top: 4,
								bottom: `calc(${100 - index / (TIERS.length - 1) * 100}% )`
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute left-1/2 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[var(--shadow-glow)] ring-2 ring-foreground/40",
							style: { top: `${index / (TIERS.length - 1) * 100}%` }
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-1 flex-col justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: cn("tier-letter text-5xl font-semibold", TIER_COLOR[value]),
							children: [value, "-Tier"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-muted",
							children: [
								value === "S" && "Masterpiece. Permanent rotation.",
								value === "A" && "Excellent. Easy to recommend.",
								value === "B" && "Solid. Worth the time.",
								value === "C" && "Fine. Not a rewatch.",
								value === "D" && "A slog. Barely finished.",
								value === "F" && "Dropped in spirit, even if you finished."
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: onCancel,
					children: "Skip"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: onConfirm,
					children: "Save rating"
				})]
			})
		]
	});
}
function ExpandCard({ title, intent = "open", onClose, onSave }) {
	const [status, setStatus] = (0, import_react.useState)(intent === "watched" ? "watched" : "plan");
	const [tier, setTier] = (0, import_react.useState)("B");
	const [ratingOpen, setRatingOpen] = (0, import_react.useState)(intent === "watched");
	const needsFull = status === "watched";
	const needsPartial = status === "watching" && canPartialRate(title);
	const commit = (withRating) => {
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
	const onPick = (next) => {
		setStatus(next);
		if (next === "watched") setRatingOpen(true);
		else if (next === "watching" && canPartialRate(title)) setRatingOpen(true);
		else setRatingOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overlay-in fixed inset-0 z-50 grid place-items-end bg-background/70 p-3 sm:place-items-center",
		onClick: onClose,
		onKeyDown: (event) => {
			if (event.key === "Escape") onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "modal-in liquid-glass relative w-full max-w-lg overflow-hidden rounded-2xl",
			onClick: (event) => event.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onClose,
				"aria-label": "Close",
				className: "absolute top-3 right-3 z-10 grid size-11 place-items-center rounded-full liquid-title",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [title.poster ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: title.poster,
					alt: "",
					className: "aspect-2/3 w-full object-cover sm:rounded-none"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-2/3 bg-card" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 px-4 pb-5 pt-12 sm:pt-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "liquid-title w-fit rounded-full px-3 py-1 text-xs text-muted",
							children: [
								kindLabel(title.kind),
								" ",
								title.year ? `· ${title.year}` : ""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-semibold tracking-tight",
							children: title.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "line-clamp-4 text-sm text-muted",
							children: title.summary || "No synopsis."
						}),
						ratingOpen && (needsFull || needsPartial) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TierSlider, {
							value: tier,
							onChange: setTier,
							onConfirm: () => commit(true),
							onCancel: () => {
								setRatingOpen(false);
								if (needsFull) setStatus("plan");
							}
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircularSlider, {
								value: status,
								onChange: onPick
							}),
							status === "watching" && !canPartialRate(title) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-center text-xs text-muted",
								children: "Still airing — no partial rating until a season is finished."
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => commit(false),
								children: "Save"
							})
						] })
					]
				})]
			})]
		})
	});
}
function TasteRound({ pool, hidden, onClose, onAnswer }) {
	const [cursor, setCursor] = (0, import_react.useState)(0);
	const [skipped, setSkipped] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [answered, setAnswered] = (0, import_react.useState)(0);
	const [status, setStatus] = (0, import_react.useState)("plan");
	const [tier, setTier] = (0, import_react.useState)("B");
	const [ratingOpen, setRatingOpen] = (0, import_react.useState)(false);
	const queue = (0, import_react.useMemo)(() => pool.filter((title) => title.poster && !hidden.has(title.id) && !skipped.has(title.id)), [
		pool,
		hidden,
		skipped
	]);
	const current = queue[cursor] ?? queue[0];
	const remaining = Math.max(0, 20 - answered);
	const advance = () => {
		setRatingOpen(false);
		setStatus("watched");
		setCursor((c) => c + 1);
	};
	const finishIfDone = (count) => {
		if (count >= 20) onClose();
	};
	const save = (title, next, rating, partial) => {
		onAnswer(title, next, rating, partial);
		const count = answered + 1;
		setAnswered(count);
		advance();
		finishIfDone(count);
	};
	const onPick = (next) => {
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
	if (!current) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overlay-in fixed inset-0 z-50 grid place-items-center bg-background/80 p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "liquid-glass w-full max-w-md rounded-2xl p-6 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-lg font-semibold",
					children: "Need more titles"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Come back in a moment — the shelf is still filling."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-5",
					onClick: onClose,
					children: "Close"
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overlay-in fixed inset-0 z-50 overflow-y-auto bg-background/80 p-3 sm:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "modal-in mx-auto grid min-h-full max-w-lg place-items-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "liquid-glass relative w-full overflow-hidden rounded-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "liquid-title rounded-full px-3 py-1 text-xs",
							children: [answered, " / 20"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							"aria-label": "Close",
							className: "grid size-11 place-items-center rounded-full liquid-title",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})]
					}),
					current.poster ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: current.poster,
						alt: "",
						className: "aspect-2/3 max-h-80 w-full object-cover"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-semibold tracking-tight",
							children: current.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 line-clamp-3 text-sm text-muted",
							children: current.summary
						})] }), ratingOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TierSlider, {
							value: tier,
							onChange: setTier,
							onConfirm: () => save(current, status, tier, status === "watching"),
							onCancel: () => setRatingOpen(false)
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircularSlider, {
								value: status,
								onChange: onPick
							}),
							status === "watching" && !canPartialRate(current) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-center text-xs text-muted",
								children: "Still airing — watching is saved without a partial rating."
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "glass",
									className: "flex-1",
									onClick: skip,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "size-4" }), "Skip"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "flex-1",
									onClick: () => {
										if (status === "watched" || status === "watching" && canPartialRate(current)) {
											setRatingOpen(true);
											return;
										}
										save(current, status, null, false);
									},
									children: [
										"Next · ",
										remaining,
										" left"
									]
								})]
							})
						] })]
					})
				]
			})
		})
	});
}
function TitleCard({ title, onOpen, onWatched }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "flex flex-col gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			"data-open-title": true,
			onClick: () => onOpen(title),
			className: "poster-shell aspect-2/3 w-full text-left transition-transform duration-200 ease-out active:scale-[0.96]",
			children: [
				title.poster ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: title.poster,
					alt: "",
					className: "poster-art aspect-2/3"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "poster-art aspect-2/3 bg-card" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "poster-glass",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "poster-title",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-lg font-semibold leading-snug tracking-tight text-foreground line-clamp-2",
						children: title.title
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-2 px-0.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-sm text-muted",
				children: kindLabel(title.kind)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "glass",
				className: cn("h-10 rounded-full px-3"),
				onClick: () => onWatched(title),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }), "Watched"]
			})]
		})]
	});
}
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-xl bg-foreground/8", className),
		...props
	});
}
function TitleGrid({ titles, loading, canMore, onMore, onOpen, onWatched }) {
	if (loading && titles.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-3",
		children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "aspect-2/3 rounded-xl" }, i))
	});
	if (!titles.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-16 text-center text-sm text-muted",
		children: "Nothing in this shelf yet."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 sm:gap-4",
			children: titles.map((title) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleCard, {
				title,
				onOpen,
				onWatched
			}, title.id))
		}), canMore ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onMore,
			"aria-label": "Load more titles",
			className: "mx-auto grid size-12 place-items-center rounded-full liquid-glass text-foreground transition-transform duration-150 active:scale-[0.96]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-5" })
		}) : null]
	});
}
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-lg bg-foreground/6 px-3 text-sm text-foreground outline-none ring-1 ring-foreground/12 transition-[box-shadow,background-color] placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-ring", className),
		ref,
		suppressHydrationWarning: true,
		...props
	});
});
Input.displayName = "Input";
function wait(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
async function fetchJson(url, retries = 1) {
	let lastError = null;
	for (let attempt = 0; attempt <= retries; attempt += 1) try {
		const res = await fetch(url, {
			headers: { Accept: "application/json" },
			signal: AbortSignal.timeout(8e3)
		});
		if (res.status === 429 && attempt < retries) {
			await wait(1e3 * (attempt + 1));
			continue;
		}
		if (!res.ok) throw new Error(`Catalog request failed (${res.status})`);
		return await res.json();
	} catch (err) {
		lastError = err instanceof Error ? err : /* @__PURE__ */ new Error("Catalog request failed");
		if (attempt < retries) {
			await wait(400 * (attempt + 1));
			continue;
		}
	}
	throw lastError ?? /* @__PURE__ */ new Error("Catalog request failed");
}
function yearFrom(value) {
	if (value == null) return null;
	const text = String(value).slice(0, 4);
	return /^\d{4}$/.test(text) ? text : null;
}
function uniqueTitles(list) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const item of list) {
		if (!item.title || !item.poster || seen.has(item.id)) continue;
		seen.add(item.id);
		out.push(item);
	}
	return out;
}
function tvKind(show) {
	const type = (show.type ?? "").toLowerCase();
	if (type === "movie" || (show.averageRuntime ?? show.runtime ?? 0) >= 85) return "movie";
	if (type.includes("animation") && (show.genres ?? []).some((g) => g.toLowerCase() === "anime")) return "anime";
	return "series";
}
function fromTvMaze(show) {
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
		ongoing: status === "running" || status === "in development"
	};
}
function fromAniList(media) {
	const kind = (media.format ?? "").toUpperCase() === "MOVIE" ? "movie" : "anime";
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
		ongoing: status === "RELEASING" || status === "NOT_YET_RELEASED"
	};
}
async function loadAniListPage(page, perPage = 50, format) {
	const res = await fetch("https://graphql.anilist.co", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify({
			query: format ? `
    query ($page: Int, $perPage: Int, $format: MediaFormat) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: POPULARITY_DESC, isAdult: false, format: $format) {
          id title { romaji english } coverImage { extraLarge large }
          genres averageScore episodes status seasonYear startDate { year } format
          description(asHtml: false)
        }
      }
    }` : `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
          id title { romaji english } coverImage { extraLarge large }
          genres averageScore episodes status seasonYear startDate { year } format
          description(asHtml: false)
        }
      }
    }`,
			variables: format ? {
				page,
				perPage,
				format
			} : {
				page,
				perPage
			}
		}),
		signal: AbortSignal.timeout(8e3)
	});
	if (!res.ok) throw new Error(`AniList failed (${res.status})`);
	return uniqueTitles(((await res.json()).data?.Page?.media ?? []).map(fromAniList));
}
async function loadTvPage(page) {
	return uniqueTitles((await fetchJson(`https://api.tvmaze.com/shows?page=${page}`, 1)).map(fromTvMaze));
}
var FILM_QUERIES = [
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
	"The Dark Knight"
];
async function loadCinematicTitles() {
	const results = await Promise.allSettled(FILM_QUERIES.map((q) => fetchJson(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(q)}`)));
	const titles = [];
	for (const res of results) {
		if (res.status !== "fulfilled") continue;
		const hit = res.value.find((row) => row.show.image);
		if (hit) titles.push({
			...fromTvMaze(hit.show),
			kind: "movie"
		});
	}
	return uniqueTitles(titles);
}
async function loadCatalogPool() {
	const results = await Promise.allSettled([
		loadTvPage(0),
		loadAniListPage(1, 50),
		loadAniListPage(2, 50),
		loadAniListPage(1, 50, "MOVIE"),
		loadAniListPage(2, 50, "MOVIE"),
		loadCinematicTitles()
	]);
	const merged = [];
	for (const res of results) if (res.status === "fulfilled") merged.push(...res.value);
	return uniqueTitles(merged);
}
async function loadExtraPool(round) {
	const results = await Promise.allSettled([loadTvPage(round), loadAniListPage(round + 2, 50)]);
	const merged = [];
	for (const res of results) if (res.status === "fulfilled") merged.push(...res.value);
	return uniqueTitles(merged);
}
async function searchCatalog(query) {
	const q = query.trim();
	if (q.length < 2) return [];
	const [tvRes, aniRes] = await Promise.allSettled([fetchJson(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(q)}`, 1), fetch("https://graphql.anilist.co", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify({
			query: `
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
  `,
			variables: { q }
		}),
		signal: AbortSignal.timeout(8e3)
	}).then(async (res) => {
		if (!res.ok) throw new Error("AniList search failed");
		return await res.json();
	})]);
	const tv = tvRes.status === "fulfilled" ? tvRes.value.map((row) => fromTvMaze(row.show)) : [];
	return uniqueTitles([...aniRes.status === "fulfilled" ? (aniRes.value.data?.Page?.media ?? []).map(fromAniList) : [], ...tv]).slice(0, 50);
}
var GENRE_ALIASES = {
	"sci-fi": [
		"sci-fi",
		"science-fiction",
		"science fiction",
		"sci fi"
	],
	"slice of life": ["slice of life", "slice-of-life"]
};
var CANON_GENRES = [
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
	"Western"
];
function genreMatches(genres, needle) {
	const key = needle.toLowerCase();
	const names = GENRE_ALIASES[key] ?? [key];
	return genres.some((g) => names.includes(g.toLowerCase()));
}
function filterByGenre(pool, genre, media) {
	return pool.filter((title) => {
		if (media === "movie" && title.kind !== "movie") return false;
		if (media === "series" && title.kind === "movie") return false;
		return genreMatches(title.genres, genre);
	});
}
function buildGenreBoard() {
	return CANON_GENRES.map((genre) => ({
		genre,
		poster: null,
		sampleTitle: ""
	}));
}
var BY_NAME = {
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
	Western: "oklch(0.54 0.11 55)"
};
var FALLBACK = [
	"oklch(0.55 0.13 250)",
	"oklch(0.54 0.12 20)",
	"oklch(0.56 0.12 160)",
	"oklch(0.57 0.12 80)",
	"oklch(0.53 0.13 300)",
	"oklch(0.52 0.11 200)"
];
function genreLook(genre, index, total) {
	let hash = 0;
	for (const ch of genre) hash = (hash + ch.charCodeAt(0) * 17) % 997;
	const color = BY_NAME[genre] ?? FALLBACK[hash % FALLBACK.length];
	const t = total <= 1 ? 58 : 62 - index / (total - 1) * 24;
	return {
		color,
		tint: `${Math.round(t)}%`
	};
}
function emptyTaste() {
	return {
		genres: {},
		kinds: {},
		answers: 0,
		quizDone: false
	};
}
function bump(map, key, amount) {
	map[key] = (map[key] ?? 0) + amount;
}
function learnFrom(taste, title, status, rating) {
	const genres = { ...taste.genres };
	const kinds = { ...taste.kinds };
	let strength = 0;
	if (status === "watched") strength = rating ? TIER_WEIGHT[rating] : 3;
	else if (status === "watching") strength = rating ? TIER_WEIGHT[rating] * .55 : 1.4;
	else if (status === "plan") strength = 1.15;
	else if (status === "passed") strength = -3.2;
	for (const genre of title.genres) bump(genres, genre, strength);
	bump(kinds, title.kind, strength * .45);
	return {
		genres,
		kinds,
		answers: taste.answers + 1,
		quizDone: taste.quizDone || taste.answers + 1 >= 20
	};
}
function profileStrength(taste) {
	let total = 0;
	for (const value of Object.values(taste.genres)) total += Math.abs(value);
	for (const value of Object.values(taste.kinds)) total += Math.abs(value);
	return total;
}
function scoreTitle(title, taste) {
	const priorMix = 1 / (1 + profileStrength(taste) / 14);
	let learned = 0;
	for (const genre of title.genres) learned += taste.genres[genre] ?? 0;
	learned += (taste.kinds[title.kind] ?? 0) * .8;
	const prior = (title.score ?? 6) * 1.1;
	return learned * (1 - priorMix) + prior * priorMix;
}
function rankTitles(pool, taste, hidden) {
	return [...pool].filter((title) => !hidden.has(title.id) && title.poster).sort((a, b) => scoreTitle(b, taste) - scoreTitle(a, taste));
}
var STORAGE_KEY = "aether-vault-v2";
function toItem(title, status, rating, partial, prev) {
	return {
		...title,
		status,
		rating: partial ? prev?.rating ?? null : rating ?? prev?.rating ?? null,
		partialRating: partial ? rating : status === "watching" ? prev?.partialRating ?? null : null,
		addedAt: prev?.addedAt ?? Date.now(),
		updatedAt: Date.now()
	};
}
var useVault = create((set, get) => ({
	ready: false,
	items: {},
	taste: emptyTaste(),
	hidden: [],
	hydrate: () => {
		if (typeof window === "undefined") return;
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				set({
					items: parsed.items ?? {},
					taste: parsed.taste ?? emptyTaste(),
					hidden: parsed.hidden ?? [],
					ready: true
				});
				return;
			}
		} catch {}
		set({ ready: true });
	},
	persist: () => {
		if (typeof window === "undefined") return;
		const { items, taste, hidden } = get();
		try {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
				items,
				taste,
				hidden
			}));
		} catch {}
	},
	applyStatus: (title, status, rating = null, partial = false) => {
		const current = get().items[title.id];
		const item = toItem(title, status, rating, partial, current);
		const hidden = new Set(get().hidden);
		if (status === "passed") hidden.add(title.id);
		const taste = learnFrom(get().taste, title, status, rating);
		set({
			items: {
				...get().items,
				[title.id]: item
			},
			taste,
			hidden: [...hidden]
		});
		get().persist();
	}
}));
function hiddenSet(state) {
	const next = new Set(state.hidden);
	for (const item of Object.values(state.items)) if (item.status !== "plan") next.add(item.id);
	return next;
}
var PAGE = 50;
function AetherApp() {
	const hydrate = useVault((s) => s.hydrate);
	const applyStatus = useVault((s) => s.applyStatus);
	const items = useVault((s) => s.items);
	const taste = useVault((s) => s.taste);
	const hidden = useVault((s) => s.hidden);
	const [view, setView] = (0, import_react.useState)("foryou");
	const [pool, setPool] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [page, setPage] = (0, import_react.useState)(1);
	const [quiz, setQuiz] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(null);
	const [rateDirect, setRateDirect] = (0, import_react.useState)(null);
	const [media, setMedia] = (0, import_react.useState)("all");
	const [query, setQuery] = (0, import_react.useState)("");
	const [results, setResults] = (0, import_react.useState)(null);
	const [genre, setGenre] = (0, import_react.useState)(null);
	const [sort, setSort] = (0, import_react.useState)("match");
	const [filtersOpen, setFiltersOpen] = (0, import_react.useState)(false);
	const [listStatus, setListStatus] = (0, import_react.useState)("watched");
	const [extraRound, setExtraRound] = (0, import_react.useState)(1);
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		loadCatalogPool().then((list) => {
			if (!cancelled) setPool(list);
		}).catch(() => {
			if (!cancelled) toast.error("Catalog is taking a moment. Retry shortly.");
		}).finally(() => {
			if (!cancelled) setLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const q = query.trim();
		if (q.length < 2) {
			setResults(null);
			return;
		}
		const handle = setTimeout(() => {
			searchCatalog(q).then(setResults).catch(() => setResults([]));
		}, 280);
		return () => clearTimeout(handle);
	}, [query]);
	const blocked = (0, import_react.useMemo)(() => hiddenSet({
		items,
		hidden
	}), [items, hidden]);
	const ranked = (0, import_react.useMemo)(() => rankTitles(pool, taste, blocked), [
		pool,
		taste,
		blocked
	]);
	const forYou = (0, import_react.useMemo)(() => {
		return ranked.filter((t) => matchesFilter(t, "all")).slice(0, page * PAGE);
	}, [ranked, page]);
	const genres = (0, import_react.useMemo)(() => buildGenreBoard(), []);
	const browseList = (0, import_react.useMemo)(() => {
		let list = results ?? (genre ? filterByGenre(pool, genre, media) : []);
		if (!results) list = list.filter((t) => matchesFilter(t, media));
		else list = list.filter((t) => matchesFilter(t, media));
		if (sort === "az") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
		if (sort === "year") list = [...list].sort((a, b) => Number(b.year ?? 0) - Number(a.year ?? 0));
		if (sort === "score") list = [...list].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
		return list.slice(0, page * PAGE);
	}, [
		results,
		genre,
		pool,
		media,
		sort,
		page
	]);
	const listItems = (0, import_react.useMemo)(() => Object.values(items).filter((item) => item.status === listStatus).sort((a, b) => b.updatedAt - a.updatedAt), [items, listStatus]);
	const save = (title, status, rating, partial) => {
		applyStatus(title, status, rating, partial);
		setOpen(null);
		setRateDirect(null);
		if (status === "watched") toast.success(`Saved ${title.title}`);
	};
	const loadMoreForYou = () => {
		if (forYou.length >= ranked.length) loadExtraPool(extraRound).then((more) => {
			setPool((prev) => {
				const seen = new Set(prev.map((t) => t.id));
				return [...prev, ...more.filter((t) => !seen.has(t.id))];
			});
			setExtraRound((n) => n + 1);
		});
		setPage((n) => n + 1);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-dvh max-w-3xl flex-col px-3 pb-24 pt-3 sm:px-4 sm:pb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "liquid-glass sticky top-3 z-30 flex flex-col gap-2 rounded-2xl px-2 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setQuiz(true),
						"aria-label": "Taste round",
						className: "grid size-11 place-items-center rounded-xl liquid-title",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkle, { className: "size-5 text-accent" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-wide text-muted uppercase",
							children: "Aether"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "truncate text-sm font-medium",
							children: "Dark glass watchlist"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex rounded-full bg-background/50 p-1",
					children: [
						["foryou", "For You"],
						["browse", "Browse"],
						["list", "List"]
					].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setView(id);
							setPage(1);
							setGenre(null);
						},
						className: cn("h-10 flex-1 rounded-full text-xs font-medium transition-colors duration-200", view === id ? "liquid-title text-foreground" : "text-muted"),
						children: label
					}, id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mt-5 flex-1",
				children: [
					view === "foryou" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "stagger-in flex flex-col gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: taste.quizDone ? `Tuned from ${taste.answers} answers. It sharpens as you rate.` : "Tap the mark in the corner for 20 titles — then this grid gets personal."
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleGrid, {
							titles: forYou,
							loading,
							canMore: !loading && forYou.length > 0 && (forYou.length >= page * PAGE || extraRound < 4),
							onMore: loadMoreForYou,
							onOpen: setOpen,
							onWatched: setRateDirect
						})]
					}) : null,
					view === "browse" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "stagger-in flex flex-col gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: query,
										onChange: (event) => {
											setQuery(event.target.value);
											setPage(1);
										},
										placeholder: "Search titles",
										className: "liquid-title rounded-full border-0 pl-9 ring-0"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "Filters",
									onClick: () => setFiltersOpen((v) => !v),
									className: "grid size-11 place-items-center rounded-full liquid-title",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "size-4" })
								})]
							}),
							filtersOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "liquid-glass flex flex-wrap gap-2 rounded-2xl p-3",
								children: [
									"match",
									"score",
									"year",
									"az"
								].map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: sort === mode ? "default" : "glass",
									onClick: () => setSort(mode),
									className: "rounded-full capitalize",
									children: mode === "az" ? "A–Z" : mode
								}, mode))
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex rounded-full bg-background/40 p-1",
								children: [
									"all",
									"movie",
									"series"
								].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setMedia(id);
										setPage(1);
									},
									className: cn("h-9 flex-1 rounded-full text-xs font-medium capitalize transition-colors duration-200", media === id ? "liquid-title" : "text-muted"),
									children: id
								}, id))
							}),
							query.trim().length >= 2 || genre ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [genre && query.trim().length < 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setGenre(null),
								className: "self-start text-xs text-muted",
								children: "← Genres"
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleGrid, {
								titles: browseList,
								loading,
								canMore: browseList.length >= page * PAGE,
								onMore: () => setPage((n) => n + 1),
								onOpen: setOpen,
								onWatched: setRateDirect
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-3",
								children: genres.map((tile, index) => {
									const look = genreLook(tile.genre, index, genres.length);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											setGenre(tile.genre);
											setPage(1);
										},
										className: "glass-card genre-glass flex min-h-28 items-end p-4 text-left transition-transform duration-200 active:scale-[0.96] sm:min-h-32",
										style: {
											"--genre": look.color,
											"--genre-tint": look.tint
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-lg font-semibold leading-snug tracking-tight",
											children: tile.genre
										})
									}, tile.genre);
								})
							})
						]
					}) : null,
					view === "list" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "stagger-in flex flex-col gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex rounded-full bg-background/40 p-1",
							children: [
								["watched", "Watched"],
								["watching", "Watching"],
								["plan", "Plan"],
								["passed", "Skip"]
							].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setListStatus(id),
								className: cn("h-9 flex-1 rounded-full text-xs font-medium transition-colors duration-200", listStatus === id ? "liquid-title" : "text-muted"),
								children: label
							}, id))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleGrid, {
							titles: listItems,
							onOpen: setOpen,
							onWatched: setRateDirect
						})]
					}) : null
				]
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpandCard, {
				title: open,
				onClose: () => setOpen(null),
				onSave: (status, rating, partial) => save(open, status, rating, partial)
			}) : null,
			rateDirect ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpandCard, {
				title: rateDirect,
				intent: "watched",
				onClose: () => setRateDirect(null),
				onSave: (status, rating, partial) => save(rateDirect, status, rating, partial)
			}) : null,
			quiz ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TasteRound, {
				pool: ranked.length ? ranked : pool,
				hidden: blocked,
				onClose: () => setQuiz(false),
				onAnswer: (title, status, rating, partial) => applyStatus(title, status, rating, partial)
			}) : null
		]
	});
}
var SplitComponent = AetherApp;
//#endregion
export { SplitComponent as component };
