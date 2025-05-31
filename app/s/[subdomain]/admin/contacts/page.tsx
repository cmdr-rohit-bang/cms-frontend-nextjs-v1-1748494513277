"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Column, Pagination } from "@/types/types";
import { DataTable } from "@/components/shared/data-table/data-table";
import { Contact as ContactType } from "@/types/types";
import { deleteBulkData, deleteData, exportData, fetchData, importData } from "@/app/actions";
import { ContactsImportModal } from "@/components/models/contacts-import-modal";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/components/models/delete-modal";

export default function ContactsPage() {
  const router = useRouter();
  const [data, setData] = useState<ContactType[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const [idsToDelete, setIdsToDelete] = useState<string[] | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState<"single" | "multiple" | null>(
    null
  );

  const fetchContacts = async (
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
        `/api/contacts?${params.toString()}`
      )) as {
        data: ContactType[];
        pagination: Pagination;
      };

      setData(response.data || (response.data as ContactType[])); // Handle both formats
      setTotalPages(response.pagination?.total_pages || 1);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchContacts();
  }, []);
  const handleAdd = () => router.push("/admin/contacts/add");

  const handleEdit = (contacts: any) => {
    router.push(`/admin/contacts/edit/${contacts.id}`);
  };

  const handleImport = () => {
    setIsImportModalOpen(true);
  };

  const handleExport = async () => {
    await exportData("/api/contacts/export");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
    fetchContacts(1, pageSize, query);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchContacts(page, pageSize, searchQuery);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
    fetchContacts(1, newPageSize, searchQuery);
  };

  const handleImportConfirm = async (contacts: File) => {
    const formData = new FormData();
    formData.append("file", contacts);
    try {
      const res = await importData("/api/contacts/import", formData);
      console.log("Import response:", res);
    } catch (error) {
      console.error("Import failed:", error);
    }
  };

  const openDeleteConfirmation = (contact: any) => {
    setItemToDelete(contact);
    setDeleteMode("single");
    setIsDeleteDialogOpen(true);
  };

  const openDeleteMultipleConfirmation = (contacts: any[]) => {
    setIdsToDelete(contacts);
    setDeleteMode("multiple");
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteMode === "single" && itemToDelete) {
      try {
        await deleteData(`/api/contacts/${itemToDelete.id}`);
        setData(prev => prev.filter(c => c.id !== itemToDelete.id));
        toast.success("Contact deleted successfully");
      } catch (error) {
        console.error("Error deleting contact:", error);
        toast.error("Failed to delete contact");
      }
    }
  
    if (deleteMode === "multiple" && idsToDelete) {
      console.log("idsToDelete", idsToDelete);
      try {
         await deleteBulkData(`/api/contacts/bulk-action`, {
          "contact_ids": idsToDelete,
          "action": "delete",
        });
        setData(prev => prev.filter(c => !idsToDelete.includes(c.id)));
        toast.success(`${idsToDelete.length} contact(s) deleted successfully`);
      } catch (error) {
        console.error("Error deleting contacts:", error);
        toast.error("Failed to delete contacts");
      }
    }
  
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
    setIdsToDelete(null);
    setDeleteMode(null);
  };

  const columns: Column[] = [
    {
      id: "name",
      accessorKey: "name",
      header: "Name",
    },

    {
      id: "email",
      accessorKey: "email",
      header: "Email",
    },
    {
      id: "phone",
      accessorKey: "phone",
      header: "Mobile Number",
    },
    {
      id: "company",
      accessorKey: "company",
      header: "Company Name",
    },
    {
      id: "address",
      accessorKey: "address",
      header: "Address",
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
        basePath="/admin/contacts"
        onImport={handleImport}
        onExport={handleExport}
        pageNumber={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        searchable={true}
        onPageSizeChange={handlePageSizeChange}
        pagination={{
          has_next: currentPage < totalPages,
          has_previous: currentPage > 1,
        }}
        onDelete={openDeleteConfirmation}
        onDeleteMultiple={openDeleteMultipleConfirmation}
        allowSelection={true}
      />
      <ContactsImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onConfirm={handleImportConfirm}
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setItemToDelete(null);
          setIdsToDelete(null);
          setDeleteMode(null);
      
        }}
        onConfirm={confirmDelete}
        title={
          deleteMode === "multiple"
            ? "Delete Contacts"
            : "Delete Contact"
        }
        description={
          deleteMode === "multiple"
            ? "Are you sure you want to delete these contacts? This action cannot be undone."
            : "Are you sure you want to delete this contact? This action cannot be undone."
        }
      />
    </div>
  );
}
