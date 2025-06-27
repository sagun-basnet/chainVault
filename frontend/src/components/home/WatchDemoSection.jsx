import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  Maximize,
  Clock,
  Users,
  Shield,
  Brain,
  Database,
  Search,
  Share2,
  CheckCircle,
  ArrowRight,
  Eye,
  Zap,
} from "lucide-react";

const WatchDemoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const totalDuration = 180; // 3 minutes demo

  useEffect(() => {
    setIsVisible(true);

    // Auto-cycle through features
    const featureInterval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % demoFeatures.length);
    }, 4000);

    // Simulate video progress when playing
    let progressInterval;
    if (isPlaying) {
      progressInterval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(featureInterval);
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isPlaying]);

  const demoFeatures = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Classification",
      description: "Watch files get automatically categorized by AI",
      timestamp: "0:15",
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Blockchain Logging",
      description: "See immutable records created in real-time",
      timestamp: "0:45",
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Smart Search",
      description: "Experience intelligent content discovery",
      timestamp: "1:20",
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Secure Sharing",
      description: "Learn about encrypted collaboration features",
      timestamp: "2:10",
    },
  ];

  const stats = [
    {
      label: "Demo Length",
      value: "3 min",
      icon: <Clock className="w-5 h-5" />,
    },
    { label: "Viewers", value: "12.5K", icon: <Users className="w-5 h-5" /> },
    { label: "Features", value: "8+", icon: <Zap className="w-5 h-5" /> },
  ];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
    <section className="relative z-10 px-6 py-20 bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <FloatingElement delay={200}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              See ChainVault in Action
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Watch how AI and blockchain revolutionize file management in just
              3 minutes
            </p>
          </div>
        </FloatingElement>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Video Player */}
          <FloatingElement delay={400} className="lg:col-span-2">
            <div className="relative bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-2xl rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
              {/* Video Area */}
              <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                {/* Simulated Video Content */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-blue-900/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-4 p-8 w-full max-w-md opacity-60">
                      {[...Array(9)].map((_, i) => (
                        <div
                          key={i}
                          className={`aspect-square rounded-lg transition-all duration-500 ${
                            isPlaying && (currentTime * 3) % 9 === i
                              ? "bg-gradient-to-br from-cyan-500 to-blue-500 scale-110"
                              : "bg-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Play/Pause Button */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="relative z-10 w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-2xl"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" />
                  )}
                </button>

                {/* Video Overlay Info */}
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-medium text-white">
                  <Eye className="w-4 h-4 inline mr-2" />
                  Live Demo
                </div>
              </div>

              {/* Video Controls */}
              <div className="p-6 bg-gray-900/80 backdrop-blur-sm">
                {/* Progress Bar */}
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-sm text-gray-400 font-mono">
                    {formatTime(currentTime)}
                  </span>
                  <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 ease-out"
                      style={{
                        width: `${(currentTime / totalDuration) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 font-mono">
                    {formatTime(totalDuration)}
                  </span>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-10 h-10 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg flex items-center justify-center transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 text-cyan-500" />
                      ) : (
                        <Play className="w-5 h-5 text-cyan-500 ml-0.5" />
                      )}
                    </button>
                    <button className="w-10 h-10 bg-gray-700/50 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                      <Volume2 className="w-5 h-5 text-gray-300" />
                    </button>
                  </div>
                  <button className="w-10 h-10 bg-gray-700/50 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                    <Maximize className="w-5 h-5 text-gray-300" />
                  </button>
                </div>
              </div>
            </div>
          </FloatingElement>

          {/* Demo Features Sidebar */}
          <FloatingElement delay={600} className="space-y-6">
            {/* Stats */}
            <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4 text-cyan-500">
                Demo Stats
              </h3>
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-cyan-500">{stat.icon}</div>
                      <span className="text-gray-300">{stat.label}</span>
                    </div>
                    <span className="font-semibold text-white">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Timeline */}
            <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-6 text-cyan-500">
                What You'll See
              </h3>
              <div className="space-y-4">
                {demoFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      activeFeature === index
                        ? "border-cyan-500 bg-cyan-500/10 scale-105"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`transition-colors ${
                          activeFeature === index
                            ? "text-cyan-500"
                            : "text-gray-400"
                        }`}
                      >
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-white">
                            {feature.title}
                          </h4>
                          <span className="text-xs text-gray-400 font-mono">
                            {feature.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30">
              <h3 className="text-lg font-semibold mb-2 text-white">
                Ready to try it?
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Start your free trial and experience the future of file
                management
              </p>
              <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-4 py-3 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </FloatingElement>
        </div>

        {/* Key Benefits */}
        <FloatingElement delay={800}>
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Secure by Design
              </h3>
              <p className="text-gray-400">
                Every file action is cryptographically secured and logged on the
                blockchain
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                AI-Powered
              </h3>
              <p className="text-gray-400">
                Intelligent classification and search make file management
                effortless
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Lightning Fast
              </h3>
              <p className="text-gray-400">
                Experience instant file operations without compromising security
              </p>
            </div>
          </div>
        </FloatingElement>
      </div>
    </section>
  );
};

export default WatchDemoSection;
