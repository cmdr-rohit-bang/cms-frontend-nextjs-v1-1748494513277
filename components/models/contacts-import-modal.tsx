import { useState } from "react";
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
import { toast } from "sonner";
import { Input } from "../ui/input";

interface ContactsImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (contacts: File) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

export const ContactsImportModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Import Contacts",
  description = "Are you sure you want to import contacts? This action cannot be undone.",
  confirmLabel = "Import",
  cancelLabel = "Cancel",
  isLoading = false,
}: ContactsImportModalProps) => {
  const [contacts, setContacts] = useState<File | null>(null);
  const handleConfirm = () => {
    if (
      contacts === null ||
      contacts === undefined ||
      !contacts
    ) {
      toast.error("Please enter the contacts to import");
      return;
    }
    onConfirm(contacts);
    setContacts(null);

  };
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
          <Input
            type="file"
            placeholder="Enter the contacts to import"
            accept=".csv"
            onChange={(e) => setContacts(e.target.files?.[0] || null)}
          /> 
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            className=" text-destructive-foreground  disabled:bg-gray-400"
          >
            {isLoading ? confirmLabel + "..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
