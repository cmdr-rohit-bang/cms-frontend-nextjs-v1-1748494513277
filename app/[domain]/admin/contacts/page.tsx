"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Column } from "@/types/types";
import { DataTable } from "@/components/shared/data-table/data-table";
import { Contact as ContactType } from "@/types/types";
import { fetchData } from "@/app/actions";

export default function ContactsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<ContactType[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const currentPage = searchParams.get("page") || "1";
  const pageNumber = parseInt(currentPage, 10) || 1;

  useEffect(() => {
    const getData = async () => {
      const data = await fetchData("/admin/contacts") as ContactType[];
      setData(data);
      setLoading(false);
    };
    getData();
  }, []);

  const handleAdd = () => router.push("/admin/contacts/add");

  const handleEdit = (contacts: any) => {
    router.push(`/admin/contacts/edit/${contacts.id}`);
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
            className="object-contain rounded-md"
          />
        </div>
      ),
    },
    {
      id: "Name",
      accessorKey: "Name",
      header: "Name",
      cell: ({ row }: { row: any }) => (
        <span>
          {row.original.firstName} {row.original.lastName}
        </span>
      ),
    },

    {
      id: "email",
      accessorKey: "email",
      header: "Email",
      cell: ({ row }: { row: any }) => <span>{row.original.email || "-"}</span>,
    },
    {
      id: "mobileNumber",
      accessorKey: "mobileNumber",
      header: "Mobile Number",
    },
    {
      id: "companyName",
      accessorKey: "companyName",
      header: "Company Name",
      cell: ({ row }: { row: any }) => (
        <span>{row.original.companyName || "-"}</span>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => (
        <p>{row.original.isArchive ? "Active" : "Inactive"}</p>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <DataTable
        title="Contacts"
        columns={columns}
        data={data}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        pageNumber={pageNumber}
        totalPages={totalPages}
        basePath="/admin/contacts"
      />
    </div>
  );
}
