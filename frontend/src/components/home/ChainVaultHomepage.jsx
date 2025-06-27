import React, { useState, useEffect } from "react";
import {
  Shield,
  Brain,
  Search,
  Share2,
  Upload,
  Lock,
  Eye,
  Users,
  Building,
  User,
  Scale,
  ChevronRight,
  Github,
  Mail,
  FileText,
  Zap,
  Database,
  CheckCircle,
  Facebook,
} from "lucide-react";
import { Link } from "react-router-dom";

const ChainVaultHomepage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(stepInterval);
  }, []);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Classification",
      description: "Intelligent file categorization and tagging",
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Blockchain Logging",
      description: "Immutable audit trails for every file action",
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Smart Search",
      description: "AI-powered content discovery and retrieval",
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Secure Sharing",
      description: "Encrypted file sharing with access controls",
    },
  ];

  const steps = [
    {
      icon: <Upload className="w-12 h-12" />,
      title: "Upload",
      description: "Drag & drop your files",
    },
    {
      icon: <Brain className="w-12 h-12" />,
      title: "Classify",
      description: "AI categorizes intelligently",
    },
    {
      icon: <Database className="w-12 h-12" />,
      title: "Log on Blockchain",
      description: "Immutable record created",
    },
    {
      icon: <Share2 className="w-12 h-12" />,
      title: "Share Securely",
      description: "Encrypted collaboration",
    },
  ];

  const useCases = [
    {
      icon: <Users className="w-10 h-10" />,
      title: "Teams",
      description: "Collaborative workspaces with audit trails",
      benefits: ["Real-time sync", "Version control", "Access management"],
    },
    {
      icon: <Building className="w-10 h-10" />,
      title: "Enterprises",
      description: "Enterprise-grade security and compliance",
      benefits: ["SOC 2 compliant", "Advanced analytics", "Custom policies"],
    },
    {
      icon: <User className="w-10 h-10" />,
      title: "Freelancers",
      description: "Professional file management for creators",
      benefits: ["Client portals", "Usage tracking", "Automated backups"],
    },
    {
      icon: <Scale className="w-10 h-10" />,
      title: "Legal Firms",
      description: "Tamper-proof document management",
      benefits: ["Chain of custody", "Compliance ready", "Secure client files"],
    },
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-gray-100 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4 backdrop-blur-lg bg-gray-900/40 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              ChainVault
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-300 hover:text-cyan-500 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-300 hover:text-cyan-500 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#use-cases"
              className="text-gray-300 hover:text-cyan-500 transition-colors"
            >
              Use Cases
            </a>
            <Link to="/registration">
              <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 text-center">
        <div className="max-w-6xl mx-auto">
          <FloatingElement delay={200}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-cyan-500 bg-clip-text text-transparent">
                ChainVault:
              </span>
              <br />
              <span className="text-4xl md:text-6xl text-gray-200">
                Intelligent File Security.
              </span>
              <br />
              <span className="text-4xl md:text-6xl bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                Redefined.
              </span>
            </h1>
          </FloatingElement>

          <FloatingElement delay={400}>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Manage, classify, share and secure your files with AI and
              blockchain.
            </p>
          </FloatingElement>

          <FloatingElement delay={600}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link to="/registration">
                <button className="group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 flex items-center space-x-2">
                  <span>Get Started</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link to="watch-demo">
                <button className="group border-2 border-cyan-500/50 hover:border-cyan-500 px-8 py-4 rounded-xl font-semibold text-lg transition-all backdrop-blur-sm hover:bg-cyan-500/10 flex items-center space-x-2">
                  <span>Watch Demo</span>
                  <Eye className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </FloatingElement>

          {/* Hero Visual */}
          <FloatingElement delay={800}>
            <div className="relative mx-auto max-w-4xl">
              <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-3xl border border-gray-800 p-8 shadow-2xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl p-4 backdrop-blur-sm border border-cyan-500/20 hover:scale-105 transition-transform"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg mb-2 mx-auto"></div>
                      <div className="h-2 bg-gray-700 rounded mb-1"></div>
                      <div className="h-2 bg-gray-800 rounded w-3/4 mx-auto"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FloatingElement>
        </div>
      </section>

      {/* Features Preview */}
      <section id="features" className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <FloatingElement delay={200}>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Core Features
            </h2>
          </FloatingElement>

          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FloatingElement key={index} delay={300 + index * 100}>
                <div className="group bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 hover:border-cyan-500/50 transition-all hover:scale-105">
                  <div className="text-cyan-500 mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </FloatingElement>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <FloatingElement delay={200}>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              How It Works
            </h2>
          </FloatingElement>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <FloatingElement key={index} delay={300 + index * 100}>
                <div
                  className={`relative bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border transition-all ${
                    currentStep === index
                      ? "border-cyan-500 scale-105"
                      : "border-gray-800"
                  }`}
                >
                  <div className="text-center">
                    <div
                      className={`mx-auto mb-4 transition-colors ${
                        currentStep === index
                          ? "text-cyan-500"
                          : "text-gray-400"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white font-bold flex items-center justify-center mx-auto mb-4">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 text-cyan-500">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </FloatingElement>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <FloatingElement delay={200}>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Perfect For Every Use Case
            </h2>
          </FloatingElement>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <FloatingElement key={index} delay={300 + index * 100}>
                <div className="group bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 hover:border-cyan-500/50 transition-all hover:scale-105">
                  <div className="text-cyan-500 mb-4 group-hover:scale-110 transition-transform">
                    {useCase.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-400 mb-4">{useCase.description}</p>
                  <ul className="space-y-2">
                    {useCase.benefits.map((benefit, i) => (
                      <li
                        key={i}
                        className="flex items-center space-x-2 text-sm text-gray-300"
                      >
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FloatingElement>
            ))}
          </div>
        </div>
      </section>

      {/* Security Highlight */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <FloatingElement delay={200}>
            <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-2xl rounded-3xl p-12 border border-cyan-500/30 shadow-2xl text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                Tamper-proof logs. Transparent audits. 100% Token-free.
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Experience the power of blockchain security without the
                complexity of cryptocurrency. Every file action is recorded on
                an immutable ledger, providing unprecedented transparency and
                trust.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-green-400">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Lightning Fast</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="w-5 h-5" />
                  <span>Military Grade</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Full Transparency</span>
                </div>
              </div>
            </div>
          </FloatingElement>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <FloatingElement delay={200}>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Admin & User Panels
            </h2>
          </FloatingElement>

          <div className="grid md:grid-cols-2 gap-8">
            <FloatingElement delay={400}>
              <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-500">
                  Admin Dashboard
                </h3>
                <div className="bg-gray-900/80 rounded-xl p-4 border border-gray-800">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-cyan-500/20 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-cyan-500">
                        1,247
                      </div>
                      <div className="text-xs text-gray-400">Files Managed</div>
                    </div>
                    <div className="bg-green-400/20 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-green-400">
                        99.9%
                      </div>
                      <div className="text-xs text-gray-400">Uptime</div>
                    </div>
                    <div className="bg-blue-500/20 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-500">24</div>
                      <div className="text-xs text-gray-400">Active Users</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-gray-800/80 rounded p-2"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded"></div>
                          <div>
                            <div className="text-sm font-medium">
                              File {i + 1}
                            </div>
                            <div className="text-xs text-gray-400">
                              {Math.floor(Math.random() * 10) + 1}MB
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-green-400">Verified</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FloatingElement>

            <FloatingElement delay={600}>
              <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-500">
                  User Interface
                </h3>
                <div className="bg-gray-900/80 rounded-xl p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full"></div>
                      <span className="font-medium">My Files</span>
                    </div>
                    <button className="bg-cyan-500/20 hover:bg-cyan-500/30 px-3 py-1 rounded text-sm transition-colors">
                      Upload
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-3 hover:scale-105 transition-transform cursor-pointer"
                      >
                        <FileText className="w-6 h-6 text-cyan-500 mb-2" />
                        <div className="text-xs text-gray-300">
                          Document {i + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center text-sm text-gray-400">
                    All files secured with blockchain integrity
                  </div>
                </div>
              </div>
            </FloatingElement>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <FloatingElement delay={200}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Ready to experience AI-secured file management?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of users who trust ChainVault with their most
              important files.
            </p>
            <Link to="/registration">
              <button className="group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-12 py-4 rounded-xl font-semibold text-xl transition-all transform hover:scale-105 flex items-center space-x-3 mx-auto">
                <span>Create Your Free Account</span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </FloatingElement>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-16 border-t border-gray-800 backdrop-blur-lg bg-gray-900/40">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  ChainVault
                </span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                ChainVault – Trust Your Files. Trust the Chain.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-cyan-500 transition-colors"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-cyan-500 transition-colors"
                >
                  <Mail className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-cyan-500 transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-cyan-500 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-500 transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-500 transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-cyan-500 transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-500 transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-500 transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 ChainVault. All rights reserved. Built with AI and
              secured by blockchain.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChainVaultHomepage;
