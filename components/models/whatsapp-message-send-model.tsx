"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { addData } from "@/app/actions";
import { Phone } from "lucide-react";


const formSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .length(10, { message: "Phone number must be exactly 10 digits." })
    .regex(/^[0-9]+$/, { message: "Digits only." }),
  message: z
    .string()
    .trim()
    .min(1, { message: "Message is required." })
    .max(4096, { message: "Too long. Max 4096 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

export const WhatsappMessageSendModel = ({
  isOpen,
  onClose,
  
}: {
  isOpen: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  
}) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      message: "",
    },
  });

  const watchMessage = form.watch("message");

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const result = (await addData("/api/whatsapp/messages/send", {
      content: data.message,
      phone_number: data.phoneNumber,
      type: "text",
      })) as any;

      if (result?.data.success === true) {
      toast.success(result.data.message, { position: "top-right" });
      handleClose();
      } else {
      toast.error(result.data.message, { position: "top-right" });
      }
    } catch (error) {
      toast.error("An error occurred while sending the message", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] rounded-xl p-0 overflow-hidden">
        <DialogHeader className="bg-gray-100 px-6 py-4">
          <DialogTitle className="text-gray-800 text-xl font-semibold">
            📩 Send WhatsApp Message
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 space-y-5"
          >
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter 10-digit phone number"
                      {...field}
                      className="focus-visible:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Message
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your message..."
                      className="min-h-[120px] resize-none focus-visible:ring-blue-500"
                      maxLength={4096}
                      {...field}
                    />
                  </FormControl>
                  <div className="text-xs text-right text-muted-foreground">
                    {watchMessage?.length || 0} / 4096 characters
                  </div>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
