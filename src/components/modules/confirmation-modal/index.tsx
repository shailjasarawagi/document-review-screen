/* ConfirmationModal Component
 * A modal component that prompts the user for confirmation.
 * Features:
 * - Supports light and dark themes.
 * - Displays a warning icon and customizable message.
 * - Handles `Confirm` and `Cancel` actions.
 */

import type React from "react";
import { AlertTriangle, X } from "lucide-react";
import { Modal } from "../../elements/modal";
import { Button } from "../../elements/button";

interface ConfirmationModalProps {
  isOpen: boolean; //visibility control
  onClose: () => void;
  onConfirm: () => void;
  selectedCount: number;
  message?: string; // Optional custom message for the modal
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        {/* Header  */}
        <div className="w-full flex items-center justify-between mb-4">
          <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {message ? "Remove Fields" : "Confirm Selection"}
          </h3>
          <Button onClick={onClose} variant="ghost">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {message ? (
          message
        ) : (
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to confirm the selected {selectedCount} field
            {selectedCount !== 1 ? "s" : ""}?
          </p>
        )}

        {/* Action buttons */}
        <div className="w-full flex flex-row gap-2">
          <Button
            onClick={onClose}
            variant="outline"
            ariaLabel="Close confirmation dialog"
          >
            Cancel
          </Button>

          <Button onClick={onConfirm} ariaLabel="Confirmation and close dialog">
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};
