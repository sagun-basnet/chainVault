import React, { useState, useEffect } from "react";
import * as Chart from "chart.js";
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  Users,
  CheckSquare,
  Bot,
  BarChart3,
  TrendingUp,
  FileText,
  ChevronDown,
  X,
  AlertCircle,
  Clock,
  UserCheck,
  Activity,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  // Mock data
  const stats = {
    totalEmployees: 124,
    activeTasks: 67,
    pendingTasks: 23,
    overloadedEmployees: 5,
  };

  const recentActivities = [
    {
      id: 1,
      action: "Task 'Mobile App Testing' assigned to John Smith",
      time: "2 min ago",
      type: "assignment",
    },
    {
      id: 2,
      action: "Sarah Johnson completed 'Database Optimization'",
      time: "15 min ago",
      type: "completion",
    },
    {
      id: 3,
      action: "AI suggested rebalancing for Team Alpha",
      time: "1 hour ago",
      type: "ai_suggestion",
    },
    {
      id: 4,
      action: "Mike Chen started 'UI Component Library'",
      time: "2 hours ago",
      type: "start",
    },
  ];

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: Users, label: "Employees" },
    { icon: CheckSquare, label: "Tasks" },
    { icon: Bot, label: "AI Task Assignment" },
    { icon: BarChart3, label: "Workload Balancer" },
    { icon: TrendingUp, label: "Performance Tracker" },
    { icon: FileText, label: "Reports & Analytics" },
    { icon: Settings, label: "Settings" },
  ];

  // Chart setup (mock data)
  useEffect(() => {
    // Register Chart.js components
    Chart.Chart.register(
      Chart.CategoryScale,
      Chart.LinearScale,
      Chart.PointElement,
      Chart.LineElement,
      Chart.ArcElement,
      Chart.DoughnutController,
      Chart.LineController,
      Chart.Title,
      Chart.Tooltip,
      Chart.Legend,
      Chart.Filler
    );

    let workloadChart = null;
    let performanceChart = null;

    // Workload Distribution Chart
    const ctx1 = document.getElementById("workloadChart");
    if (ctx1) {
      // Destroy existing chart if it exists
      const existingChart1 = Chart.Chart.getChart(ctx1);
      if (existingChart1) {
        existingChart1.destroy();
      }

      workloadChart = new Chart.Chart(ctx1, {
        type: "doughnut",
        data: {
          labels: ["Frontend", "Backend", "Testing", "DevOps", "Design"],
          datasets: [
            {
              data: [30, 25, 20, 15, 10],
              backgroundColor: [
                "#3B82F6",
                "#6366F1",
                "#8B5CF6",
                "#A855F7",
                "#C084FC",
              ],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                padding: 20,
                font: { size: 12 },
              },
            },
          },
          cutout: "70%",
        },
      });
    }

    // Performance Chart
    const ctx2 = document.getElementById("performanceChart");
    if (ctx2) {
      // Destroy existing chart if it exists
      const existingChart2 = Chart.Chart.getChart(ctx2);
      if (existingChart2) {
        existingChart2.destroy();
      }

      performanceChart = new Chart.Chart(ctx2, {
        type: "line",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Tasks Completed",
              data: [12, 19, 15, 25, 22, 18, 24],
              borderColor: "#3B82F6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: { beginAtZero: true, grid: { color: "#E5E7EB" } },
            x: { grid: { color: "#E5E7EB" } },
          },
        },
      });
    }

    // Cleanup function to destroy charts when component unmounts
    return () => {
      if (workloadChart) {
        workloadChart.destroy();
      }
      if (performanceChart) {
        performanceChart.destroy();
      }
    };
  }, []);

  const StatCard = ({ icon: Icon, title, value, change, changeType }) => (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
          {change && (
            <div
              className={`flex items-center mt-2 text-sm ${
                changeType === "positive" ? "text-green-600" : "text-red-600"
              }`}
            >
              {changeType === "positive" ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className="bg-blue-100 p-3 rounded-full">
          <Icon className="w-8 h-8 text-blue-600" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white/80 backdrop-blur-md shadow-2xl transition-all duration-300 z-40 border-r border-white/20 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  AI Scheduler
                </h1>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            )}
          </div>
        </div>

        <nav className="mt-8">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-center px-6 py-3 mx-3 rounded-xl cursor-pointer transition-all duration-200 ${
                item.active
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                  : "text-gray-600 hover:bg-white/50"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Top Bar */}
        <header className="bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-30 border-b border-white/20">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tasks, employees..."
                  className="pl-10 pr-4 py-2 w-80 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-800">
                      Alex Johnson
                    </p>
                    <p className="text-xs text-gray-500">Admin</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">
                        Alex Johnson
                      </p>
                      <p className="text-xs text-gray-500">alex@company.com</p>
                    </div>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back, Alex! 👋
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your team today.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Users}
              title="Total Employees"
              value={stats.totalEmployees}
              change="+12%"
              changeType="positive"
            />
            <StatCard
              icon={CheckSquare}
              title="Active Tasks"
              value={stats.activeTasks}
              change="+8%"
              changeType="positive"
            />
            <StatCard
              icon={Clock}
              title="Pending Tasks"
              value={stats.pendingTasks}
              change="-15%"
              changeType="positive"
            />
            <StatCard
              icon={AlertCircle}
              title="Overloaded Employees"
              value={stats.overloadedEmployees}
              change="+2"
              changeType="negative"
            />
          </div>

          {/* AI Suggestions */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 mb-8 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <Bot className="w-6 h-6" />
              <h2 className="text-xl font-semibold">AI Recommendations</h2>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <p className="mb-3">
                🎯 <strong>Task Rebalancing:</strong> 2 tasks can be reassigned
                to improve team balance
              </p>
              <p className="mb-3">
                ⚡ <strong>Efficiency Tip:</strong> Sarah Johnson has 20% more
                capacity for additional tasks
              </p>
              <p>
                📈 <strong>Performance Alert:</strong> Team productivity
                increased by 15% this week
              </p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Workload Distribution */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Workload Distribution
              </h3>
              <div className="h-64 relative">
                <canvas id="workloadChart"></canvas>
              </div>
            </div>

            {/* Performance Trends */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Task Completion Trends
              </h3>
              <div className="h-64 relative">
                <canvas id="performanceChart"></canvas>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4 p-3 bg-gray-50/50 rounded-xl"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "completion"
                        ? "bg-green-500"
                        : activity.type === "assignment"
                        ? "bg-blue-500"
                        : activity.type === "ai_suggestion"
                        ? "bg-purple-500"
                        : "bg-orange-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">
                      {activity.action}
                    </p>
                    <p className="text-gray-500 text-sm">{activity.time}</p>
                  </div>
                  <Activity className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
