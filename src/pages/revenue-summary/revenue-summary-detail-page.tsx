import { useState } from "react";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import {
  useDeleteRevenueSummaryMutation,
  useRevenueSummaryQuery,
} from "@/hooks/use-salon-revenue-summary";
import {
  formatMoney,
  formatMonth,
  parseRevenueSummaryIdParam,
} from "./revenue-summary-utils";

export default function RevenueSummaryDetailPage() {
  const { id: idParam } = useParams<{ id: string }>();
  const id = parseRevenueSummaryIdParam(idParam);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError, error, refetch } = useRevenueSummaryQuery(id);
  const deleteMut = useDeleteRevenueSummaryMutation();

  const onConfirmDelete = () => {
    if (!data) return;
    deleteMut.mutate(data.id, {
      onSuccess: () => {
        toast.success("Kayit silindi.");
        setOpen(false);
        navigate("/revenue-summary", { replace: true });
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : "Silme islemi basarisiz.");
      },
    });
  };

  if (!id) {
    return <p className="py-16 text-center text-sm text-destructive">Gecersiz kayit adresi.</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1">
        <Link to="/revenue-summary">
          <ArrowLeft className="h-4 w-4" />
          Listeye don
        </Link>
      </Button>

      {isLoading ? (
        <p className="py-16 text-center text-sm text-muted-foreground">Yukleniyor...</p>
      ) : isError ? (
        <div className="space-y-3 py-12 text-center">
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Kayit yuklenemedi."}
          </p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Tekrar dene
          </Button>
        </div>
      ) : !data ? (
        <p className="py-16 text-center text-sm text-muted-foreground">Kayit bulunamadi.</p>
      ) : (
        <>
          <header className="flex flex-col gap-4 border-b border-border/60 pb-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{data.salon_name || "Gelir kaydi"}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{formatMonth(data.month)}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/revenue-summary/${data.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Duzenle
                </Link>
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Sil
              </Button>
            </div>
          </header>

          <dl className="grid gap-4 rounded-xl border border-border/50 bg-card/20 p-5 sm:grid-cols-2">
            <Meta label="Salon ID" value={data.salon_id || "-"} />
            <Meta label="Para birimi" value={data.currency || "-"} />
            <Meta label="Odeme sayisi" value={data.payment_count == null ? "-" : String(data.payment_count)} />
            <Meta label="Toplam gelir" value={formatMoney(data.total_revenue, data.currency)} />
            <Meta label="Ortalama odeme" value={formatMoney(data.avg_payment, data.currency)} />
            <Meta label="Ay" value={formatMonth(data.month)} />
            <Meta label="Aciklama" value={data.description || "-"} className="sm:col-span-2" />
          </dl>
        </>
      )}

      <ConfirmModal
        open={open}
        title="Kaydi sil"
        tone="destructive"
        description={data ? `${data.salon_name || "Kayit"} kalici olarak silinecek.` : undefined}
        confirmByTyping={data?.salon_name ?? undefined}
        confirmByTypingHint="Devam etmek icin salon adini yazin."
        confirmText="Evet, sil"
        cancelText="Vazgec"
        loading={deleteMut.isPending}
        onCancel={() => (deleteMut.isPending ? null : setOpen(false))}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
}

function Meta({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
    </div>
  );
}
