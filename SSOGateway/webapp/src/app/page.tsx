"use client";

import { motion } from "framer-motion";
import { LogOut, LayoutDashboard, Brain, HardDrive, BarChart3, Music, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

const APPS = [
  {
    name: "LocalGPT",
    description: "Private LLM interface",
    path: "/localgpt",
    icon: Brain,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    name: "Dashboard Ubuntu",
    description: "System management panel",
    path: "/dashboard",
    icon: LayoutDashboard,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
  {
    name: "Portainer",
    description: "Docker container manager",
    path: "/portainer",
    icon: HardDrive,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    name: "Netdata",
    description: "Real-time metrics",
    path: "/netdata",
    icon: BarChart3,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  {
    name: "AudioSpace",
    description: "Audio control center",
    path: "/audiospace",
    icon: Music,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Services Gateway</h1>
            <p className="text-gray-400 mt-2">Unified access to your infrastructure</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white px-5 py-2.5 rounded-xl border border-gray-800 transition-all self-start md:self-auto"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>

        {/* Apps Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {APPS.map((app) => (
            <motion.a
              key={app.name}
              href={app.path}
              variants={item}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`block p-6 rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:${app.border} group transition-all duration-300 relative overflow-hidden`}
            >
              {/* Subtle gradient background on hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-transparent to-current ${app.color}`} />
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${app.bg} border ${app.border}`}>
                  <app.icon className={`w-6 h-6 ${app.color}`} />
                </div>
                <ExternalLink className="w-5 h-5 text-gray-600 group-hover:text-gray-300 transition-colors" />
              </div>
              
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                  {app.name}
                </h3>
                <p className="text-sm text-gray-400">
                  {app.description}
                </p>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
