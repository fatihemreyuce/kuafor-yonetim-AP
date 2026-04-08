import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DarkModeToggleProps {
  className?: string;
}

export default function DarkModeToggle({ className }: DarkModeToggleProps) {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored === "dark";
  });

  useEffect(() => {
    const legacyDark = localStorage.getItem("darkMode");
    const stored = localStorage.getItem("theme");
    let initialTheme = stored || "light";
    if (!stored && legacyDark) {
      try {
        const legacy = JSON.parse(legacyDark) as boolean;
        initialTheme = legacy ? "dark" : "light";
        localStorage.setItem("theme", initialTheme);
        localStorage.removeItem("darkMode");
      } catch {
        // Ignore parsing errors
      }
    }
    setIsDark(initialTheme === "dark");
  }, []);

  useEffect(() => {
    const rootElement = document.documentElement;
    rootElement.classList.remove("dark");
    if (isDark) {
      rootElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setIsDark((d) => !d)}
      className={cn(
        "h-8 w-8 shrink-0 rounded-lg border shadow-sm",
        "border-sky-500/45 bg-white text-sky-900",
        "transition-[transform,box-shadow,background-color,border-color,color] duration-200",
        "hover:scale-105 hover:border-sky-700 hover:bg-sky-100 hover:text-sky-950 hover:shadow-md",
        "active:scale-95",
        "dark:border-sky-500/50 dark:bg-slate-950 dark:text-amber-400",
        "dark:hover:border-sky-400 dark:hover:bg-slate-900 dark:hover:text-amber-200",
        "[&_svg]:shrink-0 [&_svg]:stroke-[2.25]",
        className,
      )}
      aria-label={isDark ? "Açık temaya geç" : "Koyu temaya geç"}
      aria-pressed={isDark}
    >
      {isDark ? (
        <Sun className="h-4 w-4" aria-hidden />
      ) : (
        <Moon className="h-4 w-4" aria-hidden />
      )}
    </Button>
  );
}
