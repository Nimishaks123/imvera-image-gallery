import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "../store/store.ts";
import { registerUser } from "../store/slices/authSlice.ts";
import { registerSchema, type RegisterFormValues } from "../schemas/auth/registerSchema.ts";
import { useAuth } from "../hooks/useAuth.ts";
import { AuthLayout } from "../components/auth/AuthLayout.tsx";
import { FormField } from "../components/common/FormField.tsx";
import { Button } from "../components/common/Button.tsx";

export function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    clearError();
  }, [clearError]);

  async function onSubmit(data: RegisterFormValues) {
    const result = await dispatch(
      registerUser({
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        password: data.password,
      }),
    );
    if (registerUser.fulfilled.match(result)) {
      navigate("/login?registered=true", { replace: true });
    }
  }

  return (
    <AuthLayout
      heading="Create your account"
      subheading="Your personal image gallery awaits"
      apiError={error ?? undefined}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <FormField
          id="register-name"
          label="Full name"
          autoComplete="name"
          placeholder="Jane Doe"
          error={errors.name?.message}
          {...register("name")}
        />
        <FormField
          id="register-email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <FormField
          id="register-phone"
          label="Phone number"
          type="tel"
          autoComplete="tel"
          placeholder="+91 555 000 0000"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <FormField
          id="register-password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="Min 8 chars, letter + number"
          error={errors.password?.message}
          {...register("password")}
        />
        <FormField
          id="register-confirm-password"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Button
          id="register-submit"
          type="submit"
          isLoading={isLoading}
          fullWidth
          className="mt-2"
        >
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
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
