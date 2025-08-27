import React from "react";
import { Bell, Settings } from "lucide-react";

const Topbar = ({ activeTab, notifications = 0 }) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-900/40 backdrop-blur-lg border-b border-gray-800">
      <div>
        <h1 className="text-2xl font-bold text-white capitalize">
          {activeTab}
        </h1>
        <p className="text-gray-400">
          Manage your files with AI and blockchain security
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-300 transition-colors">
          <Bell className="w-6 h-6" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {notifications}
            </span>
          )}
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-300 transition-colors">
          <Settings className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Topbar;