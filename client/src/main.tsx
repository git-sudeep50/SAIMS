import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { router } from "./routes.tsx";
import { RouterProvider } from "react-router";
import { Provider } from "react-redux";
import store from "./utils/store.ts";

const root = document.getElementById("root")!;
createRoot(root).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
