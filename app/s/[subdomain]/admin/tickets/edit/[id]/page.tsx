"use client";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";
import TicketForm from "@/components/custom-forms/ticket-form";
import { editData, fetchData } from "@/app/actions";
import { TicketType } from "@/types/types";

export default function UsersPage() {
  const params = useParams();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);  
  const [data, setData] = useState<any|{}>({});

  useEffect(() => {
    const fetchDataById = async () => {
      const data = await fetchData(`/api/tickets/${params.id}`) as any;
      console.log("data",data.data);    
      setData(data.data); 
    };
    fetchDataById();
  }, [params.id]);

  const onSubmit = async (data: any) => {
    setIsPending(true);
    const result = await editData(`/api/tickets/${params.id}`, data) as any;
    if (result.success === true) {
      toast.success(result.message, { position: "top-right" });
      router.push("/admin/tickets");
    } else {
      toast.error(result.data.message, { position: "top-right" });
    }
    setIsPending(false);
  };

  const defaultValue = {
    subject: data?.subject ?? "",
    description: data?.description ?? "",
    priority: data?.priority ?? "",
    category: data?.category ?? "",
    assigned_to: data?.assigned_to ?? "",
    status:data?.status,
    due_date: data?.due_date ? new Date(data.due_date) : new Date()
  };

  if (!data) {
    return (
      <div className="h-[90vh] w-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2563eb]"></div>
      </div>
    );
  }
  return (
    <div className="space-y-6 select-none p-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Ticket</h1>
        </div>
      </div>

      <Card>
        <CardContent>
          <div className="mb-4 px-4 py-8 w-0 md:w-10/12">
          <TicketForm onSubmit={onSubmit} defaultValue={defaultValue} buttonText="Update" isLoading={isPending} />         
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
