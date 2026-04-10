import { useState, type ReactNode } from "react";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useDeleteSaloonMutation, useSaloonQuery } from "@/hooks/use-addons";
import { AddonTypeBadge } from "./addon-type-badge";
import { formatAddonDate, parseAddonIdParam, shortUuid } from "./addon-utils";

function MetaRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-border/40 py-4 sm:grid-cols-[minmax(8rem,12rem)_1fr] sm:items-baseline sm:gap-8">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{children}</dd>
    </div>
  );
}

export default function AddonDetailPage() {
  const { id: idParam } = useParams<{ id: string }>();
  const id = parseAddonIdParam(idParam);
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { data: addon, isLoading, isError, error, refetch } = useSaloonQuery(id);
  const deleteMut = useDeleteSaloonMutation();

  const onConfirmDelete = () => {
    if (!addon) return;
    deleteMut.mutate(addon.id, {
      onSuccess: () => {
        toast.success("Saloon silindi.");
        setDeleteOpen(false);
        navigate("/saloons", { replace: true });
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : "Silme işlemi başarısız.");
      },
    });
  };

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
    <div className="mx-auto max-w-4xl space-y-10">
      <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1">
        <Link to="/saloons">
          <ArrowLeft className="h-4 w-4" />
          Listeye dön
        </Link>
      </Button>

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
        <>
          <header className="flex flex-col gap-6 border-b border-border/60 pb-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                <AnimatedGradientText className="text-3xl font-bold md:text-4xl">
                  {addon.name}
                </AnimatedGradientText>
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <AddonTypeBadge type={addon.type} />
                <span className="font-mono text-xs text-muted-foreground">{shortUuid(addon.id)}</span>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap justify-center gap-2 lg:justify-end">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/saloons/${addon.id}/edit`}>
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
              <h2 className="mb-2 text-sm font-semibold text-foreground">Kayıt bilgileri</h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Saloon özeti, icon anahtarı ve zaman bilgileri.
              </p>
              <dl>
                <MetaRow label="Saloon ID">
                  <span className="break-all font-mono text-xs">{addon.id}</span>
                </MetaRow>
                <MetaRow label="E-posta">{addon.email || "—"}</MetaRow>
                <MetaRow label="Telefon">{addon.phone || "—"}</MetaRow>
                <MetaRow label="Şehir">{addon.city || "—"}</MetaRow>
                <MetaRow label="Adres">{addon.address || "—"}</MetaRow>
                <MetaRow label="Logo">
                  {addon.logo_url ? (
                    <Avatar className="h-16 w-16 border border-border/60">
                      <AvatarImage src={addon.logo_url} alt="Salon logo" className="object-cover" />
                      <AvatarFallback>LG</AvatarFallback>
                    </Avatar>
                  ) : (
                    "—"
                  )}
                </MetaRow>
                <MetaRow label="Cover">
                  {addon.cover_url ? (
                    <div className="w-full max-w-md overflow-hidden rounded-md border border-border/60">
                      <img src={addon.cover_url} alt="Salon kapak" className="h-28 w-full object-cover" />
                    </div>
                  ) : (
                    "—"
                  )}
                </MetaRow>
                <MetaRow label="Aktiflik">{addon.is_active ? "Aktif" : "Pasif"}</MetaRow>
                <MetaRow label="Açıklama">{addon.description || "—"}</MetaRow>
                <MetaRow label="Para birimi">{String(addon.settings?.currency ?? "TRY")}</MetaRow>
                <MetaRow label="Saat dilimi">
                  {String(addon.settings?.timezone ?? "Europe/Istanbul")}
                </MetaRow>
                <MetaRow label="Randevu buffer">
                  {String(addon.settings?.booking_buffer_min ?? 15)} dk
                </MetaRow>
                <MetaRow label="Oluşturulma">{formatAddonDate(addon.created_at)}</MetaRow>
                <MetaRow label="Güncellenme">{formatAddonDate(addon.updated_at)}</MetaRow>
              </dl>
            </div>

            <aside className="border border-border/50 bg-muted/20 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Tip
              </p>
              <div className="mt-4">
                <AddonTypeBadge type={addon.type} />
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Bu kart, hızlı görsel sınıflandırma için tip bilgisini öne çıkarır.
              </p>
            </aside>
          </div>
        </>
      )}

      <ConfirmModal
        open={deleteOpen}
        title="Saloon sil"
        tone="destructive"
        description={
          addon ? `${addon.name} kaydı kalıcı olarak silinecek. Bu işlem geri alınamaz.` : undefined
        }
        confirmByTyping={addon?.name}
        confirmByTypingHint="Devam etmek için saloon adını yazın."
        confirmText="Evet, sil"
        cancelText="Vazgeç"
        loading={deleteMut.isPending}
        onCancel={() => (deleteMut.isPending ? null : setDeleteOpen(false))}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
}
