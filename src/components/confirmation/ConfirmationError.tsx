import React from "react";

interface ConfirmationErrorProps {
  error: string;
}

export function ConfirmationError({ error }: ConfirmationErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center text-red-600">
      {error}
    </div>
  );
}
