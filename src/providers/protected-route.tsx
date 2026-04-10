import { Loader2 } from "lucide-react";
import { Navigate, Outlet } from "react-router";
import { useLoginState } from "@/hooks/use-login-state";

export default function ProtectedRoute() {
	const { isLoggedIn, isActionable } = useLoginState();

	// Oturum doğrulanmadan Outlet render edilirse istekler anon key ile gider → RLS 403.
	if (!isActionable) {
		return (
			<div className="flex min-h-svh items-center justify-center bg-background">
				<Loader2
					className="h-8 w-8 animate-spin text-muted-foreground"
					aria-label="Yükleniyor"
				/>
			</div>
		);
	}

	if (!isLoggedIn) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
}
