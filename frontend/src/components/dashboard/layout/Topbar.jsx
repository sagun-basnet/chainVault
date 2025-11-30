import React from "react";
import { Bell, Settings, Search } from "lucide-react";

const Topbar = ({ activeTab, notifications = 0, onSearch }) => {
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

      {/* Search Bar */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
          <input
            type="text"
            placeholder="Search files using AI (e.g., 'financial reports from last month')..."
            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-2 pl-10 pr-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:bg-gray-800 transition-all"
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>
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