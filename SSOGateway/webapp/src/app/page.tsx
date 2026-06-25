"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Brain, HardDrive, BarChart3, Music, Globe, Store,
  LayoutDashboard, Server, ChevronRight, Activity, Shield,
  Cpu, Wifi
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// ─── Service Definitions ─────────────────────────────────────────────────────
// Paths are relative so they work via Cloudflare Tunnel through nginx proxy.
// Never use direct IPs here — those only work on LAN.

type Category = "infrastructure" | "app" | "site";

interface App {
  name: string;
  description: string;
  path: string;
  icon: React.ElementType;
  category: Category;
  accent: string;
  glow: string;
  iconBg: string;
}

const APPS: App[] = [
  // ── Infrastructure ──────────────────────────────────────────────────────
  {
    name: "LocalGPT",
    description: "Private LLM · Jetson 8GB",
    path: "/localgpt/",
    icon: Brain,
    category: "infrastructure",
    accent: "from-emerald-500 to-teal-400",
    glow: "rgba(16,185,129,0.15)",
    iconBg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
  },
  {
    name: "Dashboard Ubuntu",
    description: "System statics panel",
    path: "/dashboard/",
    icon: LayoutDashboard,
    category: "infrastructure",
    accent: "from-orange-500 to-amber-400",
    glow: "rgba(249,115,22,0.15)",
    iconBg: "bg-orange-500/15 border-orange-500/30 text-orange-400",
  },
  {
    name: "Portainer",
    description: "Docker container manager",
    path: "/portainer/",
    icon: HardDrive,
    category: "infrastructure",
    accent: "from-blue-500 to-cyan-400",
    glow: "rgba(59,130,246,0.15)",
    iconBg: "bg-blue-500/15 border-blue-500/30 text-blue-400",
  },
  {
    name: "Netdata",
    description: "Real-time metrics & monitoring",
    path: "/netdata/",
    icon: BarChart3,
    category: "infrastructure",
    accent: "from-green-500 to-lime-400",
    glow: "rgba(34,197,94,0.15)",
    iconBg: "bg-green-500/15 border-green-500/30 text-green-400",
  },
  // ── Applications ────────────────────────────────────────────────────────
  {
    name: "AudioSpace",
    description: "Audio control center",
    path: "/audiospace/",
    icon: Music,
    category: "app",
    accent: "from-violet-500 to-purple-400",
    glow: "rgba(139,92,246,0.15)",
    iconBg: "bg-violet-500/15 border-violet-500/30 text-violet-400",
  },
  // ── Sites ───────────────────────────────────────────────────────────────
  {
    name: "Jenny Dentista",
    description: "Consultorio dental · Sitio web",
    path: "/jennydentista/",
    icon: Globe,
    category: "site",
    accent: "from-pink-500 to-rose-400",
    glow: "rgba(236,72,153,0.15)",
    iconBg: "bg-pink-500/15 border-pink-500/30 text-pink-400",
  },
  {
    name: "Las Flores",
    description: "Abarrotes · Tienda online",
    path: "/lasflores/",
    icon: Store,
    category: "site",
    accent: "from-yellow-500 to-amber-400",
    glow: "rgba(234,179,8,0.15)",
    iconBg: "bg-yellow-500/15 border-yellow-500/30 text-yellow-400",
  },
];

const CATEGORIES: { key: Category; label: string; icon: React.ElementType; color: string }[] = [
  { key: "infrastructure", label: "Infrastructure", icon: Server, color: "text-indigo-400" },
  { key: "app",            label: "Applications",  icon: Cpu,    color: "text-violet-400" },
  { key: "site",           label: "Websites",      icon: Wifi,   color: "text-amber-400" },
];

// ─── Animation Variants ───────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 260, damping: 22 } },
};

// ─── App Card ─────────────────────────────────────────────────────────────────
function AppCard({ app }: { app: App }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={app.path}
      variants={cardVariants}
      whileHover={{ y: -5, scale: 1.025 }}
      whileTap={{ scale: 0.97 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative group block rounded-2xl overflow-hidden cursor-pointer"
      style={{ boxShadow: hovered ? `0 0 40px ${app.glow}` : "none", transition: "box-shadow 0.3s ease" }}
    >
      {/* Glass background */}
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xl border border-white/[0.06] rounded-2xl transition-colors duration-300 group-hover:border-white/[0.12]" />

      {/* Gradient overlay on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`absolute inset-0 bg-gradient-to-br ${app.accent} opacity-[0.06] rounded-2xl`}
          />
        )}
      </AnimatePresence>

      {/* Top gradient line */}
      <div className={`absolute top-0 left-4 right-4 h-px bg-gradient-to-r ${app.accent} opacity-0 group-hover:opacity-60 transition-opacity duration-300`} />

      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between mb-5">
          {/* Icon */}
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${app.iconBg} transition-transform duration-300 group-hover:scale-110`}>
            <app.icon className="w-5 h-5" />
          </div>
          {/* Online indicator */}
          <div className="flex items-center gap-1.5 bg-slate-800/60 px-2.5 py-1 rounded-full border border-white/[0.06]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">online</span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-[15px] font-semibold text-white tracking-tight leading-tight">{app.name}</h3>
            <p className="text-xs text-slate-500 mt-1">{app.description}</p>
          </div>
          <motion.div
            animate={{ x: hovered ? 2 : 0, opacity: hovered ? 1 : 0.3 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </motion.div>
        </div>
      </div>
    </motion.a>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const router = useRouter();
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const totalServices = APPS.length;

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-x-hidden">

      {/* ── Ambient background orbs ─────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] bg-cyan-600/8 rounded-full blur-[100px]" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />
      </div>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 border-b border-white/[0.06] backdrop-blur-md bg-slate-950/40"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Shield className="w-4.5 h-4.5 text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight leading-none">MauServerWorld</h1>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-none">Services Gateway</p>
            </div>
          </div>

          {/* Center — live clock & stats */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 bg-slate-900/50 border border-white/[0.06] rounded-full px-4 py-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs text-slate-400 font-medium">{totalServices} servicios activos</span>
            </div>
            <span className="text-xs text-slate-600 font-mono tabular-nums">{time}</span>
          </div>

          {/* Logout */}
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 bg-slate-900/60 hover:bg-red-950/40 text-slate-400 hover:text-red-400 px-4 py-2 rounded-xl border border-white/[0.06] hover:border-red-500/30 transition-all duration-200 text-sm font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </motion.button>
        </div>
      </motion.header>

      {/* ── Main Content ────────────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-10">

        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-bold text-white tracking-tight">Panel de Control</h2>
          <p className="text-slate-500 text-sm mt-1">Acceso unificado a tu infraestructura</p>
        </motion.div>

        {/* Categories */}
        <div className="space-y-10">
          {CATEGORIES.map((cat, catIdx) => {
            const apps = APPS.filter((a) => a.category === cat.key);
            if (!apps.length) return null;
            return (
              <motion.section
                key={cat.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + catIdx * 0.08 }}
              >
                {/* Category header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center gap-2">
                    <cat.icon className={`w-4 h-4 ${cat.color}`} />
                    <span className={`text-xs font-semibold uppercase tracking-widest ${cat.color}`}>{cat.label}</span>
                  </div>
                  <div className="flex-1 h-px bg-white/[0.05]" />
                  <span className="text-[11px] text-slate-600 font-medium">{apps.length} {apps.length === 1 ? "servicio" : "servicios"}</span>
                </div>

                {/* Cards grid */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                  {apps.map((app) => (
                    <AppCard key={app.name} app={app} />
                  ))}
                </motion.div>
              </motion.section>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 pt-6 border-t border-white/[0.04] flex items-center justify-between"
        >
          <p className="text-[11px] text-slate-700">MauServerWorld · SSO Gateway v1.0</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-slate-700">Ubuntu Server · Cloudflare Tunnel</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
