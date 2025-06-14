import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { toast } from "sonner";
import { addData } from "@/app/actions";

export const commentFormSchema = z.object({
  message: z.string().min(1, "Comment is required"),
});

export type CommentFormValues = z.infer<typeof commentFormSchema>;

const Comments = ({
  ticketId,
  onMessageSent,
}: {
  ticketId: string;
  onMessageSent?: () => void;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
    
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (data: CommentFormValues) => {
    setIsSubmitting(true);
    try {
      const response: any = await addData(`/api/tickets/${ticketId}/messages`, {
        message: data.message,
      });

      console.log("response", response);

      if (response.data.success === true) {
        form.reset();
        if (onMessageSent) {
          onMessageSent();
        }
          
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Textarea
        placeholder="Type your reply..."
        {...form.register("message")}
        className="min-h-[100px]"
      />
      {form.formState.errors.message && (
        <p className="text-sm text-red-500 mt-1">
          {form.formState?.errors?.message?.message}
        </p>
      )}

      <div className="flex items-center justify-end">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          <Send className="mr-2 h-4 w-4" />
          {isSubmitting ? "Sending..." : "Send Reply"}
        </Button>
      </div>
    </form>
  );
};

export default Comments;
