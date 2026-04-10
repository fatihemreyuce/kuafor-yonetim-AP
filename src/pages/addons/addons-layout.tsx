import { Link, Outlet, useLocation } from "react-router-dom";

import { DotPattern } from "@/components/ui/dot-pattern";

function SaloonsBreadcrumb() {
  const { pathname } = useLocation();

  if (pathname === "/saloons") {
    return <p className="mb-4 text-sm font-medium text-foreground">Saloons</p>;
  }

  const trail: { label: string; to?: string }[] = [{ label: "Saloons", to: "/saloons" }];

  if (pathname.endsWith("/new")) {
    trail.push({ label: "Yeni kayıt" });
  } else if (pathname.includes("/edit")) {
    trail.push({ label: "Düzenle" });
  } else {
    trail.push({ label: "Detay" });
  }

  return (
    <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
      {trail.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
          {i > 0 ? <span aria-hidden className="text-border">/</span> : null}
          {item.to ? (
            <Link to={item.to} className="transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default function AddonsLayout() {
  return (
    <div className="relative min-h-[calc(100vh-3rem)] overflow-hidden rounded-2xl">
      <DotPattern className="opacity-[0.14] dark:opacity-[0.07]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/[0.04] via-transparent to-sky-600/[0.05]"
      />
      <div className="relative z-10 mx-auto max-w-6xl px-1 py-2">
        <SaloonsBreadcrumb />
        <Outlet />
      </div>
    </div>
  );
}
