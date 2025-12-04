import { useState, useEffect, useCallback } from "react";
import {
  BookingRequest,
  FilterState,
  getDateRangeParams,
} from "@/components/admin/admin-utils";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "LesMakhloufs";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// --- Auth Hook ---
export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("adminAuth");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setIsAuthenticated(true);
  }, []);

  const login = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("adminAuth", "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
}

// --- Data Fetching Hook ---
export function useRequests(filters: FilterState, isAuthenticated: boolean) {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);

      const { fromDate, toDate } = getDateRangeParams(
        filters.dateFilter,
        filters.dateFrom,
        filters.dateTo,
      );
      if (fromDate) params.append("dateFrom", fromDate);
      if (toDate) params.append("dateTo", toDate);

      params.append("sortOrder", filters.sortOrder);

      const [resRes, devisRes] = await Promise.all([
        fetch(`${API_URL}/api/reservations?${params.toString()}`),
        fetch(`${API_URL}/api/devis?${params.toString()}`),
      ]);

      let allRequests: BookingRequest[] = [];

      if (resRes.ok) {
        const resData = await resRes.json();
        allRequests.push(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...resData.map((r: any) => ({ ...r, type: "reservation" as const })),
        );
      }

      if (devisRes.ok) {
        const devisData = await devisRes.json();
        allRequests.push(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...devisData.map((d: any) => ({ ...d, type: "devis" as const })),
        );
      }

      // Client side type filtering (as per original logic)
      if (filters.type === "reservation") {
        allRequests = allRequests.filter((r) => r.type === "reservation");
      } else if (filters.type === "devis") {
        allRequests = allRequests.filter((r) => r.type === "devis");
      }

      // Client side sorting (redundant if API sorts, but kept for safety matching original)
      allRequests.sort((a, b) => {
        const aDate = new Date(a.createdAt).getTime();
        const bDate = new Date(b.createdAt).getTime();
        return filters.sortOrder === "asc" ? aDate - bDate : bDate - aDate;
      });

      setRequests(allRequests);
    } catch (err) {
      console.error("Error fetching requests", err);
    } finally {
      setLoading(false);
    }
  }, [filters, isAuthenticated]);

  const updateStatus = async (
    requestId: string,
    newStatus: string,
    type: "reservation" | "devis",
  ) => {
    try {
      const endpoint = type === "reservation" ? "reservations" : "devis";
      const response = await fetch(`${API_URL}/api/${endpoint}/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updated = await response.json();
        const updatedRequest = { ...updated, type };
        setRequests((prev) =>
          prev.map((r) => (r.id === requestId ? updatedRequest : r)),
        );
        return updatedRequest;
      }
    } catch (err) {
      console.error("Error updating status", err);
    }
    return null;
  };

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { requests, loading, updateStatus, refetch: fetchRequests };
}
