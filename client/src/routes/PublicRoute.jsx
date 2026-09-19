import {
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  useAuth,
} from "../context/useAuth";


const PublicRoute = () => {

  const {
    user,
    loading,
  } = useAuth();


  if (loading) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-slate-400">
          Loading...
        </div>
      </div>
    );
  }


  if (user) {

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }


  return <Outlet />;
};


export default PublicRoute;