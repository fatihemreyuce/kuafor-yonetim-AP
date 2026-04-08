import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./ui/sidebar";
import { TooltipProvider } from "./ui/tooltip";
import { cn } from "@/lib/utils";

const SIDEBAR_COLLAPSED_KEY = "admin-sidebar-collapsed";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? "1" : "0");
    } catch {
      // ignore
    }
  }, [collapsed]);

  return (
    <TooltipProvider delayDuration={250}>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
        <div
          className={cn(
            "min-h-screen transition-[padding] duration-300 ease-out",
            collapsed ? "pl-16" : "pl-60",
          )}
        >
          <main className="min-h-screen p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
