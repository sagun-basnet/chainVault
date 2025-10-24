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
  Image,
  X,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { del, get, post } from "../../../utils/api";
import { AuthContext } from "../../../context/authContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyFilesPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [fileToView, setFileToView] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [zoom, setZoom] = useState(100);

  const fetchData = async () => {
    await get(`/api/files/user-id/${parseInt(currentUser?.id)}`)
      .then((res) => {
        const formatted = res.map((file) => ({
          id: file.id,
          name: file.name,
          path: file.path,
          size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
          sizeInBytes: file.size,
          type: file.type,
          category: file.category,
          createdAt: new Date(file.createdAt).toLocaleDateString(),
          createdAtTimestamp: new Date(file.createdAt).getTime(),
          user: file.user
            ? {
                id: file.user.id,
                name: file.user.name,
                email: file.user.email,
              }
            : null,
          tags: file.tags?.map((t) => t.tag?.name) || [],
        }));
        setFiles(formatted);
      })
      .catch((err) => {
        console.error("Error fetching files data:", err);
      });
  };

  useEffect(() => {
    fetchData();
  }, [currentUser?.id]);

  const getFileIcon = (type) => {
    switch (type) {
      case "images":
        return <Image className="w-8 h-8 text-red-400" />;
      case "Archive":
        return <FileArchive className="w-8 h-8 text-yellow-400" />;
      case "spreadsheet":
        return <FileSpreadsheet className="w-8 h-8 text-green-400" />;
      case "documents":
        return <File className="w-8 h-8 text-blue-400" />;
      case "code":
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

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "date":
        return b.createdAtTimestamp - a.createdAtTimestamp;
      case "size":
        return b.sizeInBytes - a.sizeInBytes;
      default:
        return 0;
    }
  });

  const openDeleteModal = (file) => {
    setFileToDelete(file);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setFileToDelete(null);
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;

    await del(`/api/files/${parseInt(fileToDelete.id)}`)
      .then((res) => {
        console.log(res);
        fetchData();
        closeDeleteModal();
        toast.success("File deleted successfully.");
      })
      .catch((err) => {
        console.error("Error deleting file:", err);
        closeDeleteModal();
      });
  };

  const handleDownload = async (file) => {
    try {
      const response = await axios.get(
        `http://localhost:5550/api/files/download/${file.id}/${currentUser?.id}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  // View file functionality
  const handleView = async (file) => {
    setFileToView(file);
    setShowViewModal(true);
    setIsLoadingFile(true);
    setZoom(100);

    try {
      const response = await axios.get(
        `http://localhost:5550/api/files/download/${file.id}/${currentUser?.id}`,
        { responseType: "blob" }
      );

      const blob = response.data;
      const fileExtension = file.name.split(".").pop().toLowerCase();

      // Handle different file types
      if (
        ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(
          fileExtension
        )
      ) {
        // Image files
        const url = window.URL.createObjectURL(blob);
        setFileContent({ type: "image", url });
      } else if (["pdf"].includes(fileExtension)) {
        // PDF files
        const url = window.URL.createObjectURL(blob);
        setFileContent({ type: "pdf", url });
      } else if (
        [
          "txt",
          "js",
          "jsx",
          "ts",
          "tsx",
          "html",
          "css",
          "json",
          "xml",
          "md",
          "py",
          "java",
          "c",
          "cpp",
          "cs",
        ].includes(fileExtension)
      ) {
        // Text/Code files
        const text = await blob.text();
        setFileContent({
          type: "text",
          content: text,
          extension: fileExtension,
        });
      } else if (["mp4", "webm", "ogg"].includes(fileExtension)) {
        // Video files
        const url = window.URL.createObjectURL(blob);
        setFileContent({ type: "video", url });
      } else if (["mp3", "wav", "ogg", "m4a"].includes(fileExtension)) {
        // Audio files
        const url = window.URL.createObjectURL(blob);
        setFileContent({ type: "audio", url });
      } else {
        // Unsupported file type
        setFileContent({ type: "unsupported" });
      }
    } catch (error) {
      console.error("Error loading file:", error);
      toast.error("Failed to load file preview.");
      setFileContent({ type: "error" });
    } finally {
      setIsLoadingFile(false);
    }
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setFileToView(null);
    setFileContent(null);
    setZoom(100);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  const renderFileContent = () => {
    if (isLoadingFile) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
      );
    }

    if (!fileContent) return null;

    switch (fileContent.type) {
      case "image":
        return (
          <div className="flex flex-col items-center justify-center space-y-4 p-4">
            <div className="flex items-center space-x-2 mb-2">
              <button
                onClick={handleZoomOut}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <ZoomOut className="w-4 h-4 text-white" />
              </button>
              <span className="text-white font-medium">{zoom}%</span>
              <button
                onClick={handleZoomIn}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <ZoomIn className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="overflow-auto max-h-[600px] w-full flex justify-center">
              <img
                src={fileContent.url}
                alt={fileToView?.name}
                style={{ width: `${zoom}%` }}
                className="rounded-lg"
              />
            </div>
          </div>
        );

      case "pdf":
        return (
          <div className="h-[600px] w-full">
            <iframe
              src={fileContent.url}
              className="w-full h-full rounded-lg"
              title={fileToView?.name}
            />
          </div>
        );

      case "text":
        return (
          <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-[600px]">
            <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap">
              {fileContent.content}
            </pre>
          </div>
        );

      case "video":
        return (
          <div className="flex justify-center p-4">
            <video
              controls
              className="max-w-full max-h-[600px] rounded-lg"
              src={fileContent.url}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );

      case "audio":
        return (
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="p-6 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full">
              <FileText className="w-16 h-16 text-cyan-400" />
            </div>
            <h3 className="text-white text-lg font-medium">
              {fileToView?.name}
            </h3>
            <audio controls className="w-full max-w-md">
              <source src={fileContent.url} />
              Your browser does not support the audio tag.
            </audio>
          </div>
        );

      case "unsupported":
        return (
          <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
            <div className="p-4 bg-yellow-500/20 rounded-full">
              <AlertTriangle className="w-12 h-12 text-yellow-400" />
            </div>
            <h3 className="text-white text-lg font-medium">
              Preview Not Available
            </h3>
            <p className="text-gray-400 max-w-md">
              This file type cannot be previewed. Please download the file to
              view its contents.
            </p>
            <button
              onClick={() => handleDownload(fileToView)}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-all flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </button>
          </div>
        );

      case "error":
        return (
          <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
            <div className="p-4 bg-red-500/20 rounded-full">
              <AlertTriangle className="w-12 h-12 text-red-400" />
            </div>
            <h3 className="text-white text-lg font-medium">
              Error Loading File
            </h3>
            <p className="text-gray-400">
              Failed to load the file preview. Please try again.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

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
          <span>{sortedFiles.length} files</span>
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
              {sortedFiles.map((file) => (
                <div
                  key={file.id}
                  className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800 p-4 hover:border-cyan-500/50 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-3 bg-gray-800/50 rounded-xl">
                      {getFileIcon(file.category)}
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
                    <span className="text-xs">{file.createdAt}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {file.tags.map(
                      (tag, index) =>
                        index <= 2 && (
                          <span
                            key={index}
                            className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full border border-cyan-500/30"
                          >
                            {tag}
                          </span>
                        )
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <span className="text-xs font-bold text-white">
                      {file.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleView(file)}
                        className="p-2 text-gray-400 hover:text-cyan-500 hover:bg-gray-800/50 rounded-lg transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(file)}
                        className="p-2 text-gray-400 hover:text-cyan-500 hover:bg-gray-800/50 rounded-lg transition-all"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(file)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-800/50 rounded-lg transition-all"
                      >
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
                  {sortedFiles.map((file) => (
                    <tr
                      key={file.id}
                      className="hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file.category)}
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
                          {file.tags.map(
                            (tag, index) =>
                              index <= 2 && (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full border border-cyan-500/30"
                                >
                                  {tag}
                                </span>
                              )
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {file.createdAt}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleView(file)}
                            className="p-2 text-gray-400 hover:text-cyan-500 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(file)}
                            className="p-2 text-gray-400 hover:text-cyan-500 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-cyan-500 transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(file)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
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
      </div>

      {/* View File Modal */}
      {showViewModal && fileToView && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 max-w-6xl w-full shadow-2xl max-h-[100vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between py-3 px-6 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  {getFileIcon(fileToView.category)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {fileToView.name}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {fileToView.category} • {fileToView.size}
                  </p>
                </div>
              </div>
              <button
                onClick={closeViewModal}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto">
              {renderFileContent()}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-2 border-t border-gray-700">
              <div className="flex items-center space-x-2">
                {fileToView.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full border border-cyan-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleDownload(fileToView)}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-all flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && fileToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 max-w-md w-full shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-white">Delete File</h2>
              </div>
              <button
                onClick={closeDeleteModal}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <p className="text-gray-300">
                Are you sure you want to delete this file? This action cannot be
                undone.
              </p>

              {/* File Details */}
              <div className="bg-gray-800/50 rounded-lg p-4 space-y-3 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-800 rounded-lg">
                    {getFileIcon(fileToDelete.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">
                      {fileToDelete.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {fileToDelete.category}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-700">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Size</p>
                    <p className="text-sm text-gray-300 font-medium">
                      {fileToDelete.size}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Uploaded</p>
                    <p className="text-sm text-gray-300 font-medium">
                      {fileToDelete.createdAt}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end p-6 border-t border-gray-700 space-x-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MyFilesPage;
