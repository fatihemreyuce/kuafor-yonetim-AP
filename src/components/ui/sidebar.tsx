import { useCallback, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Puzzle,
  Sparkles,
  Users,
  UserRoundCog,
} from "lucide-react";

import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DarkModeToggle from "@/components/dark-mode-toggle";
import { DotPattern } from "@/components/ui/dot-pattern";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLoginState } from "@/hooks/use-login-state";
import { cn } from "@/lib/utils";

export interface SidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
}

const navigationItems: NavItem[] = [
  {
    to: "/",
    label: "Gosterge Paneli",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/profiles",
    label: "Kullanicilar",
    icon: Users,
  },
  {
    to: "/saloons",
    label: "Saloons",
    icon: Puzzle,
  },
  {
    to: "/revenue-summary",
    label: "Gelir Ozeti",
    icon: BarChart3,
  },
  {
    to: "/salon-team",
    label: "Salon Team",
    icon: UserRoundCog,
  },
];

type Tilt = { rx: number; ry: number };

function TiltNavLink({
  to,
  end,
  icon: Icon,
  label,
  collapsed,
}: {
  to: string;
  end?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  collapsed: boolean;
}) {
  const [tilt, setTilt] = useState<Tilt>({ rx: 0, ry: 0 });
  const [hover, setHover] = useState(false);

  const onMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: py * -10, ry: px * 10 });
  }, []);

  const onEnter = useCallback(() => setHover(true), []);
  const onLeave = useCallback(() => {
    setHover(false);
    setTilt({ rx: 0, ry: 0 });
  }, []);

  const link = (
    <NavLink
      to={to}
      end={end}
      onMouseMove={collapsed ? undefined : onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={
        collapsed
          ? undefined
          : {
              transform: `perspective(720px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(${hover ? 4 : 0}px)`,
            }
      }
      className={({ isActive }) =>
        cn(
          "group relative flex transform-gpu items-center overflow-hidden border text-[13px] font-medium leading-tight tracking-tight",
          collapsed ? "rounded-md" : "rounded-lg",
          "will-change-transform [transform-style:preserve-3d]",
          collapsed ? "justify-center px-1 py-1.5" : "gap-2 px-2.5 py-2",
          !collapsed && (hover ? "duration-75 ease-out" : "duration-300 ease-out"),
          collapsed && "duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
          isActive
            ? "border-sky-400/25 bg-gradient-to-br from-sky-500/15 via-sky-500/8 to-blue-600/10 text-foreground shadow-sm shadow-sky-500/10"
            : "border-border/30 bg-card/20 text-muted-foreground hover:border-sky-300/20 hover:bg-accent/35 hover:text-foreground dark:hover:border-sky-500/15",
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              "flex shrink-0 items-center justify-center rounded-md border border-sky-400/15 bg-gradient-to-br from-sky-500/15 to-blue-600/8 text-sky-600 transition-transform duration-300 group-hover:scale-[1.03] dark:text-sky-400",
              collapsed ? "h-7 w-7 rounded-md" : "h-7 w-7",
              isActive &&
                "border-sky-400/30 from-sky-500/28 to-blue-600/18",
            )}
            style={collapsed ? undefined : { transform: "translateZ(8px)" }}
          >
            <Icon className="h-3.5 w-3.5" />
          </span>
          <span
            className={cn(
              "relative z-[1]",
              collapsed && "sr-only",
            )}
            style={collapsed ? undefined : { transform: "translateZ(4px)" }}
          >
            {label}
          </span>
          {!collapsed ? (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, hsl(var(--primary) / 0.08) 50%, transparent 60%)",
                transform: "translateZ(0)",
              }}
            />
          ) : null}
        </>
      )}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="block w-full">{link}</span>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return link;
}

