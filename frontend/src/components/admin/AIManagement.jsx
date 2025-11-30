import React, { useState, useEffect } from "react";
import axios from "axios";
import { Brain, ToggleLeft, ToggleRight, Activity, Zap } from "lucide-react";
import { useOutletContext } from "react-router-dom";

const AIManagement = () => {
  const { isVisible } = useOutletContext();
  const [aiStatus, setAiStatus] = useState("checking");
  const [indexStats, setIndexStats] = useState({ indexed_files: 0 });
  const [retraining, setRetraining] = useState(false);

  useEffect(() => {
    checkAIStatus();
    fetchIndexStats();
  }, []);

  const checkAIStatus = async () => {
    try {
      const res = await axios.get("http://localhost:5550/api/admin/ai-status");
      setAiStatus(res.data.status === "online" ? "online" : "offline");
    } catch (error) {
      setAiStatus("offline");
    }
  };

  const fetchIndexStats = async () => {
    try {
      const res = await axios.get("http://localhost:5550/api/admin/ai-index-stats");
      setIndexStats(res.data);
    } catch (error) {
      console.error("Error fetching index stats:", error);
    }
  };

  const handleRetrain = async () => {
    setRetraining(true);
    try {
      await axios.post("http://localhost:5550/api/admin/ai-retrain");
      alert("Model retraining started successfully.");
    } catch (error) {
      alert("Error starting retraining.");
    } finally {
      setRetraining(false);
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
          <h1 className="text-2xl font-bold text-white mb-2">AI Management</h1>
          <p className="text-gray-400">Configure AI models and view usage statistics</p>
        </FloatingElement>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FloatingElement delay={200}>
            <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Classification Model</h3>
                    <p className="text-sm text-gray-400">TF-IDF & Cosine Similarity</p>
                  </div>
                </div>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${
                  aiStatus === 'online' 
                    ? 'text-green-400 bg-green-500/10 border-green-500/20' 
                    : 'text-red-400 bg-red-500/10 border-red-500/20'
                }`}>
                  <Activity className="w-4 h-4" />
                  <span className="text-xs font-medium capitalize">{aiStatus}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-800/30 rounded-xl">
                  <span className="text-gray-300">Auto-Classification</span>
                  <ToggleRight className="w-8 h-8 text-cyan-500 cursor-pointer" />
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-800/30 rounded-xl">
                  <span className="text-gray-300">Confidence Threshold</span>
                  <span className="text-cyan-500 font-mono">0.85</span>
                </div>
              </div>
            </div>
          </FloatingElement>

          <FloatingElement delay={300}>
            <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Semantic Search</h3>
                    <p className="text-sm text-gray-400">Vector Embeddings</p>
                  </div>
                </div>
                 <div className="flex items-center space-x-2 text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                  <Activity className="w-4 h-4" />
                  <span className="text-xs font-medium">Active</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-800/30 rounded-xl">
                  <span className="text-gray-300">Indexed Files</span>
                  <span className="text-green-400 text-sm">{indexStats.indexed_files} files</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-800/30 rounded-xl">
                  <span className="text-gray-300">Retrain Model</span>
                  <button 
                    onClick={handleRetrain}
                    disabled={retraining}
                    className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                      retraining 
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed" 
                        : "bg-cyan-500/20 text-cyan-500 hover:bg-cyan-500/30"
                    }`}
                  >
                    {retraining ? "Training..." : "Start"}
                  </button>
                </div>
              </div>
            </div>
          </FloatingElement>
        </div>
      </div>
    </main>
  );
};

export default AIManagement;
