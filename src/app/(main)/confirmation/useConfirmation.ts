import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ApiResponse } from "./types";

export function useConfirmation() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    async function fetchSession() {
      if (!sessionId) {
        setError("Aucun session_id trouvé dans l'URL.");
        setLoading(false);
        return;
      }

      try {
        const url = `/api/stripe-session?session_id=${encodeURIComponent(sessionId)}`;
        console.debug("[Confirmation] Fetching session from", url);
        const res = await fetch(url);

        // Try to parse JSON; if parsing fails, capture raw text for debugging
        const jsonData = await res.json();

        console.debug(
          "[Confirmation] Response JSON:",
          jsonData,
          "status:",
          res.status,
        );

        if (!res.ok) {
          setError(
            jsonData.error ||
              "Erreur lors de la récupération du statut de paiement",
          );
          setLoading(false);
          return;
        }
        setData(jsonData);
      } catch (e) {
        console.error("[Confirmation] Network/fetch error", e);
        const msg = e instanceof Error ? e.message : "Erreur réseau";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, [sessionId]);

  return { loading, error, data };
}
