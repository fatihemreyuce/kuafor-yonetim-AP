import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AnimatedGradientTextProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedGradientText({
  children,
  className,
}: AnimatedGradientTextProps) {
  return (
    <span
      style={{
        backgroundImage:
          "linear-gradient(90deg, #0369a1, #0ea5e9, #38bdf8, #0284c7, #0369a1)",
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        animation: "gradient-shift 4s ease infinite",
      }}
      className={cn("inline-block font-bold", className)}
    >
      {children}
    </span>
  );
}
