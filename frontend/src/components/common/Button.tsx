import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Spinner } from "./Spinner.tsx";

type ButtonVariant = "primary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white",
    "py-2.5 px-4",
    "focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
  ].join(" "),
  ghost: [
    "text-slate-700 bg-white hover:bg-slate-50 border border-slate-300",
    "py-2 px-3 text-xs",
    "hover:text-red-600 hover:border-red-300 hover:bg-red-50/50",
  ].join(" "),
};

export function Button({
  children,
  isLoading = false,
  variant = "primary",
  fullWidth = false,
  className = "",
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      className={[
        "inline-flex items-center justify-center gap-2",
        "rounded-md font-semibold text-sm tracking-wide",
        "transition-all duration-150 cursor-pointer",
        "disabled:opacity-55 disabled:cursor-not-allowed",
        variantClasses[variant],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
}
