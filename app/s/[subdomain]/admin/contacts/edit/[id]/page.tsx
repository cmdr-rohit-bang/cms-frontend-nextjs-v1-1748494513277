"use client";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {  useEffect, useState, useTransition } from "react";

import { useParams, useRouter } from "next/navigation";
import ContactForm from "@/components/custom-forms/contacts-form";
import { editData, fetchData } from "@/app/actions";


export default function UsersPage() {
  const params = useParams();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [data, setData] = useState<any|{}>({});

  useEffect(() => {
    const fetchDataById = async () => {
        const data = await fetchData(`/api/contacts/${params.id}`) as any;
      console.log("data",data.data);    
      setData(data.data); 
    };
    fetchDataById();
  }, [params.id]);

  const onSubmit = async (data: any) => {
    setIsPending(true);
    const result = await editData(`/api/contacts/${params.id}`, data) as any;

    if (result.success === true) {
      toast.success(result.message, { position: "top-right" });
      router.push("/admin/contacts");
    } else {
      toast.error(result.message, { position: "top-right" });
    }
    setIsPending(false);
  };  

  const defaultValue = {
    name: data?.name ?? "",
    email: data?.email ?? "",
    phone: data?.phone ?? "",
    company: data?.company ?? "",
    address: data?.address ?? "",
    tags: data?.tags ?? [],
    notes: data?.notes ?? "",
    custom_fields: data?.custom_fields ?? [],
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
          <h1 className="text-3xl font-bold tracking-tight">Edit Contact</h1>
        </div>
      </div>

      <Card>
        <CardContent>
          <div className="mb-4 px-4 py-8 w-0 md:w-10/12">
            <ContactForm onSubmit={onSubmit} defaultValue={defaultValue} buttonText="Update" isLoading={isPending} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
