import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Maximize2, Minus, Plus, ZoomIn, ZoomOut } from "lucide-react";
import type { Field, BoundingBox, ZoomLevel } from "../../../types";
import { Button } from "../../elements/button";
import { Select } from "../../elements/select";

interface DocumentViewerProps {
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  selectedFields: Set<number>;
  hoveredField: number | null;
  onFieldHover: (fieldId: number | null) => void;
  fields: Field[];
  bboxes: BoundingBox[];
}

const zoomLevels: ZoomLevel[] = [
  { label: "Fit", value: 0 },
  { label: "75%", value: 0.75 },
  { label: "100%", value: 1 },
  { label: "125%", value: 1.25 },
  { label: "150%", value: 1.5 },
  { label: "200%", value: 2 },
];

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  imageUrl,
  imageWidth,
  imageHeight,
  selectedFields,
  hoveredField,
  onFieldHover,
  fields,
  // bboxes,
}) => {
  const [currentZoom, setCurrentZoom] = useState<ZoomLevel>(zoomLevels[0]);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

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

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // const handleZoomIn = useCallback(() => {
  //   const currentIndex = zoomLevels.findIndex(
  //     (z) => z.value === currentZoom.value
  //   );
  //   if (currentIndex < zoomLevels.length - 1) {
  //     setCurrentZoom(zoomLevels[currentIndex + 1]);
  //   }
  // }, [currentZoom]);

  // const handleZoomOut = useCallback(() => {
  //   const currentIndex = zoomLevels.findIndex(
  //     (z) => z.value === currentZoom.value
  //   );
  //   if (currentIndex > 0) {
  //     setCurrentZoom(zoomLevels[currentIndex - 1]);
  //   }
  // }, [currentZoom]);
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
    [currentZoom]
  );
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

  const getActualZoom = () => {
    if (currentZoom.value === 0) {
      const scaleX = containerSize.width / imageWidth;
      const scaleY = containerSize.height / imageHeight;
      return Math.min(scaleX, scaleY, 1);
    }
    return currentZoom.value;
  };

  const actualZoom = getActualZoom();
  const displayWidth = imageWidth * actualZoom;
  const displayHeight = imageHeight * actualZoom;

  const getFieldPosition = useCallback(
    (field: Field) => {
      if (!field.content.position || field.content.position.length !== 4) {
        return null;
      }
      const [x1, y1, x2, y2] = field.content.position;
      return {
        left: (x1 / imageWidth) * displayWidth,
        top: (y1 / imageHeight) * displayHeight,
        width: ((x2 - x1) / imageWidth) * displayWidth,
        height: ((y2 - y1) / imageHeight) * displayHeight,
      };
    },
    [imageWidth, imageHeight, displayHeight, displayWidth]
  );

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

  const isFieldHighlighted = useCallback(
    (fieldId: number) => {
      return selectedFields.has(fieldId) || hoveredField === fieldId;
    },
    [selectedFields, hoveredField]
  );

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-800">
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
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
            value={currentZoom || `${Math.round(actualZoom * 100)}%`}
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

      <div ref={containerRef} className="flex-1 overflow-auto p-4">
        <div
          className="relative mx-auto bg-white shadow-lg"
          style={{
            width: displayWidth,
            height: displayHeight,
            minWidth: displayWidth,
            minHeight: displayHeight,
          }}
        >
          <img
            ref={imageRef}
            src={`/assets/${imageUrl}`}
            sizes="(max-width: 600px) 480px, 800px"
            alt="description"
            className="max-w-full max-h-full object-contain"
            style={{
              width: displayWidth,
              height: displayHeight,
            }}
          />

          {fields.map((field) => {
            const position = getFieldPosition(field);
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
