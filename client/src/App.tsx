import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ReservationProvider } from "./contexts/ReservationContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/hotels" component={Home} />
      <Route path="/reservation" component={Home} />
      <Route path="/navettes" component={Home} />
      <Route path="/mes-reservations" component={Home} />
      <Route path="/admin" component={Home} />
      <Route path="/hote" component={Home} />
      <Route path="/espace-hote" component={Home} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={Home} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ReservationProvider>
          <TooltipProvider>
            <Toaster position="top-right" richColors />
            <Router />
          </TooltipProvider>
        </ReservationProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
