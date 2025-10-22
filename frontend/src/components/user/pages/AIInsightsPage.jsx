import { Tag, TrendingUp, PieChart, BarChart3 } from "lucide-react";
const AIInsightsPage = () => {
  const insights = [
    {
      title: "Category Distribution",
      description: "Most files are categorized as Business Documents",
      icon: <PieChart className="w-8 h-8" />,
      color: "from-cyan-500 to-blue-500",
    },
    {
      title: "Most Used Tags",
      description: "#important, #proposal, #finance are trending",
      icon: <Tag className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Upload Trends",
      description: "23% increase in uploads this month",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Storage Optimization",
      description: "15% storage saved through AI compression",
      icon: <BarChart3 className="w-8 h-8" />,
      color: "from-orange-500 to-red-500",
    },
  ];

  const categoryData = [
    { category: "Business", count: 450, percentage: 36 },
    { category: "Media", count: 320, percentage: 26 },
    { category: "Finance", count: 280, percentage: 22 },
    { category: "Documents", count: 197, percentage: 16 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">AI Insights</h1>
        <p className="text-gray-400">AI-powered analytics about your files</p>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all"
          >
            <div
              className={`w-14 h-14 bg-gradient-to-br ${insight.color} rounded-lg flex items-center justify-center mb-4`}
            >
              {insight.icon}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {insight.title}
            </h3>
            <p className="text-gray-400 text-sm">{insight.description}</p>
          </div>
        ))}
      </div>

      {/* Category Analysis */}
      <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">
            Category Distribution
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {categoryData.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">
                    {item.category}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {item.count} files ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AIInsightsPage;
