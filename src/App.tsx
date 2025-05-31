import ReviewScreen from "./components/pages/Review-Modal";
import { ThemeProvider } from "./context/themeprovider";

export default function Home() {
  return (
    <ThemeProvider>
      <ReviewScreen />
    </ThemeProvider>
  );
}
