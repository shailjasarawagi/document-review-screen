import React from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import type { Field } from "../../../types";
import {
  getFieldInitials,
  getRandomBadgeColor,
} from "../../../utils/fieldutils";

interface RowProps {
  index: number;

  field: Field;
  selectedFields: Set<number>;
  hoveredField: number | null;
  showDropdown: number | null;
  onFieldSelect: (fieldId: number) => void;
  onFieldHover: (fieldId: number | null) => void;
  onFieldRemove: (fieldId: number, event: React.MouseEvent) => void;
  onDropdownToggle: (fieldId: number, event: React.MouseEvent) => void;
  dropdownRef: React.MutableRefObject<HTMLDivElement | null>;
}

const Row: React.FC<RowProps> = ({
  //   index,

  field,
  selectedFields,
  hoveredField,
  showDropdown,
  onFieldSelect,
  onFieldHover,
  onFieldRemove,
  onDropdownToggle,
  dropdownRef,
}) => {
  // const handleRemoveField = (fieldId: number, event: React.MouseEvent) => {
  // event.stopPropagation();
  // onFieldRemove(fieldId);
  // onDropdownToggle(fieldId, event);
  // };

  return (
    <div
      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
        selectedFields.has(field.id)
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
          : hoveredField === field.id
          ? "border-blue-300 bg-blue-25 dark:bg-blue-900/10"
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
      }`}
      onClick={() => onFieldSelect(field.id)}
      onMouseEnter={() => onFieldHover(field.id)}
      onMouseLeave={() => onFieldHover(null)}
    >
      <div
        className={`w-8 h-8 rounded-md flex items-center justify-center text-white text-xs font-medium ${getRandomBadgeColor(
          field.id
        )}`}
      >
        {getFieldInitials(field.label)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {field.label}
          </h3>

          <div className="flex flex-row gap-2 items-center">
            <input
              aria-label={`field-info-${field.id}`}
              id={`field-checkbox-${field.id}`}
              type="checkbox"
              checked={selectedFields.has(field.id)}
              onChange={() => onFieldSelect(field.id)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()}
              aria-describedby={`field-info-${field.id}`}
            />
            <div className="relative">
              <button
                onClick={(e) => onDropdownToggle(field.id, e)}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="More options menu"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>

              {showDropdown === field.id && (
                <div
                  className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-10"
                  ref={dropdownRef}
                >
                  <button
                    // onClick={(e) => handleRemoveField(field?.id, e)}
                    onClick={(e) => onFieldRemove(field.id, e)}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    aria-label="trash"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
          {field.content.value}
        </p>
      </div>
    </div>
  );
};

export default Row;
