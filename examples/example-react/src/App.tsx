import { Toaster } from 'sonner'

import { ThemeProvider } from "@/components/theme-provider";
import Home from "./Home";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Home />
      <Toaster richColors />
    </ThemeProvider>
  );
}

export default App;
