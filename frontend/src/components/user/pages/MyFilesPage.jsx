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
  Copy,
  Check,
  Lock,
  Clock,
  Shield,
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

  // Share modal states
  const [showShareModal, setShowShareModal] = useState(false);
  const [fileToShare, setFileToShare] = useState(null);
  const [sharePermission, setSharePermission] = useState("VIEW_ONLY");
  const [shareExpireIn, setShareExpireIn] = useState("1");
  const [sharePassword, setSharePassword] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

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
        // console.log(res);
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

  // Share modal functions
  const openShareModal = (file) => {
    setFileToShare(file);
    setShowShareModal(true);
    setSharePermission("VIEW_ONLY");
    setShareExpireIn("1");
    setSharePassword("");
    setShareLink("");
    setLinkGenerated(false);
    setLinkCopied(false);
  };

  const closeShareModal = () => {
    setShowShareModal(false);
    setFileToShare(null);
    setSharePermission("VIEW_ONLY");
    setShareExpireIn("1");
    setSharePassword("");
    setShareLink("");
    setLinkGenerated(false);
    setLinkCopied(false);
  };

  const generateShareLink = async () => {
    // Generate dummy link - you can replace this with your actual link generation logic
    await post(`/api/files/share/${fileToShare.id}`, {
      userId: currentUser?.id,
      password: sharePassword || null,
      permission: sharePermission,
      expiresInDays: shareExpireIn === "never" ? null : Number(shareExpireIn),
    })
      .then((res) => {
        console.log(res);

        setShareLink(res.url);
        setLinkGenerated(true);
        toast.success("Share link generated successfully!");
      })
      .catch((err) => {
        console.error("Error generating share link:", err);
        toast.error("Failed to generate share link. Please try again.");
      });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setLinkCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  const shareViaWhatsApp = () => {
    const message = `Check out this file: ${fileToShare.name}\n${shareLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const shareViaMessenger = () => {
    window.open(
      `https://www.facebook.com/dialog/send?link=${encodeURIComponent(
        shareLink
      )}&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(
        window.location.href
      )}`,
      "_blank"
    );
  };

  const shareViaInstagram = () => {
    // Instagram doesn't have a direct share URL, so we copy the link
    copyToClipboard();
    toast.info("Link copied! You can now paste it in Instagram.");
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
                      <button
                        onClick={() => openShareModal(file)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-800/50 rounded-lg transition-all"
                      >
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
                          <button
                            onClick={() => openShareModal(file)}
                            className="p-2 text-gray-400 hover:text-cyan-500 transition-colors"
                          >
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

      {/* Share File Modal */}
      {showShareModal && fileToShare && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 max-w-2xl w-full shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Share2 className="w-6 h-6 text-blue-500" />
                </div>
                <h2 className="text-xl font-bold text-white">Share File</h2>
              </div>
              <button
                onClick={closeShareModal}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* File Info */}
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-800 rounded-lg">
                    {getFileIcon(fileToShare.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">
                      {fileToShare.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {fileToShare.category} • {fileToShare.size}
                    </p>
                  </div>
                </div>
              </div>

              {/* Share Settings */}
              <div className="space-y-4">
                {/* Permission */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
                    <Shield className="w-4 h-4" />
                    <span>Permission</span>
                  </label>
                  <select
                    value={sharePermission}
                    onChange={(e) => setSharePermission(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none transition-all"
                  >
                    <option value="VIEW_ONLY">View Only</option>
                    <option value="DOWNLOAD">View & Download</option>
                  </select>
                </div>

                {/* Expire In */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
                    <Clock className="w-4 h-4" />
                    <span>Expires In</span>
                  </label>
                  <select
                    value={shareExpireIn}
                    onChange={(e) => setShareExpireIn(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none transition-all"
                  >
                    <option value="0.1">1 Hour</option>
                    <option value="0.6">6 Hours</option>
                    <option value="1">24 Hours</option>
                    <option value="7">7 Days</option>
                    <option value="30">30 Days</option>
                    <option value="never">Never</option>
                  </select>
                </div>

                {/* Password (Optional) */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
                    <Lock className="w-4 h-4" />
                    <span>Password (Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={sharePassword}
                    onChange={(e) => setSharePassword(e.target.value)}
                    placeholder="Leave empty for no password"
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none transition-all placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Generate Link Button */}
              {!linkGenerated && (
                <button
                  onClick={generateShareLink}
                  className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-cyan-500/20"
                >
                  Generate Share Link
                </button>
              )}

              {/* Share Link Display */}
              {linkGenerated && (
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Share Link
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={shareLink}
                        readOnly
                        className="flex-1 px-3 py-2 bg-gray-900 text-gray-300 rounded-lg border border-gray-700 text-sm"
                      />
                      <button
                        onClick={copyToClipboard}
                        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-all flex items-center space-x-2"
                      >
                        {linkCopied ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Share via Social Media */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-3 block">
                      Share via
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={shareViaWhatsApp}
                        className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        <span>WhatsApp</span>
                      </button>

                      <button
                        onClick={shareViaMessenger}
                        className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z" />
                        </svg>
                        <span>Messenger</span>
                      </button>

                      <button
                        onClick={shareViaInstagram}
                        className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-lg font-medium transition-all"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                        </svg>
                        <span>Instagram</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end p-6 border-t border-gray-700">
              <button
                onClick={closeShareModal}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
            <div className="flex-1 overflow-auto">{renderFileContent()}</div>

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
