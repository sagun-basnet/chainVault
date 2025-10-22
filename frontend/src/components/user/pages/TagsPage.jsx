import { Tag, Eye } from "lucide-react";
const TagsPage = () => {
  const tags = [
    { name: "important", count: 145, color: "from-red-500 to-pink-500" },
    { name: "proposal", count: 89, color: "from-cyan-500 to-blue-500" },
    { name: "finance", count: 134, color: "from-green-500 to-emerald-500" },
    { name: "marketing", count: 78, color: "from-purple-500 to-pink-500" },
    { name: "quarterly", count: 56, color: "from-orange-500 to-red-500" },
    { name: "meeting", count: 92, color: "from-yellow-500 to-orange-500" },
    { name: "notes", count: 67, color: "from-blue-500 to-indigo-500" },
    { name: "assets", count: 45, color: "from-pink-500 to-rose-500" },
    { name: "development", count: 112, color: "from-teal-500 to-cyan-500" },
    { name: "research", count: 38, color: "from-indigo-500 to-purple-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tags</h1>
          <p className="text-gray-400">Manage and explore your file tags</p>
        </div>
        <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2">
          <Tag className="w-4 h-4" />
          <span>Create Tag</span>
        </button>
      </div>

      {/* Tag Cloud */}
      <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800 p-8">
        <div className="flex flex-wrap gap-4 justify-center">
          {tags.map((tag, index) => (
            <button
              key={index}
              className="group relative"
              style={{
                fontSize: `${Math.min(24, 12 + tag.count / 10)}px`,
              }}
            >
              <span
                className={`bg-gradient-to-r ${tag.color} bg-clip-text text-transparent font-semibold hover:scale-110 transition-transform inline-block`}
              >
                #{tag.name}
              </span>
              <span className="ml-2 text-gray-500 text-sm">({tag.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tag List */}
      <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">All Tags</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 bg-gradient-to-br ${tag.color} rounded-lg flex items-center justify-center`}
                    >
                      <Tag className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">#{tag.name}</h3>
                      <p className="text-gray-400 text-sm">{tag.count} files</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-cyan-500 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default TagsPage;
