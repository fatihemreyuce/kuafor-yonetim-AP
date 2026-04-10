import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSaloonsQuery } from "@/hooks/use-addons";
import {
  useCreateRevenueSummaryMutation,
  useUpdateRevenueSummaryMutation,
} from "@/hooks/use-salon-revenue-summary";
import type { SalonRevenueSummary } from "@/types/salon-revenue-summary.types";

type FormState = {
  salon_id: string;
  salon_name: string;
  month: string;
  payment_count: string;
  total_revenue: string;
  avg_payment: string;
  currency: string;
  description: string;
};

const emptyForm: FormState = {
  salon_id: "",
  salon_name: "",
  month: "",
  payment_count: "",
  total_revenue: "",
  avg_payment: "",
  currency: "TRY",
  description: "",
};

function toNum(value: string): number | null {
  const v = value.trim();
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function toMonthTimestamp(value: string): string | null {
  const v = value.trim();
  if (!v) return null;
  if (/^\d{4}-\d{2}$/.test(v)) {
    return `${v}-01T00:00:00.000Z`;
  }
  return v;
}

export function RevenueSummaryCreateForm({
  onSuccessNavigate,
  onCancel,
}: {
  onSuccessNavigate: (created: SalonRevenueSummary) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const { data: saloons = [] } = useSaloonsQuery();
  const mut = useCreateRevenueSummaryMutation();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    mut.mutate(
      {
        salon_id: form.salon_id.trim() || null,
        salon_name: form.salon_name.trim() || null,
        month: toMonthTimestamp(form.month),
        payment_count: toNum(form.payment_count),
        total_revenue: toNum(form.total_revenue),
        avg_payment: toNum(form.avg_payment),
        currency: form.currency.trim() || null,
        description: form.description.trim() || null,
      },
      {
        onSuccess: (created) => {
          toast.success("Gelir ozeti olusturuldu.");
          onSuccessNavigate(created);
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : "Kayit basarisiz.");
        },
      },
    );
  };

  return (
    <form onSubmit={submit} className="max-w-5xl space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="rs-salon-id">Salon ID</Label>
          <Select
            value={form.salon_id}
            onValueChange={(v) => {
              const selected = saloons.find((s) => s.id === v);
              setForm((f) => ({
                ...f,
                salon_id: v,
                salon_name: selected?.name ?? f.salon_name,
              }));
            }}
            disabled={mut.isPending}
          >
            <SelectTrigger id="rs-salon-id">
              <SelectValue placeholder="Salon secin" />
            </SelectTrigger>
            <SelectContent>
              {saloons.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="rs-salon-name">Salon adi</Label>
          <Input id="rs-salon-name" value={form.salon_name} disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rs-month">Ay</Label>
          <Input id="rs-month" type="month" value={form.month} onChange={(e) => setForm((f) => ({ ...f, month: e.target.value }))} disabled={mut.isPending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rs-currency">Para birimi</Label>
          <Input id="rs-currency" value={form.currency} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))} disabled={mut.isPending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rs-payment-count">Odeme sayisi</Label>
          <Input id="rs-payment-count" type="number" min={0} value={form.payment_count} onChange={(e) => setForm((f) => ({ ...f, payment_count: e.target.value }))} disabled={mut.isPending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rs-total-revenue">Toplam gelir</Label>
          <Input id="rs-total-revenue" type="number" step="0.01" min={0} value={form.total_revenue} onChange={(e) => setForm((f) => ({ ...f, total_revenue: e.target.value }))} disabled={mut.isPending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rs-avg-payment">Ortalama odeme</Label>
          <Input id="rs-avg-payment" type="number" step="0.01" min={0} value={form.avg_payment} onChange={(e) => setForm((f) => ({ ...f, avg_payment: e.target.value }))} disabled={mut.isPending} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="rs-description">Aciklama</Label>
          <Input id="rs-description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} disabled={mut.isPending} />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-8 sm:flex-row sm:items-center sm:justify-end">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={mut.isPending} className="sm:mr-auto">
          Vazgec
        </Button>
        <ShimmerButton type="submit" disabled={mut.isPending} className="min-w-[10rem]">
          {mut.isPending ? "Kaydediliyor..." : "Olustur"}
        </ShimmerButton>
      </div>
    </form>
  );
}

export function RevenueSummaryEditForm({
  item,
  onSuccessNavigate,
  onCancel,
}: {
  item: SalonRevenueSummary;
  onSuccessNavigate: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const { data: saloons = [] } = useSaloonsQuery();
  const mut = useUpdateRevenueSummaryMutation();

  useEffect(() => {
    setForm({
      salon_id: item.salon_id ?? "",
      salon_name: item.salon_name ?? "",
      month: item.month ? item.month.slice(0, 7) : "",
      payment_count: item.payment_count == null ? "" : String(item.payment_count),
      total_revenue: item.total_revenue == null ? "" : String(item.total_revenue),
      avg_payment: item.avg_payment == null ? "" : String(item.avg_payment),
      currency: item.currency ?? "TRY",
      description: item.description ?? "",
    });
  }, [item]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    mut.mutate(
      {
        id: item.id,
        patch: {
          salon_id: form.salon_id.trim() || null,
          salon_name: form.salon_name.trim() || null,
          month: toMonthTimestamp(form.month),
          payment_count: toNum(form.payment_count),
          total_revenue: toNum(form.total_revenue),
          avg_payment: toNum(form.avg_payment),
          currency: form.currency.trim() || null,
          description: form.description.trim() || null,
        },
      },
      {
        onSuccess: () => {
          toast.success("Gelir ozeti guncellendi.");
          onSuccessNavigate();
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : "Guncelleme basarisiz.");
        },
      },
    );
  };

  return (
    <RevenueSummaryCreateFormShell
      form={form}
      setForm={setForm}
      saloons={saloons}
      isPending={mut.isPending}
      onCancel={onCancel}
      onSubmit={submit}
      submitText={mut.isPending ? "Kaydediliyor..." : "Kaydet"}
    />
  );
}

function RevenueSummaryCreateFormShell({
  form,
  setForm,
  saloons,
  isPending,
  onCancel,
  onSubmit,
  submitText,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  saloons: Array<{ id: string; name: string }>;
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  submitText: string;
}) {
  return (
    <form onSubmit={onSubmit} className="max-w-5xl space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="rse-salon-id">Salon ID</Label>
          <Select
            value={form.salon_id}
            onValueChange={(v) => {
              const selected = saloons.find((s) => s.id === v);
              setForm((f) => ({
                ...f,
                salon_id: v,
                salon_name: selected?.name ?? f.salon_name,
              }));
            }}
            disabled={isPending}
          >
            <SelectTrigger id="rse-salon-id">
              <SelectValue placeholder="Salon secin" />
            </SelectTrigger>
            <SelectContent>
              {saloons.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="rse-salon-name">Salon adi</Label>
          <Input id="rse-salon-name" value={form.salon_name} disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rse-month">Ay</Label>
          <Input id="rse-month" type="month" value={form.month} onChange={(e) => setForm((f) => ({ ...f, month: e.target.value }))} disabled={isPending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rse-currency">Para birimi</Label>
          <Input id="rse-currency" value={form.currency} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))} disabled={isPending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rse-payment-count">Odeme sayisi</Label>
          <Input id="rse-payment-count" type="number" min={0} value={form.payment_count} onChange={(e) => setForm((f) => ({ ...f, payment_count: e.target.value }))} disabled={isPending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rse-total-revenue">Toplam gelir</Label>
          <Input id="rse-total-revenue" type="number" step="0.01" min={0} value={form.total_revenue} onChange={(e) => setForm((f) => ({ ...f, total_revenue: e.target.value }))} disabled={isPending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rse-avg-payment">Ortalama odeme</Label>
          <Input id="rse-avg-payment" type="number" step="0.01" min={0} value={form.avg_payment} onChange={(e) => setForm((f) => ({ ...f, avg_payment: e.target.value }))} disabled={isPending} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="rse-description">Aciklama</Label>
          <Input id="rse-description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} disabled={isPending} />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-8 sm:flex-row sm:items-center sm:justify-end">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isPending} className="sm:mr-auto">
          Vazgec
        </Button>
        <ShimmerButton type="submit" disabled={isPending} className="min-w-[10rem]">
          {submitText}
        </ShimmerButton>
      </div>
    </form>
  );
}
