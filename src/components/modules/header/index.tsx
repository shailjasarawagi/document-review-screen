/* Header Compoent */
import { Bell, HelpCircle, MoreVertical } from "lucide-react";
import { useTheme } from "../../../hooks/use-theme";
import { ThemeToggle } from "../../elements/theme-toggle";

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex h-14 items-center justify-between px-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Review Screen
        </h1>

        <div className="flex items-center gap-2">
          <ThemeToggle
            isDark={theme === "dark" ? true : false}
            onToggle={toggleTheme}
          />

          <div className="flex items-center space-x-3">
            <button
              className="p-2 text-black-100  hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="More options menu"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            <button
              className="p-2 text-black-100  hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Help and documentation"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              className="p-2 text-black-100  hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>
            <button
              className="p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
              aria-label="User profile menu"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
