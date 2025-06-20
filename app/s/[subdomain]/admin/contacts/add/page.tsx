"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ContactForm from "@/components/custom-forms/contacts-form";
import { addData, fetchData } from "@/app/actions";

export default function UsersPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const defaultValue = {
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    tags: [],
    notes: "",
    custom_fields: [{ key: "", value: "" }],
  };

  const onSubmit = async (data: any) => {
    try {
      setIsPending(true);
      const result = await addData("/api/contacts", data) as any;
      if (result?.data?.success === true) {
      toast.success(result.data.message, { position: "top-right" });
      router.push("/admin/contacts");
      } else {
      toast.error(result.data.message, { position: "top-right" });
      }
    } catch (error) {
      toast.error("An error occurred while adding contact", { position: "top-right" });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-6 select-none p-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Contact</h1>
        </div>
      </div>

      <Card>
        <CardContent>
          <div className="mb-4 px-4 py-8 w-0 md:w-10/12">
              <ContactForm onSubmit={onSubmit} defaultValue={defaultValue} buttonText="Save" isLoading={isPending} />            
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
