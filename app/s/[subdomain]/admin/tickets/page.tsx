"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Column, Pagination, TicketType } from "@/types/types";
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
import CustomFields from "@/components/custom-forms/custom-fields-form";
import { TagsModal } from "@/components/models/tags-modal";

export default function TicketsPage() {
  const router = useRouter();
  const [data, setData] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
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

  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState({model:"" ,open:false});

  const fetchTickets = async (
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
        `/api/tickets?${params.toString()}`
      )) as {
        data: TicketType[];
        pagination: Pagination;
      };

      setData(response.data || (response.data as TicketType[]));
      setTotalPages(response.pagination?.total_pages || 1);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleAdd = () => router.push("/admin/tickets/add");

  const handleEdit = (ticket: any) => {
    router.push(`/admin/tickets/edit/${ticket.id}`);
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
        await deleteData(`/api/tickets/${itemToDelete.id}`);
        setData((prev) => prev.filter((c) => c.id !== itemToDelete.id));
        toast.success("tickets deleted successfully");
        fetchTickets(currentPage, pageSize, searchQuery);
      } catch (error) {
        console.error("Error deleting tickets:", error);
        toast.error("Failed to delete tickets");
      }
    }

    if (deleteMode === "multiple" && idsToDelete) {
      console.log("idsToDelete", idsToDelete);
      try {
        await deleteBulkData(`/api/tickets/bulk-action`, {
          contact_ids: idsToDelete,
          action: "delete",
        });
        setData((prev) => prev.filter((c) => !idsToDelete.includes(c.id)));
        toast.success(`${idsToDelete.length} tickets deleted successfully`);
        fetchTickets(currentPage, pageSize, searchQuery);
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
    fetchTickets(currentPage, pageSize, searchQuery);
  };

  const handleTagsConfirm = (ids: string[], tags: string[]) => {
    setIsTagsModalOpen(false);
    tagsModalMode === "add"
      ? addTagsAndRemoveTags(`/api/tickets/bulk-action`, {
          ticket_ids: ids,
          action: "add_tags",
          tags: tags,
        })
      : addTagsAndRemoveTags(`/api/tickets/bulk-action`, {
          ticket_ids: ids,
          action: "remove_tags",
          tags: tags,
        });

    fetchTickets(currentPage, pageSize, searchQuery);
  };

  const handleRemoveTags = (ids: string[]) => {
    console.log("remove-tags", ids);
    setTagsModalMode("remove");
    setIsTagsModalOpen(true);
    setSelectedIds(ids);
    fetchTickets(currentPage, pageSize, searchQuery);
  };

  const handleChangeStatus = (ids: string[]) => {
    setIsChangeStatusModalOpen({model:"status",open:true});
    setSelectedIds(ids);
    fetchTickets(currentPage, pageSize, searchQuery);
  };
  const handleChangeCategory = (ids: string[]) => {
    setIsChangeStatusModalOpen({model:"category",open:true});
    setSelectedIds(ids);
    fetchTickets(currentPage, pageSize, searchQuery);
  };

  const handleChangePriority = (ids: string[]) => {
    setIsChangeStatusModalOpen({model:"priority",open:true});
    setSelectedIds(ids);
    fetchTickets(currentPage, pageSize, searchQuery);
  };

  const handleChangeAssignedTo = (ids: string[]) => {
    setIsChangeStatusModalOpen({model:"assigned_to",open:true});
    setSelectedIds(ids);
    fetchTickets(currentPage, pageSize, searchQuery);
  };

  const handleChangeStatusConfirm = async () => {};

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
        return description.length > 100
          ? description.substring(0, 100) + "..."
          : description;
      },
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
    {
      id: "priority",
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.getValue("priority");
        return priority || "-";
      },
    },

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
        pageNumber={currentPage}
        totalPages={totalPages}
        basePath="/admin/tickets"
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
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setItemToDelete(null);
          setIdsToDelete(null);
          setDeleteMode(null);
        }}
        onConfirm={confirmDelete}
        title={deleteMode === "multiple" ? "Delete Tickets" : "Delete Ticket"}
        description={
          deleteMode === "multiple"
            ? "Are you sure you want to delete these Tickets? This action cannot be undone."
            : "Are you sure you want to delete this Ticket? This action cannot be undone."
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

      <BaseModal
        onConfirm={handleChangeStatusConfirm}
        title={isChangeStatusModalOpen.model}
        isOpen={isChangeStatusModalOpen.open}
        onClose={() => setIsChangeStatusModalOpen({model:isChangeStatusModalOpen.model,open:false})}
      ></BaseModal>
    </div>
  );
}
