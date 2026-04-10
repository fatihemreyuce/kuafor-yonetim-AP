import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2, Users } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDeleteProfileMutation, useProfilesQuery } from "@/hooks/use-profiles";
import { ProfileRoleBadge } from "./profile-role-badge";
import { shortUuid } from "./profile-utils";

function initials(fullName: string) {
  const p = fullName.trim().split(/\s+/).filter(Boolean);
  if (p.length === 0) return "?";
  if (p.length === 1) return p[0]!.slice(0, 2).toUpperCase();
  return (p[0]![0] + p[p.length - 1]![0]).toUpperCase();
}

export default function ProfilesPage() {
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; full_name: string } | null>(null);
  const { data: profiles = [], isLoading, isError, error, refetch } =
    useProfilesQuery();
  const deleteMut = useDeleteProfileMutation();

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteMut.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Profil silindi.");
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
              <Users className="h-8 w-8 text-sky-500" aria-hidden />
              <h1>
                <AnimatedGradientText className="text-3xl font-bold">
                  Kullanıcılar
                </AnimatedGradientText>
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Tüm kullanıcıları buradan görüntüleyebilir, profil detaylarını inceleyebilir ve
              gerekli güncellemeleri hızlıca yapabilirsiniz.
            </p>
          </div>
          <ShimmerButton
            type="button"
            onClick={() => navigate("/profiles/new")}
            className="w-full shrink-0 sm:w-auto"
          >
            Yeni kullanıcı
          </ShimmerButton>
        </div>

        <div className="overflow-hidden rounded-xl border border-border/50 bg-card/30">
            {isLoading ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                Profiller yükleniyor…
              </p>
            ) : isError ? (
              <div className="space-y-3 py-10 text-center">
                <p className="text-sm text-destructive">
                  {error instanceof Error ? error.message : "Veri alınamadı."}
                </p>
                <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
                  Tekrar dene
                </Button>
              </div>
            ) : profiles.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                Henüz profil yok. Yeni kullanıcı ekleyerek başlayın.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border/60 hover:bg-transparent">
                    <TableHead className="w-14"> </TableHead>
                    <TableHead>Ad soyad</TableHead>
                    <TableHead className="hidden md:table-cell">Rol</TableHead>
                    <TableHead className="hidden lg:table-cell">Telefon</TableHead>
                    <TableHead className="hidden w-28 text-right font-mono text-[10px] xl:table-cell">
                      ID
                    </TableHead>
                    <TableHead className="w-[140px] text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((p) => (
                    <TableRow key={p.id} className="border-border/50">
                      <TableCell>
                        <Avatar className="h-9 w-9 border border-sky-400/20 shadow-sm">
                          <AvatarImage src={p.avatar_url ?? undefined} alt="" />
                          <AvatarFallback className="text-[10px]">
                            {initials(p.full_name)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        <Link
                          to={`/profiles/${p.id}`}
                          className="text-foreground underline-offset-4 hover:underline"
                        >
                          {p.full_name}
                        </Link>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <ProfileRoleBadge role={p.role} />
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground lg:table-cell">
                        {p.phone || "—"}
                      </TableCell>
                      <TableCell className="hidden text-right font-mono text-[11px] text-muted-foreground xl:table-cell">
                        {shortUuid(p.id)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-sky-600 hover:bg-sky-100 hover:text-sky-700"
                            asChild
                          >
                            <Link to={`/profiles/${p.id}`} aria-label="Detay">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-amber-600 hover:bg-amber-100 hover:text-amber-700"
                            asChild
                          >
                            <Link to={`/profiles/${p.id}/edit`} aria-label="Düzenle">
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:bg-red-100 hover:text-red-700"
                            aria-label="Sil"
                            onClick={() =>
                              setDeleteTarget({ id: p.id, full_name: p.full_name })
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
        open={Boolean(deleteTarget)}
        title="Profili sil"
        tone="destructive"
        description={
          deleteTarget
            ? `${deleteTarget.full_name} kaydı kalıcı olarak silinecek. Bu işlem geri alınamaz.`
            : undefined
        }
        confirmByTyping={deleteTarget?.full_name}
        confirmByTypingHint="Devam etmek için silinecek kullanıcının adını yazın."
        confirmText="Evet, sil"
        cancelText="Vazgeç"
        loading={deleteMut.isPending}
        onCancel={() => (deleteMut.isPending ? null : setDeleteTarget(null))}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
