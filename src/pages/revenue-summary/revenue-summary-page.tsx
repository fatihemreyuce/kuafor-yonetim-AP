import { useState } from "react";
import { Eye, Pencil, Trash2, WalletCards } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeleteRevenueSummaryMutation,
  useRevenueSummariesQuery,
} from "@/hooks/use-salon-revenue-summary";
import { formatMoney, formatMonth, shortId } from "./revenue-summary-utils";

export default function RevenueSummaryPage() {
  const navigate = useNavigate();
  const [target, setTarget] = useState<{ id: string; title: string } | null>(null);
  const { data = [], isLoading, isError, error, refetch } = useRevenueSummariesQuery();
  const deleteMut = useDeleteRevenueSummaryMutation();

  const onConfirmDelete = () => {
    if (!target) return;
    deleteMut.mutate(target.id, {
      onSuccess: () => {
        toast.success("Kayıt silindi.");
        setTarget(null);
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : "Silme işlemi başarısız.");
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <WalletCards className="h-8 w-8 text-emerald-500" aria-hidden />
            <h1>
              <AnimatedGradientText className="text-3xl font-bold">Gelir Ozeti</AnimatedGradientText>
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Salon bazli aylik odeme, toplam gelir ve ortalama sepet analizini tek yerden yonetin.
          </p>
        </div>
        <ShimmerButton
          type="button"
          onClick={() => navigate("/revenue-summary/new")}
          className="w-full shrink-0 sm:w-auto"
        >
          Yeni ozet kaydi
        </ShimmerButton>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/50 bg-card/30">
        {isLoading ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Kayitlar yukleniyor...</p>
        ) : isError ? (
          <div className="space-y-3 py-10 text-center">
            <p className="text-sm text-destructive">
              {error instanceof Error ? error.message : "Veri alinamadi."}
            </p>
            <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
              Tekrar dene
            </Button>
          </div>
        ) : data.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Henuz gelir ozet kaydi yok. Yeni bir kayit ekleyin.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead>Salon</TableHead>
                <TableHead>Ay</TableHead>
                <TableHead className="hidden md:table-cell text-right">Odeme</TableHead>
                <TableHead className="hidden lg:table-cell text-right">Toplam</TableHead>
                <TableHead className="hidden xl:table-cell text-right">Ort.</TableHead>
                <TableHead className="hidden xl:table-cell text-right font-mono text-[10px]">
                  ID
                </TableHead>
                <TableHead className="w-[140px] text-right">Islemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id} className="border-border/50">
                  <TableCell className="font-medium">
                    <Link
                      to={`/revenue-summary/${row.id}`}
                      className="text-foreground underline-offset-4 hover:underline"
                    >
                      {row.salon_name || "Isimsiz salon"}
                    </Link>
                  </TableCell>
                  <TableCell>{formatMonth(row.month)}</TableCell>
                  <TableCell className="hidden md:table-cell text-right">
                    {row.payment_count ?? "-"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-right">
                    {formatMoney(row.total_revenue, row.currency)}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell text-right">
                    {formatMoney(row.avg_payment, row.currency)}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell text-right font-mono text-[11px] text-muted-foreground">
                    {shortId(row.id)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-sky-600 hover:bg-sky-100 hover:text-sky-700"
                        asChild
                      >
                        <Link to={`/revenue-summary/${row.id}`} aria-label="Detay">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-amber-600 hover:bg-amber-100 hover:text-amber-700"
                        asChild
                      >
                        <Link to={`/revenue-summary/${row.id}/edit`} aria-label="Duzenle">
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:bg-red-100 hover:text-red-700"
                        aria-label="Sil"
                        onClick={() =>
                          setTarget({ id: row.id, title: row.salon_name || shortId(row.id) })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <ConfirmModal
        open={Boolean(target)}
        title="Kaydi sil"
        tone="destructive"
        description={
          target
            ? `${target.title} kaydi kalici olarak silinecek. Bu islem geri alinamaz.`
            : undefined
        }
        confirmByTyping={target?.title}
        confirmByTypingHint="Devam etmek icin kayit adini yazin."
        confirmText="Evet, sil"
        cancelText="Vazgec"
        loading={deleteMut.isPending}
        onCancel={() => (deleteMut.isPending ? null : setTarget(null))}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
}
