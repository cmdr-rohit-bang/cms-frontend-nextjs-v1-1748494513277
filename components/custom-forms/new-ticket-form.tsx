"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { TicketCategoryType } from "@/types/types";
import { FileDropzone } from "../common/file-dropzone";
import { z } from "zod";

export const ticketSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  description: z.string().min(10, "Description is required"),
  contact_name: z.string().min(1, "Name is required"),
  contact_phone: z.string().min(1, "Phone number is required"),
  category: z.string().optional(),
  countryCode: z.string().optional(),
});

export type TicketValues = z.infer<typeof ticketSchema>;

interface TicketFormProps {
  onSubmit: (data: TicketValues) => void;
  submitText?: string;
  isLoading?: boolean;
 
}

export function NewTicketForm({
  onSubmit,
  submitText = "Submit Ticket",
  isLoading = false,

}: TicketFormProps) {
  const form = useForm<TicketValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      category: "",
      subject: "",
      description: "",
      contact_name: "",
      contact_phone: "",
      countryCode: "+1",
    },
  });

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">Submit a Support Ticket</CardTitle>
        <CardDescription>
          Fill out the form below to create a new support ticket
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="accounting">Accounting</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Briefly describe your issue"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide details about your issue"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="attachments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attachments (optional)</FormLabel>
                  <FormControl>
                    <FileDropzone
                      value={field.value}
                      onChange={(files) => field.onChange(files)}
                      maxFiles={5}
                      maxSize={10}
                      accept={{
                        "image/*": [".png", ".jpg", ".jpeg"],
                        "application/pdf": [".pdf"],
                        "application/msword": [".doc"],
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
                          ".docx",
                        ],
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Max 5 files. Supported formats: PNG, JPG, PDF, DOC, DOCX. Max
                    size: 10MB each.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="contact_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="contact_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <div className="flex gap-2">
                        <Select
                          value={form.watch("countryCode")}
                          onValueChange={(value) =>
                            form.setValue("countryCode", value)
                          }
                        >
                          <SelectTrigger className="w-[80px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="+1">+1</SelectItem>
                            <SelectItem value="+44">+44</SelectItem>
                            <SelectItem value="+91">+91</SelectItem>
                            <SelectItem value="+61">+61</SelectItem>
                            <SelectItem value="+81">+81</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                submitText
              )}
            </Button>
            <div className="text-center text-sm">
              Already have a ticket?{" "}
              <Link
                href="/ticket/my-tickets"
                className="font-medium text-primary hover:underline"
              >
                Check status
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
