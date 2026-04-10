import { Badge } from "@/components/ui/badge";
import type { AddonType } from "@/types/addon.types";
import { ADDON_TYPE_LABELS } from "@/types/addon.types";

const typeStyles: Record<AddonType, string> = {
  editing: "border-sky-300/50 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  effect: "border-violet-300/50 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  advanced: "border-amber-300/50 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  social: "border-emerald-300/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  general: "border-muted-foreground/30 bg-muted/60 text-foreground",
};

export function AddonTypeBadge({ type }: { type: AddonType }) {
  return (
    <Badge variant="outline" className={typeStyles[type]}>
      {ADDON_TYPE_LABELS[type]}
    </Badge>
  );
}
