"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/shared/data-table/data-table";
import { Column, Pagination, User as UserType } from "@/types/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fetchData } from "@/app/actions";
import { UserRoundCheck } from "lucide-react";
import Image from "next/image";
import { DeleteConfirmationDialog } from "@/components/models/delete-modal";

export default function UsersPage() {
  const router = useRouter();
  const [data, setData] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [emailVerificationToken, setEmailVerificationToken] = useState("");

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
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleAdd = () => router.push("/admin/users/add");


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUser(page, pageSize, searchQuery);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    fetchUser(1, newPageSize, searchQuery);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleUserVerified = async () => {
    try {
      await fetchData(
        `/auth/tenant/verify-token?token${emailVerificationToken}`
      );
      toast.success("User verified successfully");
      await fetchUser(currentPage, pageSize, searchQuery);
    } catch (error: any) {
      toast.error(error.message || "Failed to user verify");
    } finally {
      closeDeleteDialog();
    }
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
      cell({ row }) {
        return row.getValue("role") || "-";
      },
    },
    {
      id: "email",
      accessorKey: "email",
      header: "Email",
      cell({ row }) {
        return row.getValue("email") || "-";
      },
    },
    {
      id: "phone_number",
      accessorKey: "phone_number",
      header: "Phone Number",
      cell({ row }) {
        return row.getValue("phone_number") || "-";
      },
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const status = row.original.status;
        const emailToken = row.original.email_verification_token;
        return status === "pending" ? (
          <Image
            src={`http://${process.env.NEXT_PUBLIC_DOMIAN_URL}/icons/user-warning.svg`}
            alt="FlexiCMS Dashboard"
            width={24}
            height={24}
            className="object-cover cursor-pointer grayscale"
            onClick={() => {
              setIsDeleteDialogOpen(true);
              setEmailVerificationToken(emailToken);
            }}
          />
        ) : (
          <UserRoundCheck className="text-green-500" />
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

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleUserVerified}
        isDestruct={false}
        title={"Verify User"}
        description={
          "Are you sure you want to verify this user? This action cannot be undone."
        }
        confirmLabel="Verify"
      />
    </div>
  );
}
