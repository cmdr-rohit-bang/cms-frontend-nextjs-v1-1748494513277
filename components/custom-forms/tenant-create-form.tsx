"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Link } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/common/password-input";
import SubDomainCheck from "@/components/common/sub-domain-check";
import axios from "axios";
import { toast } from "sonner";

const SignupSchema = z
  .object({
    company_name: z.string().min(1, "Company name is required"),
    admin_email: z.string().email("Invalid email address"),
    admin_password: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    phone: z.string().optional(),
    admin_name: z.string().optional(),
  })
  .refine((data) => data.admin_password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export default function TenantCreateForm({
  setIsSubmitted,
}: {
  setIsSubmitted: (isSubmitted: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(
    null
  );
  const [subdomain, setSubdomain] = useState("");

  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      company_name: "",
      admin_name: "",
      admin_email: "",
      admin_password: "",
      confirmPassword: "",
      phone: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof SignupSchema>) => {
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/tenant/create`,
        {
          company_name: data.company_name,
          admin_name: data.admin_name,
          admin_email: data.admin_email,
          admin_password: data.admin_password,
          phone: data.phone,
          subdomain: subdomain,
          selected_modules: ["tickets", "contacts","whatsapp","broadcasts"],
          template: "modern",
        }
      );
      setIsSubmitted(true);
      setIsLoading(false);
    } catch (error:any) {
      toast.error(error.message || "Error creating tenant:");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div className="space-y-2">
              <SubDomainCheck
                subdomainAvailable={subdomainAvailable}
                setSubdomainAvailable={setSubdomainAvailable}
                setSubdomain={setSubdomain}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Company/Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Company Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="admin_name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Admin Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="admin_email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Admin Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="admin_password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-2">
           
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Start My CMS</span>
                  <ArrowRight size={16} />
                </div>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
