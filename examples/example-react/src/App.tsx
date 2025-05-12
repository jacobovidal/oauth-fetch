import { Auth0Provider } from "@auth0/auth0-react";
import { Toaster } from 'sonner'

import { ThemeProvider } from "@/components/theme-provider";
import Home from "./Home";

function App() {
  return (
    <Auth0Provider
      domain="auth0.oauthlabs.com"
      clientId="UapVm2tvz0bzYkVz5tz4ao0mX73uYTvh"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Home />
        <Toaster richColors />
      </ThemeProvider>
    </Auth0Provider>
  );
}

export default App;
