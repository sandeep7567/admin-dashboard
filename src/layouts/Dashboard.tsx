import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store";

const Dashboard = () => {
  const { user } = useAuthStore();
  console.log(user);

  if (user === null) {
    return <Navigate to={"/auth/login"} replace />;
  }

  return (
    <>
      <h1>Hi Dashboard</h1>
      <Outlet />;
    </>
  );
};

export default Dashboard;
