import type { ReactNode } from "react";

function CameraIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-blue-600"
      aria-hidden="true"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 mt-0.5"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function AlertCircleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 mt-0.5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

interface AuthLayoutProps {
  heading: string;
  subheading: string;
  children: ReactNode;
  successMessage?: string;
  apiError?: string;
}

export function AuthLayout({
  heading,
  subheading,
  children,
  successMessage,
  apiError,
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-[440px]">
        {/* Auth card */}
        <div className="bg-white border border-slate-200 rounded-lg p-8 sm:p-10 shadow-sm">
          {/* Brand */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div
              className="w-9 h-9 rounded-md flex items-center justify-center shrink-0 bg-blue-50 border border-blue-100"
              aria-hidden="true"
            >
              <CameraIcon />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Imvera
            </span>
          </div>

          <h1 className="text-xl font-bold text-center text-slate-900 tracking-tight mb-1">
            {heading}
          </h1>
          <p className="text-sm text-slate-500 text-center mb-6">{subheading}</p>

          {successMessage && (
            <div
              className="flex items-start gap-2 mb-5 p-3 rounded-md text-sm text-emerald-800 bg-emerald-50 border border-emerald-200"
              role="status"
            >
              <CheckIcon />
              <span>{successMessage}</span>
            </div>
          )}

          {apiError && (
            <div
              className="flex items-start gap-2 mb-5 p-3 rounded-md text-sm text-red-800 bg-red-50 border border-red-200"
              role="alert"
            >
              <AlertCircleIcon />
              <span>{apiError}</span>
            </div>
          )}

          {children}
        </div>
      </div>
    </main>
  );
}
