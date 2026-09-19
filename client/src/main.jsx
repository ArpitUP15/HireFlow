import React from "react";

import ReactDOM from "react-dom/client";

import App from "./App.jsx";

import "./index.css";

import {
  AuthProvider,
} from "./context/AuthContext";

import {
  OrganizationProvider,
} from "./context/OrganizationContext";


ReactDOM
  .createRoot(
    document.getElementById(
      "root"
    )
  )
  .render(

    <React.StrictMode>

      <AuthProvider>

        <OrganizationProvider>

          <App />

        </OrganizationProvider>

      </AuthProvider>

    </React.StrictMode>
  );