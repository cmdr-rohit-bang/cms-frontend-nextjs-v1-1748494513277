"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DataTable } from "@/components/shared/data-table/data-table";
import { Column, Pagination } from "@/types/types";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");

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



  const fetchTenants = async (
    page: number = currentPage,
    limit: number = pageSize,
    search: string = searchQuery
  ) => {
    setLoading(true);
    try {
      // Update your API call to include pagination parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = (await fetchData(
        `api/whatsapp/messages?${params.toString()}`
      )) as {
        data: WhatsappMessage[];
        pagination: Pagination;
      };

      setData(response.data || (response.data as WhatsappMessage[])); // Handle both formats
      setTotalPages(response.pagination?.total_pages || 1);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants()
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchTenants(page, pageSize, searchQuery);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
    fetchTenants(1, newPageSize, searchQuery);
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
