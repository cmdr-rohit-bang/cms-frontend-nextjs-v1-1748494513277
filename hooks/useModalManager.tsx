// hooks/useModalManager.ts
import { useState } from "react";

export type DeleteMode = "single" | "multiple" | null;
export type TagsMode = "add" | "remove" | null;

export const useModalManager = () => {
  const [isImportOpen, setImportOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState<DeleteMode>(null);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const [idsToDelete, setIdsToDelete] = useState<string[] | null>(null);

  const [isTagsOpen, setTagsOpen] = useState(false);
  const [tagsMode, setTagsMode] = useState<TagsMode>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [isCustomFieldOpen, setCustomFieldOpen] = useState(false);

  return {
    importModal: {
      isOpen: isImportOpen,
      open: () => setImportOpen(true),
      close: () => setImportOpen(false),
    },
    deleteDialog: {
      isOpen: isDeleteOpen,
      openSingle: (item: any) => {
        setItemToDelete(item);
        setDeleteMode("single");
        setDeleteOpen(true);
      },
      openMultiple: (ids: string[]) => {
        setIdsToDelete(ids);
        setDeleteMode("multiple");
        setDeleteOpen(true);
      },
      close: () => {
        setItemToDelete(null);
        setIdsToDelete(null);
        setDeleteMode(null);
        setDeleteOpen(false);
      },
      mode: deleteMode,
      item: itemToDelete,
      ids: idsToDelete,
    },
    tagsModal: {
      isOpen: isTagsOpen,
      open: (mode: TagsMode, ids: string[]) => {
        setTagsMode(mode);
        setSelectedIds(ids);
        setTagsOpen(true);
      },
      close: () => {
        setTagsOpen(false);
        setTagsMode(null);
        setSelectedIds([]);
      },
      mode: tagsMode,
      ids: selectedIds,
    },
    customFieldModal: {
      isOpen: isCustomFieldOpen,
      open: () => setCustomFieldOpen(true),
      close: () => setCustomFieldOpen(false),
    },
  };
};
