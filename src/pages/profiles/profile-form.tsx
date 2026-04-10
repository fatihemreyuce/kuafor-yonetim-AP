import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AvatarDropzone } from "@/components/ui/avatar-dropzone";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import {
  useCreateProfileMutation,
  useUpdateProfileMutation,
} from "@/hooks/use-profiles";
import type { Profile, UserRole } from "@/types/profile.types";
import { USER_ROLES, USER_ROLE_LABELS } from "@/types/profile.types";

type FormState = {
  full_name: string;
  role: UserRole;
  phone: string;
  avatar_url: string;
};

const emptyCreate: FormState = {
  full_name: "",
  role: "user",
  phone: "",
  avatar_url: "",
};

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function initials(fullName: string) {
  const p = fullName.trim().split(/\s+/).filter(Boolean);
  if (p.length === 0) return "?";
  if (p.length === 1) return p[0]!.slice(0, 2).toUpperCase();
  return (p[0]![0] + p[p.length - 1]![0]).toUpperCase();
}

export function ProfileCreateForm({
  onSuccessNavigate,
  onCancel,
}: {
  onSuccessNavigate: (created: Profile) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(emptyCreate);
  const mut = useCreateProfileMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const full_name = form.full_name.trim();
    if (!full_name) {
      toast.error("Ad soyad gerekli.");
      return;
    }

    mut.mutate(
      {
        full_name,
        role: form.role,
        phone: form.phone.trim() || null,
        avatar_url: form.avatar_url.trim() || null,
      },
      {
        onSuccess: (created) => {
          toast.success("Profil oluşturuldu.");
          onSuccessNavigate(created);
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : "Kayıt başarısız.");
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl space-y-0">
      <header className="border-b border-border/60 pb-8">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          <AnimatedGradientText className="text-2xl font-bold md:text-3xl">
            Yeni kullanıcı
          </AnimatedGradientText>
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Profil <code className="rounded bg-muted px-1.5 py-0.5 text-xs">id</code> kayıt
          sırasında otomatik atanır. Aşağıdaki alanları doldurun.
        </p>
      </header>

      <div className="grid gap-12 pt-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="space-y-12">
          <FormSection
            title="Kimlik ve rol"
            description="Listede ve yetkilendirmede görünecek temel bilgiler."
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="pf-full_name">Ad soyad</Label>
                <Input
                  id="pf-full_name"
                  value={form.full_name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, full_name: e.target.value }))
                  }
                  required
                  disabled={mut.isPending}
                  className="max-w-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Rol</Label>
                <Select
                  value={form.role}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, role: v as UserRole }))
                  }
                  disabled={mut.isPending}
                >
                  <SelectTrigger className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {USER_ROLE_LABELS[r]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </FormSection>

          <FormSection
            title="İletişim ve avatar"
            description="İsteğe bağlı; daha sonra da güncelleyebilirsiniz."
          >
            <div className="grid max-w-2xl gap-6">
              <div className="space-y-2">
                <Label htmlFor="pf-phone">Telefon</Label>
                <Input
                  id="pf-phone"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+90 …"
                  disabled={mut.isPending}
                />
              </div>
              <AvatarDropzone
                id="pf-avatar"
                label="Profil fotoğrafı"
                description="Sürükleyip bırakın veya dosya seçin."
                value={form.avatar_url}
                onChange={(avatar_url) => setForm((f) => ({ ...f, avatar_url }))}
                disabled={mut.isPending}
              />
            </div>
          </FormSection>
        </div>

        <aside className="border border-border/50 bg-muted/20 px-5 py-6 lg:sticky lg:top-24">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Canlı önizleme
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Avatar className="h-14 w-14 border border-border/60">
              <AvatarImage src={form.avatar_url || undefined} alt="" />
              <AvatarFallback>{initials(form.full_name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {form.full_name.trim() || "Yeni kullanıcı"}
              </p>
              <p className="text-xs text-muted-foreground">{USER_ROLE_LABELS[form.role]}</p>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-14 flex flex-col-reverse gap-3 border-t border-border/60 pt-8 sm:flex-row sm:items-center sm:justify-end">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={mut.isPending}
          className="sm:mr-auto"
        >
          Vazgeç
        </Button>
        <ShimmerButton type="submit" disabled={mut.isPending} className="min-w-[9rem]">
          {mut.isPending ? "Kaydediliyor…" : "Oluştur"}
        </ShimmerButton>
      </div>
    </form>
  );
}

export function ProfileEditForm({
  profile,
  onSuccessNavigate,
  onCancel,
}: {
  profile: Profile;
  onSuccessNavigate: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormState>({
    full_name: profile.full_name,
    role: profile.role,
    phone: profile.phone ?? "",
    avatar_url: profile.avatar_url ?? "",
  });
  const mut = useUpdateProfileMutation();

  useEffect(() => {
    setForm({
      full_name: profile.full_name,
      role: profile.role,
      phone: profile.phone ?? "",
      avatar_url: profile.avatar_url ?? "",
    });
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const full_name = form.full_name.trim();
    if (!full_name) {
      toast.error("Ad soyad gerekli.");
      return;
    }

    mut.mutate(
      {
        id: profile.id,
        patch: {
          full_name,
          role: form.role,
          phone: form.phone.trim() || null,
          avatar_url: form.avatar_url.trim() || null,
        },
      },
      {
        onSuccess: () => {
          toast.success("Profil güncellendi.");
          onSuccessNavigate();
        },
        onError: (err) => {
          toast.error(
            err instanceof Error ? err.message : "Güncelleme başarısız.",
          );
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl space-y-0">
      <header className="border-b border-border/60 pb-8">
        <h2 className="text-2xl font-bold tracking-tight">Profili düzenle</h2>
        <p className="mt-2 break-all font-mono text-xs text-muted-foreground">
          {profile.id}
        </p>
      </header>

      <div className="grid gap-12 pt-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="space-y-12">
          <FormSection title="Kimlik ve rol">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="pf2-full_name">Ad soyad</Label>
                <Input
                  id="pf2-full_name"
                  value={form.full_name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, full_name: e.target.value }))
                  }
                  required
                  disabled={mut.isPending}
                  className="max-w-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Rol</Label>
                <Select
                  value={form.role}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, role: v as UserRole }))
                  }
                  disabled={mut.isPending}
                >
                  <SelectTrigger className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {USER_ROLE_LABELS[r]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </FormSection>

          <FormSection title="İletişim ve avatar">
            <div className="grid max-w-2xl gap-6">
              <div className="space-y-2">
                <Label htmlFor="pf2-phone">Telefon</Label>
                <Input
                  id="pf2-phone"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  disabled={mut.isPending}
                />
              </div>
              <AvatarDropzone
                id="pf2-avatar"
                label="Profil fotoğrafı"
                description="Sürükleyip bırakın veya dosya seçin."
                value={form.avatar_url}
                onChange={(avatar_url) => setForm((f) => ({ ...f, avatar_url }))}
                disabled={mut.isPending}
              />
            </div>
          </FormSection>
        </div>

        <aside className="border border-border/50 bg-muted/20 px-5 py-6 lg:sticky lg:top-24">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Canlı önizleme
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Avatar className="h-14 w-14 border border-border/60">
              <AvatarImage src={form.avatar_url || undefined} alt="" />
              <AvatarFallback>{initials(form.full_name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {form.full_name.trim() || "İsimsiz kullanıcı"}
              </p>
              <p className="text-xs text-muted-foreground">{USER_ROLE_LABELS[form.role]}</p>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-14 flex flex-col-reverse gap-3 border-t border-border/60 pt-8 sm:flex-row sm:items-center sm:justify-end">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={mut.isPending}
          className="sm:mr-auto"
        >
          Vazgeç
        </Button>
        <ShimmerButton type="submit" disabled={mut.isPending} className="min-w-[9rem]">
          {mut.isPending ? "Kaydediliyor…" : "Kaydet"}
        </ShimmerButton>
      </div>
    </form>
  );
}
