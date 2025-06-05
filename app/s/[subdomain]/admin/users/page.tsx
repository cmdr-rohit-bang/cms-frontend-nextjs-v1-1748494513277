"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/shared/data-table/data-table";
import { Column, Pagination, User as UserType } from "@/types/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fetchData } from "@/app/actions";
import { UserCheck } from "lucide-react";
import Image from "next/image";

export default function UsersPage() {
  const router = useRouter();
  const [data, setData] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUser = async (
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

      const response = (await fetchData(`/auth/tenant/all`)) as {
        data: UserType[];
        pagination: Pagination;
      };

      setData(response.data || []);
      setTotalPages(response.pagination?.total_pages || 1);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleAdd = () => router.push("/admin/users/add");

  const handleEdit = (banner: any) => {
    router.push(`/admin/users/edit/${banner.id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUser(page, pageSize, searchQuery);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    fetchUser(1, newPageSize, searchQuery);
  };

  const columns: Column[] = [
    {
      id: "Name",
      accessorKey: "Name",
      header: "Name",
      cell: ({ row }: { row: any }) => (
        <p>
          {row.original.first_name}&nbsp;{row.original.last_name}
        </p>
      ),
    },
    {
      id: "role",
      accessorKey: "role",
      header: "Role",
    },
    {
      id: "email",
      accessorKey: "email",
      header: "Email",
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const status = row.original.status;

        return status === "pending" ? (
          <img
            src="/icons/user-warning.svg"
            alt="FlexiCMS Dashboard"
            width={80}
            height={80}
            className="object-cover"
          />
        ) : (
          <UserCheck className="text-green-500" />
        );
      },
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <DataTable
        title="Users"
        columns={columns}
        data={data}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        pageNumber={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        pagination={{
          has_next: currentPage < totalPages,
          has_previous: currentPage > 1,
        }}
        basePath="/admin/users"
      />
    </div>
  );
}
