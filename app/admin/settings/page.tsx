"use client";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { use, useEffect, useState, useTransition } from "react";

import { useRouter } from "next/navigation";
import UserSettingsForm from "@/components/custom-forms/user-settings-form";

export default function SettingsPage() {

  const router = useRouter();
  const [data, setData] = useState<any|[]>([]);
  const [isPending, startTransition] = useTransition();

  

  const handleSubmit = async (formData: any) => {
    if (!formData) return;
    const data = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      password: formData.password,
      mobileNumber:formData.mobileNumber,
      role:formData.role,
      status:formData.status,
      profile:formData.profile,
      permissions:formData.permissions,
    };
    

   
  };

  const defaultValue = {
    email: data?.email ?? "",
    firstName: data?.firstName ?? "",
    lastName:data?.lastName ?? "",
    status:data?.status,
    mobileNumber:data?.mobileNumber ?? "",
    permissions:data?.permissions ?? "",
    password:"",
    profile:data?.profile ?? "",
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
          <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
        </div>
      </div>

      <Card>
        <CardContent>
          <div className="mb-4 px-4 py-8 w-0 md:w-10/12">
            <UserSettingsForm onSubmit={(formData) => startTransition(() => handleSubmit(formData))} submitText="Update" formStatus={isPending} defaultValues={defaultValue}  />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
