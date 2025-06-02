import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Field } from "../../../types";

import Row from "../virtualization-list";
import { FixedSizeList as List } from "react-window";
interface FieldsSidebarProps {
  fields: Field[];
  selectedFields: Set<number>;
  hoveredField: number | null;
  onFieldSelect: (fieldId: number) => void;
  onFieldHover: (fieldId: number | null) => void;
  onFieldRemove: (fieldId: number) => void;
  onSelectAll: () => void;
  onConfirm: () => void;
  regularFields: Field[];
  columnFields: Field[];
}

const ConfirmationModal = React.lazy(() =>
  import("../../modules/confirmation-modal").then((module) => ({
    default: module.ConfirmationModal,
  }))
);

export const FieldsSidebar: React.FC<FieldsSidebarProps> = ({
  regularFields,
  columnFields,
  // fields,
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
  const footerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);
  const [fieldToRemove, setFieldToRemove] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"regular" | "column">("regular");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
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
      if (containerRef.current && headerRef?.current && footerRef?.current) {
        const containerHeight = containerRef.current.clientHeight;
        const headerHeight = headerRef.current.getBoundingClientRect().height;
        const footerHeight = footerRef.current.getBoundingClientRect().height;
        const calculatedHeight =
          containerHeight - headerHeight - footerHeight - 8;
        setListHeight(Math.max(calculatedHeight, 0));
      }
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    return () => window.removeEventListener("resize", calculateHeight);
  }, []);

  const handleDropdownToggle = useCallback(
    (fieldId: number, event: React.MouseEvent) => {
      event.stopPropagation();
      setShowDropdown((prev) => (prev === fieldId ? null : fieldId));
    },
    []
  );
  const handleRemoveFieldRequest = useCallback(
    (fieldId: number, event: React.MouseEvent) => {
      event.stopPropagation();
      setFieldToRemove(fieldId);
      setShowRemoveConfirmModal(true);
      setShowDropdown(null);
    },
    []
  );

  const handleRemoveConfirm = useCallback(() => {
    if (fieldToRemove !== null) {
      onFieldRemove(fieldToRemove);
    }
    setShowRemoveConfirmModal(false);
    setFieldToRemove(null);
  }, [fieldToRemove, onFieldRemove]);

  const handleRemoveCancel = useCallback(() => {
    setShowRemoveConfirmModal(false);
    setFieldToRemove(null);
  }, []);

  const currentFields = useMemo(
    () => (activeTab === "regular" ? regularFields : columnFields),
    [activeTab, regularFields, columnFields]
  );

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
            className={`px-3 py-1 text-sm rounded-md ${
              activeTab === "regular"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            aria-label="fields header"
            onClick={() => setActiveTab("regular")}
          >
            Regular fields
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              activeTab === "column"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            aria-label="columns header"
            onClick={() => setActiveTab("column")}
          >
            Column fields
          </button>
        </div>
      </div>

      <div className="flex-1  px-4 py-2">
        {currentFields.length > 0 ? (
          <List
            height={listHeight}
            itemCount={currentFields.length}
            itemSize={78}
            width="100%"
          >
            {({ index }) => (
              <div style={{ marginBottom: "8px" }}>
                <Row
                  index={index}
                  field={currentFields[index]}
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
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            No {activeTab === "regular" ? "regular" : "column"} fields available
          </div>
        )}
      </div>
      <div
        className=" flex flex-row gap-2 p-4 border-t border-gray-200 dark:border-gray-700 "
        ref={footerRef}
      >
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

      <React.Suspense fallback={<div>Loading...</div>}>
        {showRemoveConfirmModal && (
          <ConfirmationModal
            isOpen={showRemoveConfirmModal}
            onClose={handleRemoveCancel}
            onConfirm={handleRemoveConfirm}
            selectedCount={1}
            message="Are you sure you want to remove this field?"
          />
        )}
      </React.Suspense>
    </div>
  );
};
