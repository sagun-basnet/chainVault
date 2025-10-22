import React, { useState } from "react";
import TopBar from "./TopBar";
import { Outlet } from "react-router-dom";

// Main Dashboard Component
const UserDashboard = () => {
  const [activePage, setActivePage] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const renderPage = () => {
//     switch (activePage) {
//       case "home":
//         return <HomePage />;
//       case "myfiles":
//         return <MyFilesPage />;
//       case "shared":
//         return <SharedFilesPage />;
//       case "aiinsights":
//         return <AIInsightsPage />;
//       case "tags":
//         return <TagsPage />;
//       case "profile":
//         return <ProfilePage />;
//       default:
//         return <HomePage />;
//     }
//   };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-gray-100">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Top Navigation Bar */}
      <div className="md:flex">
        <TopBar
          activePage={activePage}
          setActivePage={setActivePage}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Main Content */}
        <main className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
