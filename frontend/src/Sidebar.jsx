import {
  BarChart3,
  Database,
  Folder,
  Home,
  LogOut,
  Share2,
  Shield,
  User,
} from "lucide-react";
import React, { useState } from "react";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const sidebarItems = [
    { id: "overview", icon: <Home className="w-5 h-5" />, label: "Overview" },
    { id: "files", icon: <Folder className="w-5 h-5" />, label: "Files" },
    {
      id: "analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      label: "Analytics",
    },
    {
      id: "blockchain",
      icon: <Database className="w-5 h-5" />,
      label: "Blockchain",
    },
    { id: "sharing", icon: <Share2 className="w-5 h-5" />, label: "Sharing" },
    { id: "security", icon: <Shield className="w-5 h-5" />, label: "Security" },
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
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-500 border border-cyan-500/30"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
              }`}
            >
              {item.icon}
              <span className="ml-3 font-medium">{item.label}</span>
            </button>
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
