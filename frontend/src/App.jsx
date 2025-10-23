import { Router } from "lucide-react";
import ChainVaultHomepage from "./components/home/ChainVaultHomepage";
import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/form/Login";
import Registration from "./components/form/Registration";
import HomePage from "./pages/HomePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WatchDemoSection from "./components/home/WatchDemoSection";
import ChainVaultDashboard from "./components/dashboard/layout/ChainVaultDashboard";
import VerifyOtp from "./pages/Verifyotp";
import ProtectedRoute from "./utils/ProtectedRoute";
import UserDashboard from "./components/dashboard/user/UserDashboard";
import UserDashboardHomePage from "./components/user/pages/UserDashboardHomePage";
import MyFilesPage from "./components/user/pages/MyFilesPage";
import SharedFilesPage from "./components/user/pages/SharedFilesPage";
import AIInsightsPage from "./components/user/pages/AIInsightsPage";
import TagsPage from "./components/user/pages/TagsPage";
import ProfilePage from "./components/user/pages/ProfilePage";
import AddFiles from "./components/user/components/AddFiles";

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
      element: <ProtectedRoute />,
      children: [
        {
          path: "/dashboard",
          element: <ChainVaultDashboard />,
        },
      ],
    },

    {
      path: "/registration",
      element: <Registration />,
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/user-dashboard",
          element: <UserDashboard />,
          children: [
            {
              path: "",
              element: <UserDashboardHomePage />,
            },
            {
              path: "/user-dashboard/files",
              element: <MyFilesPage />,
            },
            {
              path: "/user-dashboard/add-files",
              element: <AddFiles />,
            },
            {
              path: "/user-dashboard/shared",
              element: <SharedFilesPage />,
            },
            {
              path: "/user-dashboard/insights",
              element: <AIInsightsPage />,
            },
            {
              path: "/user-dashboard/tags",
              element: <TagsPage />,
            },
            {
              path: "/user-dashboard/user-profile",
              element: <ProfilePage />,
            },
          ]
        },
      ],
    },

    {
      path: "/verify-otp",
      element: <VerifyOtp />,
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
