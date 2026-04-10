import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import type { SalonTeamMember } from "@/types/salon-team.types";
import { SalonTeamCreateForm } from "./salon-team-form";

export default function SalonTeamCreatePage() {
  const navigate = useNavigate();
  const onCreated = (created: SalonTeamMember) => {
    navigate(`/salon-team/${created.id}`, { replace: true });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1">
        <Link to="/salon-team"><ArrowLeft className="h-4 w-4" />Listeye don</Link>
      </Button>
      <SalonTeamCreateForm onSuccessNavigate={onCreated} onCancel={() => navigate("/salon-team")} />
    </div>
  );
}
