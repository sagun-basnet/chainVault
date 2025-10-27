import { Share2, Eye, FileText, Grid3x3, List, Trash2, Download, Link as LinkIcon, Copy } from "lucide-react";
import { useState } from "react";

const SharedFilesPage = () => {
  const [viewMode, setViewMode] = useState("list"); // "list" or "grid"
  const [sortBy, setSortBy] = useState("sharedAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const sharedFiles = [
    {
      id: 1,
      name: "Q4_Financial_Report.pdf",
      permission: "View Only",
      expiresAt: "2025-11-30",
      sharedAt: "2025-10-15",
      size: "2.4 MB",
      shareLink: "https://share.example.com/q4-report-abc123",
      views: 12,
    },
    {
      id: 2,
      name: "Marketing_Strategy_2025.pptx",
      permission: "Edit",
      expiresAt: "2025-12-31",
      sharedAt: "2025-10-10",
      size: "5.1 MB",
      shareLink: "https://share.example.com/marketing-xyz789",
      views: 8,
    },
    {
      id: 3,
      name: "Product_Roadmap.xlsx",
      permission: "View Only",
      expiresAt: "Never",
      sharedAt: "2025-10-05",
      size: "1.8 MB",
      shareLink: "https://share.example.com/roadmap-def456",
      views: 25,
    },
  ];

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const colors = {
      pdf: "text-red-500",
      pptx: "text-orange-500",
      xlsx: "text-green-500",
      docx: "text-blue-500",
    };
    return colors[ext] || "text-cyan-500";
  };

  const sortFiles = (files) => {
    return [...files].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "sharedAt":
          comparison = new Date(a.sharedAt) - new Date(b.sharedAt);
          break;
        case "size":
          const sizeA = parseFloat(a.size);
          const sizeB = parseFloat(b.size);
          comparison = sizeA - sizeB;
          break;
        case "views":
          comparison = a.views - b.views;
          break;
        case "expiresAt":
          if (a.expiresAt === "Never") return sortOrder === "asc" ? 1 : -1;
          if (b.expiresAt === "Never") return sortOrder === "asc" ? -1 : 1;
          comparison = new Date(a.expiresAt) - new Date(b.expiresAt);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const handleCopyLink = (link, fileName) => {
    navigator.clipboard.writeText(link);
    alert(`Link copied for ${fileName}!`);
  };

  const sortedFiles = sortFiles(sharedFiles);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex w-full justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Shared Files</h1>
            <p className="text-gray-400">Manage your shared file links</p>
          </div>
          <button 
            onClick={() => alert('Navigate to search shared files')}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 text-white shadow-lg shadow-cyan-500/20"
          >
            <FileText className="w-4 h-4" />
            <span>Search Shared Files</span>
          </button>
        </div>

        {/* Controls Bar */}
        <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800 p-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Sort by:</span>
              <div className="flex space-x-2 flex-wrap">
                <button
                  onClick={() => handleSort("name")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    sortBy === "name"
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
                <button
                  onClick={() => handleSort("sharedAt")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    sortBy === "sharedAt"
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Date {sortBy === "sharedAt" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
                <button
                  onClick={() => handleSort("size")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    sortBy === "size"
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Size {sortBy === "size" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
                <button
                  onClick={() => handleSort("views")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    sortBy === "views"
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Views {sortBy === "views" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
                <button
                  onClick={() => handleSort("expiresAt")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    sortBy === "expiresAt"
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Expires {sortBy === "expiresAt" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "list"
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "grid"
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* List View */}
        {viewMode === "list" && (
          <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                      File Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                      Size
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                      Permission
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                      Views
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                      Shared Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                      Expires
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {sortedFiles.map((file) => (
                    <tr
                      key={file.id}
                      className="hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <Share2 className={`w-5 h-5 ${getFileIcon(file.name)}`} />
                          <span className="text-white font-medium">
                            {file.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{file.size}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            file.permission === "Edit"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          }`}
                        >
                          {file.permission}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{file.views}</td>
                      <td className="px-6 py-4 text-gray-400">{file.sharedAt}</td>
                      <td className="px-6 py-4 text-gray-400">{file.expiresAt}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleCopyLink(file.shareLink, file.name)}
                            className="p-2 text-gray-400 hover:text-cyan-500 transition-colors" 
                            title="Copy Link"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => alert(`View ${file.name}`)}
                            className="p-2 text-gray-400 hover:text-blue-500 transition-colors" 
                            title="View File"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => alert(`Download ${file.name}`)}
                            className="p-2 text-gray-400 hover:text-green-500 transition-colors" 
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => alert(`Remove share for ${file.name}`)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors" 
                            title="Delete Share"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFiles.map((file) => (
              <div
                key={file.id}
                className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800 p-6 hover:border-cyan-500/30 transition-all hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      <Share2 className={`w-6 h-6 ${getFileIcon(file.name)}`} />
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      file.permission === "Edit"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    }`}
                  >
                    {file.permission}
                  </span>
                </div>

                <h3 className="text-white font-semibold mb-2 truncate" title={file.name}>
                  {file.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Size:</span>
                    <span className="text-gray-300">{file.size}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Views:</span>
                    <span className="text-gray-300">{file.views}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Shared:</span>
                    <span className="text-gray-300">{file.sharedAt}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Expires:</span>
                    <span className="text-gray-300">{file.expiresAt}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-700">
                    <div className="flex items-center space-x-2 text-xs text-gray-400 bg-gray-800/30 rounded px-2 py-1.5">
                      <LinkIcon className="w-3 h-3" />
                      <span className="truncate flex-1">{file.shareLink}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-4 border-t border-gray-700">
                  <button 
                    onClick={() => handleCopyLink(file.shareLink, file.name)}
                    className="flex-1 bg-gray-800/50 hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-400 px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </button>
                  <button 
                    onClick={() => alert(`View ${file.name}`)}
                    className="p-2 bg-gray-800/50 hover:bg-blue-500/20 text-gray-300 hover:text-blue-400 rounded-lg transition-all" 
                    title="View File"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => alert(`Download ${file.name}`)}
                    className="p-2 bg-gray-800/50 hover:bg-green-500/20 text-gray-300 hover:text-green-400 rounded-lg transition-all" 
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => alert(`Remove share for ${file.name}`)}
                    className="p-2 bg-gray-800/50 hover:bg-red-500/20 text-gray-300 hover:text-red-400 rounded-lg transition-all" 
                    title="Delete Share"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedFilesPage;