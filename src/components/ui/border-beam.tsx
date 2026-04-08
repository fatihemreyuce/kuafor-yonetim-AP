import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  borderWidth?: number;
  /** Fill behind the beam (must match the card surface). */
  innerClassName?: string;
}

export function BorderBeam({
  className,
  duration = 10,
  colorFrom = "#0ea5e9",
  colorTo = "#38bdf8",
  borderWidth = 1.5,
  innerClassName,
}: BorderBeamProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit]",
        className,
      )}
    >
      {/* Static border */}
      <div
        className="absolute inset-0 rounded-[inherit]"
        style={{
          padding: `${borderWidth}px`,
          background: `linear-gradient(135deg, ${colorFrom}33, ${colorTo}33)`,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      {/* Animated spinning beam */}
      <div
        className="absolute inset-0 rounded-[inherit] overflow-hidden"
        style={{ padding: `${borderWidth}px` }}
      >
        <div
          className="absolute inset-[-200%]"
          style={{
            background: `conic-gradient(from 0deg, transparent 0%, transparent 30%, ${colorFrom} 50%, ${colorTo} 55%, transparent 70%, transparent 100%)`,
            animation: `spin-slow ${duration}s linear infinite`,
          }}
        />
        {/* Inner mask to show only the border */}
        <div
          className={cn(
            "absolute rounded-[inherit] bg-white dark:bg-card",
            innerClassName,
          )}
          style={{ inset: `${borderWidth}px` }}
        />
      </div>
    </div>
  );
}
