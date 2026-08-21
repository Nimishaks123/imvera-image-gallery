import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ hasError = false, className = "", ...rest }, ref) => (
    <input
      ref={ref}
      className={[
        "w-full rounded-md px-3.5 py-2.5 text-sm text-slate-900",
        "bg-white border placeholder:text-slate-400",
        "focus:outline-none focus:ring-2 transition-all duration-150",
        hasError
          ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
          : "border-slate-300 focus:ring-blue-500/20 focus:border-blue-600",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    />
  ),
);

Input.displayName = "Input";
