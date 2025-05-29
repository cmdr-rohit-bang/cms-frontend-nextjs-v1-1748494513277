"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "@/components/shared/data-table/data-table";
import { Column, Tenants } from "@/types/types";
import Link from "next/link";
import { fetchData } from "@/app/actions";

export default function TenantsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<Tenants[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const currentPage = searchParams.get("page") || "1";
  const pageNumber = parseInt(currentPage, 10) || 1;

  useEffect(() => {
    const getData = async () => {
      const data = await fetchData("/admin/tenants") as Tenants[];
      setData(data);
      setLoading(false);
    };
    getData();
  }, []);

  const columns: Column[] = [
    {
      id: "company_name",
      accessorKey: "company_name",
      header: "Company Name",
      cell: ({ row }: { row: any }) => (
        <span>
          {row.original.firstName} {row.original.company_name}
        </span>
      ),
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
      id: "subdomain",
      accessorKey: "subdomain",
      header: "View",
      cell: ({ row }: { row: any }) => {
        return (
          <Link
            href={`https://${row.original.subdomain}.${process.env.NEXT_PUBLIC_APP_URL}`}
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
        pageNumber={pageNumber}
        totalPages={totalPages}
        basePath="/Tenants"
      />
    </div>
  );
}
