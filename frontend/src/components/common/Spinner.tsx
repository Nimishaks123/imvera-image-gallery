interface SpinnerProps {
  size?: "sm" | "lg";
}

export function Spinner({ size = "sm" }: SpinnerProps) {
  const classes =
    size === "lg"
      ? "h-8 w-8 border-2 border-slate-200 border-t-blue-600"
      : "h-4 w-4 border-2 border-white/30 border-t-white";

  return (
    <span
      className={`${classes} inline-block shrink-0 rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
}
