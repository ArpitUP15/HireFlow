import React from "react";

import ReactDOM from
  "react-dom/client";

import App from "./App.jsx";

import "./index.css";

import {
  AuthProvider,
} from "./context/AuthContext.jsx";

import {
  OrganizationProvider,
} from "./context/OrganizationContext.jsx";


ReactDOM.createRoot(
  document.getElementById(
    "root"
  )
).render(
  <React.StrictMode>

    <AuthProvider>

      <OrganizationProvider>

        <App />

      </OrganizationProvider>

    </AuthProvider>

  </React.StrictMode>
);