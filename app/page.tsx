"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Sparkles, Shield, Zap, Heart } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  type Particle = { id: number; x: number; y: number; size: number; duration: number }
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10,
    }))
    setParticles(newParticles)
  }, [])

  const handleLogin = async () => {
    setIsLoading(true)
    // Store username in localStorage for role-based welcome
    localStorage.setItem("username", credentials.username)
    // Simulate login process
    await new Promise((resolve) => setTimeout(resolve, 2000))
    window.location.href = "/dashboard"
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  const floatingVariants = {
    animate: {
      y: [-20, 20, -20],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0f0f23] via-[#1a1a3e] to-[#2d1b69]">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Floating Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [-100, window.innerHeight + 100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fillOpacity=&quot;0.03&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;1&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md">
          {/* Logo Animation */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#581c87] to-[#7c3aed] rounded-2xl mb-4 shadow-2xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className="w-10 h-10 text-white" />
            </motion.div>
            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent"
              
              animate="animate"
            >
              PalmCareConnect
            </motion.h1>
            <motion.p
              className="text-purple-200/80 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Next-Generation Healthcare Platform
            </motion.p>
          </motion.div>

          {/* Login Card */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader className="text-center pb-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <CardTitle className="text-2xl font-bold text-white mb-2">Welcome Back</CardTitle>
                  <p className="text-purple-200/70">Sign in to access your dashboard</p>
                </motion.div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Username Field */}
                <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.02 }}>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Username</label>
                  <div className="relative group">
                    <Input
                      type="text"
                      placeholder="Enter your username"
                      value={credentials.username}
                      onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                      className="bg-white/5 border-white/20 text-white placeholder-purple-300/50 focus:border-purple-400 focus:ring-purple-400/50 transition-all duration-300"
                    />
                    <motion.div
                      className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
                      layoutId="inputGlow"
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Password</label>
                  <div className="relative group">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                      className="bg-white/5 border-white/20 text-white placeholder-purple-300/50 focus:border-purple-400 focus:ring-purple-400/50 pr-12 transition-all duration-300"
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <AnimatePresence mode="wait">
                        {showPassword ? (
                          <motion.div
                            key="hide"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                          >
                            <EyeOff size={20} />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="show"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Eye size={20} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                    <motion.div
                      className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
                      layoutId="inputGlow"
                    />
                  </div>
                </motion.div>

                {/* Login Button */}
                <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#581c87] via-[#7c3aed] to-[#8b5cf6] hover:from-[#6b21a8] hover:via-[#8b5cf6] hover:to-[#a855f7] text-white font-semibold py-3 rounded-lg transition-all duration-500 transform hover:shadow-2xl hover:shadow-purple-500/25 relative overflow-hidden group"
                  >
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center"
                        >
                          <motion.div
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          />
                          Signing In...
                        </motion.div>
                      ) : (
                        <motion.div
                          key="signin"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center"
                        >
                          <Zap className="w-5 h-5 mr-2" />
                          Sign In
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Button Shine Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                      animate={{
                        x: [-100, 300],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 3,
                      }}
                    />
                  </Button>
                </motion.div>

                {/* Features */}
                <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 pt-4">
                  {[
                    { icon: Shield, label: "Secure", color: "from-green-400 to-emerald-500" },
                    { icon: Zap, label: "Fast", color: "from-yellow-400 to-orange-500" },
                    { icon: Sparkles, label: "Smart", color: "from-purple-400 to-pink-500" },
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.label}
                      className="text-center"
                      whileHover={{ scale: 1.1, y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl mb-2 shadow-lg`}
                        animate={{
                          boxShadow: [
                            "0 0 20px rgba(139, 92, 246, 0.3)",
                            "0 0 30px rgba(139, 92, 246, 0.5)",
                            "0 0 20px rgba(139, 92, 246, 0.3)",
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: index * 0.5,
                        }}
                      >
                        <feature.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <p className="text-xs text-purple-200/70">{feature.label}</p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Demo Credentials */}
                <motion.div variants={itemVariants} className="text-center">
                  <motion.p
                    className="text-xs text-purple-200/50"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  >
                    Demo: Use any credentials to continue
                  </motion.p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
