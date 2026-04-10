import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "text-foreground",
        sky: "border-sky-300/50 bg-sky-500/15 text-sky-800 dark:border-sky-600/40 dark:bg-sky-500/20 dark:text-sky-200",
        violet:
          "border-violet-300/50 bg-violet-500/15 text-violet-900 dark:border-violet-600/40 dark:bg-violet-500/20 dark:text-violet-200",
        amber:
          "border-amber-300/50 bg-amber-500/15 text-amber-950 dark:border-amber-600/40 dark:bg-amber-500/20 dark:text-amber-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
