"use client";

import { Card, CardContent } from "@/components/ui/card";
  import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import TicketForm from "@/components/custom-forms/ticket-form";
import { addData } from "@/app/actions";

export default function UsersPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      setIsPending(true);
      const result = await addData("/api/tickets", data) as any;
      if (result.data.success === true) {
      toast.success(result.data.message, { position: "top-right" });
      router.push("/admin/tickets");
      } else {
      toast.error(result.message, { position: "top-right" });
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong", { position: "top-right" });
    } finally {
      setIsPending(false);
    }
  };

  const defaultValue = {
    subject: "",
    description: "",
    priority: "",
    category: "",
    assigned_to: null, 
    status:"",
    due_date: new Date()
  };

  return (
    <div className="space-y-6 select-none p-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Ticket</h1>
        </div>
      </div>

      <Card>
        <CardContent>
          <div className="mb-4 px-4 py-8 w-0 md:w-10/12">
            <TicketForm onSubmit={onSubmit} defaultValue={defaultValue}  buttonText="Save"  isLoading={isPending} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
