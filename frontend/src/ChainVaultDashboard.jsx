import React, { useState, useEffect } from "react";
import {
  Shield,
  Brain,
  Search,
  Share2,
  Upload,
  Lock,
  Eye,
  Users,
  Building,
  User,
  Scale,
  ChevronRight,
  Github,
  Mail,
  FileText,
  Zap,
  Database,
  CheckCircle,
  Bell,
  Settings,
  LogOut,
  Home,
  Folder,
  BarChart3,
  Activity,
  Download,
  MoreHorizontal,
  Filter,
  Grid,
  List,
  Star,
  Clock,
  HardDrive,
  Cpu,
  Globe,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Plus,
  Calendar,
  PieChart,
  LineChart,
} from "lucide-react";

const ChainVaultDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState("grid");
  const [isVisible, setIsVisible] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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

  const stats = [
    {
      label: "Total Files",
      value: "1,247",
      change: "+12%",
      icon: <FileText className="w-6 h-6" />,
      color: "from-cyan-500 to-blue-500",
    },
    {
      label: "Storage Used",
      value: "847 GB",
      change: "+5%",
      icon: <HardDrive className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "AI Classifications",
      value: "2,156",
      change: "+23%",
      icon: <Brain className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Blockchain Logs",
      value: "5,432",
      change: "+18%",
      icon: <Database className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
    },
  ];

  const recentFiles = [
    {
      id: 1,
      name: "Project_Proposal_v3.pdf",
      type: "PDF",
      size: "2.4 MB",
      modified: "2 hours ago",
      status: "verified",
      classification: "Business Document",
    },
    {
      id: 2,
      name: "Marketing_Assets.zip",
      type: "Archive",
      size: "45.2 MB",
      modified: "5 hours ago",
      status: "processing",
      classification: "Media Files",
    },
    {
      id: 3,
      name: "Financial_Report_Q4.xlsx",
      type: "Spreadsheet",
      size: "1.8 MB",
      modified: "1 day ago",
      status: "verified",
      classification: "Financial Data",
    },
    {
      id: 4,
      name: "Team_Meeting_Notes.docx",
      type: "Document",
      size: "856 KB",
      modified: "2 days ago",
      status: "verified",
      classification: "Meeting Notes",
    },
    {
      id: 5,
      name: "Code_Review_Comments.txt",
      type: "Text",
      size: "12 KB",
      modified: "3 days ago",
      status: "verified",
      classification: "Development",
    },
  ];

  const blockchainLogs = [
    {
      id: 1,
      action: "File Upload",
      file: "Project_Proposal_v3.pdf",
      timestamp: "2025-06-25 14:32:15",
      hash: "0x7d4a8b9c...",
      status: "confirmed",
    },
    {
      id: 2,
      action: "Classification",
      file: "Marketing_Assets.zip",
      timestamp: "2025-06-25 14:28:42",
      hash: "0x3f2e1a5b...",
      status: "confirmed",
    },
    {
      id: 3,
      action: "Shared Access",
      file: "Financial_Report_Q4.xlsx",
      timestamp: "2025-06-25 13:45:18",
      hash: "0x9b7c2d8e...",
      status: "confirmed",
    },
  ];

  const getFileIcon = (type) => {
    switch (type) {
      case "PDF":
        return <FileText className="w-6 h-6 text-red-500" />;
      case "Archive":
        return <FileText className="w-6 h-6 text-yellow-500" />;
      case "Spreadsheet":
        return <FileText className="w-6 h-6 text-green-500" />;
      case "Document":
        return <FileText className="w-6 h-6 text-blue-500" />;
      case "Text":
        return <FileText className="w-6 h-6 text-gray-400" />;
      default:
        return <FileText className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Verified
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            <Clock className="w-3 h-3 mr-1" />
            Processing
          </span>
        );
      case "error":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            Error
          </span>
        );
      default:
        return null;
    }
  };

  const FloatingElement = ({ children, delay = 0, className = "" }) => (
    <div
      className={`transform transition-all duration-1000 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );

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

      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="ml-64 flex flex-col h-screen">
        {/* Header */}
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

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <FloatingElement delay={200}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}
                        >
                          {stat.icon}
                        </div>
                        <span className="text-green-400 text-sm font-medium">
                          {stat.change}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {stat.value}
                      </h3>
                      <p className="text-gray-400 text-sm">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </FloatingElement>

              {/* Recent Files */}
              <FloatingElement delay={400}>
                <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800">
                  <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <h2 className="text-xl font-semibold text-white">
                      Recent Files
                    </h2>
                    <button className="text-cyan-500 hover:text-cyan-400 text-sm font-medium">
                      View All
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentFiles.slice(0, 5).map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-800/50 transition-colors"
                        >
                          {getFileIcon(file.type)}
                          <div className="flex-1">
                            <h3 className="font-medium text-white">
                              {file.name}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-400">
                              <span>{file.size}</span>
                              <span>•</span>
                              <span>{file.modified}</span>
                              <span>•</span>
                              <span className="text-cyan-500">
                                {file.classification}
                              </span>
                            </div>
                          </div>
                          {getStatusBadge(file.status)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FloatingElement>

              {/* Blockchain Activity */}
              <FloatingElement delay={600}>
                <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800">
                  <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <h2 className="text-xl font-semibold text-white">
                      Recent Blockchain Activity
                    </h2>
                    <button className="text-cyan-500 hover:text-cyan-400 text-sm font-medium">
                      View All Logs
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {blockchainLogs.map((log) => (
                        <div
                          key={log.id}
                          className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-800/50 transition-colors"
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <Database className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-white">
                              {log.action}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-400">
                              <span>{log.file}</span>
                              <span>•</span>
                              <span>{log.timestamp}</span>
                              <span>•</span>
                              <span className="font-mono text-cyan-500">
                                {log.hash}
                              </span>
                            </div>
                          </div>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Confirmed
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FloatingElement>
            </div>
          )}

          {activeTab === "files" && (
            <div className="space-y-6">
              {/* File Actions */}
              <FloatingElement delay={200}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>Upload Files</span>
                    </button>
                    <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2">
                      <Filter className="w-4 h-4" />
                      <span>Filter</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === "grid"
                          ? "bg-cyan-500/20 text-cyan-500"
                          : "text-gray-400 hover:text-gray-300"
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === "list"
                          ? "bg-cyan-500/20 text-cyan-500"
                          : "text-gray-400 hover:text-gray-300"
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </FloatingElement>

              {/* Files Grid/List */}
              <FloatingElement delay={400}>
                <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800">
                  <div className="p-6">
                    {viewMode === "grid" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {recentFiles.map((file) => (
                          <div
                            key={file.id}
                            className="group bg-gray-800/50 hover:bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-cyan-500/50 transition-all cursor-pointer"
                          >
                            <div className="flex items-center justify-between mb-3">
                              {getFileIcon(file.type)}
                              <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="w-4 h-4 text-gray-400" />
                              </button>
                            </div>
                            <h3 className="font-medium text-white mb-1 truncate">
                              {file.name}
                            </h3>
                            <div className="text-sm text-gray-400 mb-2">
                              <div>{file.size}</div>
                              <div>{file.modified}</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-cyan-500">
                                {file.classification}
                              </span>
                              {getStatusBadge(file.status)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {recentFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-800/50 transition-colors"
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-cyan-500 bg-gray-800 border-gray-600 rounded focus:ring-cyan-500"
                            />
                            {getFileIcon(file.type)}
                            <div className="flex-1">
                              <h3 className="font-medium text-white">
                                {file.name}
                              </h3>
                              <div className="flex items-center space-x-2 text-sm text-gray-400">
                                <span>{file.size}</span>
                                <span>•</span>
                                <span>{file.modified}</span>
                                <span>•</span>
                                <span className="text-cyan-500">
                                  {file.classification}
                                </span>
                              </div>
                            </div>
                            {getStatusBadge(file.status)}
                            <button className="text-gray-400 hover:text-gray-300">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </FloatingElement>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              {/* Analytics Cards */}
              <FloatingElement delay={200}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      File Growth
                    </h3>
                    <div className="h-64 bg-gray-800/50 rounded-lg flex items-center justify-center">
                      <LineChart className="w-16 h-16 text-cyan-500" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      File Types
                    </h3>
                    <div className="h-64 bg-gray-800/50 rounded-lg flex items-center justify-center">
                      <PieChart className="w-16 h-16 text-cyan-500" />
                    </div>
                  </div>
                </div>
              </FloatingElement>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChainVaultDashboard;
