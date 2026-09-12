import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg bg-foreground/6 px-3 text-sm text-foreground outline-none ring-1 ring-foreground/12 transition-[box-shadow,background-color] placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-ring",
          className,
        )}
        ref={ref}
        suppressHydrationWarning
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
