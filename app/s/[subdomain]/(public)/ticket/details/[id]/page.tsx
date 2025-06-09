"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { User } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { Comment, TicketType } from "@/types/types";
import { fetchData } from "@/app/actions";
import Comments from "@/components/custom-forms/comments-form";
import BadgeStatus from "@/components/common/badge-status";
import CommentsComponent from "@/components/common/comments";

export default function TicketDetailPage() {
  const params = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ticketId = params.id as string;
  const [ticket, setTicket] = useState<TicketType | null>(null);

  const [messages, setMessages] = useState<Comment[] | []>([]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const fetchMessages = async () => {
    const messageData = (await fetchData(
      `/api/tickets/${params.id}/messages`
    )) as any;
    setMessages(messageData.data);
  };

  useEffect(() => {
    const fetchDataById = async () => {
      const ticketData = (await fetchData(`/api/tickets/${params.id}`)) as any;
      setTicket(ticketData.data);
      await fetchMessages();
    };
    fetchDataById();
  }, [params.id]);

  const handleNewMessage = async () => {
    await fetchMessages();
    setTimeout(scrollToBottom, 100);
  };

  if (!ticket)
    return (
      <div className="h-[90vh] w-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2563eb]"></div>
      </div>
    );

  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {ticket.subject}
            </h1>
            <BadgeStatus status={ticket.status} />
          </div>
          <p className="text-muted-foreground">
            Created {formatDate(ticket.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Ticket Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">
                    Status
                  </div>
                  <span className="capitalize">{ticket.status}</span>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">
                    Priority
                  </div>
                  <span className="capitalize">{ticket.priority}</span>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">
                    Assigned To
                  </div>
                  {ticket.assigned_admin?.first_name }&nbsp;{ticket.assigned_admin?.last_name }
                </div>

                <Separator />

                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">
                    Customer
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{ticket?.contact_name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {ticket?.contact?.email}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">
                    Created
                  </div>
                  <div>{formatDate(ticket.createdAt)}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </div>
                  <div>{formatDate(ticket.updatedAt)}</div>
                </div>
                {ticket.due_date && (
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">
                      Due Date
                    </div>
                    <div>{formatDate(ticket.due_date)} </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Conversation</CardTitle>
              <CardDescription>
                Communication between customer and support staff
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 h-[50vh] overflow-y-auto">
                <CommentsComponent messages={messages} />
                <div ref={messagesEndRef} />
              </div>

              <Separator className="my-6" />

              <Comments ticketId={ticketId} onMessageSent={handleNewMessage} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
