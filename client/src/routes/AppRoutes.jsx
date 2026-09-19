import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute
  from "./ProtectedRoute";

import PublicRoute
  from "./PublicRoute";


import Login
  from "../pages/auth/Login";

import Register
  from "../pages/auth/Register";

import AcceptInvitation
  from "../pages/auth/AcceptInvitation";


import Dashboard
  from "../pages/DashBoard";

import Home
  from "../pages/Home";

import NotFound
  from "../pages/NotFound";

import Unauthorized
  from "../pages/Unauthorized";


const AppRoutes = () => {

  return (

    <Routes>


      {/* =================================================
          HOME
      ================================================= */}

      <Route
        path="/"
        element={<Home />}
      />


      {/* =================================================
          PUBLIC ROUTES
      ================================================= */}

      <Route
        element={<PublicRoute />}
      >

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

      </Route>


      {/* =================================================
          INVITATION
      ================================================= */}

      <Route
        path="/accept-invitation"
        element={
          <AcceptInvitation />
        }
      />


      {/* =================================================
          PROTECTED ROUTES
      ================================================= */}

      <Route
        element={
          <ProtectedRoute />
        }
      >

        <Route
          path="/dashboard"
          element={
            <Dashboard />
          }
        />

        {/* Keep your remaining
            protected routes here */}

      </Route>


      {/* =================================================
          UNAUTHORIZED
      ================================================= */}

      <Route
        path="/unauthorized"
        element={
          <Unauthorized />
        }
      />


      {/* =================================================
          404
      ================================================= */}

      <Route
        path="*"
        element={
          <NotFound />
        }
      />

    </Routes>
  );
};


export default AppRoutes;