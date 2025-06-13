"use client";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/shared/data-table/data-table";
import { Column, Pagination } from "@/types/types";
import { WhatsappMessage } from "@/types/types";
import { fetchData } from "@/app/actions";
import { EyeIcon } from "lucide-react";
import { WhatsappChatViewModel } from "@/components/models/whatsapp-chat-view-model";
import { WhatsappMessageSendModel } from "@/components/models/whatsapp-message-send-model";
import BadgeStatus from "@/components/badge-status";
import { formatDate } from "@/lib/utils";

export default function WhatsappMessagePage() {
  const [data, setData] = useState<WhatsappMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSendPopupOpen, setIsSendPopupOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string|null>(null);

  const handleViewClick = (message: WhatsappMessage) => {
    setSelectedMessage(message.phone_number);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedMessage("");
  };

  const fetchMessages = async (
    page: number = currentPage,
    limit: number = pageSize,
    search: string = searchQuery
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = (await fetchData(
        `api/whatsapp/messages/grouped?${params.toString()}`
      )) as {
        data: WhatsappMessage[];
        pagination: Pagination;
      };

      setData(response.data || (response.data as WhatsappMessage[])); //
      setTotalPages(response.pagination?.total_pages || 1);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const columns: Column[] = [
    {
      id: "phone_number",
      accessorKey: "phone_number",
      header: "Phone Number",
    },

    {
      id: "content",
      accessorKey: "content",
      header: "Message",
      cell: ({ row }: { row: any }) => {
        const message = row.original.latest_message.content; // Assuming row.original contains the message data
        return (
          <p>
            {message > 100 ? message.slice(0, 100) + "..." : message}
          </p>
        );
      },
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const message = row.original.latest_message; // Assuming row.original contains the message data
        return (
          <BadgeStatus
            status={
              message.status as
                | "sent"
                | "delivered"
                | "read"
                | "failed"
                | "pending"
                | "scheduled"
            }
          />
        );
      },
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => {
        const date = row.original.latest_message.created_at;
        return date ? formatDate(date) : "-";
      },
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
      },
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchMessages(page, pageSize, searchQuery);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
    fetchMessages(1, newPageSize, searchQuery);
  };

  return (
    <div className="space-y-6 p-4">
      <DataTable
        title="Whatsapp Message"
        columns={columns}
        onAdd={() => setIsSendPopupOpen(true)}
        data={data}
        loading={loading}
        pageNumber={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        pagination={{
          has_next: currentPage < totalPages,
          has_previous: currentPage > 1,
        }}
      />
      <WhatsappChatViewModel
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        phone_number={selectedMessage}
      />
      <WhatsappMessageSendModel
        isOpen={isSendPopupOpen}
        onClose={() => setIsSendPopupOpen(false)}
      />
    </div>
  );
}
