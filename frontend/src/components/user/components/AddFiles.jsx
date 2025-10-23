import {
  Upload,
  X,
  FileText,
  File,
  FileArchive,
  FileSpreadsheet,
  Image,
  Tag,
  Check,
  List,
  Grid,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useState, useRef, useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import { post } from "../../../utils/api";
import axios from "axios";

const AddFiles = () => {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);

  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentTagInput, setCurrentTagInput] = useState({});
  const [viewMode, setViewMode] = useState("list");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const getFileIcon = (type) => {
    const extension = type.toLowerCase();
    if (["pdf"].includes(extension))
      return <FileText className="w-8 h-8 text-red-400" />;
    if (["zip", "rar"].includes(extension))
      return <FileArchive className="w-8 h-8 text-yellow-400" />;
    if (["xlsx", "xls", "csv"].includes(extension))
      return <FileSpreadsheet className="w-8 h-8 text-green-400" />;
    if (["jpg", "png", "gif", "jpeg", "svg"].includes(extension))
      return <Image className="w-8 h-8 text-purple-400" />;
    return <File className="w-8 h-8 text-blue-400" />;
  };

  const handleFiles = (newFiles) => {
    const fileArray = Array.from(newFiles).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      type: file.name.split(".").pop(),
      userTags: [],
      uploaded: false,
      error: null,
    }));
    setFiles((prev) => [...prev, ...fileArray]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = e.target.files;
    handleFiles(selectedFiles);
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const addUserTag = (fileId) => {
    const tagValue = currentTagInput[fileId]?.trim();
    if (!tagValue) return;

    setFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? {
              ...file,
              userTags: [...file.userTags, tagValue],
            }
          : file
      )
    );
    setCurrentTagInput((prev) => ({ ...prev, [fileId]: "" }));
  };

  const removeTag = (fileId, tag) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? {
              ...file,
              userTags: file.userTags.filter((t) => t !== tag),
            }
          : file
      )
    );
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    if (isUploading) return;
    if (!currentUser?.id) {
      setUploadError("User not authenticated");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();

      // ✅ Append files first (important!)
      files.forEach((fileObj) => {
        formData.append("files", fileObj.file);
      });

      // ✅ Add userId and tags after
      formData.append("userId", currentUser.id);

      const allTags = files.map((file) => file.userTags || []);
      formData.append("tags", JSON.stringify(allTags));

      // ✅ Log FormData contents for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // ✅ Don’t set Content-Type manually!
      const res = await axios.post(
        "http://localhost:5550/api/files/upload-multiple",
        formData
      );

      console.log("Upload response:", res);

      // Mark uploaded
      setFiles((prev) =>
        prev.map((file) => ({
          ...file,
          uploaded: true,
          error: null,
        }))
      );

      setTimeout(() => {
        setFiles([]);
      }, 3000);
    } catch (err) {
      console.error("Upload error:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Upload failed";
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Upload Files</h1>
            <p className="text-gray-400 mt-1">
              Drag and drop or select files to upload
            </p>
          </div>
        </div>

        {/* Global Error Alert */}
        {uploadError && (
          <div className="flex items-center space-x-3 text-red-400 bg-red-500/10 px-4 py-3 rounded-lg border border-red-500/30">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-medium">Upload Failed</p>
              <p className="text-sm text-red-300">{uploadError}</p>
            </div>
            <button
              onClick={() => setUploadError(null)}
              className="ml-auto p-1 hover:bg-red-500/20 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Drag and Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-12 transition-all cursor-pointer ${
            isDragging
              ? "border-cyan-500 bg-cyan-500/10"
              : "border-gray-700 bg-gradient-to-br from-gray-900/40 to-gray-800/40 hover:border-gray-600"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            name="files"
            onChange={handleFileSelect}
            className="hidden"
            accept=".jpeg,.jpg,.png,.gif,.svg,.c,.cpp,.cs,.pdf,.docx,.txt,.js,.py,.java,.jsx,.csv,.xlsx"
          />
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div
              className={`p-4 rounded-full ${
                isDragging ? "bg-cyan-500/20" : "bg-gray-800"
              } transition-all`}
            >
              <Upload
                className={`w-12 h-12 ${
                  isDragging ? "text-cyan-500" : "text-gray-400"
                } transition-all`}
              />
            </div>
            <div>
              <p className="text-xl font-semibold text-white mb-2">
                {isDragging ? "Drop files here" : "Drop files to upload"}
              </p>
              <p className="text-gray-400">
                or click to browse from your computer
              </p>
            </div>
            <div className="flex flex-col justify-center items-center text-sm text-gray-500">
              <span>
                Supports: Images, PDF, DOCX, TXT, Code files, CSV, XLSX
              </span>
              <span className="font-bold text-white mt-1">
                Upload maximum 10 files at a time (20MB per file)
              </span>
            </div>
          </div>
        </div>

        {/* Files List */}
        {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Files to Upload ({files.length})
              </h2>
              <div className="flex items-center space-x-3">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-800/50 rounded-lg p-1 border border-gray-700">
                  <button
                    onClick={() => setViewMode("list")}
                    disabled={isUploading}
                    className={`px-3 py-1.5 rounded transition-all flex items-center space-x-2 ${
                      viewMode === "list"
                        ? "bg-cyan-500 text-white"
                        : "text-gray-400 hover:text-white"
                    } disabled:opacity-50`}
                  >
                    <List className="w-4 h-4" />
                    <span className="text-sm font-medium">List</span>
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    disabled={isUploading}
                    className={`px-3 py-1.5 rounded transition-all flex items-center space-x-2 ${
                      viewMode === "grid"
                        ? "bg-cyan-500 text-white"
                        : "text-gray-400 hover:text-white"
                    } disabled:opacity-50`}
                  >
                    <Grid className="w-4 h-4" />
                    <span className="text-sm font-medium">Grid</span>
                  </button>
                </div>
                <button
                  onClick={handleUpload}
                  disabled={isUploading || files.length === 0}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 text-white shadow-lg shadow-cyan-500/20"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload All ({files.length})</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-4"
              }
            >
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`relative bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border ${
                    file.uploaded
                      ? "border-green-500/50"
                      : file.error
                      ? "border-red-500/50"
                      : "border-gray-800"
                  } p-6 space-y-4 ${
                    viewMode === "grid" ? "flex flex-col h-full" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex space-x-4 flex-1 ${
                        viewMode === "grid"
                          ? "flex-col items-center text-center space-x-0 space-y-3"
                          : "items-center"
                      }`}
                    >
                      <div className="p-3 bg-gray-800/50 rounded-xl">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-white font-medium ${
                            viewMode === "grid" ? "truncate max-w-full" : ""
                          }`}
                          title={file.name}
                        >
                          {file.name}
                        </h3>
                        <div
                          className={`flex items-center space-x-4 mt-1 ${
                            viewMode === "grid"
                              ? "justify-center flex-wrap"
                              : ""
                          }`}
                        >
                          <span className="text-sm text-gray-400">
                            {file.size}
                          </span>
                          <span className="text-xs text-gray-500 uppercase">
                            {file.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    {!file.uploaded && !isUploading && (
                      <button
                        onClick={() => removeFile(file.id)}
                        className={`p-2 text-gray-400 hover:text-red-500 hover:bg-gray-800/50 rounded-lg transition-all ${
                          viewMode === "grid" ? "absolute top-4 right-4" : ""
                        }`}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* User Tags */}
                  {!file.uploaded && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Tag className="w-4 h-4 text-cyan-400" />
                        <span className="text-gray-400">
                          Add Tags (Optional)
                        </span>
                      </div>
                      {file.userTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {file.userTags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm rounded-full border border-cyan-500/30 flex items-center space-x-2"
                            >
                              <span>{tag}</span>
                              <button
                                onClick={() => removeTag(file.id, tag)}
                                disabled={isUploading}
                                className="hover:text-cyan-300 disabled:opacity-50"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="Add custom tag..."
                          value={currentTagInput[file.id] || ""}
                          onChange={(e) =>
                            setCurrentTagInput((prev) => ({
                              ...prev,
                              [file.id]: e.target.value,
                            }))
                          }
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              addUserTag(file.id);
                            }
                          }}
                          disabled={isUploading}
                          className="flex-1 bg-gray-800/50 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <button
                          onClick={() => addUserTag(file.id)}
                          disabled={isUploading}
                          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Upload Status */}
                  {file.uploaded && (
                    <div className="flex items-center space-x-2 text-green-400 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/30">
                      <Check className="w-5 h-5" />
                      <span className="font-medium">
                        Uploaded & Processed Successfully!
                      </span>
                    </div>
                  )}

                  {/* Error Status */}
                  {file.error && !isUploading && (
                    <div className="flex items-start space-x-2 text-red-400 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/30">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span className="font-medium text-sm">{file.error}</span>
                    </div>
                  )}

                  {/* Uploading Status */}
                  {isUploading && !file.uploaded && !file.error && (
                    <div className="flex items-center space-x-2 text-cyan-400 bg-cyan-500/10 px-4 py-2 rounded-lg border border-cyan-500/30">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="font-medium">Processing...</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {files.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-4">
              <FileText className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-500">No files selected yet</p>
            <p className="text-gray-600 text-sm mt-2">
              Files will be automatically categorized using AI
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddFiles;
