import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FileText,
  HardDrive,
  Brain,
  Database,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Filter,
  Grid,
  List,
  MoreHorizontal,
  LineChart,
  PieChart,
} from "lucide-react";

const Main = ({ activeTab, viewMode, setViewMode, isVisible, searchQuery }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await axios.get("http://localhost:5550/api/files");
      setFiles(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching files:", error);
      setLoading(false);
    }
  };

  const filteredFiles = files.filter((file) => {
    const query = (searchQuery || "").toLowerCase();
    return (
      file.name.toLowerCase().includes(query) ||
      (file.category && file.category.toLowerCase().includes(query)) ||
      (file.tags && file.tags.some((t) => t.tag.name.toLowerCase().includes(query)))
    );
  });

  const stats = [
    {
      label: "Total Files",
      value: files.length.toString(),
      change: "+12%",
      icon: <FileText className="w-6 h-6" />,
      color: "from-cyan-500 to-blue-500",
    },
    {
      label: "Storage Used",
      value: "847 GB", // Mock data for now
      change: "+5%",
      icon: <HardDrive className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "AI Classifications",
      value: files.filter(f => f.category && f.category !== 'unknown').length.toString(),
      change: "+23%",
      icon: <Brain className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Blockchain Logs",
      value: "5,432", // Mock data for now
      change: "+18%",
      icon: <Database className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
    },
  ];

  // Mock blockchain logs for now
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
  ];

  const getFileIcon = (type) => {
    // Simple mapping based on extension or mime type
    if (!type) return <FileText className="w-6 h-6 text-gray-400" />;
    if (type.includes("pdf")) return <FileText className="w-6 h-6 text-red-500" />;
    if (type.includes("sheet") || type.includes("csv")) return <FileText className="w-6 h-6 text-green-500" />;
    if (type.includes("image")) return <FileText className="w-6 h-6 text-purple-500" />;
    return <FileText className="w-6 h-6 text-blue-500" />;
  };

  const getStatusBadge = (status) => {
    // Assuming all files fetched are 'verified' or 'processed' for now
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Verified
      </span>
    );
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
                  {loading ? (
                    <p className="text-gray-400">Loading files...</p>
                  ) : filteredFiles.slice(0, 5).map((file) => (
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
                          <span>{new Date(file.createdAt || Date.now()).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="text-cyan-500">
                            {file.category || "Unclassified"}
                          </span>
                        </div>
                      </div>
                      {getStatusBadge("verified")}
                    </div>
                  ))}
                  {!loading && filteredFiles.length === 0 && (
                    <p className="text-gray-500">No files found.</p>
                  )}
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
                {loading ? (
                   <p className="text-gray-400">Loading files...</p>
                ) : viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredFiles.map((file) => (
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
                          <div>{new Date(file.createdAt || Date.now()).toLocaleDateString()}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-cyan-500">
                            {file.category || "Unclassified"}
                          </span>
                          {getStatusBadge("verified")}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredFiles.map((file) => (
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
                            <span>{new Date(file.createdAt || Date.now()).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="text-cyan-500">
                              {file.category || "Unclassified"}
                            </span>
                          </div>
                        </div>
                        {getStatusBadge("verified")}
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
  );
};

export default Main;