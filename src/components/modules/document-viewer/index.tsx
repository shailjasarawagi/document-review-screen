/**
 * DocumentViewer component for displaying document pages with zoom, fullscreen, and field highlighting
 * @param {DocumentViewerProps} props - Component props
 * @returns {JSX.Element} Document viewer UI with controls and page display
 */

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Maximize2, Minus, Plus, ZoomIn, ZoomOut } from "lucide-react";
import type { Field, BoundingBox, ZoomLevel } from "../../../types";
import { Button } from "../../elements/button";
import { Select } from "../../elements/select";
import debounce from "debounce";

interface DocumentViewerProps {
  selectedFields: Set<number>;
  hoveredField: number | null;
  onFieldHover: (fieldId: number | null) => void;
  fields: Field[];
  bboxes: BoundingBox[];
  documentInfo: any;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

// Predefined zoom levels
const zoomLevels: ZoomLevel[] = [
  { label: "Fit", value: 0 },
  { label: "75%", value: 0.75 },
  { label: "100%", value: 1 },
  { label: "125%", value: 1.25 },
  { label: "150%", value: 1.5 },
  { label: "200%", value: 2 },
];

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  selectedFields,
  hoveredField,
  onFieldHover,
  fields,
  // bboxes,
  documentInfo,
  currentPage,
  onPageChange,
  pageRefs,
}) => {
  const [currentZoom, setCurrentZoom] = useState<ZoomLevel>(zoomLevels[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const observerRef = useRef<IntersectionObserver | null>(null);

  /**
   * Calculates the actual zoom level based on the container size and page dimensions.
   * Falls back to "Fit" behavior if zoom level is set to 0.
   */
  const getActualZoom = useCallback(
    (pageWidth: number, pageHeight: number) => {
      if (currentZoom.value === 0) {
        const scaleX = containerSize.width / pageWidth;
        const scaleY = containerSize.height / pageHeight;
        return Math.min(scaleX, scaleY, 1);
      }
      return currentZoom.value;
    },
    [currentZoom, containerSize]
  );

  /**
   * Detects the most visible page in the container based on IntersectionObserver thresholds.
   */
  const detectVisiblePage = useCallback(() => {
    if (!containerRef.current || !pageRefs.current) return;

    let maxRatio = 0;
    let visiblePage = currentPage;

    pageRefs.current.forEach((pageEl, index) => {
      if (pageEl) {
        const rect = pageEl.getBoundingClientRect();
        const containerRect = containerRef.current!.getBoundingClientRect();
        const visibleHeight =
          Math.min(rect.bottom, containerRect.bottom) -
          Math.max(rect.top, containerRect.top);
        const ratio = visibleHeight / rect.height;

        if (ratio > maxRatio && ratio > 0.3) {
          // Adjusted threshold to 30%
          maxRatio = ratio;
          visiblePage = index + 1;
        }
      }
    });

    if (visiblePage !== currentPage) {
      onPageChange(visiblePage);
    }
  }, [currentPage, onPageChange, pageRefs]);

  // Debounced version of detectVisiblePage to prevent excessive calls
  const debouncedDetectVisiblePage = useCallback(
    debounce(detectVisiblePage, 500),
    [detectVisiblePage]
  );

  /**
   * Sets up IntersectionObserver to track page visibility
   * Cleans up observer on component unmount
   */
  useEffect(() => {
    if (!containerRef.current || !pageRefs.current) return;

    observerRef.current = new IntersectionObserver(
      () => {
        debouncedDetectVisiblePage();
      },
      {
        root: containerRef.current,
        threshold: 0.3,
      }
    );

    pageRefs.current.forEach((el) => {
      if (el) observerRef.current!.observe(el);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [debouncedDetectVisiblePage, pageRefs.current]);

  /**
   * Updates container size on mount and window resize
   * Ensures proper zoom calculations
   */
  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);
    return () => window.removeEventListener("resize", updateContainerSize);
  }, []);

  /**
   * Toggles fullscreen mode for the document viewer.
   */
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  /**
   * Adjusts zoom level up or down
   * @param {"in" | "out"} direction - Zoom direction
   */
  const adjustZoom = useCallback(
    (direction: "in" | "out") => {
      const currentIndex = zoomLevels.findIndex(
        (z) => z.value === currentZoom.value
      );
      const newIndex =
        direction === "in"
          ? Math.min(currentIndex + 1, zoomLevels.length - 1)
          : Math.max(currentIndex - 1, 0);
      setCurrentZoom(zoomLevels[newIndex]);
    },
    [currentZoom, pageRefs?.current]
  );

  /**
   * Listens for keyboard shortcuts to enhance accessibility and interactivity.
   */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;

      switch (event.key) {
        case "+":
        case "=":
          event.preventDefault();
          adjustZoom("in");
          break;
        case "-":
          event.preventDefault();
          adjustZoom("out");
          break;

        case "f":
          event.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [adjustZoom, toggleFullscreen]);

  /**
   * Calculates the position of a field on the page based on its dimensions and zoom level.
   */
  const getFieldPosition = useCallback(
    (field: Field, actualZoom: number) => {
      if (!field.content.position || field.content.position.length !== 4) {
        return null;
      }
      const [x1, y1, x2, y2] = field.content.position;
      return {
        left: x1 * actualZoom,
        top: y1 * actualZoom,
        width: (x2 - x1) * actualZoom,
        height: (y2 - y1) * actualZoom,
      };
    },
    [currentPage]
  );

  /**
   * Debounced handler for field hover events
   * @param {number | null} fieldId - ID of the hovered field or null
   * @returns {() => void} Cleanup function
   */
  const debouncedHover = useCallback(
    (fieldId: number | null) => {
      const debounce = setTimeout(() => onFieldHover(fieldId), 16);
      return () => clearTimeout(debounce);
    },
    [onFieldHover]
  );

  const handleFieldClick = useCallback((fieldId: number) => {
    console.log("Field clicked:", fieldId, isFullscreen);
  }, []);

  //filed highlight when hover
  const isFieldHighlighted = useCallback(
    (fieldId: number) => {
      return selectedFields.has(fieldId) || hoveredField === fieldId;
    },
    [selectedFields, hoveredField]
  );

  //filter boxpages according to page number
  // const boxesByPage = useMemo(() => {
  //   if (!bboxes || bboxes.length === 0) {
  //     return {};
  //   }

  //   const map = {} as Record<number, [number, number, number, number][]>;
  //   bboxes.forEach(({ page, rectangle }: BoundingBox) => {
  //     if (!map[page]) map[page] = [];
  //     map[page].push(rectangle);
  //   });

  //   return map;
  // }, [bboxes]);

  /**
   * Triggers initial page visibility detection
   */
  useEffect(() => {
    debouncedDetectVisiblePage();
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-800">
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        {/* Toolbar for Zoom and Navigation */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => adjustZoom("out")}
            disabled={currentZoom.value <= zoomLevels[0].value}
            ariaLabel="zoom-out"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>

          <Select
            value={currentZoom}
            onValueChange={setCurrentZoom}
            options={zoomLevels}
          />

          <Button
            variant="outline"
            onClick={() => adjustZoom("in")}
            disabled={
              currentZoom.value >= zoomLevels[zoomLevels.length - 1].value
            }
            ariaLabel="zoom-in"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          Use Ctrl+A to select all • ↑↓ to navigate fields • PageUp/PageDown for
          pages • +- to Zoomin/Zoomout
        </div>
      </div>

      {/* Document Viewer */}
      <div ref={containerRef} className="flex-1 overflow-auto p-4">
        {documentInfo.pages.map((page: any, pageIndex: number) => {
          // const pageNumber = pageIndex + 1;
          const pageWidth = page.image.width;
          const pageHeight = page.image.height;
          const actualZoom = getActualZoom(pageWidth, pageHeight);
          // const pageBBoxes = boxesByPage[pageNumber] || [];

          return (
            <div
              key={pageIndex}
              data-page-index={pageIndex}
              id={`page-${pageIndex}`}
              className="relative mx-auto bg-white shadow-lg mb-4"
              style={{
                width: page.image.width * actualZoom,
                height: page.image.height * actualZoom,
              }}
              ref={(el) => {
                pageRefs.current[pageIndex] = el;
              }}
            >
              <img
                ref={imageRef}
                src={`/assets/${page.image.url}`}
                alt={`Page ${pageIndex + 1}`}
                className="absolute top-0 left-0 w-full h-full object-contain"
              />

              {/*Since rectangle position in bboxes doesnot match height of document so commented */}

              {/* 
              {pageBBoxes?.map(
                (
                  [x0, y0, x2, y2]: [number, number, number, number],
                  idx: number
                ) => {
                  const position = getFieldPositions(
                    [x0, y0, x2, y2],
                    actualZoom
                  );
                  if (!position) return null;
                  return (
                    <div
                      key={idx}
                      className={`absolute border-2 cursor-pointer transition-all duration-200 ${
                        isFieldHighlighted(idx)
                          ? "border-red-500 bg-red-500 bg-opacity-20"
                          : "border-transparent hover:border-red-300 hover:bg-red-300 hover:bg-opacity-10"
                      }`}
                      style={{
                        left: position.left,
                        top: position.top,
                        width: position.width,
                        height: position.height,
                      }}
                      onMouseEnter={() => debouncedHover(idx)}
                      onMouseLeave={() => debouncedHover(null)}
                    />
                  );
                }
              )} */}

              {fields.map((field) => {
                const position = getFieldPosition(field, actualZoom);
                if (!position) return null;

                return (
                  <div
                    key={field.id}
                    className={`absolute border-2 cursor-pointer transition-all duration-200 ${
                      isFieldHighlighted(field.id)
                        ? "border-blue-500 bg-blue-500 bg-opacity-20"
                        : "border-transparent hover:border-blue-300 hover:bg-blue-300 hover:bg-opacity-10"
                    }`}
                    style={{
                      left: position.left,
                      top: position.top,
                      width: position.width,
                      height: position.height,
                    }}
                    onClick={() => handleFieldClick(field.id)}
                    onMouseEnter={() => debouncedHover(field.id)}
                    onMouseLeave={() => debouncedHover(null)}
                    title={`${field.label}: ${field.content.value}`}
                  />
                );
              })}
            </div>
          );
        })}

        {/* Floating zoom and fullscreen controls */}
        <div className="absolute  bottom-4 flex flex-col bg-gray-900 rounded-lg shadow-lg">
          <button
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-t-lg"
            onClick={() => adjustZoom("in")}
            aria-label="plus"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-b-lg"
            onClick={() => adjustZoom("out")}
            aria-label="minus"
          >
            <Minus className="w-5 h-5" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-b-lg transition-colors"
            title="Fullscreen (F)"
            aria-label="maximize"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
