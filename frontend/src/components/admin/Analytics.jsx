import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { useOutletContext } from "react-router-dom";

const Analytics = () => {
  const { isVisible } = useOutletContext();
  const [stats, setStats] = useState({
    fileGrowthData: [],
    fileTypeData: [],
    blockchainActivityData: [],
    aiUsageData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5550/api/admin/stats");
      setStats(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setLoading(false);
    }
  };

  const { fileGrowthData, fileTypeData, blockchainActivityData, aiUsageData } = stats;

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const AI_COLORS = ["#8884d8", "#82ca9d"];

  const FloatingElement = ({ children, delay = 0, className = "" }) => (
    <div
      className={`transform transition-all duration-1000 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-6">
        <FloatingElement delay={100}>
          <h1 className="text-2xl font-bold text-white mb-2">System Analytics</h1>
          <p className="text-gray-400">Real-time insights into system performance and usage</p>
        </FloatingElement>

        {/* Top Row: File Growth & Blockchain Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FloatingElement delay={200}>
            <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">File Storage Growth</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={fileGrowthData}>
                    <defs>
                      <linearGradient id="colorFiles" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="files" stroke="#06b6d4" fillOpacity={1} fill="url(#colorFiles)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </FloatingElement>

          <FloatingElement delay={300}>
            <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Blockchain Transactions (Weekly)</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={blockchainActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                      cursor={{fill: '#374151', opacity: 0.2}}
                    />
                    <Bar dataKey="txs" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </FloatingElement>
        </div>

        {/* Bottom Row: File Types & AI Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FloatingElement delay={400}>
            <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">File Distribution by Type</h3>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fileTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {fileTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </FloatingElement>

          <FloatingElement delay={500}>
            <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">AI Feature Usage</h3>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={aiUsageData}
                      cx="50%"
                      cy="50%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {aiUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={AI_COLORS[index % AI_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </FloatingElement>
        </div>
      </div>
    </main>
  );
};

export default Analytics;
