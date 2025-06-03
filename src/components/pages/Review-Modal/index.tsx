import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { DocumentViewer } from "../../modules/document-viewer";
import { FieldsSidebar } from "../../modules/fields-sidebar";
import { ConfirmationModal } from "../../modules/confirmation-modal";
import { SuccessModal } from "../../modules/success-modal";
import { useDocumentData } from "../../../hooks/useDocumentData";
import { getAllFields } from "../../../utils/fieldutils";
import { Header } from "../../modules/header";
import { PageNavigation } from "../../elements/pageNavigation";

function ReviewScreen() {
  const { bboxes, sections, documentInfo, loading } = useDocumentData();
  const [selectedFields, setSelectedFields] = useState<Set<number>>(new Set());
  const [hoveredField, setHoveredField] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [regularFields, setRegularFields] = useState<any[]>([]);
  const [columnFields, setColumnFields] = useState<any[]>([]);

  useEffect(() => {
    if (sections.length > 0) {
      const { regularFields, columnFields } = getAllFields(sections);
      setRegularFields(regularFields);
      setColumnFields(columnFields);
    }
  }, [sections]);

  const totalPages = useMemo(
    () => documentInfo?.pages.length || 0,
    [documentInfo]
  );

  const availableFields = useMemo(
    () =>
      [...regularFields, ...columnFields].filter(
        (field) => field.content.page === currentPage
      ),
    [regularFields, columnFields, currentPage]
  );

  const availableRegularFields = useMemo(
    () =>
      [...regularFields].filter((field) => field.content.page === currentPage),
    [regularFields, currentPage]
  );

  const debouncedSetHoveredField = useCallback(
    (() => {
      let rafId: number;
      let lastCall = 0;
      return (fieldId: number | null) => {
        const now = performance.now();
        if (now - lastCall < 16) return;

        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          setHoveredField(fieldId);
          lastCall = now;
        });
      };
    })(),
    []
  );

  useEffect(() => {
    const targetPage = pageRefs.current[currentPage - 1];
    if (targetPage) {
      targetPage.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentPage]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "a":
            event.preventDefault();
            handleSelectAll();
            break;
        }
      }

      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        const currentIndex = hoveredField
          ? availableFields.findIndex((f) => f.id === hoveredField)
          : -1;

        let nextIndex;
        if (event.key === "ArrowUp") {
          nextIndex =
            currentIndex > 0 ? currentIndex - 1 : availableFields.length - 1;
        } else {
          nextIndex =
            currentIndex < availableFields.length - 1 ? currentIndex + 1 : 0;
        }

        if (availableFields[nextIndex]) {
          setHoveredField(availableFields[nextIndex].id);
        }
      }

      if (event.key === " " && hoveredField) {
        event.preventDefault();
        handleFieldSelect(hoveredField);
      }

      if (event.key === "Enter" && selectedFields.size > 1) {
        event.preventDefault();
        setShowConfirmModal(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedFields, hoveredField, availableFields]);

  const fieldsPerPage = useMemo(
    () =>
      [...regularFields, ...columnFields].reduce((counts, field) => {
        const page = field.content.page;
        counts[page] = (counts[page] || 0) + 1;
        return counts;
      }, {} as Record<number, number>),
    [regularFields, columnFields]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (isPageLoading) return;

      setIsPageLoading(true);
      setHoveredField(null);

      requestAnimationFrame(() => {
        setCurrentPage(page);
        if ("requestIdleCallback" in window) {
          requestIdleCallback(() => setIsPageLoading(false));
        } else {
          setTimeout(() => setIsPageLoading(false), 50);
        }
      });
    },
    [isPageLoading]
  );

  const handleFieldSelect = useCallback((fieldId: number) => {
    setSelectedFields((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(fieldId)) {
        newSelected.delete(fieldId);
      } else {
        newSelected.add(fieldId);
      }
      return newSelected;
    });
  }, []);

  const handleFieldRemove = useCallback((fieldId: number) => {
    setRegularFields((prev) => prev.filter((field) => field.id !== fieldId));
    setColumnFields((prev) => prev.filter((field) => field.id !== fieldId));
    setSelectedFields((prev) => {
      const newSelected = new Set(prev);
      newSelected.delete(fieldId);
      return newSelected;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    const pageFieldIds = availableFields.map((field) => field.id);
    setSelectedFields((prev) => {
      const newSelected = new Set(prev);
      if (pageFieldIds.every((id) => prev.has(id))) {
        pageFieldIds.forEach((id) => newSelected.delete(id));
      } else {
        pageFieldIds.forEach((id) => newSelected.add(id));
      }
      return newSelected;
    });
  }, [availableFields]);

  const handleConfirm = useCallback(() => {
    if (selectedFields.size > 1) {
      setShowConfirmModal(true);
    }
  }, [selectedFields]);

  const handleConfirmModalConfirm = useCallback(() => {
    setShowConfirmModal(false);
    setShowSuccessModal(true);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading document...</div>
      </div>
    );
  }

  if (!documentInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-red-600">Error loading document</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <PageNavigation
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        fieldsPerPage={fieldsPerPage}
        isLoading={isPageLoading}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <DocumentViewer
            selectedFields={selectedFields}
            hoveredField={hoveredField}
            onFieldHover={setHoveredField}
            fields={availableRegularFields}
            bboxes={bboxes}
            documentInfo={documentInfo}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            pageRefs={pageRefs}
          />
        </div>

        <FieldsSidebar
          regularFields={availableRegularFields}
          columnFields={columnFields}
          fields={availableFields}
          selectedFields={selectedFields}
          hoveredField={hoveredField}
          onFieldSelect={handleFieldSelect}
          onFieldHover={debouncedSetHoveredField}
          onFieldRemove={handleFieldRemove}
          onSelectAll={handleSelectAll}
          onConfirm={handleConfirm}
        />
      </div>

      {showConfirmModal && (
        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmModalConfirm}
          selectedCount={selectedFields.size}
        />
      )}
      {showSuccessModal && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
}

export default ReviewScreen;
