import {Navigate,Outlet} from "react-router-dom";
import { useAuth } from "../context/useAuth";

function PublicRoute() {
  const {
    user,
    loading
  } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading...
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
}

export default PublicRoute;