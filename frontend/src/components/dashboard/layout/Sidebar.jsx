import React from "react";
import {
  Shield,
  Share2,
  LogOut,
  Home,
  BarChart3,
  Database,
  User,
  Folder,
  Brain,
  FileText,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const location = useLocation();

  const sidebarItems = [
    { id: "overview", icon: <Home className="w-5 h-5" />, label: "Dashboard", link: "/dashboard" },
    { id: "files", icon: <Folder className="w-5 h-5" />, label: "File Management", link: "/dashboard/files" },
    { id: "users", icon: <User className="w-5 h-5" />, label: "User Management", link: "/dashboard/users" },
    { id: "ai", icon: <Brain className="w-5 h-5" />, label: "AI Management", link: "/dashboard/ai" },
    {
      id: "blockchain",
      icon: <Database className="w-5 h-5" />,
      label: "Blockchain Log",
      link: "/dashboard/blockchain-log",
    },
    {
      id: "analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      label: "Analytics",
      link: "/dashboard/analytics",
    },
    { id: "logs", icon: <FileText className="w-5 h-5" />, label: "System Logs", link: "/dashboard/logs" },
    { id: "settings", icon: <Settings className="w-5 h-5" />, label: "Settings", link: "/dashboard/settings" },
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900/80 backdrop-blur-xl border-r border-gray-800">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-4 border-b border-gray-800">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="ml-3 text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            ChainVault
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {sidebarItems.map((item) => (
            <Link
              to={item.link}
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all ${
                location.pathname === item.link
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-500 border border-cyan-500/30"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
              }`}
            >
              {item.icon}
              <span className="ml-3 font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="px-4 py-4 border-t border-gray-800">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3 flex-1">
              <p className="font-medium text-white">John Doe</p>
              <p className="text-sm text-gray-400">Admin</p>
            </div>
            <button className="text-gray-400 hover:text-gray-300">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;