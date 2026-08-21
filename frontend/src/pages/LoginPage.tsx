import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "../store/store.ts";
import { loginUser } from "../store/slices/authSlice.ts";
import { loginSchema, type LoginFormValues } from "../schemas/auth/loginSchema.ts";
import { useAuth } from "../hooks/useAuth.ts";
import { AuthLayout } from "../components/auth/AuthLayout.tsx";
import { FormField } from "../components/common/FormField.tsx";
import { Button } from "../components/common/Button.tsx";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, error, clearError } = useAuth();

  const justRegistered = new URLSearchParams(location.search).get("registered") === "true";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    clearError();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isAuthenticated) navigate("/gallery", { replace: true });
  }, [isAuthenticated, navigate]);

  function onSubmit(data: LoginFormValues) {
    void dispatch(loginUser({ email: data.email.toLowerCase(), password: data.password }));
  }

  return (
    <AuthLayout
      heading="Welcome back"
      subheading="Sign in to your gallery"
      successMessage={justRegistered ? "Account created! Sign in to get started." : undefined}
      apiError={error ?? undefined}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <FormField
          id="login-email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <FormField
          id="login-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button id="login-submit" type="submit" isLoading={isLoading} fullWidth className="mt-2">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
