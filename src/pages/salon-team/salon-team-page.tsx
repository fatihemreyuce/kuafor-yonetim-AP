import { useState } from "react";
import { Eye, Pencil, Trash2, UserRoundCog } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeleteSalonTeamMutation, useSalonTeamQuery } from "@/hooks/use-salon-team";
import { shortId } from "./salon-team-utils";

export default function SalonTeamPage() {
  const navigate = useNavigate();
  const [target, setTarget] = useState<{ id: string; name: string } | null>(null);
  const { data = [], isLoading, isError, error, refetch } = useSalonTeamQuery();
  const deleteMut = useDeleteSalonTeamMutation();

  const onConfirmDelete = () => {
    if (!target) return;
    deleteMut.mutate(target.id, {
      onSuccess: () => {
        toast.success("Kayit silindi.");
        setTarget(null);
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : "Silme islemi basarisiz.");
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <UserRoundCog className="h-8 w-8 text-fuchsia-500" aria-hidden />
            <h1>
              <AnimatedGradientText className="text-3xl font-bold">Salon Team</AnimatedGradientText>
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">Salon personel kartlarini tek ekrandan olusturun, guncelleyin ve yonetin.</p>
        </div>
        <ShimmerButton type="button" onClick={() => navigate("/salon-team/new")} className="w-full shrink-0 sm:w-auto">
          Yeni personel
        </ShimmerButton>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/50 bg-card/30">
        {isLoading ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Kayitlar yukleniyor...</p>
        ) : isError ? (
          <div className="space-y-3 py-10 text-center">
            <p className="text-sm text-destructive">{error instanceof Error ? error.message : "Veri alinamadi."}</p>
            <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>Tekrar dene</Button>
          </div>
        ) : data.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Henuz personel kaydi yok. Yeni kayit ekleyin.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="w-14" />
                <TableHead>Ad</TableHead>
                <TableHead className="hidden md:table-cell">Unvan</TableHead>
                <TableHead className="hidden lg:table-cell">Renk</TableHead>
                <TableHead className="hidden xl:table-cell">Durum</TableHead>
                <TableHead className="hidden xl:table-cell text-right font-mono text-[10px]">ID</TableHead>
                <TableHead className="w-[140px] text-right">Islemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((m) => (
                <TableRow key={m.id} className="border-border/50">
                  <TableCell>
                    <Avatar className="h-9 w-9 border border-fuchsia-400/20 shadow-sm">
                      <AvatarImage src={m.avatar_url ?? undefined} alt="" />
                      <AvatarFallback>{(m.display_name ?? "?").slice(0, 1).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link to={`/salon-team/${m.id}`} className="text-foreground underline-offset-4 hover:underline">{m.display_name || "Isimsiz"}</Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{m.title || "—"}</TableCell>
                  <TableCell className="hidden lg:table-cell">{m.color_key || "—"}</TableCell>
                  <TableCell className="hidden xl:table-cell">{m.is_active ? "Aktif" : "Pasif"}</TableCell>
                  <TableCell className="hidden xl:table-cell text-right font-mono text-[11px] text-muted-foreground">{shortId(m.id)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-sky-600 hover:bg-sky-100 hover:text-sky-700" asChild><Link to={`/salon-team/${m.id}`} aria-label="Detay"><Eye className="h-4 w-4" /></Link></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:bg-amber-100 hover:text-amber-700" asChild><Link to={`/salon-team/${m.id}/edit`} aria-label="Duzenle"><Pencil className="h-4 w-4" /></Link></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-100 hover:text-red-700" aria-label="Sil" onClick={() => setTarget({ id: m.id, name: m.display_name || shortId(m.id) })}><Trash2 className="h-4 w-4" /></Button>
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
        title="Personeli sil"
        tone="destructive"
        description={target ? `${target.name} kaydi kalici olarak silinecek. Bu islem geri alinamaz.` : undefined}
        confirmByTyping={target?.name}
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
