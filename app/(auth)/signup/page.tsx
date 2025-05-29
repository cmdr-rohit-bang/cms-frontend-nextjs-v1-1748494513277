"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import TenantCreateForm from "@/components/custom-forms/tenant-create-form";
import { Grid3X3 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function SignupPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-muted/40">

      {isSubmitted ? (
        <div className="container max-w-6xl py-8 h-screen flex items-center justify-center">        
        <div className="text-center shadow-md p-10 rounded-lg">
          <h2 className="text-2xl font-bold">Thank You!</h2>
          <p className="mb-4 mt-3">
            Your account has been created successfully.
          </p>
          <p className="mb-4">Please check your email for the subdomain and login details.</p>
          <Image
            src="/thank-you-illustration-download.webp"
            alt="Thank You"
            width={400}
            height={400}
          />
        </div>
        </div>
      ) : (
        <div className="container max-w-6xl py-8">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Grid3X3 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">FlexiCMS</span>
            </Link>
          </div>

          <Card className="mx-auto max-w-4xl">
            <CardContent className="pt-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-center">
                  Create Your FlexiCMS Account
                </h1>
              </div>
              <TenantCreateForm setIsSubmitted={setIsSubmitted} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
