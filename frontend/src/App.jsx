import { Router } from "lucide-react";
import ChainVaultHomepage from "./components/home/ChainVaultHomepage";
import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/form/Login";
import Registration from "./components/form/Registration";
import HomePage from "./pages/HomePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WatchDemoSection from "./components/home/WatchDemoSection";
import ChainVaultDashboard from "./components/dashboard/ChainVaultDashboard";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/watch-demo",
      element: <WatchDemoSection />,
    },
    {
      path: "/dashboard",
      element: <ChainVaultDashboard />,
    },
    {
      path: "/registration",
      element: <Registration />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
