"use client";

import React, { Suspense } from "react";
import { useConfirmation } from "./useConfirmation";
import { ConfirmationLoading } from "@/components/confirmation/ConfirmationLoading";
import { ConfirmationError } from "@/components/confirmation/ConfirmationError";
import { ConfirmationSuccess } from "@/components/confirmation/ConfirmationSuccess";
import { ConfirmationFailure } from "@/components/confirmation/ConfirmationFailure";

function ConfirmationContent() {
  const { loading, error, data } = useConfirmation();

  if (loading) return <ConfirmationLoading />;
  if (error) return <ConfirmationError error={error} />;

  const session = data?.session;
  const reservation = data?.booking;
  const status = session?.payment_status;

  if (status === "paid" || status === "succeeded") {
    return <ConfirmationSuccess session={session} reservation={reservation} />;
  }

  return <ConfirmationFailure />;
}

export default function Confirmation() {
  return (
    <Suspense fallback={<ConfirmationLoading />}>
      <ConfirmationContent />
    </Suspense>
  );
}
