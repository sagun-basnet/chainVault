import React, { useState, useEffect } from "react";
import axios from "axios";
import { Database, CheckCircle2, Search, Filter } from "lucide-react";
import { useOutletContext } from "react-router-dom";

const BlockchainLog = () => {
  const { isVisible } = useOutletContext();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:5550/api/files/blockchain/logs");
      setLogs(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blockchain logs:", error);
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) =>
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.file?.name && log.file.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (log.txHash && log.txHash.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
        {/* Header */}
        <FloatingElement delay={200}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Blockchain Ledger</h1>
              <p className="text-gray-400">Immutable record of all file activities on the blockchain</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-800/50 border border-gray-700 text-gray-200 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-cyan-500/50 w-64"
                />
              </div>
              <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 text-gray-300">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </FloatingElement>

        {/* Logs Table */}
        <FloatingElement delay={400}>
          <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900/50">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Activity</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">File</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Transaction Hash</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-400">Loading blockchain logs...</td>
                    </tr>
                  ) : filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-400">No logs found matching your search.</td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                              <Database className="w-4 h-4 text-cyan-500" />
                            </div>
                            <span className="text-sm font-medium text-white">{log.action}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-300">{log.file?.name || "Unknown File"}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs text-cyan-500 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20">
                              {log.txHash}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-400">{new Date(log.timestamp).toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Confirmed
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </FloatingElement>
      </div>
    </main>
  );
};

export default BlockchainLog;