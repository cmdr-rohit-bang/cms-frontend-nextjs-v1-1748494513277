"use client";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { editData } from "@/app/actions";
import UserForm from "@/components/custom-forms/user-form";

export default function UsersPage() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState<any|[]>([]);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    try {
      if (!formData) return;
      setIsPending(true);
      const result = await editData(`/admin/users/${id}`, formData) as any;

      if (result?.status === "success") {
      toast.success(result.message, { position: "top-right" });
      router.push("/admin/users");
      } else {
      toast.error(result.message, { position: "top-right" });
      }
    } catch (error) {
      toast.error("Something went wrong!", { position: "top-right" });
    } finally {
      setIsPending(false);
    }
  };

  const defaultValue = {
    email: data?.email ?? "",
    name: data?.name ?? "",
    phone: data?.phone ?? "",
    status:data?.status,
    role:data?.role ?? "",
    permissions:data?.permissions ?? "",
    password:"",
    confirm_password:"",
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
          <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
        </div>
      </div>

      <Card>
        <CardContent>
          <div className="mb-4 px-4 py-8 w-0 md:w-10/12">
          <UserForm onSubmit={handleSubmit} submitText="Update" formStatus={isPending} defaultValues={defaultValue} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
