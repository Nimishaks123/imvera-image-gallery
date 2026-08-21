interface ErrorMessageProps {
  id?: string;
  message?: string;
}

export function ErrorMessage({ id, message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <span id={id} className="text-xs text-red-600 font-medium" role="alert">
      {message}
    </span>
  );
}
