import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useSalonTeamMemberQuery } from "@/hooks/use-salon-team";
import { SalonTeamEditForm } from "./salon-team-form";
import { parseSalonTeamIdParam } from "./salon-team-utils";

export default function SalonTeamEditPage() {
  const { id: idParam } = useParams<{ id: string }>();
  const id = parseSalonTeamIdParam(idParam);
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useSalonTeamMemberQuery(id);

  if (!id) return <p className="py-16 text-center text-sm text-destructive">Gecersiz kayit adresi.</p>;

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1">
          <Link to="/salon-team"><ArrowLeft className="h-4 w-4" />Listeye don</Link>
        </Button>
        {data ? <Button variant="ghost" size="sm" asChild><Link to={`/salon-team/${data.id}`}>Detay</Link></Button> : null}
      </div>
      {isLoading ? (
        <p className="py-16 text-center text-sm text-muted-foreground">Yukleniyor...</p>
      ) : isError ? (
        <div className="space-y-3 py-12 text-center">
          <p className="text-sm text-destructive">{error instanceof Error ? error.message : "Kayit yuklenemedi."}</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>Tekrar dene</Button>
        </div>
      ) : !data ? (
        <p className="py-16 text-center text-sm text-muted-foreground">Kayit bulunamadi.</p>
      ) : (
        <SalonTeamEditForm item={data} onSuccessNavigate={() => navigate(`/salon-team/${data.id}`, { replace: true })} onCancel={() => navigate(`/salon-team/${data.id}`)} />
      )}
    </div>
  );
}
