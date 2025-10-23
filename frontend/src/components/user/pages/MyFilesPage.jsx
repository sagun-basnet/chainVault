import {
  Search,
  Download,
  Eye,
  Share2,
  Trash2,
  Grid,
  List,
  FileText,
  File,
  FileArchive,
  FileSpreadsheet,
  MoreVertical,
  SquareTerminal,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const MyFilesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [sortBy, setSortBy] = useState("name");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const files = [
    {
      id: 1,
      name: "Project_Proposal_v3.pdf",
      category: "Documents",
      size: "2.4 MB",
      tags: ["important", "proposal"],
      uploadedAt: "2025-10-20",
      type: "PDF",
    },
    {
      id: 2,
      name: "Marketing_Assets.zip",
      category: "Archive",
      size: "45.2 MB",
      tags: ["marketing", "assets"],
      uploadedAt: "2025-10-19",
      type: "Archive",
    },
    {
      id: 3,
      name: "Financial_Report_Q4.xlsx",
      category: "Spreadsheet",
      size: "1.8 MB",
      tags: ["finance", "quarterly"],
      uploadedAt: "2025-10-18",
      type: "Spreadsheet",
    },
    {
      id: 4,
      name: "Team_Meeting_Notes.docx",
      category: "Documents",
      size: "856 KB",
      tags: ["meeting", "notes"],
      uploadedAt: "2025-10-17",
      type: "Document",
    },
    {
      id: 5,
      name: "Brand_Guidelines.pdf",
      category: "Documents",
      size: "3.2 MB",
      tags: ["branding", "guidelines"],
      uploadedAt: "2025-10-16",
      type: "PDF",
    },
    {
      id: 6,
      name: "Product_Card.jsx",
      category: "Code",
      size: "28.5 MB",
      tags: ["images", "products"],
      uploadedAt: "2025-10-15",
      type: "Code",
    },
  ];

  const getFileIcon = (type) => {
    switch (type) {
      case "PDF":
        return <FileText className="w-8 h-8 text-red-400" />;
      case "Archive":
        return <FileArchive className="w-8 h-8 text-yellow-400" />;
      case "Spreadsheet":
        return <FileSpreadsheet className="w-8 h-8 text-green-400" />;
      case "Document":
        return <File className="w-8 h-8 text-blue-400" />;
      case "Code":
        return <SquareTerminal className="w-8 h-8 text-purple-500" />;
      default:
        return <FileText className="w-8 h-8 text-gray-400" />;
    }
  };

  const categories = ["all", ...new Set(files.map((f) => f.category))];

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">My Files</h1>
          <Link to="/user-dashboard/add-files">
            <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 text-white shadow-lg shadow-cyan-500/20">
              <FileText className="w-4 h-4" />
              <span>Upload Files</span>
            </button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-4 border border-gray-800">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800/50 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none transition-all"
              />
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-all text-gray-300 border border-gray-700 focus:border-cyan-500 focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-cyan-500/20 text-cyan-500"
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-cyan-500/20 text-cyan-500"
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Files Count */}
        <div className="flex items-center justify-between text-gray-400 text-sm">
          <span>{filteredFiles.length} files</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800/50 text-gray-300 px-3 py-1 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none text-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="date">Sort by Date</option>
            <option value="size">Sort by Size</option>
          </select>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div id="allfiles" className="h-[30rem] overflow-y-scroll">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800 p-4 hover:border-cyan-500/50 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-3 bg-gray-800/50 rounded-xl">
                      {getFileIcon(file.type)}
                    </div>
                    <button className="p-1 text-gray-400 hover:text-cyan-500 opacity-0 group-hover:opacity-100 transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                  <h3
                    className="text-white font-medium mb-2 truncate"
                    title={file.name}
                  >
                    {file.name}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                    <span>{file.size}</span>
                    <span className="text-xs">{file.uploadedAt}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {file.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full border border-cyan-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <span className="text-xs text-gray-500">
                      {file.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button className="p-2 text-gray-400 hover:text-cyan-500 hover:bg-gray-800/50 rounded-lg transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-cyan-500 hover:bg-gray-800/50 rounded-lg transition-all">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-800/50 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-800/50 rounded-lg transition-all">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                      Size
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                      Tags
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                      Uploaded At
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredFiles.map((file) => (
                    <tr
                      key={file.id}
                      className="hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file.type)}
                          <span className="text-white font-medium">
                            {file.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {file.category}
                      </td>
                      <td className="px-6 py-4 text-gray-400">{file.size}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {file.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full border border-cyan-500/30"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {file.uploadedAt}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-cyan-500 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-cyan-500 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-cyan-500 transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
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
      </div>
    </div>
  );
};

export default MyFilesPage;
