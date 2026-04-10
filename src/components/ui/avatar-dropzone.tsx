import { useCallback, useId, useRef, useState } from "react";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { imageFileToAvatarUrl } from "@/services/avatar-image";

const MAX_FILE_BYTES = 5 * 1024 * 1024;

type AvatarDropzoneProps = {
  id?: string;
  label: string;
  description?: string;
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  className?: string;
};

export function AvatarDropzone({
  id: idProp,
  label,
  description,
  value,
  onChange,
  disabled,
  className,
}: AvatarDropzoneProps) {
  const reactId = useId();
  const inputId = idProp ?? `avatar-drop-${reactId}`;
  const fileRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [busy, setBusy] = useState(false);

  const pickFiles = useCallback((list: FileList | null) => {
    const file = list?.[0];
    if (!file || disabled || busy) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Lütfen bir görsel dosyası seçin.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      toast.error("Dosya en fazla 5 MB olabilir.");
      return;
    }
    setBusy(true);
    void imageFileToAvatarUrl(file)
      .then((url) => {
        onChange(url);
      })
      .catch((e: unknown) => {
        toast.error(e instanceof Error ? e.message : "Yükleme başarısız.");
      })
      .finally(() => setBusy(false));
  }, [disabled, busy, onChange]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    pickFiles(e.dataTransfer.files);
  };

  const clear = () => {
    onChange("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <Label htmlFor={inputId} className="text-foreground">
          {label}
        </Label>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <div
        className={cn(
          "relative overflow-hidden rounded-2xl transition-all duration-200",
          "border-2 border-dashed",
          isDragging
            ? "border-sky-400/70 bg-sky-500/10 shadow-[0_0_0_1px_rgba(56,189,248,0.25)]"
            : "border-border/60 bg-muted/20",
          disabled && "pointer-events-none opacity-60",
        )}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled && !busy) setIsDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragging(false);
          }
        }}
        onDrop={onDrop}
      >
        <input
          ref={fileRef}
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/*"
          className="sr-only"
          tabIndex={-1}
          disabled={disabled || busy}
          onChange={(e) => {
            pickFiles(e.target.files);
            e.target.value = "";
          }}
        />

        {value ? (
          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
            <Avatar className="mx-auto h-28 w-28 shrink-0 border-2 border-border/50 shadow-md sm:mx-0 sm:h-24 sm:w-24">
              <AvatarImage src={value} alt="" className="object-cover" />
              <AvatarFallback className="text-muted-foreground">?</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 space-y-3 text-center sm:text-left">
              <p className="text-sm font-medium text-foreground">Önizleme</p>
              <p className="text-xs text-muted-foreground">Profil fotoğrafı hazır.</p>
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={disabled || busy}
                  onClick={() => fileRef.current?.click()}
                >
                  {busy ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ImagePlus className="mr-2 h-4 w-4" />
                  )}
                  Değiştir
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={disabled || busy}
                  onClick={clear}
                >
                  <X className="mr-2 h-4 w-4" />
                  Kaldır
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-14 text-center">
            <div
              className={cn(
                "rounded-2xl p-5",
                isDragging ? "bg-sky-500/15 text-sky-300" : "bg-muted/40 text-muted-foreground",
              )}
            >
              {busy ? (
                <Loader2 className="h-10 w-10 animate-spin" aria-hidden />
              ) : (
                <Upload className="h-10 w-10" strokeWidth={1.25} aria-hidden />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {isDragging ? "Bırakın, yüklensin" : "Görseli sürükleyip bırakın"}
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG veya WebP · en fazla 5 MB
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || busy}
              onClick={() => fileRef.current?.click()}
              className="border-border/80"
            >
              {busy ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Dosya seç
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
