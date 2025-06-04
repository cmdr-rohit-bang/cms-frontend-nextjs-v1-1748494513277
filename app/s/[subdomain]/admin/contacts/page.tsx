"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Column, Pagination } from "@/types/types";
import { DataTable } from "@/components/shared/data-table/data-table";
import { Contact as ContactType } from "@/types/types";
import {
  addTagsAndRemoveTags,
  deleteBulkData,
  deleteData,
  exportData,
  fetchData,
  importData,
} from "@/app/actions";
import { ContactsImportModal } from "@/components/models/contacts-import-modal";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/components/models/delete-modal";
import { TagsModal } from "@/components/models/tags-modal";
import CustomFields from "@/components/custom-forms/custom-fields-form";
import { CustomFieldModal } from "@/components/models/custom-fields-modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [tagsModalMode, setTagsModalMode] = useState<"add" | "remove" | null>(
    null
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCustomFieldModalOpen, setIsCustomFieldModalOpen] = useState(false);
  const [customFieldsId, setCustomFieldsId] = useState<string[]>([]);
  const [customFields, setCustomFields] = useState([{ key: "", value: "" }]);

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
      fetchContacts(currentPage, pageSize, searchQuery);
      toast.success("Contacts imported successfully");
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
        setData((prev) => prev.filter((c) => c.id !== itemToDelete.id));
        toast.success("Contact deleted successfully");
        fetchContacts(currentPage, pageSize, searchQuery);
      } catch (error) {
        console.error("Error deleting contact:", error);
        toast.error("Failed to delete contact");
      }
    }

    if (deleteMode === "multiple" && idsToDelete) {
      try {
        const res: any = await deleteBulkData(`/api/contacts/bulk-action`, {
          contact_ids: idsToDelete,
          action: "delete",
        });
        setData((prev) => prev.filter((c) => !idsToDelete.includes(c.id)));
        if (res.success === true) {
          toast.success(res.message);
          fetchContacts(currentPage, pageSize, searchQuery);
        } else {
          toast.error(res.message);
        }
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

  const handleAddTags = (ids: string[]) => {
    setTagsModalMode("add");
    setIsTagsModalOpen(true);
    setSelectedIds(ids);
    fetchContacts(currentPage, pageSize, searchQuery);
  };

  const handleTagsConfirm = async (ids: string[], tags: string[]) => {
    setIsTagsModalOpen(false);
    let res: any;
    tagsModalMode === "add"
      ? (res = await addTagsAndRemoveTags(`/api/contacts/bulk-action`, {
          contact_ids: ids,
          action: "add_tags",
          tags: tags,
        }))
      : (res = await addTagsAndRemoveTags(`/api/contacts/bulk-action`, {
          contact_ids: ids,
          action: "remove_tags",
          tags: tags,
        }));

    if (res.success === true) {
      toast.success(res.message);
      fetchContacts(currentPage, pageSize, searchQuery);
    } else {
      toast.error("Tags could not be added");
    }
  };

  const handleRemoveTags = (ids: string[]) => {
    console.log("remove-tags", ids);
    setTagsModalMode("remove");
    setIsTagsModalOpen(true);
    setSelectedIds(ids);
    fetchContacts(currentPage, pageSize, searchQuery);
  };

  const handleAddCustomField = (ids: string[]) => {
    console.log("add-custom-field", ids);
    setCustomFieldsId(ids);
    setIsCustomFieldModalOpen(true);
    fetchContacts(currentPage, pageSize, searchQuery);
  };

  const handleAddCustomFieldConfirm = async () => {
    if (customFields.length > 0) {
      const objectifiedCustomFields = customFields.reduce((acc, field) => {
        const key = field.key?.trim();
        const value = field.value?.trim();
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>);

      const jsonString = JSON.stringify(objectifiedCustomFields);
      const jsonParse = JSON.parse(jsonString);

      const dataToSend = {
        contact_ids: customFieldsId,
        action: "update_fields",
        fields: jsonParse,
      };

      const res: any = await addTagsAndRemoveTags(
        `/api/contacts/bulk-action`,
        dataToSend
      );
      if (res.success === true) {
        toast.success("Custom fields updated successfully");
        fetchContacts(currentPage, pageSize, searchQuery);
      } else {
        toast.error(res.message);
      }
    }
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
      cell({ row }) {
        return row.getValue("address") || "-";
      },
    },
    {
      id: "tags",
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }: { row: any }) => {
        const tags = row.original.tags || [];

        return (
          <div className="flex items-center">
            {tags.length > 0 ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs bg-blue-100 text-blue-800 rounded-full px-3 py-1 hover:bg-blue-200 transition-colors border border-blue-200"
                  >
                    {tags.length} {tags.length === 1 ? "tag" : "tags"}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[200px] p-3 max-w-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="grid grid-cols-2 gap-2">
                    {tags.map((tag: string, index: number) => (
                      <div
                        key={index}
                        className="text-sm px-2 py-1 bg-gray-50 rounded text-gray-700 text-center hover:bg-gray-100 transition-colors"
                        style={{
                          gridRow: `span ${Math.ceil(tag.length / 10)}`,
                        }}
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <span className="text-xs text-gray-400 italic">No tags</span>
            )}
          </div>
        );
      },
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
        selection={{
          enabled: true,
          actions: [
            {
              id: "delete-users",
              label: "Delete Users",
              variant: "destructive",
              showCount: true,
              action: openDeleteMultipleConfirmation,
            },
            {
              id: "add-tags",
              label: "Add Tags",
              action: handleAddTags,
            },
            {
              id: "remove-tags",
              label: "Remove Tags",
              action: handleRemoveTags,
            },
            {
              id: "add-custom-field",
              label: "Add Custom Field",
              action: handleAddCustomField,
            },
          ],
        }}
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
        title={deleteMode === "multiple" ? "Delete Contacts" : "Delete Contact"}
        description={
          deleteMode === "multiple"
            ? "Are you sure you want to delete these contacts? This action cannot be undone."
            : "Are you sure you want to delete this contact? This action cannot be undone."
        }
      />
      <TagsModal
        isOpen={isTagsModalOpen}
        onClose={() => setIsTagsModalOpen(false)}
        onConfirm={handleTagsConfirm}
        mode={tagsModalMode || "add"}
        selectedIds={selectedIds}
        data={data}
        availableTags={[
          "partner",
          "customer",
          "prospect",
          "vendor",
          "important",
        ]}
        title={tagsModalMode === "add" ? "Add Tags" : "Remove Tags"}
        description={
          tagsModalMode === "add"
            ? "Add tags to the selected contacts"
            : "Remove tags from the selected contacts"
        }
        confirmLabel={tagsModalMode === "add" ? "Add" : "Remove"}
        cancelLabel="Cancel"
        isLoading={false}
      />
      <CustomFieldModal
        onConfirm={handleAddCustomFieldConfirm}
        title="Add Custom Field"
        isOpen={isCustomFieldModalOpen}
        onClose={() => setIsCustomFieldModalOpen(false)}
      >
        <CustomFields
          setCustomFields={setCustomFields}
          customFields={customFields}
        />
      </CustomFieldModal>
    </div>
  );
}
