import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import type { SalonRevenueSummary } from "@/types/salon-revenue-summary.types";
import { RevenueSummaryCreateForm } from "./revenue-summary-form";

export default function RevenueSummaryCreatePage() {
  const navigate = useNavigate();
  const onCreated = (created: SalonRevenueSummary) => {
    navigate(`/revenue-summary/${created.id}`, { replace: true });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1">
        <Link to="/revenue-summary">
          <ArrowLeft className="h-4 w-4" />
          Listeye don
        </Link>
      </Button>
      <RevenueSummaryCreateForm onSuccessNavigate={onCreated} onCancel={() => navigate("/revenue-summary")} />
    </div>
  );
}
