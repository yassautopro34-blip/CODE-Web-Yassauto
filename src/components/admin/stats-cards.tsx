import { IBookingDocument } from "@/lib/models/booking";

export function StatsCards({ requests }: { requests: IBookingDocument[] }) {
  const resCount = requests.filter(
    (r) => r.bookingType === "reservation",
  ).length;
  const devisCount = requests.filter((r) => r.bookingType === "devis").length;
  const confirmedCount = requests.filter(
    (r) => r.status === "confirmed",
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card label="Total" value={requests.length} colorClass="text-black" />
      <Card
        label="Accompagnements"
        value={resCount}
        colorClass="text-blue-600"
      />
      <Card
        label="Devis mécanique"
        value={devisCount}
        colorClass="text-purple-600"
      />
      <Card
        label="Confirmées"
        value={confirmedCount}
        colorClass="text-green-600"
      />
    </div>
  );
}

const Card = ({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: number;
  colorClass: string;
}) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <p className="text-gray-600 text-sm">{label}</p>
    <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
  </div>
);
