import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Content */}
      <div
        className={`relative w-full ${sizes[size]} rounded-2xl bg-white shadow-xl`}
      >
        {title ? (
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-base font-semibold">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="rounded-lg p-2 hover:bg-slate-100"
            >
              ×
            </button>
          </div>
        ) : null}
        <div className="p-4">{children}</div>
      </div>
    </div>,
    document.body
  );
}
