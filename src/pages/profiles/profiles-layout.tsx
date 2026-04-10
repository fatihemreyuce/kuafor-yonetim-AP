import { Link, Outlet, useLocation } from "react-router-dom";

import { DotPattern } from "@/components/ui/dot-pattern";
function ProfilesBreadcrumb() {
  const { pathname } = useLocation();

  if (pathname === "/profiles") {
    return (
      <p className="mb-4 text-sm font-medium text-foreground">Kullanıcılar</p>
    );
  }

  const trail: { label: string; to?: string }[] = [
    { label: "Kullanıcılar", to: "/profiles" },
  ];

  if (pathname.endsWith("/new")) {
    trail.push({ label: "Yeni kayıt" });
  } else if (pathname.includes("/delete")) {
    trail.push({ label: "Sil" });
  } else if (pathname.includes("/edit")) {
    trail.push({ label: "Düzenle" });
  } else {
    const m = /^\/profiles\/([^/]+)$/.exec(pathname);
    if (m?.[1] && m[1] !== "new") {
      trail.push({ label: "Detay" });
    }
  }

  return (
    <nav
      className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
      aria-label="Sayfa konumu"
    >
      {trail.map((c, i) => (
        <span key={`${c.label}-${i}`} className="flex items-center gap-1.5">
          {i > 0 ? <span aria-hidden className="text-border">/</span> : null}
          {c.to ? (
            <Link
              to={c.to}
              className="transition-colors hover:text-foreground"
            >
              {c.label}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default function ProfilesLayout() {
  return (
    <div className="relative min-h-[calc(100vh-3rem)] overflow-hidden rounded-2xl">
      <DotPattern className="opacity-[0.14] dark:opacity-[0.07]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-500/[0.04] via-transparent to-blue-600/[0.05]"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-1 py-2">
        <ProfilesBreadcrumb />
        <Outlet />
      </div>
    </div>
  );
}
