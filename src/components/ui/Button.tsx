import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "outline" | "ghost" | "accent";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  full?: boolean;
}

const base =
  "inline-flex items-center justify-center rounded-xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2";
const variants: Record<Variant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-600",
  accent: "bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-500",
  outline:
    "border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-400",
  ghost: "text-slate-700 hover:bg-slate-100 focus:ring-slate-400",
};
const sizes: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-base px-5 py-3",
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = "primary", size = "md", full, className = "", ...props }, ref) => {
    const w = full ? "w-full" : "";
    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${w} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
