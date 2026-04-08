import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  shimmerColor?: string;
  shimmerSize?: string;
  shimmerDuration?: string;
  className?: string;
}

export function ShimmerButton({
  children,
  shimmerColor = "rgba(255,255,255,0.4)",
  shimmerSize = "0.1em",
  shimmerDuration = "2.5s",
  className,
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      style={
        {
          "--shimmer-color": shimmerColor,
          "--shimmer-width": "200px",
          "--speed": shimmerDuration,
        } as React.CSSProperties
      }
      className={cn(
        "group relative inline-flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg",
        "bg-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-md",
        "transition-all duration-300 hover:bg-sky-600 hover:shadow-sky-200/50 hover:shadow-lg",
        "active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    >
      {/* Shimmer overlay */}
      <span
        className="absolute inset-0 overflow-hidden rounded-[inherit]"
        style={{ pointerEvents: "none" }}
      >
        <span
          className="absolute inset-0 rounded-[inherit]"
          style={{
            background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
            backgroundSize: "200px 100%",
            animation: `shimmer-slide var(--speed) ease-in-out infinite`,
          }}
        />
      </span>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
