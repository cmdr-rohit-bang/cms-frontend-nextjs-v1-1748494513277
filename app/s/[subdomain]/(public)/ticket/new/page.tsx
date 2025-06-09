"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import OtpModalVerify from "@/components/models/otp-modal-verify";
import { NewTicketForm } from "@/components/custom-forms/new-ticket-form";
import { addData } from "@/app/actions";

export default function NewTicketPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const [formData, setFormData] = useState<FormData | null>(null);
  const [ticketId, setTicketId] = useState("");

  const handleSubmit = async (data: any) => {
    console.log("Form Data:", data);

    setFormData(data);
    try {
      const result = (await addData("/api/tickets", data)) as any;

      if (result.data.success === true) {
        setTicketId(result.data.ticketId);
        toast.success(result.data.message, { position: "top-right" });
        router.push("/admin/tickets");
      } else {
        toast.error(result.message, { position: "top-right" });
      }
      setIsOtpModalOpen(true);
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Failed to create ticket. Please try again.", {
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
    setIsOtpModalOpen(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <NewTicketForm onSubmit={handleSubmit} isLoading={isLoading} />
      <OtpModalVerify
        setIsOtpModalOpen={setIsOtpModalOpen}
        isOtpModalOpen={isOtpModalOpen}
        formData={formData}
        ticketId={ticketId}
      />
    </div>
  );
}
