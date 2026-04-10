import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useProfileQuery } from "@/hooks/use-profiles";
import { ProfileEditForm } from "./profile-form";
import { parseProfileIdParam } from "./profile-utils";

export default function ProfileEditPage() {
  const { id: idParam } = useParams<{ id: string }>();
  const id = parseProfileIdParam(idParam);
  const navigate = useNavigate();
  const { data: profile, isLoading, isError, error, refetch } = useProfileQuery(id);

  if (id == null) {
    return (
      <div className="mx-auto max-w-xl p-6 text-center">
        <p className="text-sm text-destructive">Geçersiz profil adresi.</p>
        <Button asChild className="mt-4" variant="outline">
          <Link to="/profiles">Listeye dön</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1">
          <Link to="/profiles">
            <ArrowLeft className="h-4 w-4" />
            Listeye dön
          </Link>
        </Button>
        {profile ? (
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/profiles/${profile.id}`}>Detay</Link>
          </Button>
        ) : null}
      </div>

      {isLoading ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Yükleniyor…
        </p>
      ) : isError ? (
        <div className="space-y-3 py-12 text-center">
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Profil yüklenemedi."}
          </p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Tekrar dene
          </Button>
        </div>
      ) : !profile ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Profil bulunamadı.
        </p>
      ) : (
        <ProfileEditForm
          profile={profile}
          onSuccessNavigate={() => navigate(`/profiles/${profile.id}`, { replace: true })}
          onCancel={() => navigate(`/profiles/${profile.id}`)}
        />
      )}
    </div>
  );
}
