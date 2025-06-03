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
import { Popover, PopoverContent } from "../ui/popover";
import { PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

type ModalMode = "add" | "remove";

interface TagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (ids: string[], tags: string[]) => void;
  mode: ModalMode;
  selectedIds: string[]; // IDs of selected items
  data: Array<{ id: string; tags: string[] }>; // Data with tags as arrays
  availableTags?: string[]; // All available tags for add mode
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
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [customTags, setCustomTags] = useState<string[]>([]);

  // Dynamic values based on mode
  const isAddMode = mode === "add";
  const isRemoveMode = mode === "remove";

  // Helper function to get common tags across selected IDs
  const getCommonTags = () => {
    if (selectedIds.length === 0) return [];

    // Get tags for all selected items
    const selectedItems = data.filter((item) => selectedIds.includes(item.id));

    if (selectedItems.length === 0) return [];

    // Find common tags across all selected items
    const allTagsArrays = selectedItems.map((item) => item.tags || []);

    // Start with tags from first item, then filter for common ones
    const commonTags = allTagsArrays[0].filter((tag) =>
      allTagsArrays.every((tagArray) => tagArray.includes(tag))
    );

    return commonTags;
  };

  // Always show all available tags + custom tags in dropdown for both modes
  const allTags = [...availableTags, ...customTags];
  const tagsToShow = allTags;

  // Filter tags based on search
  const filteredTags = tagsToShow.filter((tag) =>
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if search term is a new tag that doesn't exist
  const isNewTag =
    searchTerm.trim() &&
    !allTags.some(
      (tag) => tag.toLowerCase() === searchTerm.toLowerCase().trim()
    );

  // Dynamic text based on mode
  const modalTitle = title || (isAddMode ? "Add Tags" : "Remove Tags");
  const modalDescription =
    description ||
    (isAddMode
      ? `Select tags to add to ${selectedIds.length} selected contact${
          selectedIds.length > 1 ? "s" : ""
        }.`
      : `Select tags to remove from ${selectedIds.length} selected contact${
          selectedIds.length > 1 ? "s" : ""
        }.`);
  const defaultConfirmLabel = isAddMode ? "Add Tags" : "Remove Tags";
  const finalConfirmLabel = confirmLabel || defaultConfirmLabel;

  // Dynamic placeholder and empty state
  const searchPlaceholder = "Search tags or type to create new...";
  const emptyMessage = "No tags found. Type to create a new tag.";
  const selectionMessage = isAddMode
    ? "Please select at least one tag to add"
    : "Please select at least one tag to remove";

  const handleConfirm = () => {
    if (!selectedTags || selectedTags.length === 0) {
      setError(selectionMessage);
      return;
    }
    setError("");
    onConfirm(selectedIds, selectedTags);
    setSelectedTags([]);
    onClose();
  };

  const handleTagToggle = (tag: string) => {
    console.log("Toggling tag:", tag);
    const currentTags = selectedTags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t: string) => t !== tag)
      : [...currentTags, tag];

    console.log("New selected tags:", newTags);
    setSelectedTags(newTags);
    setError(""); // Clear error when user selects tags
  };

  const handleTagRemove = (tag: string) => {
    const newTags = selectedTags.filter((t: string) => t !== tag);
    setSelectedTags(newTags);
  };

  // Handle creating new custom tag
  const handleCreateTag = (tagName: string) => {
    const trimmedTag = tagName.trim();

    if (!trimmedTag) return;

    // Check if tag already exists (case insensitive)
    const tagExists = tagsToShow.some(
      (tag) => tag.toLowerCase() === trimmedTag.toLowerCase()
    );

    if (!tagExists) {
      console.log("Creating new tag:", trimmedTag);
      // Add to custom tags
      setCustomTags((prev) => {
        const newCustomTags = [...prev, trimmedTag];
        console.log("Updated custom tags:", newCustomTags);
        return newCustomTags;
      });
      // Add to selected tags
      setSelectedTags((prev) => {
        const newSelectedTags = [...prev, trimmedTag];
        console.log("Updated selected tags:", newSelectedTags);
        return newSelectedTags;
      });
      // Clear search
      setSearchTerm("");
      setError("");
    } else {
      console.log("Tag already exists:", trimmedTag);
    }
  };

  // Handle Enter key press in search input
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      console.log(
        "Enter pressed, isNewTag:",
        isNewTag,
        "searchTerm:",
        searchTerm
      );
      if (isNewTag) {
        handleCreateTag(searchTerm);
      } else if (filteredTags.length > 0) {
        // If there's a filtered tag, select the first one
        handleTagToggle(filteredTags[0]);
        setSearchTerm("");
      }
    }
  };

  // Reset state when modal closes
  const handleClose = () => {
    setSelectedTags([]);
    setError("");
    setSearchTerm("");
    setCustomTags([]);
    onClose();
  };

  // Reset selected tags when mode or selectedIds change and set common tags as initial selection
  useEffect(() => {
    if (isOpen) {
      // Set common tags as initially selected for both add and remove modes
      const commonTags = getCommonTags();
      setSelectedTags(commonTags);
    } else {
      setSelectedTags([]);
    }
    setError("");
    setSearchTerm("");
    setCustomTags([]);
  }, [mode, selectedIds, isOpen]);

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {isAddMode ? (
              <Plus className="h-5 w-5" />
            ) : (
              <Minus className="h-5 w-5" />
            )}
            {modalTitle}
          </AlertDialogTitle>
          <AlertDialogDescription>{modalDescription}</AlertDialogDescription>

          {/* Show info about common tags */}
          {selectedIds.length > 1 && (
            <div className="text-sm text-muted-foreground mt-1 p-2 bg-blue-50 rounded-md border border-blue-200">
              Common tags across all {selectedIds.length} selected contacts are
              pre-selected.
            </div>
          )}

          {/* Show error message if any */}
          {error && (
            <div className="text-red-600 text-sm mt-2 p-2 bg-red-50 rounded-md border border-red-200">
              {error}
            </div>
          )}

          {mode === "add" && (
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between text-left font-normal transition-colors",
                    !selectedTags?.length && "text-muted-foreground"
                  )}
                  type="button"
                >
                  <span className="truncate">
                    {selectedTags?.length > 0
                      ? `${selectedTags.length} tag${
                          selectedTags.length > 1 ? "s" : ""
                        } selected`
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
                      className="flex h-8 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder={searchPlaceholder}
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
                    {/* Show option to create new tag */}
                    {isNewTag && (
                      <div
                        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-green-50 hover:text-green-800 border-b mb-1 bg-green-25"
                        onClick={() => {
                          console.log("Create button clicked");
                          handleCreateTag(searchTerm);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4 text-green-500" />
                        Create "{searchTerm.trim()}"
                        <span className="ml-auto text-xs text-green-600 font-medium">
                          Press Enter
                        </span>
                      </div>
                    )}

                    {filteredTags.length === 0 && !isNewTag ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        {emptyMessage}
                      </div>
                    ) : (
                      filteredTags.map((tag) => (
                        <div
                          key={tag}
                          className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                          onClick={() => {
                            console.log("Tag clicked:", tag);
                            handleTagToggle(tag);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedTags?.includes(tag)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {tag}
                          {/* Show indicator if this tag is common across selected items */}
                          {getCommonTags().includes(tag) && (
                            <span className="ml-auto text-xs text-blue-600">
                              common
                            </span>
                          )}
                          {/* Show indicator if this is a custom tag */}
                          {customTags.includes(tag) && (
                            <span className="ml-auto text-xs text-green-600">
                              custom
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Show selected tags */}
          {selectedTags && selectedTags.length > 0 && (
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
                      // Highlight custom tags differently
                      customTags.includes(tag) && "ring-2 ring-yellow-300"
                    )}
                  >
                    {isAddMode ? (
                      <Plus className="h-3 w-3" />
                    ) : (
                      <Minus className="h-3 w-3" />
                    )}
                    {tag}
                    {customTags.includes(tag) && (
                      <span className="text-xs opacity-75">(new)</span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className={cn(
                        "hover:opacity-70",
                        isAddMode
                          ? "hover:text-green-600"
                          : "hover:text-red-600"
                      )}
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
