import { Share2, Brain, FileText, BarChart3 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import { get } from "../../../utils/api";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const UserDashboardHomePage = () => {
  const { currentUser } = useContext(AuthContext);
  const [allFiles, setAllFiles] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);

  const fetchData = async () => {
    await get(`/api/files/user-id/${parseInt(currentUser?.id)}`)
      .then((res) => {
        console.log(res, 13);
        setAllFiles(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchData1 = async () => {
    await get(`api/files/get-share-file-list/${currentUser?.id}`)
      .then((res) => {
        console.log(res);
        setSharedFiles(res);
      })
      .catch((err) => {
        console.error("Error fetching shared files:", err);
      });
  };

  const totalFiles = allFiles.length;
  const totalSharedFiles = sharedFiles.length;
  const storageUsed = allFiles.reduce((total, file) => total + (file.size || 0), 0);

  useEffect(() => {
    fetchData();
    fetchData1();
  }, [currentUser?.id]);

  // Group files by type for pie chart
  const fileTypeData = allFiles.reduce((acc, file) => {
    const ext = file.name?.split('.').pop()?.toLowerCase() || 'other';
    const existing = acc.find(item => item.name === ext);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: ext, value: 1 });
    }
    return acc;
  }, []);

  // Storage by month (sample data - replace with actual dates from your files)
  const storageByMonth = [
    { month: 'Jan', storage: 2.5 },
    { month: 'Feb', storage: 3.2 },
    { month: 'Mar', storage: 4.1 },
    { month: 'Apr', storage: 5.3 },
    { month: 'May', storage: 6.8 },
    { month: 'Jun', storage: (storageUsed / (1024 * 1024 * 1024)) },
  ];

  const COLORS = ['#06b6d4', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome!{" "}
          <span className="font-extrabold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            {currentUser?.name}
          </span>{" "}
        </h1>
        <p className="text-gray-400">
          Here's what's happening with your files today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{totalFiles}</h3>
          <p className="text-gray-400 text-sm">Total Files</p>
        </div>

        <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Share2 className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{totalSharedFiles}</h3>
          <p className="text-gray-400 text-sm">Shared Files</p>
        </div>

        <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{totalFiles}</h3>
          <p className="text-gray-400 text-sm">AI Processed</p>
        </div>

        <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {((storageUsed) / (1024 * 1024 * 1024)).toFixed(2)} GB
          </h3>
          <p className="text-gray-400 text-sm">Storage Used</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Types Distribution */}
        <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">File Types Distribution</h2>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fileTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {fileTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                  labelStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Storage Growth */}
        <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">Storage Growth</h2>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={storageByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="month"
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'GB', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line
                  type="monotone"
                  dataKey="storage"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ fill: '#06b6d4', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* File Statistics Bar Chart */}
        <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800 lg:col-span-2">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">File Statistics</h2>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: 'Total Files', value: totalFiles, fill: '#06b6d4' },
                  { name: 'Shared Files', value: totalSharedFiles, fill: '#10b981' },
                  { name: 'AI Processed', value: totalFiles, fill: '#8b5cf6' },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="name"
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {[
                    { name: 'Total Files', value: totalFiles, fill: '#06b6d4' },
                    { name: 'Shared Files', value: totalSharedFiles, fill: '#10b981' },
                    { name: 'AI Processed', value: totalFiles, fill: '#8b5cf6' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardHomePage;