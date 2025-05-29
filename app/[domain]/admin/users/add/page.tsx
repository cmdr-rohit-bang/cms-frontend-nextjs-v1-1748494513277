"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { addData } from "@/app/actions";
import UserForm from "@/components/custom-forms/user-form";

export default function UsersPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);


  const handleSubmit = async (formData: FormData) => {
    if (!formData) return;
    setIsPending(true);
    const result = await addData("/admin/users", formData) as any;

    if (result?.status === "success") {
      toast.success(result.message, { position: "top-right" });
      router.push("/admin/users");
    } else {
      toast.error(result.message, { position: "top-right" });
    }
    setIsPending(false);
  };

  const defaultValue = {
      name: "",
      phone: "",
      email: "",
      password: "",
      confirm_password: "",
      permissions: [],
      status: false,
      role: "",
  };

  return (
    <div className="space-y-6 select-none p-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add User</h1>
        </div>
      </div>

      <Card>
        <CardContent>
          <div   className="mb-4 px-4 py-8 w-0 md:w-10/12">
            <UserForm onSubmit={handleSubmit} submitText="Create" formStatus={isPending} defaultValues={defaultValue} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
