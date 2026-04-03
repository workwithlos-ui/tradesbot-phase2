import { Route, Switch } from "wouter";
import { Toaster } from "sonner";
import Home from "@/pages/Home";
import Estimates from "@/pages/Estimates";

export default function App() {
  return (
    <>
      <Toaster position="top-right" theme="dark" richColors />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/estimates" component={Estimates} />
        <Route>
          <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>404</h1>
              <p style={{ color: "var(--muted-foreground)" }}>Page not found</p>
            </div>
          </div>
        </Route>
      </Switch>
    </>
  );
}
