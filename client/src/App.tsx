import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import NewEntry from "./pages/NewEntry";
import DailySummary from "./pages/DailySummary";
import Reminders from "./pages/Reminders";
import Contacts from "./pages/Contacts";
import Settings from "./pages/Settings";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ConsentForm from "./pages/ConsentForm";
import EntriesSearch from "./pages/EntriesSearch";
import Analytics from "./pages/Analytics";
import DataManagement from "./pages/DataManagement";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/new-entry"} component={NewEntry} />
      <Route path={"/daily-summary"} component={DailySummary} />
      <Route path={"/reminders"} component={Reminders} />
      <Route path={"/contacts"} component={Contacts} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/messages"} component={Messages} />
      <Route path={"/privacy"} component={PrivacyPolicy} />
      <Route path={"/consent"} component={ConsentForm} />
      <Route path={"/search"} component={EntriesSearch} />
      <Route path={"/analytics"} component={Analytics} />
      <Route path={"/data-management"} component={DataManagement} />
      <Route path={"/about"} component={About} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

