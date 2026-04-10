import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, Pencil, Puzzle, Trash2 } from "lucide-react";
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
import { useDeleteSaloonMutation, useSaloonsQuery } from "@/hooks/use-addons";
import { AddonTypeBadge } from "./addon-type-badge";
import { shortUuid } from "./addon-utils";

export default function AddonsPage() {
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const { data: addons = [], isLoading, isError, error, refetch } = useSaloonsQuery();
  const deleteMut = useDeleteSaloonMutation();

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteMut.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Saloon silindi.");
        setDeleteTarget(null);
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
            <Puzzle className="h-8 w-8 text-violet-500" aria-hidden />
            <h1>
              <AnimatedGradientText className="text-3xl font-bold">Saloons</AnimatedGradientText>
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Salon kayıtlarını tek ekrandan yönetin: listeleyin, detayları inceleyin, güncelleyin
            veya güvenle silin.
          </p>
        </div>
        <ShimmerButton
          type="button"
          onClick={() => navigate("/saloons/new")}
          className="w-full shrink-0 sm:w-auto"
        >
          Yeni saloon
        </ShimmerButton>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/50 bg-card/30">
        {isLoading ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Saloons yükleniyor…</p>
        ) : isError ? (
          <div className="space-y-3 py-10 text-center">
            <p className="text-sm text-destructive">
              {error instanceof Error ? error.message : "Veri alınamadı."}
            </p>
            <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
              Tekrar dene
            </Button>
          </div>
        ) : addons.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Henüz saloon yok. Yeni saloon ekleyerek başlayın.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead>Ad</TableHead>
                <TableHead className="hidden md:table-cell">Tip</TableHead>
                <TableHead className="hidden lg:table-cell">Şehir</TableHead>
                <TableHead className="hidden xl:table-cell">Telefon</TableHead>
                <TableHead className="hidden w-28 text-right font-mono text-[10px] xl:table-cell">
                  ID
                </TableHead>
                <TableHead className="w-[140px] text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addons.map((a) => (
                <TableRow key={a.id} className="border-border/50">
                  <TableCell className="font-medium">
                    <Link to={`/saloons/${a.id}`} className="text-foreground underline-offset-4 hover:underline">
                      {a.name}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <AddonTypeBadge type={a.type} />
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">
                    {a.city || "—"}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground xl:table-cell">
                    {a.phone || "—"}
                  </TableCell>
                  <TableCell className="hidden text-right font-mono text-[11px] text-muted-foreground xl:table-cell">
                    {shortUuid(a.id)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-sky-600 hover:bg-sky-100 hover:text-sky-700"
                        asChild
                      >
                        <Link to={`/saloons/${a.id}`} aria-label="Detay">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-amber-600 hover:bg-amber-100 hover:text-amber-700"
                        asChild
                      >
                        <Link to={`/saloons/${a.id}/edit`} aria-label="Düzenle">
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:bg-red-100 hover:text-red-700"
                        aria-label="Sil"
                        onClick={() => setDeleteTarget({ id: a.id, name: a.name })}
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
        open={Boolean(deleteTarget)}
        title="Saloon sil"
        tone="destructive"
        description={
          deleteTarget
            ? `${deleteTarget.name} kaydı kalıcı olarak silinecek. Bu işlem geri alınamaz.`
            : undefined
        }
        confirmByTyping={deleteTarget?.name}
        confirmByTypingHint="Devam etmek için silinecek saloon adını yazın."
        confirmText="Evet, sil"
        cancelText="Vazgeç"
        loading={deleteMut.isPending}
        onCancel={() => (deleteMut.isPending ? null : setDeleteTarget(null))}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
