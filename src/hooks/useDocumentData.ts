import { useState, useEffect } from "react";
import type { BoundingBox, Section, DocumentInfo } from "../types";
import sectionsData from "../../public/sections.json";
import pagesData from "../../public/pages.json";
import boxesData from "../../public/bboxes_a2cbec1124234a6d846f908ba9531a2e.json";

const mockBboxes = boxesData as any;
const mockSections = sectionsData as any;
const mockPages = pagesData as any;

export const useDocumentData = () => {
  const [bboxes, setBboxes] = useState<BoundingBox[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setBboxes(mockBboxes?.data?.bboxes);
        setSections(mockSections?.data?.sections);
        setDocumentInfo(mockPages?.data?.documents[0]);
      } catch (error) {
        console.error("Error loading document data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    bboxes,
    sections,
    documentInfo,
    loading,
  };
};
