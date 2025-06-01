import React, { useEffect, useRef, useState } from "react";
import type { Field } from "../../../types";

import Row from "../virtualization-list";
import { FixedSizeList as List } from "react-window";
import { ConfirmationModal } from "../confirmation-modal";
interface FieldsSidebarProps {
  fields: Field[];
  selectedFields: Set<number>;
  hoveredField: number | null;
  onFieldSelect: (fieldId: number) => void;
  onFieldHover: (fieldId: number | null) => void;
  onFieldRemove: (fieldId: number) => void;
  onSelectAll: () => void;
  onConfirm: () => void;
}

export const FieldsSidebar: React.FC<FieldsSidebarProps> = ({
  fields,
  selectedFields,
  hoveredField,
  onFieldSelect,
  onFieldHover,
  onFieldRemove,
  onSelectAll,
  onConfirm,
}) => {
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [listHeight, setListHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);
  const [fieldToRemove, setFieldToRemove] = useState<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        // Ensure the click is not on the MoreVertical button
        !(event.target as HTMLElement).closest(
          '[aria-label="More options menu"]'
        )
      ) {
        setShowDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const calculateHeight = () => {
      if (containerRef.current && headerRef?.current) {
        const containerHeight = containerRef.current.clientHeight;
        const headerHeight = headerRef.current.getBoundingClientRect().height;
        setListHeight(containerHeight - headerHeight - 60);
      }
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    return () => window.removeEventListener("resize", calculateHeight);
  }, []);

  const handleDropdownToggle = (fieldId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setShowDropdown(showDropdown === fieldId ? null : fieldId);
  };

  const handleRemoveFieldRequest = (
    fieldId: number,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setFieldToRemove(fieldId);
    setShowRemoveConfirmModal(true);
    setShowDropdown(null); // Close dropdown
  };

  const handleRemoveConfirm = () => {
    if (fieldToRemove !== null) {
      onFieldRemove(fieldToRemove);
    }
    setShowRemoveConfirmModal(false);
    setFieldToRemove(null);
  };

  const handleRemoveCancel = () => {
    setShowRemoveConfirmModal(false);
    setFieldToRemove(null);
  };
  return (
    <div
      ref={containerRef}
      className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full"
    >
      <div
        className="p-4 border-b border-gray-200 dark:border-gray-700"
        ref={headerRef}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Fields
        </h2>
        <div className="flex space-x-2 mt-2">
          <button
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md"
            aria-label="fields header"
          >
            Regular fields
          </button>
          <button
            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
            aria-label="coulmns header"
          >
            Column fields
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-hidden p-4">
        <List
          height={listHeight}
          itemCount={fields.length}
          itemSize={78}
          width="100%"
        >
          {({ index }) => (
            <div style={{ marginBottom: "8px" }}>
              <Row
                index={index}
                field={fields[index]}
                selectedFields={selectedFields}
                hoveredField={hoveredField}
                showDropdown={showDropdown}
                onFieldSelect={onFieldSelect}
                onFieldHover={onFieldHover}
                onFieldRemove={handleRemoveFieldRequest}
                onDropdownToggle={handleDropdownToggle}
                dropdownRef={dropdownRef}
              />
            </div>
          )}
        </List>
      </div>
      <div className=" flex flex-row gap-2 p-4 border-t border-gray-200 dark:border-gray-700 ">
        <button
          onClick={onSelectAll}
          className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Select All
        </button>
        <button
          onClick={onConfirm}
          disabled={selectedFields.size <= 1}
          className={`w-full px-4 py-2 text-sm rounded-md ${
            selectedFields.size > 1
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Confirm ({selectedFields.size})
        </button>
      </div>

      <ConfirmationModal
        isOpen={showRemoveConfirmModal}
        onClose={handleRemoveCancel}
        onConfirm={handleRemoveConfirm}
        selectedCount={1}
        message="Are you sure you want to remove this field?"
      />
    </div>
  );
};
