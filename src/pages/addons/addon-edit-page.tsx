import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useSaloonQuery } from "@/hooks/use-addons";
import { AddonEditForm } from "./addon-form";
import { parseAddonIdParam } from "./addon-utils";

export default function AddonEditPage() {
  const { id: idParam } = useParams<{ id: string }>();
  const id = parseAddonIdParam(idParam);
  const navigate = useNavigate();
  const { data: addon, isLoading, isError, error, refetch } = useSaloonQuery(id);

  if (id == null) {
    return (
      <div className="mx-auto max-w-xl p-6 text-center">
        <p className="text-sm text-destructive">Geçersiz saloon adresi.</p>
        <Button asChild className="mt-4" variant="outline">
          <Link to="/saloons">Listeye dön</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1">
          <Link to="/saloons">
            <ArrowLeft className="h-4 w-4" />
            Listeye dön
          </Link>
        </Button>
        {addon ? (
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/saloons/${addon.id}`}>Detay</Link>
          </Button>
        ) : null}
      </div>

      {isLoading ? (
        <p className="py-16 text-center text-sm text-muted-foreground">Yükleniyor…</p>
      ) : isError ? (
        <div className="space-y-3 py-12 text-center">
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Saloon yüklenemedi."}
          </p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Tekrar dene
          </Button>
        </div>
      ) : !addon ? (
        <p className="py-16 text-center text-sm text-muted-foreground">Saloon bulunamadı.</p>
      ) : (
        <AddonEditForm
          addon={addon}
          onSuccessNavigate={() => navigate(`/saloons/${addon.id}`, { replace: true })}
          onCancel={() => navigate(`/saloons/${addon.id}`)}
        />
      )}
    </div>
  );
}
