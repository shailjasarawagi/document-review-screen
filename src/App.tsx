/**
 * Home component serving as the main entry point for the application
 * Wraps the ReviewScreen component with ThemeProvider for theme management
 * @returns {JSX.Element} Home page with theme context and review screen
 */

import ReviewScreen from "./components/pages/Review-Modal";
import { ThemeProvider } from "./context/themeprovider";

export default function Home() {
  return (
    <ThemeProvider>
      <ReviewScreen />
    </ThemeProvider>
  );
}
