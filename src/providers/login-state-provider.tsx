import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { LoginContext } from "@/contexts/login-context";
import { supabase } from "@/lib/supabase";
import { login, logout } from "@/services/auth-services";
import type { LoginRequest } from "@/types/auth.types";
import { useQueryClient } from "@tanstack/react-query";

export interface LoginContextType {
	isLoggedIn: boolean;
	login: (request: LoginRequest) => Promise<void>;
	logout: () => Promise<void>;
	isActionable: boolean;
	isLoading: boolean;
}

export const LoginProvider = ({ children }: { children: ReactNode }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isStarted, setIsStarted] = useState(false);
	const queryClient = useQueryClient();

	const isActionable = isStarted && !isLoading;

	useEffect(() => {
		// Mevcut session'ı kontrol et
		supabase.auth.getSession().then(({ data: { session } }) => {
			setIsLoggedIn(!!session);
			setIsLoading(false);
			setIsStarted(true);
		});

		// Auth değişikliklerini dinle (token yenileme, oturum kapatma vb.)
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setIsLoggedIn(!!session);
		});

		return () => subscription.unsubscribe();
	}, []);

	const handleLogout = async () => {
		setIsLoading(true);
		try {
			await logout();
			setIsLoggedIn(false);
			queryClient.removeQueries();
		} finally {
			setIsLoading(false);
		}
	};

	const handleLogin = async (request: LoginRequest) => {
		setIsLoading(true);
		try {
			await login(request);
			setIsLoggedIn(true);
			await queryClient.invalidateQueries({ queryKey: ["me"] });
		} catch (error) {
			setIsLoggedIn(false);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<LoginContext.Provider
			value={{
				isLoggedIn,
				login: handleLogin,
				logout: handleLogout,
				isActionable,
				isLoading,
			}}
		>
			{children}
		</LoginContext.Provider>
	);
};
