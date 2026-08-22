import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "../api/authApi.ts";
import { useAuth } from "../hooks/useAuth.ts";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../schemas/auth/forgotPasswordSchema.ts";
import { AuthLayout } from "../components/auth/AuthLayout.tsx";
import { FormField } from "../components/common/FormField.tsx";
import { Button } from "../components/common/Button.tsx";

export function ForgotPasswordPage() {
  const { clearError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  useEffect(() => {
    clearError();
  }, [clearError]);

  async function onSubmit(data: ForgotPasswordFormValues) {
    setIsLoading(true);
    setApiError(null);
    setSuccessMessage(null);
    try {
      const msg = await authApi.forgotPassword(data.email);
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
      heading="Reset password"
      subheading="Enter your email to receive a password reset link"
      successMessage={successMessage ?? undefined}
      apiError={apiError ?? undefined}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <FormField
          id="forgot-email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Button
          id="forgot-submit"
          type="submit"
          isLoading={isLoading}
          fullWidth
          className="mt-2"
        >
          Send reset link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Remember your password?{" "}
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
export default ForgotPasswordPage;
