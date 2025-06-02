/* Theme toggle */
import type React from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "../button";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  isDark,
  onToggle,
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
      ariaLabel={isDark ? "sun" : "moon"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600" />
      )}
    </Button>
  );
};
