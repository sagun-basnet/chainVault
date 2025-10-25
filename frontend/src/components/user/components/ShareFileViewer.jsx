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
  CheckCircle,
  Loader,
  ZoomIn,
  ZoomOut,
  Share2,
} from "lucide-react";
import { useState } from "react";

const ShareFileViewer = () => {
  const [urlInput, setUrlInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [error, setError] = useState(null);
  const [accessGranted, setAccessGranted] = useState(false);
  const [shareInfo, setShareInfo] = useState(null);
  const [zoom, setZoom] = useState(100);

  // Parse URL parameters
  const parseShareUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/");
      const fileId = pathParts[pathParts.length - 1];
      const params = new URLSearchParams(urlObj.search);

      return {
        fileId,
        permission: params.get("permission") || "VIEW",
        expire: params.get("expire") || "24hr",
        protected: params.get("protected") === "true",
      };
    } catch (err) {
      return null;
    }
  };

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

  const showToast = (message, type = "success") => {
    // Simple toast replacement - you can integrate with your actual toast library
    console.log(`${type}: ${message}`);
    alert(message);
  };

  const handleAccessFile = async () => {
    if (!urlInput.trim()) {
      showToast("Please enter a share URL", "error");
      return;
    }

    const parsedUrl = parseShareUrl(urlInput);
    if (!parsedUrl) {
      setError("Invalid share URL format");
      return;
    }

    if (parsedUrl.protected && !password) {
      setShowPasswordInput(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Replace this with your actual API call using fetch or axios
      // const response = await fetch(`/api/files/share/access`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     fileId: parsedUrl.fileId,
      //     password: password || null,
      //   })
      // });
      // const data = await response.json();

      // Simulated API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulated file data - replace with actual API response
      const mockFileData = {
        id: parsedUrl.fileId,
        name: "Project_Presentation.pdf",
        size: "2.45 MB",
        type: "application/pdf",
        category: "documents",
        createdAt: new Date().toLocaleDateString(),
        owner: {
          name: "John Doe",
          email: "john@example.com",
        },
        tags: ["presentation", "project", "2024"],
      };

      setFileData(mockFileData);
      setShareInfo(parsedUrl);
      setAccessGranted(true);
      setShowPasswordInput(false);
      showToast("Access granted!");

      // Auto-load file preview
      await loadFilePreview(mockFileData);
    } catch (err) {
      setError("Failed to access file. Please check the URL and password.");
      showToast("Failed to access file", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const loadFilePreview = async (file) => {
    setIsLoadingFile(true);

    try {
      // Replace with your actual file download API
      // const response = await fetch(
      //   `http://localhost:5550/api/files/share/preview/${file.id}`
      // );
      // const blob = await response.blob();

      // Simulated file content based on type
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (
        ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(
          fileExtension
        )
      ) {
        // For demo: using placeholder image
        setFileContent({
          type: "image",
          url: "https://via.placeholder.com/800x600/1f2937/ffffff?text=Shared+Image+Preview",
        });
      } else if (["pdf"].includes(fileExtension)) {
        setFileContent({ type: "pdf", url: "#" });
      } else if (
        ["txt", "js", "jsx", "html", "css", "json", "md"].includes(
          fileExtension
        )
      ) {
        setFileContent({
          type: "text",
          content:
            "// Sample shared file content\nfunction example() {\n  console.log('This is a shared file');\n}\n\nexample();",
          extension: fileExtension,
        });
      } else if (["mp4", "webm", "ogg"].includes(fileExtension)) {
        setFileContent({ type: "video", url: "#" });
      } else if (["mp3", "wav", "ogg"].includes(fileExtension)) {
        setFileContent({ type: "audio", url: "#" });
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
    if (!shareInfo || shareInfo.permission === "VIEW") {
      showToast("You don't have download permission for this file", "error");
      return;
    }

    try {
      showToast("Download started...");
      // Replace with actual download logic
      // const response = await fetch(
      //   `http://localhost:5550/api/files/share/download/${fileData.id}`
      // );
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const link = document.createElement("a");
      // link.href = url;
      // link.download = fileData.name;
      // document.body.appendChild(link);
      // link.click();
      // link.remove();
      // window.URL.revokeObjectURL(url);
    } catch (error) {
      showToast("Failed to download file", "error");
    }
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
            <div className="flex items-center justify-center h-full bg-gray-900 rounded-lg">
              <div className="text-center space-y-4">
                <FileText className="w-16 h-16 text-cyan-400 mx-auto" />
                <p className="text-gray-300">PDF Preview</p>
                <p className="text-gray-500 text-sm">
                  PDF viewer would be embedded here
                </p>
              </div>
            </div>
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
            <div className="text-center space-y-4">
              <div className="p-8 bg-gray-900 rounded-lg">
                <Eye className="w-16 h-16 text-cyan-400 mx-auto" />
                <p className="text-gray-300 mt-4">Video Preview</p>
                <p className="text-gray-500 text-sm">
                  Video player would be embedded here
                </p>
              </div>
            </div>
          </div>
        );

      case "audio":
        return (
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="p-6 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full">
              <FileText className="w-16 h-16 text-cyan-400" />
            </div>
            <h3 className="text-white text-lg font-medium">Audio File</h3>
            <p className="text-gray-400 text-sm">
              Audio player would be embedded here
            </p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {!accessGranted ? (
          // Access Form
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl">
                    <Share2 className="w-12 h-12 text-cyan-400" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Access Shared File
                </h1>
                <p className="text-gray-400">
                  Enter the share URL to view the file
                </p>
              </div>

              {/* Access Card */}
              <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800 p-8 shadow-2xl">
                <div className="space-y-6">
                  {/* URL Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Share URL
                    </label>
                    <input
                      type="text"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://yourapp.com/share/abc123..."
                      className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none transition-all placeholder-gray-500"
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAccessFile()
                      }
                    />
                  </div>

                  {/* Password Input (conditional) */}
                  {showPasswordInput && (
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
                      />
                      <p className="text-sm text-gray-400 mt-2">
                        This file is password protected
                      </p>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center space-x-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Access Button */}
                  <button
                    onClick={handleAccessFile}
                    disabled={isLoading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Accessing...</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-5 h-5" />
                        <span>Access File</span>
                      </>
                    )}
                  </button>

                  {/* Info */}
                  <div className="pt-4 border-t border-gray-700">
                    <div className="flex items-start space-x-3 text-sm text-gray-400">
                      <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <p>
                        Your access is secure and temporary. Files are shared
                        with specific permissions and may expire after a set
                        time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // File Viewer
          <div className="space-y-6">
            {/* Header */}
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
                  setFileContent(null);
                  setUrlInput("");
                  setPassword("");
                  setError(null);
                }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-all"
              >
                New URL
              </button>
            </div>

            {/* File Info Card */}
            <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gray-800/50 rounded-xl">
                    {getFileIcon(fileData?.category)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {fileData?.name}
                    </h2>
                    <p className="text-gray-400 mb-3">
                      Shared by {fileData?.owner?.name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {fileData?.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full border border-cyan-500/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {shareInfo?.permission !== "VIEW" && (
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-all flex items-center space-x-2 shadow-lg shadow-cyan-500/20"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                )}
              </div>

              {/* File Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-700">
                <div>
                  <div className="flex items-center space-x-2 text-gray-400 mb-1">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">Size</span>
                  </div>
                  <p className="text-white font-medium">{fileData?.size}</p>
                </div>
                <div>
                  <div className="flex items-center space-x-2 text-gray-400 mb-1">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Permission</span>
                  </div>
                  <p className="text-white font-medium">
                    {shareInfo?.permission}
                  </p>
                </div>
                <div>
                  <div className="flex items-center space-x-2 text-gray-400 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Expires In</span>
                  </div>
                  <p className="text-white font-medium">{shareInfo?.expire}</p>
                </div>
              </div>
            </div>

            {/* File Preview */}
            <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Preview</h3>
              {renderFileContent()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareFileViewer;
