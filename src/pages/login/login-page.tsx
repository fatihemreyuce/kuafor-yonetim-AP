import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import { toast } from "sonner";

import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { BorderBeam } from "@/components/ui/border-beam";
import { DotPattern } from "@/components/ui/dot-pattern";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { useLoginState } from "@/hooks/use-login-state";
import type { LoginRequest } from "@/types/auth.types";
import { cn } from "@/lib/utils";

const cardSurface = "bg-[#161a20]";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { login, isLoading, isLoggedIn } = useLoginState();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const loginRequest: LoginRequest = { email, password };
      await login(loginRequest);
      navigate("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Geçersiz e-posta veya şifre.";
      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = isLoading || isSubmitting;

  const inputBase =
    "w-full rounded-xl border py-3 pl-11 pr-4 text-base text-slate-100 outline-none transition-all duration-200 " +
    "border-slate-600/50 bg-slate-800/80 placeholder:text-slate-400 " +
    "hover:border-slate-500/70 hover:bg-slate-800 " +
    "focus:border-sky-400 focus:bg-slate-800 focus:ring-2 focus:ring-sky-400/35 focus:ring-offset-2 focus:ring-offset-[#161a20] " +
    "disabled:cursor-not-allowed disabled:opacity-55";

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-10"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 45%, rgb(224 242 254 / 0.95), rgb(240 249 255) 45%, rgb(224 242 254))",
      }}
    >
      <DotPattern className="opacity-[0.35]" />

      <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-sky-300/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-300/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-200/25 blur-3xl" />

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="mb-8 flex justify-center">
          <div
            className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg shadow-sky-500/30 ring-4 ring-white/60"
            style={{ animation: "float 3s ease-in-out infinite" }}
          >
            <Shield className="h-9 w-9 text-white" strokeWidth={1.75} />
          </div>
        </div>

        <div
          className={cn(
            "relative overflow-hidden rounded-3xl border border-slate-700/60 p-9 shadow-2xl shadow-slate-900/20 backdrop-blur-sm",
            cardSurface,
          )}
        >
          <BorderBeam
            colorFrom="#0ea5e9"
            colorTo="#38bdf8"
            duration={10}
            borderWidth={1.5}
            innerClassName={cardSurface}
          />

          <div className="relative mb-10 text-center">
            <h1 className="mb-2 text-4xl font-bold tracking-tight">
              <AnimatedGradientText className="text-4xl font-bold">
                Kuafor Yönetim Sistemi
              </AnimatedGradientText>
            </h1>
            <p className="text-base text-slate-400">
              Kuafor Yönetim Sistemi'ne giriş yapın
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative space-y-6"
            noValidate
          >
            {submitError ? (
              <div
                id="login-error"
                role="alert"
                className="rounded-xl border border-red-500/40 bg-red-950/50 px-4 py-3 text-sm text-red-200"
              >
                {submitError}
              </div>
            ) : null}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold tracking-wide text-slate-300"
              >
                E-posta
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-400"
                  aria-hidden
                />
                <input
                  id="email"
                  type="email"
                  placeholder="ornek@sirket.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSubmitError(null);
                  }}
                  required
                  disabled={isFormDisabled}
                  aria-invalid={submitError ? true : undefined}
                  aria-describedby={submitError ? "login-error" : undefined}
                  className={inputBase}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold tracking-wide text-slate-300"
              >
                Şifre
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-400"
                  aria-hidden
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Şifrenizi girin"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setSubmitError(null);
                  }}
                  required
                  disabled={isFormDisabled}
                  aria-invalid={submitError ? true : undefined}
                  aria-describedby={submitError ? "login-error" : undefined}
                  className={cn(inputBase, "pr-12")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={isFormDisabled}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-sky-400 transition-colors hover:bg-slate-700/80 hover:text-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161a20] disabled:opacity-50"
                  aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <ShimmerButton
                type="submit"
                disabled={isFormDisabled}
                className={cn(
                  "rounded-xl bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 py-3.5 text-base font-semibold shadow-lg shadow-sky-500/25",
                  "hover:from-sky-500 hover:via-sky-500 hover:to-blue-700 hover:shadow-sky-500/40",
                  "active:scale-[0.99]",
                )}
              >
                {isFormDisabled ? (
                  <>
                    <span
                      className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
                      aria-hidden
                    />
                    Giriş yapılıyor…
                  </>
                ) : (
                  "Giriş Yap"
                )}
              </ShimmerButton>
            </div>
          </form>

          <p className="relative mt-8 text-center text-xs leading-relaxed text-slate-500">
            Yalnızca yetkili kullanıcılar erişebilir.
          </p>
        </div>
      </div>
    </div>
  );
}
