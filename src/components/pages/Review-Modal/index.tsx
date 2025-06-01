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
  const [allFields, setAllFields] = useState<any[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    if (sections.length > 0) {
      const fields = getAllFields(sections);
      setAllFields(fields);
    }
  }, [sections]);

  const totalPages = useMemo(
    () => documentInfo?.pages.length || 0,
    [documentInfo]
  );

  const availableFields = useMemo(() => {
    return allFields.filter((field) => field.content.page === currentPage);
  }, [allFields, currentPage]);

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

  const fieldsPerPage = useMemo(() => {
    const counts: Record<number, number> = {};
    allFields.forEach((field) => {
      const page = field.content.page;
      counts[page] = (counts[page] || 0) + 1;
    });
    return counts;
  }, [allFields]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page === currentPage || isPageLoading) return;

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
    [currentPage, isPageLoading]
  );

  const handleFieldSelect = (fieldId: number) => {
    const newSelected = new Set(selectedFields);
    if (newSelected.has(fieldId)) {
      newSelected.delete(fieldId);
    } else {
      newSelected.add(fieldId);
    }
    setSelectedFields(newSelected);
  };

  const handleFieldRemove = (fieldId: number) => {
    const newFields = allFields.filter((field) => field.id !== fieldId);
    setAllFields(newFields);

    const newSelected = new Set(selectedFields);
    newSelected.delete(fieldId);
    setSelectedFields(newSelected);
  };

  const handleSelectAll = () => {
    const pageFieldIds = availableFields.map((field) => field.id);
    if (pageFieldIds.every((id) => selectedFields.has(id))) {
      const newSelected = new Set(selectedFields);
      pageFieldIds.forEach((id) => newSelected.delete(id));
      setSelectedFields(newSelected);
    } else {
      setSelectedFields((prev) => new Set([...prev, ...pageFieldIds]));
    }
  };

  const handleConfirm = () => {
    if (selectedFields.size > 1) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmModalConfirm = () => {
    setShowConfirmModal(false);
    setShowSuccessModal(true);
  };

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
        <div className="flex-1">
          <DocumentViewer
            selectedFields={selectedFields}
            hoveredField={hoveredField}
            onFieldHover={setHoveredField}
            fields={availableFields}
            bboxes={bboxes}
            documentInfo={documentInfo}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            pageRefs={pageRefs}
          />
        </div>

        <FieldsSidebar
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

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmModalConfirm}
        selectedCount={selectedFields.size}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
}

export default ReviewScreen;
