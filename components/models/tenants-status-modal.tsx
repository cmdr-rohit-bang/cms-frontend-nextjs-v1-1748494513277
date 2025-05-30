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
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

interface TenantsStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

export const TenantsStatusModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Status Confirmation",
  description = "Are you sure you want to change the status of this tenant? This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isLoading = false,
}: TenantsStatusModalProps) => {
  const [reason, setReason] = useState("");
  const handleConfirm = () => {
    if (
      reason.trim() === "" ||
      reason.trim() === null ||
      reason.trim() === undefined ||
      !reason
    ) {
      toast.error("Please enter a reason");
      return;
    }
    onConfirm(reason);
    setReason("");
    onClose();
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
          <Textarea
            placeholder="Reason for action"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
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
