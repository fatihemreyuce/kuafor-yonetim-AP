import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Profile } from "@/types/profile.types";
import { ProfileCreateForm } from "./profile-form";

export default function ProfileCreatePage() {
  const navigate = useNavigate();

  const onCreated = (created: Profile) => {
    navigate(`/profiles/${created.id}`, { replace: true });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1">
        <Link to="/profiles">
          <ArrowLeft className="h-4 w-4" />
          Listeye dön
        </Link>
      </Button>
      <ProfileCreateForm
        onSuccessNavigate={onCreated}
        onCancel={() => navigate("/profiles")}
      />
    </div>
  );
}
