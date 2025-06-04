"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  UserPlus,
  Activity,
  Users,
  Stethoscope,
  FlaskConical,
  FileText,
  CreditCard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMediaQuery } from "@/hooks/use-media-query"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", color: "from-blue-500 to-blue-600" },
  {
    icon: UserPlus,
    label: "Patient Registration",
    href: "/patient-registration",
    color: "from-green-500 to-green-600",
  },
  { icon: Activity, label: "Triage", href: "/triage", color: "from-red-500 to-red-600" },
  { icon: Users, label: "Queue Management", href: "/queue", color: "from-yellow-500 to-yellow-600" },
  { icon: Stethoscope, label: "Consultation", href: "/consultation", color: "from-purple-500 to-purple-600" },
  { icon: FlaskConical, label: "Laboratory", href: "/laboratory", color: "from-cyan-500 to-cyan-600" },
  { icon: FileText, label: "Prescription", href: "/prescription", color: "from-orange-500 to-orange-600" },
  { icon: CreditCard, label: "Payments", href: "/payments", color: "from-pink-500 to-pink-600" },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)
  const [particles, setParticles] = useState([])
  const pathname = usePathname()
  const isLargeScreen = useMediaQuery("(min-width: 1024px)")

  useEffect(() => {
    // Generate floating particles for sidebar
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 5,
    }))
    setParticles(newParticles)
  }, [])

  const sidebarVariants = {
    expanded: {
      width: 256,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    collapsed: {
      width: 64,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  }

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (index) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
      },
    }),
  }

  const iconVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.2,
      transition: { duration: 0.3 },
    },
    active: {
      scale: 1.1,
      boxShadow: "0 0 20px rgba(139, 92, 246, 0.6)",
    },
  }

  // Only render on large screens
  if (!isLargeScreen) {
    return null
  }

  return (
    <motion.div
      variants={sidebarVariants}
      animate={isCollapsed ? "collapsed" : "expanded"}
      className="bg-gradient-to-b from-[#0f0f23] via-[#1a1a3e] to-[#2d1b69] text-white flex flex-col fixed left-0 top-0 h-screen z-50 shadow-2xl overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-10 left-1/2 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [-20, 20, -20],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-2 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Floating Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [-50, window.innerHeight + 50],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="p-6 border-b border-white/10 relative z-10">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3"
              >
                <motion.div
                  className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <motion.h1
                    className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent"
                    animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  >
                    PalmCareConnect
                  </motion.h1>
                  <motion.p
                    className="text-xs text-white/70"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    Healthcare Management
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-white hover:bg-white/20 p-2 rounded-xl bg-white/10"
            >
              <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
                {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 relative z-10 overflow-y-auto">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href
          return (
            <motion.div
              key={item.href}
              custom={index}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              onHoverStart={() => setHoveredItem(item.href)}
              onHoverEnd={() => setHoveredItem(null)}
            >
              <Link href={item.href}>
                <motion.div
                  className={`relative flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${
                    isActive ? "bg-white/20 shadow-lg backdrop-blur-sm" : "hover:bg-white/10"
                  } ${isCollapsed ? "justify-center" : "justify-start"}`}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-pink-400 rounded-r-full"
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  {/* Icon */}
                  <motion.div
                    variants={iconVariants}
                    animate={isActive ? "active" : hoveredItem === item.href ? "hover" : "rest"}
                    className={`p-2 rounded-lg bg-gradient-to-r ${item.color} shadow-lg`}
                  >
                    <item.icon className="h-5 w-5 text-white" />
                  </motion.div>

                  {/* Label */}
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`font-medium truncate ${
                          isActive ? "text-white" : "text-white/90 group-hover:text-white"
                        }`}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Hover Effect */}
                  {hoveredItem === item.href && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}

                  {/* Sparkle Effect for Active Item */}
                  {isActive && (
                    <motion.div
                      className="absolute top-1 right-1"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
                      <Zap className="w-3 h-3 text-yellow-300" />
                    </motion.div>
                  )}
                </motion.div>
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 relative z-10">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="ghost"
            className={`w-full text-white hover:bg-white/10 rounded-xl transition-all duration-300 ${
              isCollapsed ? "px-2" : "px-4"
            }`}
            onClick={() => (window.location.href = "/")}
          >
            <motion.div
              className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 shadow-lg"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <LogOut className="h-5 w-5 text-white" />
            </motion.div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="ml-3 font-medium"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-white/50 mt-4 text-center"
            >
              © 2025 PalmCareConnect
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
