export function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  const labels = {
    pending: "En attente",
    confirmed: "Confirmée",
    cancelled: "Annulée",
  };
  const key = status as keyof typeof styles;
  return (
    <span
      className={`px-2 py-1 rounded text-sm font-medium ${styles[key] || "bg-gray-100"}`}
    >
      {labels[key] || status}
    </span>
  );
}
