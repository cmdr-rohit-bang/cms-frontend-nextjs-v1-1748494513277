"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addData } from "@/app/actions";
import UserForm from "@/components/custom-forms/user-form";

export default function UsersPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (data: any) => {
    if (!data) return;

    setIsPending(true);

    try {
      const excludeFields = ["confirm_password"];
      const cleanedData = Object.keys(data).reduce((acc, key) => {
        if (!excludeFields.includes(key) && data[key] !== "") {
          acc[key] = data[key];
        }
        return acc;
      }, {} as Record<string, any>);

      const result = (await addData(
        "/auth/tenant/register",
        cleanedData
      )) as any;

      if (result?.status === "success") {
        toast.success(result.message, { position: "top-right" });
        router.push("/admin/users");
      } else {
        toast.error(result.message || "Something went wrong.", {
          position: "top-right",
        });
      }
    } catch (error: any) {
      toast.error("Request failed!", { position: "top-right" });
      console.error("Submission error:", error);
    } finally {
      setIsPending(false);
    }
  };

  const defaultValue = {
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    confirm_password: "",
    job_title: "",
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
          <div className="mb-4 px-4 py-8 w-0 md:w-10/12">
            <UserForm
              onSubmit={handleSubmit}
              submitText="Create"
              formStatus={isPending}
              defaultValues={defaultValue}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
