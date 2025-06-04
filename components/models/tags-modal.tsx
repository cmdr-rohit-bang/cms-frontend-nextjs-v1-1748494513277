import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { ChevronsUpDown, X, Check, Search, Plus, Minus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

type ModalMode = "add" | "remove";

interface TagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (ids: string[], tags: string[]) => void;
  mode: ModalMode;
  selectedIds: string[];
  data: Array<{ id: string; tags: string[] }>;
  availableTags?: string[];
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

export const TagsModal = ({
  isOpen,
  onClose,
  onConfirm,
  mode,
  selectedIds = [],
  data = [],
  availableTags = ["partner", "customer", "prospect", "vendor", "important"],
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  isLoading = false,
}: TagsModalProps) => {
  const isAddMode = mode === "add";
  const isRemoveMode = mode === "remove";

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [removedTags, setRemovedTags] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string>("");

  const getCommonTags = () => {
    if (selectedIds.length === 0) return [];
    const selectedItems = data.filter((item) => selectedIds.includes(item.id));
    const tagArrays = selectedItems.map((item) => item.tags || []);
    return tagArrays[0].filter((tag) => tagArrays.every((arr) => arr.includes(tag)));
  };

  const allTags = [...availableTags, ...customTags];
  const filteredTags = allTags.filter((tag) =>
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isNewTag =
    searchTerm.trim() &&
    !allTags.some((tag) => tag.toLowerCase() === searchTerm.toLowerCase().trim());

  const modalTitle = title || (isAddMode ? "Add Tags" : "Remove Tags");
  const modalDescription =
    description ||
    (isAddMode
      ? `Select tags to add to ${selectedIds.length} selected contact${selectedIds.length > 1 ? "s" : ""}.`
      : `Select tags to remove from ${selectedIds.length} selected contact${selectedIds.length > 1 ? "s" : ""}.`);
  const finalConfirmLabel = confirmLabel || (isAddMode ? "Add Tags" : "Remove Tags");
  const selectionMessage = isAddMode
    ? "Please select at least one tag to add"
    : "Please select at least one tag to remove";

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    setError("");
  };

  const handleTagRemove = (tag: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
    if (isRemoveMode) {
      setRemovedTags((prev) => [...prev, tag]);
    }
    if (customTags.includes(tag)) {
      setCustomTags((prev) => prev.filter((t) => t !== tag));
    }
  };

  const handleCreateTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    const exists = allTags.some((t) => t.toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      setCustomTags((prev) => [...prev, trimmed]);
      setSelectedTags((prev) => [...prev, trimmed]);
      setSearchTerm("");
      setError("");
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isNewTag) {
        handleCreateTag(searchTerm);
      } else if (filteredTags.length > 0) {
        handleTagToggle(filteredTags[0]);
        setSearchTerm("");
      }
    }
  };

  const handleClose = () => {
    setSelectedTags([]);
    setRemovedTags([]);
    setSearchTerm("");
    setCustomTags([]);
    setError("");
    onClose();
  };

  const handleConfirm = () => {
    if (isAddMode && selectedTags.length === 0) {
      setError(selectionMessage);
      return;
    }
    if (isRemoveMode && removedTags.length === 0) {
      setError(selectionMessage);
      return;
    }

    setError("");
    onConfirm(selectedIds, isAddMode ? selectedTags : removedTags);
    handleClose();
  };

  useEffect(() => {
    if (isOpen) {
      const common = getCommonTags();
      setSelectedTags(common);
      setRemovedTags([]);
      setCustomTags([]);
      setSearchTerm("");
      setError("");
    }
  }, [isOpen, mode, selectedIds]);

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {isAddMode ? <Plus className="h-5 w-5" /> : <Minus className="h-5 w-5" />}
            {modalTitle}
          </AlertDialogTitle>
          <AlertDialogDescription>{modalDescription}</AlertDialogDescription>

          {selectedIds.length > 1 && (
            <div className="text-sm text-muted-foreground mt-1 p-2 bg-blue-50 rounded-md border border-blue-200">
              Common tags across all selected contacts are pre-selected.
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm mt-2 p-2 bg-red-50 rounded-md border border-red-200">
              {error}
            </div>
          )}

          {isAddMode && (
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between text-left font-normal transition-colors",
                    !selectedTags.length && "text-muted-foreground"
                  )}
                  type="button"
                >
                  <span className="truncate">
                    {selectedTags.length > 0
                      ? `${selectedTags.length} tag${selectedTags.length > 1 ? "s" : ""} selected`
                      : `Select tags to ${mode}`}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <div className="p-2">
                  <div className="flex items-center border-b px-3 pb-2">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <input
                      className="flex h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                      placeholder="Search or create new tag..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                    />
                    {isNewTag && (
                      <button
                        type="button"
                        onClick={() => handleCreateTag(searchTerm)}
                        className="ml-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Create
                      </button>
                    )}
                  </div>

                  <div className="max-h-[200px] overflow-y-auto p-1">
                    {isNewTag && (
                      <div
                        className="relative flex items-center cursor-pointer px-2 py-1.5 text-sm hover:bg-green-50 text-green-700 border-b"
                        onClick={() => handleCreateTag(searchTerm)}
                      >
                        <Plus className="mr-2 h-4 w-4 text-green-500" />
                        Create "{searchTerm.trim()}"
                        <span className="ml-auto text-xs text-green-600 font-medium">
                          Press Enter
                        </span>
                      </div>
                    )}

                    {filteredTags.map((tag) => (
                      <div
                        key={tag}
                        className="relative flex items-center cursor-pointer px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                        onClick={() => handleTagToggle(tag)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedTags.includes(tag) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {tag}
                        {customTags.includes(tag) && (
                          <span className="ml-auto text-xs text-green-600">custom</span>
                        )}
                      </div>
                    ))}

                    {filteredTags.length === 0 && !isNewTag && (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        No tags found. Type to create one.
                      </div>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {selectedTags.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium mb-2">Tags to {mode}:</p>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md",
                      isAddMode
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-100 text-red-800 border border-red-200",
                      customTags.includes(tag) && "ring-2 ring-yellow-300"
                    )}
                  >
                    {isAddMode ? <Plus className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                    {tag}
                    {customTags.includes(tag) && (
                      <span className="text-xs opacity-75">(new)</span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => handleTagRemove(tag, e)}
                      className="hover:opacity-70"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            className={cn(
              "disabled:bg-gray-400",
              isAddMode
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            )}
          >
            {isLoading ? finalConfirmLabel + "..." : finalConfirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
