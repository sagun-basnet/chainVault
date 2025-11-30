import React from "react";
import { Terminal, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useOutletContext } from "react-router-dom";

const SystemLogs = () => {
  const { isVisible } = useOutletContext();

  const logs = [
    { id: 1, type: "info", message: "Server started successfully on port 5550", timestamp: "2023-11-30 10:00:00" },
    { id: 2, type: "info", message: "Database connection established", timestamp: "2023-11-30 10:00:02" },
    { id: 3, type: "warning", message: "High memory usage detected (85%)", timestamp: "2023-11-30 14:30:00" },
    { id: 4, type: "error", message: "Failed to connect to AI service (Retrying...)", timestamp: "2023-11-30 14:35:00" },
    { id: 5, type: "info", message: "AI service connected", timestamp: "2023-11-30 14:35:05" },
  ];

  const getIcon = (type) => {
    switch (type) {
      case "error": return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

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
          <h1 className="text-2xl font-bold text-white mb-2">System Logs</h1>
          <p className="text-gray-400">Server events and system health monitoring</p>
        </FloatingElement>

        <FloatingElement delay={200}>
          <div className="bg-black/50 backdrop-blur-xl rounded-2xl border border-gray-800 p-6 font-mono text-sm">
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start space-x-3 border-b border-gray-800/50 pb-2 last:border-0">
                  <div className="mt-1">{getIcon(log.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-gray-500 text-xs">[{log.timestamp}]</span>
                      <span className={`uppercase text-xs font-bold ${
                        log.type === 'error' ? 'text-red-500' : 
                        log.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                      }`}>
                        {log.type}
                      </span>
                    </div>
                    <p className="text-gray-300">{log.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FloatingElement>
      </div>
    </main>
  );
};

export default SystemLogs;
