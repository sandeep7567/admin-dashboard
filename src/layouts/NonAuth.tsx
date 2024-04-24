import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store";

const NonAuth = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  if (user !== null) {
    const redirect =
      new URLSearchParams(location.search).get("redirect") || "/";

    return <Navigate to={redirect} replace />;
  }

  return <Outlet />;
};

export default NonAuth;
