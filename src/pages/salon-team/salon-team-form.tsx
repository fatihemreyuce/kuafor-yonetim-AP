import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AvatarDropzone } from "@/components/ui/avatar-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { useSaloonsQuery } from "@/hooks/use-addons";
import { useProfilesQuery } from "@/hooks/use-profiles";
import { useCreateSalonTeamMutation, useUpdateSalonTeamMutation } from "@/hooks/use-salon-team";
import type { SalonTeamMember } from "@/types/salon-team.types";

type FormState = {
  profile_id: string;
  salon_id: string;
  display_name: string;
  title: string;
  avatar_url: string;
  color_key: string;
  is_active: boolean;
};

const emptyForm: FormState = {
  profile_id: "",
  salon_id: "",
  display_name: "",
  title: "",
  avatar_url: "",
  color_key: "indigo",
  is_active: true,
};

function TeamFormShell({
  form,
  setForm,
  isPending,
  onCancel,
  onSubmit,
  submitText,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  submitText: string;
}) {
  const { data: profiles = [] } = useProfilesQuery();
  const { data: saloons = [] } = useSaloonsQuery();

  return (
    <form onSubmit={onSubmit} className="max-w-5xl space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Profil</Label>
          <Select
            value={form.profile_id}
            onValueChange={(v) => {
              const selected = profiles.find((p) => p.id === v);
              setForm((f) => ({ ...f, profile_id: v, display_name: selected?.full_name ?? f.display_name }));
            }}
            disabled={isPending}
          >
            <SelectTrigger><SelectValue placeholder="Profil secin" /></SelectTrigger>
            <SelectContent>
              {profiles.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Salon</Label>
          <Select value={form.salon_id} onValueChange={(v) => setForm((f) => ({ ...f, salon_id: v }))} disabled={isPending}>
            <SelectTrigger><SelectValue placeholder="Salon secin" /></SelectTrigger>
            <SelectContent>
              {saloons.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="st-display-name">Gorunen ad</Label>
          <Input id="st-display-name" value={form.display_name} onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))} disabled={isPending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="st-title">Unvan</Label>
          <Input id="st-title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} disabled={isPending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="st-color">Renk anahtari</Label>
          <Input id="st-color" value={form.color_key} onChange={(e) => setForm((f) => ({ ...f, color_key: e.target.value }))} disabled={isPending} />
        </div>
        <button
          type="button"
          onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
          disabled={isPending}
          className="inline-flex w-fit items-center gap-3 rounded-full border border-border/70 bg-muted/30 px-3 py-1.5 text-sm"
        >
          <span className={`h-2.5 w-2.5 rounded-full ${form.is_active ? "bg-emerald-500" : "bg-zinc-400"}`} />
          {form.is_active ? "Aktif" : "Pasif"}
        </button>
        <AvatarDropzone
          id="st-avatar"
          label="Profil gorseli"
          description="Gorseli surukleyip birakin veya dosya secin."
          value={form.avatar_url}
          onChange={(avatar_url) => setForm((f) => ({ ...f, avatar_url }))}
          disabled={isPending}
          className="sm:col-span-2"
        />
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-8 sm:flex-row sm:items-center sm:justify-end">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isPending} className="sm:mr-auto">Vazgec</Button>
        <ShimmerButton type="submit" disabled={isPending} className="min-w-[10rem]">{submitText}</ShimmerButton>
      </div>
    </form>
  );
}

export function SalonTeamCreateForm({ onSuccessNavigate, onCancel }: { onSuccessNavigate: (created: SalonTeamMember) => void; onCancel: () => void; }) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const mut = useCreateSalonTeamMutation();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    mut.mutate(
      {
        profile_id: form.profile_id || null,
        salon_id: form.salon_id || null,
        display_name: form.display_name.trim() || null,
        title: form.title.trim() || null,
        avatar_url: form.avatar_url.trim() || null,
        color_key: form.color_key.trim() || null,
        is_active: form.is_active,
      },
      {
        onSuccess: (created) => {
          toast.success("Personel kaydi olusturuldu.");
          onSuccessNavigate(created);
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : "Kayit basarisiz.");
        },
      },
    );
  };

  return <TeamFormShell form={form} setForm={setForm} isPending={mut.isPending} onCancel={onCancel} onSubmit={submit} submitText={mut.isPending ? "Kaydediliyor..." : "Olustur"} />;
}

export function SalonTeamEditForm({ item, onSuccessNavigate, onCancel }: { item: SalonTeamMember; onSuccessNavigate: () => void; onCancel: () => void; }) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const mut = useUpdateSalonTeamMutation();

  useEffect(() => {
    setForm({
      profile_id: item.profile_id ?? "",
      salon_id: item.salon_id ?? "",
      display_name: item.display_name ?? "",
      title: item.title ?? "",
      avatar_url: item.avatar_url ?? "",
      color_key: item.color_key ?? "indigo",
      is_active: item.is_active,
    });
  }, [item]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    mut.mutate(
      {
        id: item.id,
        patch: {
          profile_id: form.profile_id || null,
          salon_id: form.salon_id || null,
          display_name: form.display_name.trim() || null,
          title: form.title.trim() || null,
          avatar_url: form.avatar_url.trim() || null,
          color_key: form.color_key.trim() || null,
          is_active: form.is_active,
        },
      },
      {
        onSuccess: () => {
          toast.success("Personel kaydi guncellendi.");
          onSuccessNavigate();
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : "Guncelleme basarisiz.");
        },
      },
    );
  };

  return <TeamFormShell form={form} setForm={setForm} isPending={mut.isPending} onCancel={onCancel} onSubmit={submit} submitText={mut.isPending ? "Kaydediliyor..." : "Kaydet"} />;
}
