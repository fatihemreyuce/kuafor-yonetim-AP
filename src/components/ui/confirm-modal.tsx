import { useEffect, useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";

interface ConfirmModalProps {
	open: boolean;
	title?: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void;
	onCancel: () => void;
	loading?: boolean;
	tone?: "default" | "destructive";
	confirmByTyping?: string;
	confirmByTypingHint?: string;
}

export function ConfirmModal({
	open,
	title = "Onayla",
	description,
	confirmText = "Evet",
	cancelText = "Vazgeç",
	onConfirm,
	onCancel,
	loading = false,
	tone = "default",
	confirmByTyping,
	confirmByTypingHint,
}: ConfirmModalProps) {
	const [typedValue, setTypedValue] = useState("");

	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
			return () => {
				document.body.style.overflow = "";
			};
		}
	}, [open]);

	useEffect(() => {
		if (!open) return;
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape" && !loading) onCancel();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [open, loading, onCancel]);

	useEffect(() => {
		if (!open) setTypedValue("");
	}, [open]);

	const requiresTyping = Boolean(confirmByTyping?.trim());
	const isTypingValid = useMemo(() => {
		if (!requiresTyping) return true;
		const expected = confirmByTyping!.trim().toLocaleLowerCase("tr");
		const entered = typedValue.trim().toLocaleLowerCase("tr");
		return expected.length > 0 && entered === expected;
	}, [confirmByTyping, typedValue, requiresTyping]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" onClick={loading ? undefined : onCancel} />
			<div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-border/70 bg-card text-card-foreground shadow-2xl">
				<div className="border-b border-border/60 px-6 py-5">
					<div className="flex items-start gap-3">
						<div className={tone === "destructive"
							? "mt-0.5 rounded-full border border-red-500/30 bg-red-500/15 p-2 text-red-500"
							: "mt-0.5 rounded-full border border-sky-500/30 bg-sky-500/15 p-2 text-sky-500"}>
							<AlertTriangle className="h-4 w-4" />
						</div>
						<div>
							<h3 className="text-lg font-semibold leading-6">{title}</h3>
							{description ? (
								<p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
							) : null}
						</div>
					</div>
					{requiresTyping ? (
						<div className="mt-4 space-y-2 rounded-xl border border-border/60 bg-muted/40 p-3">
							<p className="text-xs text-muted-foreground">
								{confirmByTypingHint ?? `Silmek için "${confirmByTyping}" yazın.`}
							</p>
							<Input
								value={typedValue}
								onChange={(e) => setTypedValue(e.target.value)}
								placeholder={confirmByTyping}
								autoComplete="off"
								disabled={loading}
							/>
						</div>
					) : null}
				</div>
				<div className="flex items-center justify-end gap-2 px-6 py-4">
					<Button variant="outline" onClick={onCancel} disabled={loading}>
						{cancelText}
					</Button>
					<Button
						variant={tone === "destructive" ? "destructive" : "default"}
						onClick={onConfirm}
						aria-busy={loading}
						disabled={loading || !isTypingValid}
					>
						{loading ? "İşleniyor..." : confirmText}
					</Button>
				</div>
			</div>
		</div>
	);
}


