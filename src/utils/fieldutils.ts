import type { Field } from "../types";

//Initials letters extraction of fields
export const getFieldInitials = (label: string): string => {
  return label
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
};

//random colors for initial letters
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

interface Section {
  children: (Field | LineItem)[];
  id: number;
  title: string;
  type: string;
}

interface LineItem {
  children: Field[][][];
  id: number;
  label: string;
  type: "line_item";
}

//sections fields conevrted in regualr and columns fileds ,regularfield with page 1 and position ,columns are children inside fields
export const getAllFields = (
  sections: Section[]
): {
  regularFields: Field[];
  columnFields: Field[];
} => {
  const regularFields: Field[] = [];
  const columnFields: Field[] = [];

  for (const section of sections) {
    for (const child of section.children) {
      if (child.type === "line_item") {
        const lineItem = child as LineItem;
        for (const group of lineItem.children) {
          for (const row of group) {
            columnFields.push(...row);
          }
        }
      } else {
        regularFields.push(child as Field);
      }
    }
  }

  return { regularFields, columnFields };
};
