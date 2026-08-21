interface EmptyStateProps {
  onUploadClick?: () => void;
  title?: string;
  description?: string;
  actionText?: string;
}

export function EmptyState({
  onUploadClick,
  title = "No images yet",
  description = "Upload your first photo to get started with Imvera.",
  actionText = "Upload Image",
}: EmptyStateProps) {
  return (
    <div className="border-2 border-dashed border-slate-200 rounded-lg p-12 bg-white text-center shadow-sm">
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-slate-400 mx-auto mb-4"
        aria-hidden="true"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      <h3 className="text-base font-semibold text-slate-900 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
        {description}
      </p>
      {onUploadClick && (
        <button
          onClick={onUploadClick}
          className="inline-flex items-center justify-center rounded-md font-semibold text-sm px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition-all cursor-pointer shadow-sm"
          type="button"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
