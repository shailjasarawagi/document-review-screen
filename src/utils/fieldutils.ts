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

export const getAllFields = (
  sections: any
): {
  regularFields: Field[];
  columnFields: Field[];
} => {
  const regularFields: Field[] = [];
  const columnFields: Field[] = [];

  sections.forEach((section: any) => {
    section.children.forEach((child: any) => {
      if (child.type === "line_item" && child.children) {
        child.children.forEach((group: any) => {
          group.forEach((row: any) => {
            row.forEach((field: any) => {
              columnFields.push(field);
            });
          });
        });
      } else {
        regularFields.push(child as Field);
      }
    });
  });

  return { regularFields, columnFields };
};
