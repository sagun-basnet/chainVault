import { Share2, Brain, FileText, BarChart3, CheckCircle2 } from "lucide-react";
const UserDashboardHomePage = () => {
  const stats = [
    {
      label: "Total Files",
      value: "1,247",
      change: "+12%",
      icon: <FileText className="w-6 h-6" />,
      color: "from-cyan-500 to-blue-500",
    },
    {
      label: "Shared Files",
      value: "156",
      change: "+8%",
      icon: <Share2 className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "AI Processed",
      value: "2,340",
      change: "+23%",
      icon: <Brain className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Storage Used",
      value: "847 GB",
      change: "+5%",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
    },
  ];

  const recentActivity = [
    {
      action: "Uploaded",
      file: "Project_Proposal.pdf",
      time: "2 hours ago",
      status: "success",
    },
    {
      action: "Shared",
      file: "Marketing_Assets.zip",
      time: "5 hours ago",
      status: "success",
    },
    {
      action: "AI Classified",
      file: "Financial_Report.xlsx",
      time: "1 day ago",
      status: "success",
    },
    {
      action: "Downloaded",
      file: "Meeting_Notes.docx",
      time: "2 days ago",
      status: "success",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome!{" "}
          <span className="font-extrabold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            Sagun Basnet
          </span>{" "}
        </h1>
        <p className="text-gray-400">
          Here's what's happening with your files today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}
              >
                {stat.icon}
              </div>
              <span className="text-green-400 text-sm font-medium">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white">
                    {activity.action}{" "}
                    <span className="text-cyan-500">{activity.file}</span>
                  </h3>
                  <p className="text-sm text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserDashboardHomePage;
