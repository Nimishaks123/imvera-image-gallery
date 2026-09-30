import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "../api/authApi.ts";
import { useAuth } from "../hooks/useAuth.ts";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../schemas/auth/resetPasswordSchema.ts";
import { AuthLayout } from "../components/auth/AuthLayout.tsx";
import { FormField } from "../components/common/FormField.tsx";
import { Button } from "../components/common/Button.tsx";

export function ResetPasswordPage() {
  const { clearError } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const missingTokenError = !token
  ? "Invalid reset request: Missing token in URL query."
  : undefined;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    clearError();
   
  }, [clearError]);

  async function onSubmit(data: ResetPasswordFormValues) {
    if (!token) return;
    setIsLoading(true);
    setApiError(null);
    setSuccessMessage(null);
    try {
      const msg = await authApi.resetPassword(token, data.password);
      setSuccessMessage(msg);
    } catch (err: unknown) {
      if (
        err !== null &&
        typeof err === "object" &&
        "response" in err &&
        err.response !== null &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data !== null &&
        typeof err.response.data === "object" &&
        "message" in err.response.data &&
        typeof err.response.data.message === "string"
      ) {
        setApiError(err.response.data.message);
      } else {
        setApiError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
  heading="Set new password"
  subheading="Please enter your new password below"
  successMessage={successMessage ?? undefined}
  apiError={apiError ?? missingTokenError}
>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <FormField
          id="reset-password"
          label="New password"
          type="password"
          autoComplete="new-password"
          placeholder="Min 8 chars, letter + number"
          error={errors.password?.message}
          disabled={!token || !!successMessage}
          {...register("password")}
        />
        <FormField
          id="reset-confirm"
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat new password"
          error={errors.confirmPassword?.message}
          disabled={!token || !!successMessage}
          {...register("confirmPassword")}
        />
        <Button
          id="reset-submit"
          type="submit"
          isLoading={isLoading}
          disabled={!token || !!successMessage}
          fullWidth
          className="mt-2"
        >
          Reset password
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Ready to sign in?{" "}
        <Link
          to="/login"
          className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
export default ResetPasswordPage;
