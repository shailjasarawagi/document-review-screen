/* Modal Component
 * A reusable modal component that displays content in a centered overlay.
 * Features:
 * - Handles the "Escape" key for closing the modal.
 * - Supports a backdrop click to close the modal.
 * - Accessibility features include `aria-modal` and labeling attributes.
 */

import type React from "react";
import { useEffect } from "react";

interface ModalProps {
  open: boolean; //visibility of modal
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ open, onClose, children }: ModalProps) {
  useEffect(() => {
    // Close the modal when the "Escape" key is pressed
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    // Add the event listener only when the modal is open
    if (open) {
      document.addEventListener("keydown", handleEscape);
    }
    //clean event listener
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
