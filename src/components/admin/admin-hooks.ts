import { useState, useEffect, useCallback } from "react";
import {
  FilterState,
  getDateRangeParams,
  AdminRequest,
  RequestType,
  RequestStatus,
} from "@/components/admin/admin-utils";

const ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "LesMakhloufs";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// --- Auth Hook ---
export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("adminAuth");
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
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const [bookingsRes, quotesRes] = await Promise.all([
        fetch(`${API_URL}/api/bookings`),
        fetch(`${API_URL}/api/quotes`),
      ]);

      let allRequests: AdminRequest[] = [];

      // Process Bookings
      if (bookingsRes.ok) {
        const data = await bookingsRes.json();
        const bookings = (data.data || []).map((b: any) => ({
          ...b,
          bookingType: "reservation" as RequestType,
        }));
        allRequests = [...allRequests, ...bookings];
      }

      // Process Quotes
      if (quotesRes.ok) {
        const data = await quotesRes.json();
        // data.data is the array of quotes
        const quotes = (data.data || []).map((q: any) => ({
          _id: q._id,
          bookingType: "devis" as RequestType,
          status: q.status || "pending",
          createdAt: q.createdAt,
          updatedAt: q.updatedAt,
          clientName: `${q.firstName} ${q.lastName}`,
          clientPhone: q.phone,
          clientEmail: q.email,
          licensePlate: q.licensePlate,
          requestType: q.requestType,
          issueDescription: q.issueDescription,
          hasPhotos: q.hasPhotos,
        }));
        allRequests = [...allRequests, ...quotes];
      }

      // Client-side Filtering
      if (filters.status) {
        allRequests = allRequests.filter((r) => r.status === filters.status);
      }

      if (filters.type) {
        allRequests = allRequests.filter((r) => r.bookingType === filters.type);
      }

      const { fromDate, toDate } = getDateRangeParams(
        filters.dateFilter,
        filters.dateFrom,
        filters.dateTo,
      );

      if (fromDate) {
        const fromTime = new Date(fromDate).getTime();
        allRequests = allRequests.filter(
          (r) => new Date(r.createdAt).getTime() >= fromTime,
        );
      }
      if (toDate) {
        // Add 1 day to include the end date fully
        const toTime = new Date(toDate).getTime() + 86400000;
        allRequests = allRequests.filter(
          (r) => new Date(r.createdAt).getTime() < toTime,
        );
      }

      // Client-side Sorting
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
    newStatus: RequestStatus,
    bookingType: RequestType,
  ) => {
    try {
      const endpoint = bookingType === "reservation" ? "bookings" : "quotes";
      const response = await fetch(`${API_URL}/api/${endpoint}/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updated = await response.json();
        // Since we map data differently for quotes, we need to handle the state update carefully
        // Ideally we just refetch or optimistically update
        setRequests((prev) =>
          prev.map((r) =>
            r._id === requestId ? { ...r, status: newStatus } : r,
          ),
        );
        return true;
      }
    } catch (err) {
      console.error("Error updating status", err);
    }
    return false;
  };

  const deleteRequest = async (requestId: string, bookingType: RequestType) => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer cette demande ? Cette action est irréversible.",
      )
    ) {
      return false;
    }

    try {
      const endpoint = bookingType === "reservation" ? "bookings" : "quotes";
      const response = await fetch(`${API_URL}/api/${endpoint}/${requestId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setRequests((prev) => prev.filter((r) => r._id !== requestId));
        return true;
      }
    } catch (err) {
      console.error("Error deleting request", err);
    }
    return false;
  };

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    requests,
    loading,
    updateStatus,
    deleteRequest,
    refetch: fetchRequests,
  };
}