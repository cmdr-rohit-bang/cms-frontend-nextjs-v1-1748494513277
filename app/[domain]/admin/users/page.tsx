"use client";

import { useState, useTransition } from "react";

import { Card, CardContent } from "@/components/ui/card";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { DataTable } from "@/components/shared/data-table/data-table";
import { Column } from "@/types/types";
import { User as UserType } from "@/types/types";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [isPending, startTransition] = useTransition();
  const currentPage = searchParams.get("page") || "1";
  const pageNumber = parseInt(currentPage, 10) || 1;

  const handleAdd = () => router.push("/admin/users/add");

  const handleEdit = (banner: any) => {
    router.push(`/admin/users/edit/${banner.id}`);
  };

  const columns: Column[] = [
    {
      id: "profile",
      accessorKey: "profile",
      header: "Image",
      cell: ({ row }: { row: any }) => (
        <div className="relative w-20 h-20">
          <Image
            src={row.original.profile || "/user.png"}
            alt={row.original.firstName || "user-img"}
            fill
            className="object-cover rounded-md"
          />
        </div>
      ),
    },
    {
      id: "Name",
      accessorKey: "Name",
      header: "Name",
      cell: ({ row }: { row: any }) => (
        <p>
          {row.original.firstName}&nbsp;{row.original.lastName}{" "}
        </p>
      ),
    },

    {
      id: "email",
      accessorKey: "email",
      header: "Email",
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <DataTable
        title="Users"
        columns={columns}
        data={data}
        loading={loading || isPending}
        onAdd={handleAdd}
        onEdit={handleEdit}
        pageNumber={pageNumber}
        totalPages={totalPages}
        basePath="/admin/users"
      />
    </div>
  );
}
