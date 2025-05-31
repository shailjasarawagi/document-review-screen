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
        </div>
      </div>
    </header>
  );
}
