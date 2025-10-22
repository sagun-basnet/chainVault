import {
  User,
  Edit,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Building,
} from "lucide-react";
import { useState } from "react";
const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  const userInfo = {
    name: "John Doe",
    email: "john.doe@chainvault.com",
    role: "Admin",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    company: "ChainVault Inc.",
    joinedDate: "January 2024",
    storage: "847 GB / 1 TB",
  };

  const stats = [
    { label: "Total Files", value: "1,247" },
    { label: "Shared", value: "156" },
    { label: "AI Processed", value: "2,340" },
    { label: "Tags Created", value: "45" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {userInfo.name}
              </h2>
              <p className="text-cyan-500 text-sm mb-4">{userInfo.role}</p>
              <div className="w-full space-y-3">
                <div className="flex items-center space-x-3 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{userInfo.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{userInfo.phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{userInfo.location}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Building className="w-4 h-4" />
                  <span className="text-sm">{userInfo.company}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Joined {userInfo.joinedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-4 border border-gray-800 text-center"
              >
                <h3 className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </h3>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Account Information */}
          <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">
                Account Information
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={userInfo.name}
                    disabled={!isEditing}
                    className="w-full bg-gray-800/50 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={userInfo.email}
                    disabled={!isEditing}
                    className="w-full bg-gray-800/50 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={userInfo.phone}
                    disabled={!isEditing}
                    className="w-full bg-gray-800/50 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={userInfo.location}
                    disabled={!isEditing}
                    className="w-full bg-gray-800/50 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Storage Usage */}
          <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">
                Storage Usage
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-medium">
                  {userInfo.storage}
                </span>
                <span className="text-cyan-500 text-sm">84.7% Used</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-4 rounded-full transition-all"
                  style={{ width: "84.7%" }}
                ></div>
              </div>
              <p className="text-gray-400 text-sm mt-3">
                You're using 847 GB of your 1 TB storage. Upgrade for more
                space.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
