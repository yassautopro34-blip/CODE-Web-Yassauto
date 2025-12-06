import React from "react";
import { Filter } from "lucide-react";
import { FilterState, SortOrder } from "./admin-utils";

interface Props {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export function RequestFilterBar({ filters, setFilters }: Props) {
  const handleChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} />
        <h2 className="text-lg font-semibold">Filtres</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Select
          label="Type"
          value={filters.type}
          onChange={(v) => handleChange("type", v)}
        >
          <option value="">Tous</option>
          <option value="reservation">Accompagnement</option>
          <option value="devis">Devis</option>
        </Select>

        <Select
          label="Statut"
          value={filters.status}
          onChange={(v) => handleChange("status", v)}
        >
          <option value="">Tous</option>
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmées</option>
          <option value="cancelled">Annulées</option>
        </Select>

        <Select
          label="Période"
          value={filters.dateFilter}
          onChange={(v) => handleChange("dateFilter", v)}
        >
          <option value="all">Toutes les dates</option>
          <option value="today">Aujourd&apos;hui</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="custom">Personnalisé</option>
        </Select>

        {filters.dateFilter === "custom" && (
          <>
            <Input
              label="Du"
              type="date"
              value={filters.dateFrom}
              onChange={(v) => handleChange("dateFrom", v)}
            />
            <Input
              label="Au"
              type="date"
              value={filters.dateTo}
              onChange={(v) => handleChange("dateTo", v)}
            />
          </>
        )}

        <Select
          label="Tri"
          value={filters.sortOrder}
          onChange={(v) => handleChange("sortOrder", v as SortOrder)}
        >
          <option value="desc">Plus récent d&apos;abord</option>
          <option value="asc">Plus ancien d&apos;abord</option>
        </Select>
      </div>
    </div>
  );
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}

const Select = ({ label, value, onChange, children }: SelectProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
    >
      {children}
    </select>
  </div>
);

interface InputProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
}

const Input = ({ label, type, value, onChange }: InputProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
    />
  </div>
);
