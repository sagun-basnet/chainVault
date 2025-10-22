import {
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  Filter,
  Grid,
  List,
  FileText,
} from "lucide-react";
import { useState } from "react";
const MyFilesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [sortBy, setSortBy] = useState("name");

  const files = [
    {
      id: 1,
      name: "Project_Proposal_v3.pdf",
      category: "Business",
      size: "2.4 MB",
      tags: ["important", "proposal"],
      uploadedAt: "2025-10-20",
      type: "PDF",
    },
    {
      id: 2,
      name: "Marketing_Assets.zip",
      category: "Media",
      size: "45.2 MB",
      tags: ["marketing", "assets"],
      uploadedAt: "2025-10-19",
      type: "Archive",
    },
    {
      id: 3,
      name: "Financial_Report_Q4.xlsx",
      category: "Finance",
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
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">My Files</h1>
        <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2">
          <FileText className="w-4 h-4" />
          <span>Upload Files</span>
        </button>
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
              className="w-full bg-gray-800/50 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-all flex items-center space-x-2 text-gray-300">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
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
      </div>

      {/* Files Table */}
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
              {files.map((file) => (
                <tr
                  key={file.id}
                  className="hover:bg-gray-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-cyan-500" />
                      <span className="text-white font-medium">
                        {file.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{file.category}</td>
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
                  <td className="px-6 py-4 text-gray-400">{file.uploadedAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-cyan-500 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-cyan-500 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-cyan-500 transition-colors">
                        <Edit className="w-4 h-4" />
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
    </div>
  );
};
export default MyFilesPage;
