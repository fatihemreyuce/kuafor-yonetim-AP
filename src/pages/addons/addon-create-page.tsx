import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import type { Addon } from "@/types/addon.types";
import { AddonCreateForm } from "./addon-form";

export default function AddonCreatePage() {
  const navigate = useNavigate();

  const onCreated = (created: Addon) => {
    navigate(`/saloons/${created.id}`, { replace: true });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1">
        <Link to="/saloons">
          <ArrowLeft className="h-4 w-4" />
          Listeye dön
        </Link>
      </Button>
      <AddonCreateForm onSuccessNavigate={onCreated} onCancel={() => navigate("/saloons")} />
    </div>
  );
}
