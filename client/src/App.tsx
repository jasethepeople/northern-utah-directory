import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Directory from "./pages/Directory";
import Profile from "./pages/Profile";
import Portal from "./pages/Portal";
import Admin from "./pages/Admin";

function Router() { return <Switch><Route path="/" component={Home}/><Route path="/directory" component={Directory}/><Route path="/attorneys/:slug" component={Profile}/><Route path="/portal" component={Portal}/><Route path="/admin" component={Admin}/><Route path="/404" component={NotFound}/><Route component={NotFound}/></Switch>; }
function App() { return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster/><Router/></TooltipProvider></ThemeProvider></ErrorBoundary>; }
export default App;
