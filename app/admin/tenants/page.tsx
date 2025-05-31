"use client";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/shared/data-table/data-table";
import { Column, Pagination, Tenants } from "@/types/types";
import Link from "next/link";
import { changeStatus, fetchData } from "@/app/actions";
import { TenantsStatusModal } from "@/components/models/tenants-status-modal";
import { toast } from "sonner";

export default function TenantsPage() {
  const [data, setData] = useState<Tenants[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [actionType, setActionType] = useState<
    "activate" | "deactivate" | null
  >(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");

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
        `/admin/tenants?${params.toString()}`
      )) as {
        data: Tenants[];
        pagination: Pagination;
      };

      setData(response.data || (response.data as Tenants[])); // Handle both formats
      setTotalPages(response.pagination?.total_pages || 1);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchTenants();
  }, []);

  const handleOpenPopup = (type: "activate" | "deactivate", userId: number) => {
    setActionType(type);
    setSelectedUserId(userId);
    setIsPopupOpen(true);
  };

  const handleConfirm = async (reason: string) => {
    if (actionType && selectedUserId !== null) {
      const apiEndpoint =
        actionType === "activate"
          ? `/admin/tenants/${selectedUserId}/activate`
          : `/admin/tenants/${selectedUserId}/suspend`;
      const result = (await changeStatus(apiEndpoint, {
        reason: reason,
      })) as any;
      if (result.status === "success") {
        toast.success(result.message);
        fetchTenants();
      } else {
        toast.error(result.message);
      }
      // Close the popup and reset state
      setIsPopupOpen(false);
      setSelectedUserId(null);
      fetchTenants();
      // Optionally, refresh data here
    }
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchTenants(page, pageSize, searchQuery);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
    fetchTenants(1, newPageSize, searchQuery);
  };


  const columns: Column[] = [
    {
      id: "company_name",
      accessorKey: "company_name",
      header: "Company Name",
      cell: ({ row }: { row: any }) => <span>{row.original.company_name}</span>,
    },
    {
      id: "admin_name",
      accessorKey: "admin_name",
      header: " Name",
      cell: ({ row }: { row: any }) => (
        <span>{row.original.admin_name || "-"}</span>
      ),
    },

    {
      id: "admin_email",
      accessorKey: "admin_email",
      header: "Email",
      cell: ({ row }: { row: any }) => (
        <span>{row.original.admin_email || "-"}</span>
      ),
    },
    {
      id: "phone",
      accessorKey: "phone",
      header: "Mobile Number",
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const isActive = row.original.status === "active";
        return (
          <span>
            {isActive ? (
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => handleOpenPopup("deactivate", row.original.id)}
              >
                Deactivate
              </button>
            ) : (
              <button
                className="bg-green-500 text-white px-2 py-1 rounded"
                onClick={() => handleOpenPopup("activate", row.original.id)}
              >
                Activate
              </button>
            )}
          </span>
        );
      },
    },
    {
      id: "subdomain",
      accessorKey: "subdomain",
      header: "View",
      cell: ({ row }: { row: any }) => {
        return (
          <Link
            className="underline"
            href={`http://${row.original.subdomain}.${process.env.NEXT_PUBLIC_DOMIAN_URL}`}
            target="_blank"
          >
            View
          </Link>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <DataTable
        title="Tenants"
        columns={columns}
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
      <TenantsStatusModal
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onConfirm={handleConfirm}
        title={
          actionType === "activate" ? "Activate Tenant" : "Deactivate Tenant"
        }
        description={`Are you sure you want to ${
          actionType === "activate" ? "activate" : "deactivate"
        } this tenant? This action cannot be undone.`}
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        isLoading={loading}
      />
    </div>
  );
}
