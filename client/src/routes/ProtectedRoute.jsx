import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  Loader2,
} from "lucide-react";

import {
  useAuth,
} from "../context/useAuth";


const ProtectedRoute = () => {

  const location =
    useLocation();


  const {
    user,
    loading,
  } = useAuth();


  if (loading) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-slate-950">

        <Loader2
          className="h-10 w-10 animate-spin text-blue-500"
        />

      </div>
    );
  }


  if (!user) {

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


  return <Outlet />;
};


export default ProtectedRoute;