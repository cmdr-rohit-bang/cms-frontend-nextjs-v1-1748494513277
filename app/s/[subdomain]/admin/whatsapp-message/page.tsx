"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DataTable } from "@/components/shared/data-table/data-table";
import { Column } from "@/types/types";
import { WhatsappMessage } from "@/types/types";
import { fetchData } from "@/app/actions";
import { EyeIcon } from "lucide-react";

import { WhatsappChatViewModel } from "@/components/models/whatsapp-chat-view-model";
import { WhatsappMessageSendModel } from "@/components/models/whatsapp-message-send-model";
import BadgeStatus from "@/components/badge-status";

export default function WhatsappMessagePage() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<WhatsappMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const currentPage = searchParams.get("page") || "1";
  const pageNumber = parseInt(currentPage, 10) || 1;

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSendPopupOpen, setIsSendPopupOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState("");

  const handleViewClick = (message: WhatsappMessage) => {
    setSelectedMessageId(message.id);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedMessageId("");
  };

  useEffect(() => {
    const getData = async () => {
      const data = await fetchData("/admin/whatsapp-message") as WhatsappMessage[];
      setData(data);
      setLoading(false);
    };
    getData();
  }, []);


  const columns: Column[] = [
    {
      id: "phone_number",
      accessorKey: "phone_number",
      header: "Phone Number"
    },

    {
      id: "message",
      accessorKey: "message",
      header: "Message",
      cell: ({ row }: { row: any }) => {
        const message = row.original; // Assuming row.original contains the message data
        return (
          <p>{message.message.length > 10 ? message.message.slice(0, 10) + "..." : message.message}</p>
        );
      }
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const message = row.original; // Assuming row.original contains the message data
        return (
          <BadgeStatus status={message.status as 'sent' | 'delivered' | 'read' | 'failed' | 'pending' | 'scheduled'} />
        );
      }
    },
    {
      id: "date",
      accessorKey: "date",
      header: "Date",
    },
    {
      id: "id",
      accessorKey: "id",
      header: "View",
      cell: ({ row }: { row: any }) => {
        const message = row.original; // Assuming row.original contains the message data
        return (
          <button onClick={() => handleViewClick(message)}>
            <EyeIcon className="w-4 h-4" />
          </button>
        );
      }
    }
  ];

  return (
    <div className="space-y-6 p-4">
      <DataTable
        title="Whatsapp Message"
        columns={columns}
        onAdd={() => setIsSendPopupOpen(true)}
        data={data}
        loading={loading}
        pageNumber={pageNumber}
        totalPages={totalPages}
        basePath="/admin/whatsapp-message"
      />
      <WhatsappChatViewModel
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        id={selectedMessageId}
      />
      <WhatsappMessageSendModel
        isOpen={isSendPopupOpen}
        onClose={() => setIsSendPopupOpen(false)}
        id={selectedMessageId}
      />
    </div>
  );
}
