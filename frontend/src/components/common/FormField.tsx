import { forwardRef, type InputHTMLAttributes } from "react";
import { Input } from "./Input.tsx";
import { ErrorMessage } from "./ErrorMessage.tsx";

export interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ id, label, error, ...rest }, ref) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <Input
        ref={ref}
        id={id}
        hasError={!!error}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      <ErrorMessage id={`${id}-error`} message={error} />
    </div>
  ),
);

FormField.displayName = "FormField";
