import { useState, useEffect } from "react";
import {
  Download,
  Eye,
  FileText,
  File,
  FileArchive,
  FileSpreadsheet,
  SquareTerminal,
  Image,
  Lock,
  Clock,
  Shield,
  AlertTriangle,
  Loader,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { get, post } from "../../../utils/api";

const ShareFileLink = () => {
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [ownerData, setOwnerData] = useState(null);
  const [permission, setPermission] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [error, setError] = useState(null);
  const [accessGranted, setAccessGranted] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);

  const getFileIcon = (type) => {
    switch (type) {
      case "images":
        return <Image className="w-12 h-12 text-red-400" />;
      case "Archive":
        return <FileArchive className="w-12 h-12 text-yellow-400" />;
      case "spreadsheet":
        return <FileSpreadsheet className="w-12 h-12 text-green-400" />;
      case "documents":
        return <File className="w-12 h-12 text-blue-400" />;
      case "code":
        return <SquareTerminal className="w-12 h-12 text-purple-500" />;
      default:
        return <FileText className="w-12 h-12 text-gray-400" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  useEffect(() => {
    if (token) {
      fetchSharedFile();
    }
  }, [token]);

  const fetchSharedFile = async (pwd = "") => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await get(
        `/api/files/get-share/${token}?password=${[pwd]}`
      );

      if (response.file && response.owner) {
        console.log(response);
        setFileData(response.file);
        setOwnerData(response.owner);
        setPermission(response.permission);
        setAccessGranted(true);
        setShowPasswordInput(false);
        await loadFilePreview(response.file);
      }
    } catch (err) {
      console.log(err, ":ERR");

      if (
        err.response?.status === 401 ||
        err.response?.data?.message?.includes("password")
      ) {
        setIsPasswordProtected(true);
        setShowPasswordInput(true);
        setError("This file is password protected. Please enter the password.");
      } else if (err.response?.status === 403) {
        setError("Access denied. The link may have expired or been revoked.");
      } else if (err.response?.status === 404) {
        setError("File not found. The link may be invalid or deleted.");
      } else {
        setError("Failed to access file. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccessFile = async () => {
    if (isPasswordProtected && !password) {
      setError("Please enter the password");
      return;
    }

    await fetchSharedFile(password);
  };

  const loadFilePreview = async (file) => {
    setIsLoadingFile(true);

    try {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      const fileUrl = `http://localhost:5550${file.path}`;
      console.log(fileUrl, "FILEURL");

      if (
        ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(
          fileExtension
        )
      ) {
        setFileContent({
          type: "image",
          url: fileUrl,
        });
      } else if (["pdf"].includes(fileExtension)) {
        setFileContent({ type: "pdf", url: fileUrl });
      } else if (
        ["txt", "js", "jsx", "html", "css", "json", "md"].includes(
          fileExtension
        )
      ) {
        try {
          const response = await fetch(fileUrl);
          const text = await response.text();
          setFileContent({
            type: "text",
            content: text,
            extension: fileExtension,
          });
        } catch {
          setFileContent({
            type: "text",
            content: "Unable to load file content",
            extension: fileExtension,
          });
        }
      } else if (["mp4", "webm", "ogg"].includes(fileExtension)) {
        setFileContent({ type: "video", url: fileUrl });
      } else if (["mp3", "wav", "ogg"].includes(fileExtension)) {
        setFileContent({ type: "audio", url: fileUrl });
      } else {
        setFileContent({ type: "unsupported" });
      }
    } catch (error) {
      console.error("Error loading file:", error);
      setFileContent({ type: "error" });
    } finally {
      setIsLoadingFile(false);
    }
  };

  const handleDownload = async () => {
    if (permission === "VIEW_ONLY") {
      alert("You don't have download permission for this file");
      return;
    }

    try {
      const fileUrl = `${window.location.origin}${fileData.path}`;
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileData.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Failed to download file. Please try again.");
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));

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
            <div className="overflow-auto max-h-[500px] w-full flex justify-center">
              <img
                src={fileContent.url}
                alt="Shared file"
                style={{ width: `${zoom}%` }}
                className="rounded-lg"
              />
            </div>
          </div>
        );

      case "pdf":
        return (
          <div className="h-[500px] w-full">
            <iframe
              src={fileContent.url}
              className="w-full h-full rounded-lg"
              title="PDF Preview"
            />
          </div>
        );

      case "text":
        return (
          <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-[500px]">
            <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap">
              {fileContent.content}
            </pre>
          </div>
        );

      case "video":
        return (
          <div className="flex justify-center p-4">
            <video
              src={fileContent.url}
              controls
              className="max-w-full max-h-[500px] rounded-lg"
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
            <h3 className="text-white text-lg font-medium">Audio File</h3>
            <audio src={fileContent.url} controls className="w-full max-w-md">
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
            <p className="text-gray-400">Failed to load the file preview.</p>
          </div>
        );

      default:
        return null;
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto" />
          <h1 className="text-2xl font-bold text-white">Invalid Link</h1>
          <p className="text-gray-400">The share link is invalid or missing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {!accessGranted && showPasswordInput ? (
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl">
                    <Lock className="w-12 h-12 text-cyan-400" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Password Required
                </h1>
                <p className="text-gray-400">
                  This file is protected. Enter the password to continue.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800 p-8 shadow-2xl">
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
                      <Lock className="w-4 h-4" />
                      <span>Password</span>
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none transition-all placeholder-gray-500"
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAccessFile()
                      }
                      autoFocus
                    />
                  </div>

                  {error && (
                    <div className="flex items-center space-x-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleAccessFile}
                    disabled={isLoading || !password}
                    className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-5 h-5" />
                        <span>Access File</span>
                      </>
                    )}
                  </button>

                  <div className="pt-4 border-t border-gray-700">
                    <div className="flex items-start space-x-3 text-sm text-gray-400">
                      <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <p>
                        Your access is secure and temporary. The password was
                        provided by the person who shared this file with you.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : !accessGranted && isLoading ? (
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto"></div>
              <p className="text-gray-400 text-lg">Loading shared file...</p>
            </div>
          </div>
        ) : !accessGranted && error ? (
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="text-center space-y-4 max-w-md">
              <div className="p-4 bg-red-500/20 rounded-full w-fit mx-auto">
                <AlertTriangle className="w-16 h-16 text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Access Denied</h1>
              <p className="text-gray-400">{error}</p>
            </div>
          </div>
        ) : accessGranted && fileData ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Shared File
                </h1>
                <p className="text-gray-400">
                  View and download shared content
                </p>
              </div>
              <button
                onClick={() => {
                  setAccessGranted(false);
                  setFileData(null);
                  setOwnerData(null);
                  setPermission(null);
                  setFileContent(null);
                  setPassword("");
                  setError(null);
                  setShowPasswordInput(false);
                }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-all"
              >
                Exit
              </button>
            </div>

            <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gray-800/50 rounded-xl">
                    {getFileIcon(fileData.category)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {fileData.name}
                    </h2>
                    <p className="text-gray-400 mb-3">
                      Shared by {ownerData?.name || "Unknown"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full border border-cyan-500/30">
                        {fileData.category}
                      </span>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
                        {fileData.type}
                      </span>
                    </div>
                  </div>
                </div>
                {permission !== "VIEW_ONLY" && (
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-all flex items-center space-x-2 shadow-lg shadow-cyan-500/20"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-700">
                <div>
                  <div className="flex items-center space-x-2 text-gray-400 mb-1">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">Size</span>
                  </div>
                  <p className="text-white font-medium">
                    {formatFileSize(fileData.size)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center space-x-2 text-gray-400 mb-1">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Permission</span>
                  </div>
                  <p className="text-white font-medium">
                    {permission?.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <div className="flex items-center space-x-2 text-gray-400 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Created</span>
                  </div>
                  <p className="text-white font-medium">
                    {formatDate(fileData.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Preview</h3>
              {renderFileContent()}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ShareFileLink;
