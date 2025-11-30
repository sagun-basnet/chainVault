import React from "react";
import { Settings as SettingsIcon, Shield, Bell, Lock } from "lucide-react";
import { useOutletContext } from "react-router-dom";

const Settings = () => {
  const { isVisible } = useOutletContext();

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
          <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage application preferences and configurations</p>
        </FloatingElement>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FloatingElement delay={200}>
            <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-6 h-6 text-cyan-500" />
                <h3 className="text-lg font-semibold text-white">Security Settings</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-300">Two-Factor Authentication</span>
                  <button className="text-cyan-500 hover:text-cyan-400 text-sm">Configure</button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-300">Password Policy</span>
                  <button className="text-cyan-500 hover:text-cyan-400 text-sm">Edit</button>
                </div>
              </div>
            </div>
          </FloatingElement>

          <FloatingElement delay={300}>
             <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Bell className="w-6 h-6 text-yellow-500" />
                <h3 className="text-lg font-semibold text-white">Notifications</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-300">Email Alerts</span>
                  <div className="w-10 h-5 bg-cyan-500/20 rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-cyan-500 rounded-full absolute right-0"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-300">System Updates</span>
                   <div className="w-10 h-5 bg-cyan-500/20 rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-cyan-500 rounded-full absolute right-0"></div>
                  </div>
                </div>
              </div>
            </div>
          </FloatingElement>
        </div>
      </div>
    </main>
  );
};

export default Settings;
