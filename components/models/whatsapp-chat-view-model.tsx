"use client";
import React, { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WhatsappMessage } from "@/types/types";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { addData, fetchData } from "@/app/actions";
import { Send } from "lucide-react";
import { useSession } from "next-auth/react";

export const WhatsappChatViewModel = ({
  isOpen,
  onClose,
  phone_number,
}: {
  isOpen: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  phone_number: string | null;
}) => {
  const [messages, setMessages] = useState<WhatsappMessage>();
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const session = useSession()

  const fetchDataById = async () => {
    if (!phone_number || !isOpen) return;
    const res = (await fetchData(
      `/api/whatsapp/messages/conversation/${phone_number}`
    )) as any;
    setMessages(res.data);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      toast.error("Please enter a message", { position: "top-right" });
      return;
    }

    if (phone_number !== null) {
      const messageData = {
        phone_number,
        content: newMessage.trim(),
        type: "text",
      };

      const result = (await addData("/api/whatsapp/messages/send", messageData)) as any;

      if (result?.data.success === true) {
        setNewMessage("");
        fetchDataById();
      } else {
        toast.error(result.data.message, { position: "top-right" });
      }
    }
  };

  useEffect(() => {
    fetchDataById();
  }, [phone_number, isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sortedMessages = messages?.messages
    ? [...messages.messages].sort((a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 rounded-lg overflow-hidden">
        <DialogHeader className="bg-gray-100 px-6 py-4 border-b">
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            Chat with {phone_number}
          </DialogTitle>
        </DialogHeader>

        <div className="relative h-[60vh] flex flex-col bg-white">
          {/* Chat Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-gray-50"
          >
            {sortedMessages.length ? (
              sortedMessages.map((message, index) => {
                const isUser = message.sent_by_admin_id === session.data?.user.id; // Customize this based on your data
                return (
                  <div
                    key={index}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`rounded-xl px-4 py-2 text-sm max-w-[75%] shadow 
                        ${isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
                    >
                      <p>{message.content}</p>
                      <div className="text-[10px] text-gray-400 mt-1 text-right">
                        {new Date(message.created_at || Date.now()).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-sm text-gray-500">No messages yet.</div>
            )}
          </div>

          {/* Input Bar */}
          <div className="border-t p-4 bg-white sticky bottom-0 z-10">
            <div className="flex items-center gap-2">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 resize-none border-gray-300 text-sm"
                rows={1}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 flex gap-2 items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
