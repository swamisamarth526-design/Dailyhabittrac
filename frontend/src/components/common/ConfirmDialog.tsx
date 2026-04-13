"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ConfirmDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: "default" | "destructive";
};

export default function ConfirmDialog({
  open,
  setOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  variant = "default",
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="bg-white  border-gray-200 shadow-lg rounded-2xl p-6">

        <AlertDialogTitle className="text-lg font-semibold text-black ">
          {title}
        </AlertDialogTitle>

        <AlertDialogDescription className="text-gray-600 mt-2">
          {description}
        </AlertDialogDescription>

        <div className="flex gap-3 justify-end">
          <AlertDialogCancel>
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            className={
              variant === "destructive"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : ""
            }
          >
            {confirmText}
          </AlertDialogAction>
        </div>

      </AlertDialogContent>
    </AlertDialog>
  );
}