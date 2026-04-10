import { useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useDeleteProfileMutation, useProfileQuery } from "@/hooks/use-profiles";
import { ProfileRoleBadge } from "./profile-role-badge";
import { formatProfileDate, parseProfileIdParam, shortUuid } from "./profile-utils";

function initials(fullName: string) {
  const p = fullName.trim().split(/\s+/).filter(Boolean);
  if (p.length === 0) return "?";
  if (p.length === 1) return p[0]!.slice(0, 2).toUpperCase();
  return (p[0]![0] + p[p.length - 1]![0]).toUpperCase();
}

function MetaRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1 border-b border-border/40 py-4 sm:grid-cols-[minmax(8rem,12rem)_1fr] sm:items-baseline sm:gap-8">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm text-foreground">{children}</dd>
    </div>
  );
}

export default function ProfileDetailPage() {
  const { id: idParam } = useParams<{ id: string }>();
  const id = parseProfileIdParam(idParam);
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { data: profile, isLoading, isError, error, refetch } = useProfileQuery(id);
  const deleteMut = useDeleteProfileMutation();

  const onConfirmDelete = () => {
    if (!profile) return;
    deleteMut.mutate(profile.id, {
      onSuccess: () => {
        toast.success("Profil silindi.");
        setDeleteOpen(false);
        navigate("/profiles", { replace: true });
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : "Silme işlemi başarısız.");
      },
    });
  };

  if (id == null) {
    return (
      <div className="mx-auto max-w-xl p-6 text-center">
        <p className="text-sm text-destructive">Geçersiz profil adresi.</p>
        <Button asChild className="mt-4" variant="outline">
          <Link to="/profiles">Listeye dön</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1">
        <Link to="/profiles">
          <ArrowLeft className="h-4 w-4" />
          Listeye dön
        </Link>
      </Button>

      {isLoading ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Yükleniyor…
        </p>
      ) : isError ? (
        <div className="space-y-3 py-12 text-center">
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Profil yüklenemedi."}
          </p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Tekrar dene
          </Button>
        </div>
      ) : !profile ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Profil bulunamadı.
        </p>
      ) : (
        <>
          <header className="flex flex-col gap-6 border-b border-border/60 pb-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
              <Avatar className="h-20 w-20 border border-border/60 shadow-sm sm:h-24 sm:w-24">
                <AvatarImage src={profile.avatar_url ?? undefined} alt="" />
                <AvatarFallback className="text-lg">
                  {initials(profile.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-3 text-center sm:text-left">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  <AnimatedGradientText className="text-3xl font-bold md:text-4xl">
                    {profile.full_name}
                  </AnimatedGradientText>
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <ProfileRoleBadge role={profile.role} />
                  <span className="font-mono text-xs text-muted-foreground">
                    {shortUuid(profile.id)}
                  </span>
                </div>
                {profile.user_id && profile.user_id !== profile.id ? (
                  <p className="break-all font-mono text-[11px] text-muted-foreground">
                    user_id: {profile.user_id}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap justify-center gap-2 lg:justify-end">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/profiles/${profile.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Düzenle
                </Link>
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Sil
              </Button>
            </div>
          </header>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div>
              <h2 className="mb-2 text-sm font-semibold text-foreground">
                Kayıt bilgileri
              </h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Profil özeti ve zaman bilgileri.
              </p>
              <dl>
                <MetaRow label="Profil ID">
                  <span className="break-all font-mono text-xs">{profile.id}</span>
                </MetaRow>
                <MetaRow label="Telefon">{profile.phone || "—"}</MetaRow>
                <MetaRow label="Oluşturulma">
                  {formatProfileDate(profile.created_at)}
                </MetaRow>
                <MetaRow label="Güncellenme">
                  {formatProfileDate(profile.updated_at)}
                </MetaRow>
              </dl>
            </div>

            <aside className="border border-border/50 bg-muted/20 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Profil fotoğrafı
              </p>
              <Avatar className="mt-4 h-24 w-24 border border-border/60">
                <AvatarImage src={profile.avatar_url ?? undefined} alt="" />
                <AvatarFallback>{initials(profile.full_name)}</AvatarFallback>
              </Avatar>
              <p className="mt-4 text-xs text-muted-foreground">
                Avatar bağlantısı metin olarak gösterilmez.
              </p>
            </aside>
          </div>
        </>
      )}

      <ConfirmModal
        open={deleteOpen}
        title="Profili sil"
        tone="destructive"
        description={
          profile
            ? `${profile.full_name} kaydı kalıcı olarak silinecek. Bu işlem geri alınamaz.`
            : undefined
        }
        confirmByTyping={profile?.full_name}
        confirmByTypingHint="Devam etmek için kullanıcının adını yazın."
        confirmText="Evet, sil"
        cancelText="Vazgeç"
        loading={deleteMut.isPending}
        onCancel={() => (deleteMut.isPending ? null : setDeleteOpen(false))}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
}
