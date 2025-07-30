import { Navigate, Outlet } from "react-router-dom";

const IsAdmin = () => {
  const isAuthenticated = JSON.parse(localStorage.getItem("user")).role; // Example: Checking token in localStorage
  // console.log(isAuthenticated, " :isAuthenticated");

  return isAuthenticated === "ADMIN" ? (
    <Outlet />
  ) : (
    <Navigate to="/401-Error-Unauthorized" />
  );
};

export default IsAdmin;
