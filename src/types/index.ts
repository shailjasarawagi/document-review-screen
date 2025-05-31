export interface BoundingBox {
  page: number;
  rectangle: [number, number, number, number]; // [x1, y1, x2, y2]
}

export interface FieldContent {
  confidence: number;
  is_valid_format: boolean;
  orig_value: string | number;
  page: number;
  position: [number, number, number, number];
  position_label?: any[];
  review_required: boolean;
  validation_source: string;
  value: string | number;
}

export interface Field {
  acc: number;
  content: FieldContent;
  doc_id: string;
  format: string;
  format_message: string;
  id: number;
  id_auto_extract: number;
  id_auto_extract_label: string;
  ignore: boolean;
  label: string;
  low_confidence: boolean;
  no_items_row: number;
  order: number;
  org_id: string;
  p_title: string;
  p_type: string;
  parent_id: number;
  time_spent: number;
  type: string;
  user_id: string;
  children?: Field[][];
}

export interface Section {
  children: Field[];
  id: number;
  title: string;
  type: string;
}

export interface PageInfo {
  id: number;
  image: {
    height: number;
    url: string;
    width: number;
  };
}

export interface DocumentInfo {
  doc_id: string;
  excel_type: boolean;
  pages: PageInfo[];
  status: string;
  title: string;
  type: string;
}

export interface ZoomLevel {
  label: string;
  value: number;
}
