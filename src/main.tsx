import { createRoot } from "react-dom/client";
import { App } from "./App.js";
import { AppContextProvider } from "./AppContext.js";
import "./external/react-treeview.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <AppContextProvider>
    <App />
  </AppContextProvider>,
);
