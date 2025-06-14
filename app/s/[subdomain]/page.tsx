"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { use } from "react";
import { UserAuthForm } from "@/components/custom-forms/user-auth-form";
import { Toaster } from "sonner";

export default function TenantPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const resolvedParams = use(params);
  const companyName  = resolvedParams.subdomain== "acme" ? "Acme" :"Bang Enterprises" 
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            Welcome to {companyName}
          </CardTitle>
          <p className="text-center text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </CardHeader>
        <CardContent>
          <UserAuthForm />
        </CardContent>
      </Card>
       <Toaster/>
    </div>
  );
}
