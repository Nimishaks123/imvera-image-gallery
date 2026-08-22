import type { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "../store/store.ts";
import { ProtectedRoute } from "./ProtectedRoute.tsx";
import { LoginPage } from "../pages/LoginPage.tsx";
import { RegisterPage } from "../pages/RegisterPage.tsx";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage.tsx";
import { ResetPasswordPage } from "../pages/ResetPasswordPage.tsx";
import { GalleryPage } from "../pages/GalleryPage.tsx";
import { Spinner } from "../components/common/Spinner.tsx";

function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, initializationDone } = useAppSelector((state) => state.auth);

  if (!initializationDone) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/gallery" replace />;
  }

  return <>{children}</>;
}

export function AppRouter() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="/gallery"
        element={
          <ProtectedRoute>
            <GalleryPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/gallery" replace />} />
      <Route path="*" element={<Navigate to="/gallery" replace />} />
    </Routes>
  );
}