function WithTooltip({
  collapsed,
  label,
  children,
}: {
  collapsed: boolean;
  label: string;
  children: React.ReactNode;
}) {
  if (!collapsed) return <>{children}</>;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="flex w-full justify-center">{children}</span>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={10}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

export default function Sidebar({ collapsed, onCollapsedChange }: SidebarProps) {
  const { logout, isActionable, isLoading } = useLoginState();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch {
      // noop
    }
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col overflow-hidden border-r transition-[width] duration-300 ease-out",
        collapsed ? "w-16" : "w-60",
        "border-sky-200/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70",
        "dark:border-sky-950/40 dark:bg-background/85",
      )}
    >
      <DotPattern className="opacity-[0.2] dark:opacity-[0.12]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-500/[0.06] via-transparent to-blue-600/[0.05] dark:from-sky-400/[0.04] dark:to-blue-500/[0.04]"
      />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        {/* Collapse control */}
        <div
          className={cn(
            "flex shrink-0 items-center border-b border-border/40",
            collapsed ? "justify-center px-0 py-1" : "justify-end px-1 py-1.5",
          )}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "shrink-0 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground",
                  collapsed ? "h-7 w-7" : "h-8 w-8 rounded-lg",
                )}
                onClick={() => onCollapsedChange(!collapsed)}
                aria-expanded={!collapsed}
                aria-label={
                  collapsed ? "Kenar Ã§ubuÄŸunu geniÅŸlet" : "Kenar Ã§ubuÄŸunu daralt"
                }
              >
                {collapsed ? (
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              {collapsed ? "MenÃ¼yÃ¼ geniÅŸlet" : "MenÃ¼yÃ¼ daralt"}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Brand â€” dar modda kart yok, daha hafif */}
        {collapsed ? (
          <div className="flex flex-col items-center gap-1 px-1 pb-0.5 pt-0.5">
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center"
              style={{ animation: "float 3.2s ease-in-out infinite" }}
            >
              <div className="animate-sidebar-brand-3d flex h-full w-full items-center justify-center rounded-md bg-gradient-to-br from-sky-400 to-blue-600 shadow-sm shadow-sky-500/20">
                <Sparkles className="h-3.5 w-3.5 text-white" strokeWidth={2} />
              </div>
            </div>
            <WithTooltip collapsed label="Tema deÄŸiÅŸtir">
              <DarkModeToggle className="h-7 w-7 rounded-md [&_svg]:h-3.5 [&_svg]:w-3.5" />
            </WithTooltip>
          </div>
        ) : (
          <div className="px-2 pb-1.5 pt-1">
            <Card className="relative overflow-hidden rounded-xl border-sky-200/40 bg-card/90 py-2.5 shadow-sm shadow-sky-500/5 dark:border-sky-900/35">
              <BorderBeam
                colorFrom="#0ea5e9"
                colorTo="#38bdf8"
                duration={12}
                borderWidth={1}
                innerClassName="bg-card"
              />
              <div className="relative flex items-start gap-2.5 px-2">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center"
                  style={{ animation: "float 3.2s ease-in-out infinite" }}
                >
                  <div className="animate-sidebar-brand-3d flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 shadow-md shadow-sky-500/25">
                    <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
                  </div>
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="truncate text-sm font-semibold leading-tight">
                    <AnimatedGradientText className="text-sm font-semibold">
                      Kuafor YÃ¶netim Sistemi
                    </AnimatedGradientText>
                  </p>
                  <p className="mt-px text-[11px] leading-tight text-muted-foreground">
                    KYS
                  </p>
                </div>
                <DarkModeToggle className="mt-0.5 shrink-0" />
              </div>
            </Card>
          </div>
        )}

        {/* Nav */}
        <nav
          className={cn(
            "min-h-0 flex-1 space-y-1 overflow-y-auto py-2 [perspective:800px]",
            collapsed ? "px-1 py-1.5" : "px-3 py-2",
          )}
          aria-label="Ana menÃ¼"
        >
          {navigationItems.map((item) => (
            <TiltNavLink
              key={item.to}
              to={item.to}
              end={item.end}
              icon={item.icon}
              label={item.label}
              collapsed={collapsed}
            />
          ))}
        </nav>

        {/* Footer */}
        <div
          className={cn(
            "relative z-10 border-t border-border/50 bg-background/60 backdrop-blur-md dark:bg-background/50",
            collapsed ? "p-1.5" : "p-2",
          )}
        >
          {isLoading ? (
            <WithTooltip collapsed={collapsed} label="Ã‡Ä±kÄ±ÅŸ yapÄ±lÄ±yorâ€¦">
              <Button
                variant="outline"
                disabled
                className={cn(
                  "border-dashed text-xs",
                  collapsed
                    ? "mx-auto flex h-8 w-8 items-center justify-center p-0"
                    : "h-9 w-full justify-start gap-2",
                )}
              >
                <LogOut
                  className={cn(
                    "shrink-0",
                    collapsed ? "h-3 w-3" : "h-3.5 w-3.5",
                  )}
                />
                {!collapsed ? (
                  <span>Ã‡Ä±kÄ±ÅŸ yapÄ±lÄ±yorâ€¦</span>
                ) : null}
              </Button>
            </WithTooltip>
          ) : (
            <WithTooltip collapsed={collapsed} label="Ã‡Ä±kÄ±ÅŸ Yap">
              <ShimmerButton
                type="button"
                onClick={handleLogout}
                disabled={!isActionable}
                shimmerColor="rgba(255,255,255,0.35)"
                className={cn(
                  "rounded-lg bg-gradient-to-r from-sky-500 via-sky-500 to-blue-600 py-0 text-xs font-semibold shadow-sm shadow-sky-500/15",
                  "hover:from-sky-600 hover:via-sky-500 hover:to-blue-700 hover:shadow-sky-500/25",
                  "active:scale-[0.99]",
                  collapsed
                    ? "mx-auto h-8 w-8 min-w-0 px-0 [&>span:last-child]:gap-0"
                    : "h-9 w-full",
                )}
              >
                <LogOut
                  className={cn(
                    "shrink-0",
                    collapsed ? "h-3 w-3" : "h-3.5 w-3.5",
                  )}
                />
                {!collapsed ? <span>Ã‡Ä±kÄ±ÅŸ Yap</span> : null}
              </ShimmerButton>
            </WithTooltip>
          )}
        </div>
      </div>
    </aside>
  );
}



