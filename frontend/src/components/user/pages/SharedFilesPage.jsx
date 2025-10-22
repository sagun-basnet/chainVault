import { Share2, Eye, Lock } from "lucide-react";
const SharedFilesPage = () => {
  const sharedFiles = [
    {
      id: 1,
      name: "Q4_Financial_Report.pdf",
      sharedBy: "John Doe",
      sharedWith: "Team Finance",
      permission: "View Only",
      expiresAt: "2025-11-30",
      sharedAt: "2025-10-15",
    },
    {
      id: 2,
      name: "Marketing_Strategy_2025.pptx",
      sharedBy: "Jane Smith",
      sharedWith: "Marketing Team",
      permission: "Edit",
      expiresAt: "2025-12-31",
      sharedAt: "2025-10-10",
    },
    {
      id: 3,
      name: "Product_Roadmap.xlsx",
      sharedBy: "You",
      sharedWith: "Product Team",
      permission: "View Only",
      expiresAt: "Never",
      sharedAt: "2025-10-05",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Shared Files</h1>
        <p className="text-gray-400">Files shared with you and by you</p>
      </div>

      <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                  File Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                  Shared By
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                  Shared With
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                  Permission
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
              {sharedFiles.map((file) => (
                <tr
                  key={file.id}
                  className="hover:bg-gray-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <Share2 className="w-5 h-5 text-cyan-500" />
                      <span className="text-white font-medium">
                        {file.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{file.sharedBy}</td>
                  <td className="px-6 py-4 text-gray-400">{file.sharedWith}</td>
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
                  <td className="px-6 py-4 text-gray-400">{file.expiresAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-cyan-500 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-cyan-500 transition-colors">
                        <Lock className="w-4 h-4" />
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

export default SharedFilesPage;
