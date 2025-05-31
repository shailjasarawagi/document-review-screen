import type { Field } from "../types";

export const getFieldInitials = (label: string): string => {
  return label
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
};

export const getRandomBadgeColor = (id: number): string => {
  const colors = [
    "bg-red-700",
    "bg-blue-700",
    "bg-green-700",
    "bg-yellow-700",
    "bg-purple-700",
    "bg-pink-700",
    "bg-indigo-700",
    "bg-orange-700",
    "bg-teal-700",
    "bg-cyan-700",
  ];

  return colors[id % colors.length];
};

export const getAllFields = (sections: any[]): Field[] => {
  const fields: Field[] = [];

  sections.forEach((section) => {
    if (section.children) {
      section.children.forEach((field: Field) => {
        if (!field.children) {
          fields.push(field);
        }
      });
    }
  });

  return fields;
};

export const getFieldById = (
  sections: any[],
  fieldId: number
): Field | null => {
  const allFields = getAllFields(sections);
  return allFields.find((field) => field.id === fieldId) || null;
};
