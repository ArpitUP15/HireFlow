import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

import api from "../../services/api";


// ============================================================
// PROTECTED ROUTE
// ============================================================

const ProtectedRoute = () => {

  const location = useLocation();

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);


  // ==========================================================
  // CHECK AUTHENTICATION
  // ==========================================================

  useEffect(() => {

    const checkAuthentication = async () => {

      try {

        const token =
          localStorage.getItem("token");


        // ----------------------------------------------------
        // No token = not logged in
        // ----------------------------------------------------

        if (!token) {

          setIsAuthenticated(false);
          setCheckingAuth(false);

          return;
        }


        // ----------------------------------------------------
        // Verify JWT with backend
        // ----------------------------------------------------

        const response = await api.get(
          "/auth/me"
        );


        // ----------------------------------------------------
        // Authentication successful
        // ----------------------------------------------------

        if (response.data) {

          setIsAuthenticated(true);

        } else {

          setIsAuthenticated(false);

          localStorage.removeItem("token");
          localStorage.removeItem("user");

        }

      } catch (error) {

        console.error(
          "Authentication check failed:",
          error
        );

        setIsAuthenticated(false);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

      } finally {

        setCheckingAuth(false);

      }

    };


    checkAuthentication();

  }, []);


  // ==========================================================
  // LOADING
  // ==========================================================

  if (checkingAuth) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-gray-50">

        <div className="flex flex-col items-center">

          <Loader2
            className="h-10 w-10 animate-spin text-blue-600"
          />

          <p className="mt-4 text-sm text-gray-500">
            Checking authentication...
          </p>

        </div>

      </div>

    );
  }


  // ==========================================================
  // NOT AUTHENTICATED
  // ==========================================================

  if (!isAuthenticated) {

    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );

  }


  // ==========================================================
  // AUTHENTICATED
  // ==========================================================

  return <Outlet />;

};


export default ProtectedRoute;

