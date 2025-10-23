import {
  Upload,
  X,
  FileText,
  File,
  FileArchive,
  FileSpreadsheet,
  Image,
  Tag,
  Sparkles,
  Check,
} from "lucide-react";
import { useState, useRef } from "react";

const AddFiles = () => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentTagInput, setCurrentTagInput] = useState({});
  const fileInputRef = useRef(null);

  // Simulate AI tag generation
  const generateAITags = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    const baseTags = {
      pdf: ["document", "important"],
      docx: ["document", "notes"],
      xlsx: ["spreadsheet", "data"],
      zip: ["archive", "compressed"],
      rar: ["archive", "compressed"],
      jpg: ["image", "media"],
      png: ["image", "media"],
      mp4: ["video", "media"],
    };
    return baseTags[extension] || ["file"];
  };

  const getAICategory = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    const categories = {
      pdf: "Documents",
      docx: "Documents",
      xlsx: "Finance",
      zip: "Media",
      rar: "Media",
      jpg: "Media",
      png: "Media",
      mp4: "Media",
    };
    return categories[extension] || "General";
  };

  const getFileIcon = (type) => {
    const extension = type.toLowerCase();
    if (["pdf"].includes(extension))
      return <FileText className="w-8 h-8 text-red-400" />;
    if (["zip", "rar"].includes(extension))
      return <FileArchive className="w-8 h-8 text-yellow-400" />;
    if (["xlsx", "xls"].includes(extension))
      return <FileSpreadsheet className="w-8 h-8 text-green-400" />;
    if (["jpg", "png", "gif"].includes(extension))
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
      aiTags: generateAITags(file.name),
      userTags: [],
      category: getAICategory(file.name),
      uploaded: false,
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

  const removeTag = (fileId, tag, isUserTag) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? {
              ...file,
              [isUserTag ? "userTags" : "aiTags"]: file[
                isUserTag ? "userTags" : "aiTags"
              ].filter((t) => t !== tag),
            }
          : file
      )
    );
  };

  const handleUpload = () => {
    setFiles((prev) =>
      prev.map((file) => ({
        ...file,
        uploaded: true,
      }))
    );
    setTimeout(() => {
      alert("Files uploaded successfully!");
      setFiles([]);
    }, 1000);
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Upload Files</h1>
            <p className="text-gray-400 mt-1">
              Drag and drop or select files to upload
            </p>
          </div>
        </div>

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
            onChange={handleFileSelect}
            className="hidden"
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
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Supports: PDF, DOCX, XLSX, ZIP, Images, and more</span>
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
              <button
                onClick={handleUpload}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-6 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 text-white shadow-lg shadow-cyan-500/20"
              >
                <Upload className="w-4 h-4" />
                <span>Upload All</span>
              </button>
            </div>

            {files.map((file) => (
              <div
                key={file.id}
                className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800 p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="p-3 bg-gray-800/50 rounded-xl">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{file.name}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-400">
                          {file.size}
                        </span>
                        <span className="text-sm text-cyan-400 px-2 py-0.5 bg-cyan-500/20 rounded-full border border-cyan-500/30">
                          {file.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-800/50 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* AI Generated Tags */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-400">AI Generated Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {file.aiTags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full border border-purple-500/30 flex items-center space-x-2"
                      >
                        <span>{tag}</span>
                        <button
                          onClick={() => removeTag(file.id, tag, false)}
                          className="hover:text-purple-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* User Tags */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Tag className="w-4 h-4 text-cyan-400" />
                    <span className="text-gray-400">Your Tags (Optional)</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {file.userTags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm rounded-full border border-cyan-500/30 flex items-center space-x-2"
                      >
                        <span>{tag}</span>
                        <button
                          onClick={() => removeTag(file.id, tag, true)}
                          className="hover:text-cyan-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
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
                      className="flex-1 bg-gray-800/50 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none transition-all"
                    />
                    <button
                      onClick={() => addUserTag(file.id)}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Upload Status */}
                {file.uploaded && (
                  <div className="flex items-center space-x-2 text-green-400 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/30">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Uploaded successfully!</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {files.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-4">
              <FileText className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-500">No files selected yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddFiles;
