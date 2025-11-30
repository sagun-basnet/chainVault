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
import ShareFileViewer from "./components/user/components/ShareFileViewer";
import ShareFileLink from "./components/user/components/ShareFIleLink";
import BlockchainLog from "./components/admin/BlockchainLog";
import Main from "./components/dashboard/layout/Main";
import FileManagement from "./components/admin/FileManagement";
import UserManagement from "./components/admin/UserManagement";
import AIManagement from "./components/admin/AIManagement";
import Analytics from "./components/admin/Analytics";
import SystemLogs from "./components/admin/SystemLogs";
import Settings from "./components/admin/Settings";
import UserBlockchainLog from "./components/user/pages/UserBlockchainLog";

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
          children: [
            {
              path: "",
              element: <Main />,
            },
            {
              path: "files",
              element: <FileManagement />,
            },
            {
              path: "users",
              element: <UserManagement />,
            },
            {
              path: "ai",
              element: <AIManagement />,
            },
            {
              path: "blockchain-log",
              element: <BlockchainLog />,
            },
            {
              path: "analytics",
              element: <Analytics />,
            },
            {
              path: "logs",
              element: <SystemLogs />,
            },
            {
              path: "settings",
              element: <Settings />,
            },
          ],
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
              path: "/user-dashboard/shared-file",
              element: <ShareFileViewer />,
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
            {
              path: "/user-dashboard/blockchain-log",
              element: <UserBlockchainLog />,
            },
          ],
        },
      ],
    },

    {
      path: "/share/:token",
      element: <ShareFileLink />,
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
