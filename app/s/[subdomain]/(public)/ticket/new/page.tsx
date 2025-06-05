"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import OtpModalVerify from "@/components/models/otp-modal-verify";
import { NewTicketForm } from "@/components/custom-forms/new-ticket-form";

export default function NewTicketPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const [formData, setFormData] = useState<FormData | null>(null);
  const [ticketCategoryData, setTicketCategoryData] = useState<any[]>([]);

  const handleSubmit = async (data: any) => {};

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <NewTicketForm
        onSubmit={handleSubmit}
        ticketCategoryData={ticketCategoryData}
        isLoading={isLoading}
      />
      <OtpModalVerify
        setIsOtpModalOpen={setIsOtpModalOpen}
        isOtpModalOpen={isOtpModalOpen}
        formData={formData}
      />
    </div>
  );
}
