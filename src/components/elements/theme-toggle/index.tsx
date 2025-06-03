/* ThemeToggle Component
 * A toggle button for switching between light and dark themes.
 * Features:
 * - Displays a Sun icon for light mode.
 * - Displays a Moon icon for dark mode.
 * - Accessible with ARIA labels for better usability.
 */
import type React from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "../button";

interface ThemeToggleProps {
  isDark: boolean; // Indicates if the current theme is dark
  onToggle: () => void; // Callback to handle theme toggle action
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
