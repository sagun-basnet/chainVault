import {
  Home,
  Folder,
  Share2,
  Brain,
  Tag,
  User,
  Shield,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
const TopBar = ({
  activePage,
  setActivePage,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const navItems = [
    {
      id: "home",
      icon: <Home className="w-5 h-5" />,
      label: "Home",
      link: "/user-dashboard",
    },
    {
      id: "myfiles",
      icon: <Folder className="w-5 h-5" />,
      label: "Files",
      link: "/user-dashboard/files",
    },
    {
      id: "shared",
      icon: <Share2 className="w-5 h-5" />,
      label: "Shared",
      link: "/user-dashboard/shared",
    },
    {
      id: "aiinsights",
      icon: <Brain className="w-5 h-5" />,
      label: "Insights",
      link: "/user-dashboard/insights",
    },
    {
      id: "tags",
      icon: <Tag className="w-5 h-5" />,
      label: "Tags",
      link: "/user-dashboard/tags",
    },
    {
      id: "profile",
      icon: <User className="w-5 h-5" />,
      label: "Profile",
      link: "/user-dashboard/user-profile",
    },
  ];

  return (
    <nav className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50 left-0 md:w-[8rem] h-[5rem] md:h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex md:flex-col  items-center justify-between md:h-screen py-6">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="ml-1 text-md font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              ChainVault
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:flex-col md:items-start md:p-2 md:gap-4 items-center space-x-1">
            {navItems.map((item) => (
              <Link to={item.link} key={item.id}>
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                    activePage === item.id
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-500 border border-cyan-500/30"
                      : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
                  }`}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex md:flex-col md:gap-4  items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-300 transition-colors">
              <Bell className="w-5 h-5 cursor-pointer" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-300 transition-colors cursor-pointer">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer">
              <LogOut className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-gray-300"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-xl border-t border-gray-800">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  activePage === item.id
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-500 border border-cyan-500/30"
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopBar;
