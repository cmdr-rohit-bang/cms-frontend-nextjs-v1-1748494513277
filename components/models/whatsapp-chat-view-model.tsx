"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { WhatsappMessage } from "@/types/types";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { addData } from "@/app/actions";

export const WhatsappChatViewModel = ({
  isOpen,
  onClose,
  id,
}: {
  isOpen: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  id: string | null;
}) => {
  const [messages, setMessages] = useState<WhatsappMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const messageData = {
        message: newMessage,
        contact_id: id,
        // Add other necessary fields here
      };
      const result = await addData("/admin/whatsapp-message", messageData) as any;
      if (result?.status === "success") {
        toast.success(result.message, { position: "top-right" });
        setNewMessage("");
      } else {
        toast.error(result.message, { position: "top-right" });
      }
    }
  };
  // useEffect(() => {
  //   if (id) {
  //     fetchDataByIdOrUrl("whatsapp-message", id).then((res) => {
  //       setSelectedRow(res.data);
  //     });
  //   }
  // },[id]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-2xl font-bold text-gray-800">
             Messages
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 p-6 max-h-[70vh] overflow-y-auto">
          {/* Display Messages */}
          <Card className="p-6">
            <div className="flex flex-col gap-4">
              {messages.map((message) => (
                <div key={message.id} className="p-2 border-b">
                  <p>{message.message}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Input for New Message */}
          <div className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} className="bg-blue-500 text-white">
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
