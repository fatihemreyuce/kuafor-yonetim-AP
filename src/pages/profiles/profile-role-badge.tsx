import { Badge } from "@/components/ui/badge";
import type { UserRole } from "@/types/profile.types";
import { USER_ROLE_LABELS } from "@/types/profile.types";

const roleVariant: Record<
  UserRole,
  "default" | "sky" | "violet" | "amber" | "secondary"
> = {
  owner: "amber",
  admin: "default",
  staff: "violet",
  customer: "secondary",
  user: "sky",
};

export function ProfileRoleBadge({ role }: { role: UserRole }) {
  return (
    <Badge variant={roleVariant[role] ?? "secondary"}>
      {USER_ROLE_LABELS[role] ?? role}
    </Badge>
  );
}
