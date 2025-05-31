import type React from "react";
import { CheckCircle, X } from "lucide-react";
import { Modal } from "../../elements/modal";
import { Button } from "../../elements/button";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Success
            </h3>
          </div>
          <Button onClick={onClose} variant="ghost">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Fields confirmed and processed successfully!
        </p>

        <Button onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
};
