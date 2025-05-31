"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Column, TicketType } from "@/types/types";
import { DataTable } from "@/components/shared/data-table/data-table";
import { fetchData } from "@/app/actions";


export default function TicketsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const currentPage = searchParams.get("page") || "1";
  const pageNumber = parseInt(currentPage, 10) || 1;

  useEffect(() => {
    const getData = async () => {
      const data = await fetchData("/api/tickets") as TicketType[];
      setData(data);
      setLoading(false);
    };
    getData();
  }, []);

  const handleAdd = () => router.push("/admin/tickets/add");

  const handleEdit = (ticket: any) => {
    router.push(`/admin/tickets/edit/${ticket.id}`);
  };
  const handleView = (ticket: any) => {
    router.push(`/admin/tickets/${ticket.id}`);
  };


  const columns: Column[] = [
    {
      id: "title",
      accessorKey: "title",
      header: "Title",
    },
    {
      id: "details",
      accessorKey: "details",
      header: "Details",
    },
    {
      id: "category",
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const ticketCategory = row.original.ticketCategory;
        return ticketCategory?.name;
      },
    },
    // {
    //   id: "priority",
    //   accessorKey: "priority",
    //   header: "Priority",
    //   cell: ({ row }) => {
    //     const priority = row.getValue("priority");
    //     return getPriorityBadge(priority) || "-";
    //   },
    // },
        // {
        //   id: "status",
        //   accessorKey: "status",
        //   header: "Status",
        //   cell: ({ row }) => {
        //     const status = row.getValue("status");
        //     return status  ? <BadgeStatus status={status} />  : "-" ;
        //   },
        // },
    {
      id: "assignedTo",
      accessorKey: "assignedToUser",
      header: "Assigned To",
      cell: ({ row }) => {
        const assignedToUser = row.original.assignedToUser;
        return assignedToUser?.firstName && assignedToUser?.lastName
          ? `${assignedToUser.firstName} ${assignedToUser.lastName}`
          : "-";
      },
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <DataTable
            title="Tickets"
            columns={columns}
            data={data}
            onAdd={handleAdd}
            onEdit={handleEdit}
            loading={loading}
            pageNumber={pageNumber}
            totalPages={totalPages}
            basePath="/admin/tickets"
            onView={handleView}
          />
    </div>
  );
}
