import {
  Share2,
  Eye,
  FileText,
  Grid3x3,
  List,
  Trash2,
  Download,
  Link as LinkIcon,
  Copy,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { get, post } from "../../../utils/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SharedFilesPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("sharedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [sharedFiles, setSharedFiles] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [fileToView, setFileToView] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const fetchData = async () => {
    await get(`api/files/get-share-file-list/${currentUser.id}`)
      .then((res) => {
        console.log(res);
        setSharedFiles(res);
      })
      .catch((err) => {
        console.error("Error fetching shared files:", err);
      });
  };

  useEffect(() => {
    fetchData();
  }, [currentUser?.id]);

  const getFileIcon = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    const colors = {
      pdf: "text-red-500",
      pptx: "text-orange-500",
      xlsx: "text-green-500",
      docx: "text-blue-500",
      jpg: "text-purple-500",
      jpeg: "text-purple-500",
      png: "text-purple-500",
      jsx: "text-blue-400",
    };
    return colors[ext] || "text-cyan-500";
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPermissionLabel = (permission) => {
    return permission === "VIEW_ONLY" ? "View Only" : "Download";
  };

  const sortFiles = (files) => {
    return [...files].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.file.name.localeCompare(b.file.name);
          break;
        case "sharedAt":
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        case "size":
          comparison = a.file.size - b.file.size;
          break;
        case "views":
          comparison = (a.views || 0) - (b.views || 0);
          break;
        case "expiresAt":
          if (!a.expiresAt) return sortOrder === "asc" ? 1 : -1;
          if (!b.expiresAt) return sortOrder === "asc" ? -1 : 1;
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

  const handleDeleteShare = async (shareId) => {
    await post(`/api/files/delete-share/${shareId}`)
      .then((res) => {
        toast.success("Share link deleted successfully!");
        fetchData();
      })
      .catch((err) => {
        console.error("Error deleting share link:", err);
        toast.error("Failed to delete share link.");
      });
  };

  const handleCopyLink = (token, fileName) => {
    const shareLink = `${window.location.origin}/share/${token}`;
    navigator.clipboard.writeText(shareLink);
    toast.success(`Share link copied for ${fileName}!`);
  };

  const handleView = async (file) => {
    setFileToView(file);
    setShowViewModal(true);
    setIsLoadingFile(true);
    setZoom(100);
    setRotation(0);

    try {
      const response = await axios.get(
        `http://localhost:5550/api/files/download/${file.id}/${currentUser?.id}`,
        { responseType: "blob" }
      );

      const blob = response.data;
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (
        ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(
          fileExtension
        )
      ) {
        const url = window.URL.createObjectURL(blob);
        setFileContent({ type: "image", url });
      } else if (["pdf"].includes(fileExtension)) {
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
        const text = await blob.text();
        setFileContent({
          type: "text",
          content: text,
          extension: fileExtension,
        });
      } else if (["mp4", "webm", "ogg"].includes(fileExtension)) {
        const url = window.URL.createObjectURL(blob);
        setFileContent({ type: "video", url });
      } else if (["mp3", "wav", "ogg", "m4a"].includes(fileExtension)) {
        const url = window.URL.createObjectURL(blob);
        setFileContent({ type: "audio", url });
      } else {
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

  const handleCloseModal = () => {
    setShowViewModal(false);
    setFileToView(null);
    setFileContent(null);
    setZoom(100);
    setRotation(0);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const sortedFiles = sortFiles(sharedFiles);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex w-full justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Shared Files</h1>
            <p className="text-gray-400">Manage your shared file links</p>
          </div>

          <button
            onClick={() => navigate("/user-dashboard/shared-file")}
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
                  Date{" "}
                  {sortBy === "sharedAt" && (sortOrder === "asc" ? "↑" : "↓")}
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
                  onClick={() => handleSort("expiresAt")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    sortBy === "expiresAt"
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Expires{" "}
                  {sortBy === "expiresAt" && (sortOrder === "asc" ? "↑" : "↓")}
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
                  {sortedFiles.map((shareData) => (
                    <tr
                      key={shareData.id}
                      className="hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <Share2
                            className={`w-5 h-5 ${getFileIcon(
                              shareData.file.name
                            )}`}
                          />
                          <span className="text-white font-medium">
                            {shareData.file.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {formatFileSize(shareData.file.size)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            shareData.permission !== "VIEW_ONLY"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          }`}
                        >
                          {getPermissionLabel(shareData.permission)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {formatDate(shareData.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {formatDate(shareData.expiresAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              handleCopyLink(
                                shareData.token,
                                shareData.file.name
                              )
                            }
                            className="p-2 text-gray-400 hover:text-cyan-500 transition-colors"
                            title="Copy Link"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleView(shareData.file)}
                            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                            title="View File"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteShare(shareData.id)}
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
            {sortedFiles.map((shareData) => (
              <div
                key={shareData.id}
                className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800 p-6 hover:border-cyan-500/30 transition-all hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      <Share2
                        className={`w-6 h-6 ${getFileIcon(
                          shareData.file.name
                        )}`}
                      />
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      shareData.permission === "EDIT"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    }`}
                  >
                    {getPermissionLabel(shareData.permission)}
                  </span>
                </div>

                <h3
                  className="text-white font-semibold mb-2 truncate"
                  title={shareData.file.name}
                >
                  {shareData.file.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Size:</span>
                    <span className="text-gray-300">
                      {formatFileSize(shareData.file.size)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Shared:</span>
                    <span className="text-gray-300">
                      {formatDate(shareData.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Expires:</span>
                    <span className="text-gray-300">
                      {formatDate(shareData.expiresAt)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-700">
                    <div className="flex items-center space-x-2 text-xs text-gray-400 bg-gray-800/30 rounded px-2 py-1.5">
                      <LinkIcon className="w-3 h-3" />
                      <span className="truncate flex-1">
                        {`${window.location.origin}/share/${shareData.token}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-4 border-t border-gray-700">
                  <button
                    onClick={() =>
                      handleCopyLink(shareData.token, shareData.file.name)
                    }
                    className="flex-1 bg-gray-800/50 hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-400 px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </button>
                  <button
                    onClick={() => handleView(shareData.file)}
                    className="p-2 bg-gray-800/50 hover:bg-blue-500/20 text-gray-300 hover:text-blue-400 rounded-lg transition-all"
                    title="View File"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteShare(shareData.id)}
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

      {/* File View Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <FileText className={`w-6 h-6 ${getFileIcon(fileToView?.name || '')}`} />
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {fileToView?.name}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {formatFileSize(fileToView?.size || 0)}
                  </p>
                </div>
              </div>
              
              {/* Toolbar */}
              <div className="flex items-center space-x-2">
                {fileContent?.type === "image" && (
                  <>
                    <button
                      onClick={handleZoomOut}
                      className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-400 min-w-[60px] text-center">
                      {zoom}%
                    </span>
                    <button
                      onClick={handleZoomIn}
                      className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleRotate}
                      className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all"
                      title="Rotate"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={handleCloseModal}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-6 bg-gray-900/50">
              {isLoadingFile ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-400">Loading file...</p>
                  </div>
                </div>
              ) : fileContent?.type === "image" ? (
                <div className="flex items-center justify-center h-full">
                  <img
                    src={fileContent.url}
                    alt={fileToView?.name}
                    className="max-w-full max-h-full object-contain"
                    style={{
                      transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                      transition: "transform 0.3s ease",
                    }}
                  />
                </div>
              ) : fileContent?.type === "pdf" ? (
                <iframe
                  src={fileContent.url}
                  className="w-full h-full min-h-[600px] rounded-lg"
                  title={fileToView?.name}
                />
              ) : fileContent?.type === "text" ? (
                <div className="bg-gray-800/50 rounded-lg p-4 h-full overflow-auto">
                  <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap">
                    {fileContent.content}
                  </pre>
                </div>
              ) : fileContent?.type === "video" ? (
                <div className="flex items-center justify-center h-full">
                  <video
                    src={fileContent.url}
                    controls
                    className="max-w-full max-h-full rounded-lg"
                  >
                    Your browser does not support video playback.
                  </video>
                </div>
              ) : fileContent?.type === "audio" ? (
                <div className="flex items-center justify-center h-full">
                  <div className="bg-gray-800/50 rounded-lg p-8 space-y-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full mx-auto flex items-center justify-center">
                      <FileText className="w-12 h-12 text-white" />
                    </div>
                    <audio src={fileContent.url} controls className="w-full">
                      Your browser does not support audio playback.
                    </audio>
                  </div>
                </div>
              ) : fileContent?.type === "unsupported" ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <FileText className="w-16 h-16 text-gray-500 mx-auto" />
                    <p className="text-gray-400">
                      Preview not available for this file type
                    </p>
                    <p className="text-sm text-gray-500">
                      Download the file to view it
                    </p>
                  </div>
                </div>
              ) : fileContent?.type === "error" ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <X className="w-16 h-16 text-red-500 mx-auto" />
                    <p className="text-red-400">Failed to load file</p>
                    <p className="text-sm text-gray-500">
                      Please try again later
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedFilesPage;