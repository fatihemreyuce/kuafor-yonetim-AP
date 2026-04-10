import { useState } from "react";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useDeleteSalonTeamMutation, useSalonTeamMemberQuery } from "@/hooks/use-salon-team";
import { formatDate, parseSalonTeamIdParam, shortId } from "./salon-team-utils";

export default function SalonTeamDetailPage() {
  const { id: idParam } = useParams<{ id: string }>();
  const id = parseSalonTeamIdParam(idParam);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError, error, refetch } = useSalonTeamMemberQuery(id);
  const deleteMut = useDeleteSalonTeamMutation();

  const onConfirmDelete = () => {
    if (!data) return;
    deleteMut.mutate(data.id, {
      onSuccess: () => {
        toast.success("Kayit silindi.");
        setOpen(false);
        navigate("/salon-team", { replace: true });
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : "Silme islemi basarisiz.");
      },
    });
  };

  if (!id) return <p className="py-16 text-center text-sm text-destructive">Gecersiz kayit adresi.</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1"><Link to="/salon-team"><ArrowLeft className="h-4 w-4" />Listeye don</Link></Button>
      {isLoading ? (
        <p className="py-16 text-center text-sm text-muted-foreground">Yukleniyor...</p>
      ) : isError ? (
        <div className="space-y-3 py-12 text-center"><p className="text-sm text-destructive">{error instanceof Error ? error.message : "Kayit yuklenemedi."}</p><Button type="button" variant="outline" size="sm" onClick={() => refetch()}>Tekrar dene</Button></div>
      ) : !data ? (
        <p className="py-16 text-center text-sm text-muted-foreground">Kayit bulunamadi.</p>
      ) : (
        <>
          <header className="flex flex-col gap-6 border-b border-border/60 pb-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border border-border/60 shadow-sm"><AvatarImage src={data.avatar_url ?? undefined} alt="" /><AvatarFallback>{(data.display_name ?? "?").slice(0,1).toUpperCase()}</AvatarFallback></Avatar>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{data.display_name || "Isimsiz"}</h1>
                <p className="text-sm text-muted-foreground">{data.title || "Unvan girilmedi"}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild><Link to={`/salon-team/${data.id}/edit`}><Pencil className="mr-2 h-4 w-4" />Duzenle</Link></Button>
              <Button variant="destructive" size="sm" onClick={() => setOpen(true)}><Trash2 className="mr-2 h-4 w-4" />Sil</Button>
            </div>
          </header>

          <dl className="grid gap-4 rounded-xl border border-border/50 bg-card/20 p-5 sm:grid-cols-2">
            <Meta label="ID" value={shortId(data.id)} />
            <Meta label="Durum" value={data.is_active ? "Aktif" : "Pasif"} />
            <Meta label="Salon ID" value={data.salon_id || "-"} />
            <Meta label="Profil ID" value={data.profile_id || "-"} />
            <Meta label="Renk anahtari" value={data.color_key || "-"} />
            <Meta label="Unvan" value={data.title || "-"} />
            <Meta label="Olusturulma" value={formatDate(data.created_at)} />
            <Meta label="Guncellenme" value={formatDate(data.updated_at)} />
          </dl>
        </>
      )}

      <ConfirmModal open={open} title="Kaydi sil" tone="destructive" description={data ? `${data.display_name || "Kayit"} kalici olarak silinecek.` : undefined} confirmByTyping={data?.display_name ?? undefined} confirmByTypingHint="Devam etmek icin personel adini yazin." confirmText="Evet, sil" cancelText="Vazgec" loading={deleteMut.isPending} onCancel={() => (deleteMut.isPending ? null : setOpen(false))} onConfirm={onConfirmDelete} />
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
    </div>
  );
}
