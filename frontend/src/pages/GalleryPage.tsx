import { useAuth } from "../hooks/useAuth.ts";
import { Button } from "../components/common/Button.tsx";
import { EmptyState } from "../components/gallery/EmptyState.tsx";

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

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function GalleryPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 bg-blue-50 border border-blue-100"
            aria-hidden="true"
          >
            <CameraIcon />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            Imvera
          </span>
        </div>

        {/* Right Nav Options */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 shrink-0"
                aria-hidden="true"
              >
                {getInitials(user.name)}
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:block">
                {user.name}
              </span>
            </div>
          )}
          <Button id="logout-btn" variant="ghost" onClick={logout}>
            Sign out
          </Button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        <div className="w-full">
          {/* Header section with clean alignment */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5 mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900">My Images</h2>
              <p className="text-sm text-slate-500 mt-1">Manage and organize your photos</p>
            </div>
          </div>

          {/* Empty state presentation component (non-functional upload button for now) */}
          <EmptyState
            title="No images yet"
            description="Upload your first photo to get started with Imvera. Supported formats: JPEG, PNG, WebP, GIF."
            actionText="Upload Image"
            onUploadClick={() => {}}
          />
        </div>
      </main>
    </div>
  );
}
