"use client";
import React, { useState } from "react";
import { LogOut } from "lucide-react";
import { RequestsTable } from "@/components/admin/requests-table";
import { useAdminAuth, useRequests } from "@/components/admin/admin-hooks";
import { FilterState, AdminRequest } from "@/components/admin/admin-utils";
import { LoginScreen } from "@/components/admin/login-screen";
import { StatsCards } from "@/components/admin/stats-cards";
import { RequestFilterBar } from "@/components/admin/request-filterbar";
import { RequestModal } from "@/components/admin/request-modal";

export default function AdminDashboard() {
  const { isAuthenticated, login, logout } = useAdminAuth();

  const [filters, setFilters] = useState<FilterState>({
    status: "",
    type: "",
    dateFilter: "all",
    dateFrom: "",
    dateTo: "",
    sortOrder: "asc",
  });

  const { requests, loading, updateStatus, deleteRequest } = useRequests(
    filters,
    isAuthenticated,
  );
  const [selectedRequest, setSelectedRequest] =
    useState<AdminRequest | null>(null);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">YassAuto Dashboard</h1>
            <p className="text-gray-400 text-sm">Réservations et devis</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
          >
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <StatsCards requests={requests} />
        <RequestFilterBar filters={filters} setFilters={setFilters} />
        <RequestsTable
          requests={requests}
          loading={loading}
          onView={setSelectedRequest}
          onDelete={deleteRequest}
        />
      </div>

      {selectedRequest && (
        <RequestModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdateStatus={(id, status, bookingType) => {
            updateStatus(id, status, bookingType);
          }}
        />
      )}
    </div>
  );
}