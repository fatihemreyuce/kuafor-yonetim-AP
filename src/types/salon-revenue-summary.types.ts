export interface SalonRevenueSummary {
  id: string;
  salon_id: string | null;
  salon_name: string | null;
  month: string | null;
  payment_count: number | null;
  total_revenue: number | null;
  avg_payment: number | null;
  currency: string | null;
  description: string | null;
}

export type SalonRevenueSummaryInsert = {
  salon_id?: string | null;
  salon_name?: string | null;
  month?: string | null;
  payment_count?: number | null;
  total_revenue?: number | null;
  avg_payment?: number | null;
  currency?: string | null;
  description?: string | null;
};

export type SalonRevenueSummaryUpdate = SalonRevenueSummaryInsert;
