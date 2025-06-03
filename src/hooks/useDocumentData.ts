/**
 * Custom hook for loading and managing document data
 * Fetches bounding boxes, sections, and document information from static JSON files
 * @returns {{ bboxes: BoundingBox[], sections: Section[], documentInfo: DocumentInfo | null, loading: boolean }}
 * Object containing document data and loading state
 */
import { useState, useEffect } from "react";
import type { BoundingBox, Section, DocumentInfo } from "../types";
import sectionsData from "../../public/sections.json";
import pagesData from "../../public/pages.json";
import boxesData from "../../public/bboxes_a2cbec1124234a6d846f908ba9531a2e.json";
// Mock data imports with type assertions
const mockBboxes = boxesData as any;
const mockSections = sectionsData as any;
const mockPages = pagesData as any;

export const useDocumentData = () => {
  const [bboxes, setBboxes] = useState<BoundingBox[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Loads document data from static JSON files
   * Handles errors and updates loading state
   */
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
