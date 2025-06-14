"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Column,
  Pagination,
  TicketType,
  Contact as ContactType,
} from "@/types/types";
import { DataTable } from "@/components/shared/data-table/data-table";
import {
  addTagsAndRemoveTags,
  deleteBulkData,
  deleteData,
  fetchData,
} from "@/app/actions";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/components/models/delete-modal";
import { BaseModal } from "@/components/models/base-modal";
import { TagsModal } from "@/components/models/tags-modal";
import { debounce, formatDate } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Types for modal operations
type ModalType = "status" | "category" | "priority" | "assigned_to";
type DeleteMode = "single" | "multiple";
type TagsMode = "add" | "remove";
type ModalConfig = {
  title: string;
  options: { value: string; label: string }[];
  isTextarea: boolean;
  useCombobox: boolean;
  placeholder: string;
  isLoading: boolean;
  onSearch?: (search: string) => void; // 👈 allow optional onSearch
};

interface ChangeModalState {
  type: ModalType | null;
  open: boolean;
}

// Mock data - replace with actual API calls
const STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "pending", label: "Pending" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export default function TicketsPage() {
  const router = useRouter();

  // Data state
  const [data, setData] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");

  // Delete modal state
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const [idsToDelete, setIdsToDelete] = useState<string[] | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState<DeleteMode | null>(null);
  const [tableContacts, setTableContacts] = useState<
    { label: string; value: string }[]
  >([]);
  // Tags modal state
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [tagsModalMode, setTagsModalMode] = useState<TagsMode | null>(null);

  // Change modal state
  const [changeModalState, setChangeModalState] = useState<ChangeModalState>({
    type: null,
    open: false,
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Contacts state for assign to functionality
  const [contacts, setContacts] = useState<{ label: string; value: string }[]>(
    []
  );
  const [contactsLoading, setContactsLoading] = useState(false);

  // Add these state declarations near your other useState declarations
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isTagsActionLoading, setIsTagsActionLoading] = useState(false);
  const [isChangeActionLoading, setIsChangeActionLoading] = useState(false);

  const fetchTickets = async (
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

      const response = (await fetchData(
        `/api/tickets?${params.toString()}`
      )) as {
        data: TicketType[];
        pagination: Pagination;
      };
      setData(response.data || []);
      setTotalPages(response.pagination?.total_pages || 1);
    } catch (error:any) {
      toast.error(error.message || "Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async (
    search: string = "",
    forSearch: boolean = false
  ) => {
    try {
      const res = (await fetchData(`/api/contacts?search=${search}`)) as {
        data: ContactType[];
        pagination: Pagination;
      };
      const resData = res?.data || [];
      const formattedContacts = resData.map((contact: any) => ({
        label: contact.name,
        value: contact.id,
      }));
      if (forSearch) {
        setContacts(formattedContacts);
      } else {
        setTableContacts(formattedContacts);
      }
    } catch (error:any) {
      toast.error(error.message || "Failed to fetch contacts");
    } finally {
      setContactsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchContacts("", false); // Initial fetch for table contacts
  }, []);

  const debouncedSearch = debounce((search: string) => {
    fetchContacts(search, true);
  }, 300);


  const handleAdd = () => router.push("/admin/tickets/add");
  const handleEdit = (ticket: any) =>
    router.push(`/admin/tickets/edit/${ticket.id}`);
  const handleView = (ticket: any) =>
    router.push(`/admin/tickets/details/${ticket.id}`);

  const openDeleteConfirmation = (ticket: any) => {
    setItemToDelete(ticket);
    setDeleteMode("single");
    setIsDeleteDialogOpen(true);
  };

  const openDeleteMultipleConfirmation = (ids: string[]) => {
    setIdsToDelete(ids);
    setDeleteMode("multiple");
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleteLoading(true);
    try {
      if (deleteMode === "single" && itemToDelete) {
        await deleteData(`/api/tickets/${itemToDelete.id}`);
        toast.success("Ticket deleted successfully");
      } else if (deleteMode === "multiple" && idsToDelete) {
        await deleteBulkData(`/api/tickets/bulk-action`, {
          ticket_ids: idsToDelete,
          action: "delete",
        });
        toast.success(`${idsToDelete.length} tickets deleted successfully`);
      }
      await fetchTickets(currentPage, pageSize, searchQuery);
    } catch (error:any) {
      toast.error(error.message || "Failed to delete tickets");
    } finally {
      setIsDeleteLoading(false);
      closeDeleteDialog();
    }
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
    setIdsToDelete(null);
    setDeleteMode(null);
  };

  const handleAddTags = (ids: string[]) => {
    setTagsModalMode("add");
    setIsTagsModalOpen(true);
    setSelectedIds(ids);
  };

  const handleRemoveTags = (ids: string[]) => {
    setTagsModalMode("remove");
    setIsTagsModalOpen(true);
    setSelectedIds(ids);
  };

  const handleTagsConfirm = async (ids: string[], tags: string[]) => {
    try {
      setIsTagsActionLoading(true);
      const action = tagsModalMode === "add" ? "add_tags" : "remove_tags";
      await addTagsAndRemoveTags(`/api/tickets/bulk-action`, {
        ticket_ids: ids,
        action,
        tags,
      });
      toast.success(
        `Tags ${tagsModalMode === "add" ? "added" : "removed"} successfully`
      );
      await fetchTickets(currentPage, pageSize, searchQuery);
    } catch (error:any) {
      toast.error(error.message || "Failed to update tags");
    } finally {
      setIsTagsModalOpen(false);
      setIsTagsActionLoading(false);
    }
  };


  const openChangeModal = (type: ModalType, ids: string[]) => {
    setChangeModalState({ type, open: true });
    setSelectedIds(ids);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchTickets(page, pageSize,searchQuery);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); 
    fetchTickets(1, newPageSize,searchQuery);
  };

    const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); 
    fetchTickets(1, pageSize, query);
  };
  const handleChangeStatus = (ids: string[]) => openChangeModal("status", ids);
  const handleChangeCategory = (ids: string[]) =>
    openChangeModal("category", ids);
  const handleChangePriority = (ids: string[]) =>
    openChangeModal("priority", ids);
  const handleChangeAssignedTo = (ids: string[]) =>
    openChangeModal("assigned_to", ids);

  const handleChangeConfirm = async (value: string) => {
    setIsChangeActionLoading(true);
    try {
      const { type } = changeModalState;
      if (!type) return;

      const actionMap = {
        status: "update_status",
        category: "update_category",
        priority: "update_priority",
        assigned_to: "assign_to",
      };

      await addTagsAndRemoveTags(`/api/tickets/bulk-action`, {
        ticket_ids: selectedIds,
        action: actionMap[type],
        [type]: value,
      });

      toast.success(`${type.replace("_", " ")} updated successfully`);
      await fetchTickets(currentPage, pageSize, searchQuery);
    } catch (error) {
      toast.error(`Failed to update ${changeModalState.type}`);
    } finally {
      setIsChangeActionLoading(false);
      closeChangeModal();
    }
  };

  const closeChangeModal = () => {
    setChangeModalState({ type: null, open: false });
    setSelectedIds([]);
  };

  // Get modal configuration
  const getModalConfig = (): ModalConfig | null => {
    const { type } = changeModalState;
    if (!type) return null;

    const configs = {
      status: {
        title: "Update Status",
        options: STATUS_OPTIONS,
        isTextarea: false,
        useCombobox: false,
        placeholder: "Select status...",
        isLoading: false,
      },
      category: {
        title: "Update Category",
        options: [],
        isTextarea: true,
        useCombobox: false,
        placeholder: "Enter category description...",
        isLoading: false,
      },
      priority: {
        title: "Update Priority",
        options: PRIORITY_OPTIONS,
        isTextarea: false,
        useCombobox: false,
        placeholder: "Select priority...",
        isLoading: false,
      },
      assigned_to: {
        title: "Update Assigned To",
        options: contacts,
        isTextarea: false,
        useCombobox: true,
        placeholder: "Search and select assignee...",
        isLoading: contactsLoading,
        onSearch: fetchContacts, // Pass search function for dynamic loading
      },
    };

    return configs[type];
  };

  const columns: Column[] = [
    {
      id: "subject",
      accessorKey: "subject",
      header: "Subject",
    },
    {
      id: "description",
      accessorKey: "description",
      header: "Description",
      cell: ({ row }: { row: any }) => {
        const description = row.original.description || "";
        return description.length > 50
          ? description.substring(0, 50) + "..."
          : description;
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
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag: string, index: number) => {
                    // Define color variants for badges
                    const colorVariants = [
                      'bg-blue-100 text-blue-800 border-blue-200',
                      'bg-green-100 text-green-800 border-green-200',
                      'bg-purple-100 text-purple-800 border-purple-200',
                      'bg-yellow-100 text-yellow-800 border-yellow-200',
                      'bg-pink-100 text-pink-800 border-pink-200'
                    ];

                    // Get color variant based on index
                    const colorClass = colorVariants[index % colorVariants.length];

                    return (
                      <span
                        key={index}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}
                      >
                        {tag}
                      </span>
                    );
                  })}
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
    {
      id: "category",
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => row.original.category || "-",
    },
    {
      id: "priority",
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.getValue("priority") as string;
        return priority
          ? priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()
          : "-";
      },
    },
    {
      id: "assigned_to",
      accessorKey: "assigned_to",
      header: "Assigned To",
      cell: ({ row }) => {
        const user = row.getValue("assigned_to") ;
        const contact = tableContacts.find((c) => c.value === user);
        return contact?.label  || "-";
      },
    },
    {
      id: "due_date",
      accessorKey: "due_date",
      header: "Due Date",
      cell: ({ row }) => {
        const date = row.getValue("due_date");
        return date ? formatDate(date) : "-"
      },
    },
  ];

  const modalConfig = getModalConfig();

  return (
    <div className="space-y-6 p-4">
      <DataTable
        title="Tickets"
        columns={columns}
        data={data}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onView={handleView}
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
         searchable={true}
         onSearch={handleSearch}
        basePath="/admin/tickets"
        onDelete={openDeleteConfirmation}
        selection={{
          enabled: true,
          actions: [
            {
              id: "delete-tickets",
              label: "Delete Tickets",
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
              id: "change-priority",
              label: "Update Priority",
              action: handleChangePriority,
            },
            {
              id: "change-status",
              label: "Update Status",
              action: handleChangeStatus,
            },
            {
              id: "change-assigned-to",
              label: "Update Assigned To",
              action: handleChangeAssignedTo,
            },
            {
              id: "change-category",
              label: "Update Category",
              action: handleChangeCategory,
            },
          ],
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title={deleteMode === "multiple" ? "Delete Tickets" : "Delete Ticket"}
        description={
          deleteMode === "multiple"
            ? "Are you sure you want to delete these tickets? This action cannot be undone."
            : "Are you sure you want to delete this ticket? This action cannot be undone."
        }
        isLoading={isDeleteLoading}
      />

      {/* Tags Modal */}
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
            ? "Add tags to the selected tickets"
            : "Remove tags from the selected tickets"
        }
        confirmLabel={tagsModalMode === "add" ? "Add" : "Remove"}
        cancelLabel="Cancel"
        isLoading={isTagsActionLoading}
      />

      {/* Universal Change Modal */}
      {modalConfig && (
        <BaseModal
          isOpen={changeModalState.open}
          onClose={closeChangeModal}
          onConfirm={handleChangeConfirm}
          title={modalConfig.title}
          options={modalConfig.options}
          isTextarea={modalConfig.isTextarea}
          useCombobox={modalConfig.useCombobox}
          placeholder={modalConfig.placeholder}
          selectedCount={selectedIds.length}
          isLoading={isChangeActionLoading}
          onSearch={debouncedSearch}
        />
      )}
    </div>
  );
}
