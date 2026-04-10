import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { AvatarDropzone } from "@/components/ui/avatar-dropzone";
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
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateSaloonMutation,
  useUpdateSaloonMutation,
} from "@/hooks/use-addons";
import type { Addon, AddonType } from "@/types/addon.types";
import { ADDON_TYPES, ADDON_TYPE_LABELS } from "@/types/addon.types";
import { AddonTypeBadge } from "./addon-type-badge";

type FormState = {
  name: string;
  type: AddonType;
  icon: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  logo_url: string;
  cover_url: string;
  is_active: boolean;
  settings_currency: string;
  settings_timezone: string;
  settings_booking_buffer_min: string;
};

const emptyCreate: FormState = {
  name: "",
  type: "editing",
  icon: "",
  description: "",
  address: "",
  city: "",
  phone: "",
  email: "",
  logo_url: "",
  cover_url: "",
  is_active: true,
  settings_currency: "TRY",
  settings_timezone: "Europe/Istanbul",
  settings_booking_buffer_min: "15",
};

function buildSettings(form: FormState): Record<string, unknown> | null {
  const bookingBuffer = Number(form.settings_booking_buffer_min);
  if (!Number.isFinite(bookingBuffer) || bookingBuffer < 0) {
    return null;
  }
  return {
    currency: form.settings_currency.trim() || "TRY",
    timezone: form.settings_timezone.trim() || "Europe/Istanbul",
    booking_buffer_min: Math.round(bookingBuffer),
  };
}

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
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function AddonCreateForm({
  onSuccessNavigate,
  onCancel,
}: {
  onSuccessNavigate: (created: Addon) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(emptyCreate);
  const mut = useCreateSaloonMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) {
      toast.error("Saloon adı gerekli.");
      return;
    }
    const settings = buildSettings(form);
    if (!settings) {
      toast.error("Booking buffer değeri geçerli bir sayı olmalı.");
      return;
    }

    mut.mutate(
      {
        name,
        type: form.type,
        icon: form.icon.trim() || null,
        description: form.description.trim() || null,
        address: form.address.trim() || null,
        city: form.city.trim() || null,
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        logo_url: form.logo_url.trim() || null,
        cover_url: form.cover_url.trim() || null,
        is_active: form.is_active,
        settings,
      },
      {
        onSuccess: (created) => {
          toast.success("Saloon oluşturuldu.");
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
            Yeni saloon
          </AnimatedGradientText>
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Saloon temel bilgilerini, iletişim alanlarını ve ayarları doldurun.
        </p>
      </header>

      <div className="grid gap-12 pt-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="space-y-12">
          <FormSection title="Temel bilgiler" description="Liste ve detayda gösterilecek alanlar.">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="ad-name">Saloon adı</Label>
                <Input
                  id="ad-name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  disabled={mut.isPending}
                  className="max-w-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Tip</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm((f) => ({ ...f, type: v as AddonType }))}
                  disabled={mut.isPending}
                >
                  <SelectTrigger className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ADDON_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {ADDON_TYPE_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ad-icon">Icon anahtarı</Label>
                <Input
                  id="ad-icon"
                  value={form.icon}
                  onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                  placeholder="sparkles, wand, scissors..."
                  disabled={mut.isPending}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="ad-desc">Açıklama</Label>
                <Textarea
                  id="ad-desc"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Saloon hakkında kısa açıklama."
                  disabled={mut.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ad-address">Adres</Label>
                <Input
                  id="ad-address"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  disabled={mut.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ad-city">Şehir</Label>
                <Input
                  id="ad-city"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  disabled={mut.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ad-phone">Telefon</Label>
                <Input
                  id="ad-phone"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  disabled={mut.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ad-email">E-posta</Label>
                <Input
                  id="ad-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  disabled={mut.isPending}
                />
              </div>
              <AvatarDropzone
                id="ad-logo"
                label="Logo"
                description="Logo görselini sürükleyip bırakın veya dosya seçin."
                value={form.logo_url}
                onChange={(logo_url) => setForm((f) => ({ ...f, logo_url }))}
                disabled={mut.isPending}
                className="sm:col-span-2"
              />
              <AvatarDropzone
                id="ad-cover"
                label="Kapak görseli"
                description="Cover görselini sürükleyip bırakın veya dosya seçin."
                value={form.cover_url}
                onChange={(cover_url) => setForm((f) => ({ ...f, cover_url }))}
                disabled={mut.isPending}
                className="sm:col-span-2"
              />
              <div className="space-y-2">
                <Label htmlFor="ad-settings-currency">Para birimi</Label>
                <Input
                  id="ad-settings-currency"
                  value={form.settings_currency}
                  onChange={(e) => setForm((f) => ({ ...f, settings_currency: e.target.value }))}
                  disabled={mut.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ad-settings-timezone">Saat dilimi</Label>
                <Input
                  id="ad-settings-timezone"
                  value={form.settings_timezone}
                  onChange={(e) => setForm((f) => ({ ...f, settings_timezone: e.target.value }))}
                  disabled={mut.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ad-settings-buffer">Randevu buffer (dk)</Label>
                <Input
                  id="ad-settings-buffer"
                  type="number"
                  min={0}
                  value={form.settings_booking_buffer_min}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, settings_booking_buffer_min: e.target.value }))
                  }
                  disabled={mut.isPending}
                />
              </div>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
                disabled={mut.isPending}
                className="sm:col-span-2 inline-flex w-fit items-center gap-3 rounded-full border border-border/70 bg-muted/30 px-3 py-1.5 text-sm"
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${form.is_active ? "bg-emerald-500" : "bg-zinc-400"}`}
                />
                {form.is_active ? "Aktif salon" : "Pasif salon"}
              </button>
            </div>
          </FormSection>
        </div>

        <aside className="border border-border/50 bg-muted/20 px-5 py-6 lg:sticky lg:top-24">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Canlı önizleme
          </p>
          <div className="mt-4 space-y-3">
            <p className="text-sm font-semibold text-foreground">{form.name.trim() || "Yeni saloon"}</p>
            <AddonTypeBadge type={form.type} />
            <p className="font-mono text-xs text-muted-foreground">{form.icon.trim() || "icon: —"}</p>
            <p className="text-xs text-muted-foreground">{form.city.trim() || "Sehir: —"}</p>
            <p className="text-xs text-muted-foreground">{form.phone.trim() || "Telefon: —"}</p>
            <p className="text-xs text-muted-foreground">
              Durum: {form.is_active ? "Aktif" : "Pasif"}
            </p>
            <p className="text-xs text-muted-foreground">
              {form.settings_currency} · {form.settings_timezone} · {form.settings_booking_buffer_min} dk
            </p>
            <p className="line-clamp-4 text-xs text-muted-foreground">
              {form.description.trim() || "Açıklama girilmedi."}
            </p>
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

export function AddonEditForm({
  addon,
  onSuccessNavigate,
  onCancel,
}: {
  addon: Addon;
  onSuccessNavigate: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormState>({
    name: addon.name,
    type: addon.type,
    icon: addon.icon ?? "",
    description: addon.description ?? "",
    address: addon.address ?? "",
    city: addon.city ?? "",
    phone: addon.phone ?? "",
    email: addon.email ?? "",
    logo_url: addon.logo_url ?? "",
    cover_url: addon.cover_url ?? "",
    is_active: addon.is_active,
    settings_currency:
      typeof addon.settings?.currency === "string" ? addon.settings.currency : "TRY",
    settings_timezone:
      typeof addon.settings?.timezone === "string"
        ? addon.settings.timezone
        : "Europe/Istanbul",
    settings_booking_buffer_min:
      typeof addon.settings?.booking_buffer_min === "number"
        ? String(addon.settings.booking_buffer_min)
        : "15",
  });
  const mut = useUpdateSaloonMutation();

  useEffect(() => {
    setForm({
      name: addon.name,
      type: addon.type,
      icon: addon.icon ?? "",
      description: addon.description ?? "",
      address: addon.address ?? "",
      city: addon.city ?? "",
      phone: addon.phone ?? "",
      email: addon.email ?? "",
      logo_url: addon.logo_url ?? "",
      cover_url: addon.cover_url ?? "",
      is_active: addon.is_active,
      settings_currency:
        typeof addon.settings?.currency === "string" ? addon.settings.currency : "TRY",
      settings_timezone:
        typeof addon.settings?.timezone === "string"
          ? addon.settings.timezone
          : "Europe/Istanbul",
      settings_booking_buffer_min:
        typeof addon.settings?.booking_buffer_min === "number"
          ? String(addon.settings.booking_buffer_min)
          : "15",
    });
  }, [addon]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) {
      toast.error("Saloon adı gerekli.");
      return;
    }
    const settings = buildSettings(form);
    if (!settings) {
      toast.error("Booking buffer değeri geçerli bir sayı olmalı.");
      return;
    }

    mut.mutate(
      {
        id: addon.id,
        patch: {
          name,
          type: form.type,
          icon: form.icon.trim() || null,
          description: form.description.trim() || null,
          address: form.address.trim() || null,
          city: form.city.trim() || null,
          phone: form.phone.trim() || null,
          email: form.email.trim() || null,
          logo_url: form.logo_url.trim() || null,
          cover_url: form.cover_url.trim() || null,
          is_active: form.is_active,
          settings,
        },
      },
      {
        onSuccess: () => {
          toast.success("Saloon güncellendi.");
          onSuccessNavigate();
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : "Güncelleme başarısız.");
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl space-y-0">
      <header className="border-b border-border/60 pb-8">
        <h2 className="text-2xl font-bold tracking-tight">Saloon düzenle</h2>
        <p className="mt-2 break-all font-mono text-xs text-muted-foreground">{addon.id}</p>
      </header>

      <div className="grid gap-12 pt-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="space-y-12">
          <FormSection title="Temel bilgiler">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="ad2-name">Saloon adı</Label>
                <Input
                  id="ad2-name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  disabled={mut.isPending}
                  className="max-w-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Tip</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm((f) => ({ ...f, type: v as AddonType }))}
                  disabled={mut.isPending}
                >
                  <SelectTrigger className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ADDON_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {ADDON_TYPE_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ad2-icon">Icon anahtarı</Label>
                <Input
                  id="ad2-icon"
                  value={form.icon}
                  onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                  disabled={mut.isPending}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="ad2-desc">Açıklama</Label>
                <Textarea
                  id="ad2-desc"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  disabled={mut.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ad2-address">Adres</Label>
                <Input
                  id="ad2-address"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  disabled={mut.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ad2-city">Şehir</Label>
                <Input
                  id="ad2-city"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  disabled={mut.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ad2-phone">Telefon</Label>
                <Input
                  id="ad2-phone"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  disabled={mut.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ad2-email">E-posta</Label>
                <Input
                  id="ad2-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  disabled={mut.isPending}
                />
              </div>
              <AvatarDropzone
                id="ad2-logo"
                label="Logo"
                description="Logo görselini sürükleyip bırakın veya dosya seçin."
                value={form.logo_url}
                onChange={(logo_url) => setForm((f) => ({ ...f, logo_url }))}
                disabled={mut.isPending}
                className="sm:col-span-2"
              />
              <AvatarDropzone
                id="ad2-cover"
                label="Kapak görseli"
                description="Cover görselini sürükleyip bırakın veya dosya seçin."
                value={form.cover_url}
                onChange={(cover_url) => setForm((f) => ({ ...f, cover_url }))}
                disabled={mut.isPending}
                className="sm:col-span-2"
              />
              <div className="space-y-2">
                <Label htmlFor="ad2-settings-currency">Para birimi</Label>
                <Input
                  id="ad2-settings-currency"
                  value={form.settings_currency}
                  onChange={(e) => setForm((f) => ({ ...f, settings_currency: e.target.value }))}
                  disabled={mut.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ad2-settings-timezone">Saat dilimi</Label>
                <Input
                  id="ad2-settings-timezone"
                  value={form.settings_timezone}
                  onChange={(e) => setForm((f) => ({ ...f, settings_timezone: e.target.value }))}
                  disabled={mut.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ad2-settings-buffer">Randevu buffer (dk)</Label>
                <Input
                  id="ad2-settings-buffer"
                  type="number"
                  min={0}
                  value={form.settings_booking_buffer_min}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, settings_booking_buffer_min: e.target.value }))
                  }
                  disabled={mut.isPending}
                />
              </div>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
                disabled={mut.isPending}
                className="sm:col-span-2 inline-flex w-fit items-center gap-3 rounded-full border border-border/70 bg-muted/30 px-3 py-1.5 text-sm"
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${form.is_active ? "bg-emerald-500" : "bg-zinc-400"}`}
                />
                {form.is_active ? "Aktif salon" : "Pasif salon"}
              </button>
            </div>
          </FormSection>
        </div>

        <aside className="border border-border/50 bg-muted/20 px-5 py-6 lg:sticky lg:top-24">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Canlı önizleme
          </p>
          <div className="mt-4 space-y-3">
            <p className="text-sm font-semibold text-foreground">{form.name.trim() || "İsimsiz saloon"}</p>
            <AddonTypeBadge type={form.type} />
            <p className="font-mono text-xs text-muted-foreground">{form.icon.trim() || "icon: —"}</p>
            <p className="text-xs text-muted-foreground">{form.city.trim() || "Sehir: —"}</p>
            <p className="text-xs text-muted-foreground">{form.phone.trim() || "Telefon: —"}</p>
            <p className="text-xs text-muted-foreground">
              Durum: {form.is_active ? "Aktif" : "Pasif"}
            </p>
            <p className="text-xs text-muted-foreground">
              {form.settings_currency} · {form.settings_timezone} · {form.settings_booking_buffer_min} dk
            </p>
            <p className="line-clamp-4 text-xs text-muted-foreground">
              {form.description.trim() || "Açıklama girilmedi."}
            </p>
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
