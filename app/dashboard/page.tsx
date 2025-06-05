"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Clock,
  UserCheck,
  Activity,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Stethoscope,
  FlaskConical,
  Pill,
} from "lucide-react"
import Sidebar from "@/components/sidebar"
import MobileSidebar from "@/components/mobile-sidebar"
import dynamic from "next/dynamic"
import { link } from "fs"
import { cursorTo } from "readline"

// Dynamically import chart components to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

const statsData = [
  {
    title: "Total Patients",
    value: 127,
    change: +12,
    subtitle: "Registered in system",
    icon: Users,
    color: "from-blue-500 to-blue-600",
    trend: "up",
  },
  {
    title: "Waiting for Triage",
    value: 4,
    change: -2,
    subtitle: "Patients in queue",
    icon: Clock,
    color: "from-yellow-500 to-yellow-600",
    trend: "down",
    link: "/triage",
    cursorTo: "pointer",
  },
  {
    title: "Active Consultations",
    value: 7,
    change: +3,
    subtitle: "In progress",
    icon: Activity,
    color: "from-orange-500 to-orange-600",
    trend: "up",
    link: "/consultations",
  },
  {
    title: "Completed Today",
    value: 15,
    change: +5,
    subtitle: "Patient visits completed",
    icon: UserCheck,
    color: "from-green-500 to-green-600",
    trend: "up",
  },
]

const waitingPatients = [
  { id: "P-1234", name: "John Doe", waitingFor: "Triage", waitTime: 14, avatar: "JD", link: "/triage" },
  { id: "P-1235", name: "Jane Smith", waitingFor: "Consultation", waitTime: 22, avatar: "JS" },
  { id: "P-1236", name: "Bob Johnson", waitingFor: "Lab Results", waitTime: 9, avatar: "BJ" },
  { id: "P-1237", name: "Alice Brown", waitingFor: "Prescription", waitTime: 5, avatar: "AB" },
]

const chartData = [
  { name: "Mon", patients: 24, completed: 20, revenue: 4800 },
  { name: "Tue", patients: 28, completed: 25, revenue: 5600 },
  { name: "Wed", patients: 32, completed: 30, revenue: 6400 },
  { name: "Thu", patients: 27, completed: 24, revenue: 5400 },
  { name: "Fri", patients: 35, completed: 32, revenue: 7000 },
  { name: "Sat", patients: 18, completed: 16, revenue: 3600 },
  { name: "Sun", patients: 12, completed: 10, revenue: 2400 },
]

const serviceData = [
  { name: "Triage", value: 35, color: "#581c87" },
  { name: "Consultation", value: 45, color: "#7c3aed" },
  { name: "Lab Tests", value: 25, color: "#a855f7" },
  { name: "Prescription", value: 20, color: "#c084fc" },
]

const recentActivities = [
  { id: 1, type: "consultation", patient: "Sarah Wilson", time: "2 min ago", status: "completed" },
  { id: 2, type: "lab", patient: "Mike Chen", time: "5 min ago", status: "in-progress" },
  { id: 3, type: "prescription", patient: "Emma Davis", time: "8 min ago", status: "ready" },
  { id: 4, type: "triage", patient: "Robert Kim", time: "12 min ago", status: "waiting" },
]

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState("")
  const [selectedMetric, setSelectedMetric] = useState("patients")
  const [userInfo, setUserInfo] = useState({ name: "", role: "" })
  const [mounted, setMounted] = useState(false)

  // Fix hydration error by only setting the time after component mounts
  useEffect(() => {
    setMounted(true)

    // Set initial time
    const now = new Date()
    setCurrentTime(now.toLocaleTimeString())

    // Update time every second
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Get user info from localStorage and parse role
    if (typeof window !== "undefined") {
      const username = localStorage.getItem("username") || "leofleet@gmail.com"
      const { name, role } = parseUserInfo(username)
      setUserInfo({ name, role })
    }
  }, [])

  interface UserInfo {
    name: string
    role: string
  }

  interface ParseUserInfo {
    (username: string): UserInfo
  }

  const parseUserInfo: ParseUserInfo = (username) => {
    // Extract name from email and determine role
    const emailPart = username.split("@")[0]
    const nameParts = emailPart.split(/[._-]/)
    const firstName = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : "User"
    const lastName = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : ""
    const fullName = `${firstName} ${lastName}`.trim()

    // Determine role based on email or random assignment
    const roles = ["Dr.", "Nurse", "Admin", "Technician"]
    const role =
      username.includes("dr") || username.includes("doctor")
        ? "Dr."
        : username.includes("nurse")
          ? "Nurse"
          : username.includes("admin")
            ? "Admin"
            : roles[Math.floor(Math.random() * roles.length)]

    return { name: fullName, role }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "consultation":
        return Stethoscope
      case "lab":
        return FlaskConical
      case "prescription":
        return Pill
      case "triage":
        return Activity
      default:
        return Activity
    }
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500"
      case "in-progress":
        return "text-blue-500"
      case "ready":
        return "text-purple-500"
      case "waiting":
        return "text-yellow-500"
      default:
        return "text-gray-500"
    }
  }

  // Get current date formatted
  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // ApexCharts options for line chart
  const lineChartOptions = {
    chart: {
      type: "line" as const,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    colors: ["#581c87", "#7c3aed"],
    stroke: {
      curve: ["smooth", "smooth"] as ("smooth" | "straight" | "stepline" | "linestep" | "monotoneCubic")[],
      width: [3, 2],
    },
    xaxis: {
      categories: chartData.map((item) => item.name),
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.5,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
    tooltip: {
      theme: "light",
      x: {
        show: true,
      },
    },
    grid: {
      borderColor: "#e0e7ff",
      strokeDashArray: 3,
    },
  }

  // ApexCharts options for bar chart
  const barChartOptions = {
    chart: {
      type: "bar" as const,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    colors: ["#a855f7"],
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "60%",
      },
    },
    xaxis: {
      categories: chartData.map((item) => item.name),
    },
    grid: {
      borderColor: "#e0e7ff",
      strokeDashArray: 3,
    },
  }

  // ApexCharts options for pie chart
  const pieChartOptions = {
    chart: {
      type: "donut" as const,
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    colors: serviceData.map((item) => item.color),
    labels: serviceData.map((item) => item.name),
    legend: {
      show: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "55%",
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30">
      {/* Include both sidebars */}
      <Sidebar />
      <MobileSidebar />

      <main className="flex-1 lg:ml-64 min-h-screen overflow-y-auto">
        <div className="p-4 lg:p-6 pt-16 lg:pt-6">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            {/* Header */}
            <motion.div variants={itemVariants} className="flex justify-between items-center mb-6 lg:mb-8">
              <div>
                <motion.h1
                  className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 bg-clip-text text-transparent"
                  animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                  transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                >
                  Dashboard
                </motion.h1>
                <motion.p
                  className="text-gray-600 mt-1 text-sm lg:text-base"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {formattedDate}
                </motion.p>
              </div>

              <div className="flex items-center gap-4">
                {/* User Info & Time Display */}
                <motion.div className="text-right">
                  <motion.p
                    className="text-sm font-medium bg-gradient-to-r from-[#581c87] to-[#7c3aed] bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Welcome back {userInfo.role} {userInfo.name}
                  </motion.p>
                  {mounted && (
                    <motion.p
                      className="text-lg font-bold bg-gradient-to-r from-[#581c87] to-[#7c3aed] bg-clip-text text-transparent"
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {currentTime}
                    </motion.p>
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8"
            >
              {statsData.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 5,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  }}
                  className="group"
                >
                  <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-500 transform perspective-1000 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-4 lg:p-6 relative z-10">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                          <div className="flex items-center gap-2">
                            <motion.p
                              className="text-2xl lg:text-3xl font-bold text-gray-900"
                              key={stat.value}
                              initial={{ scale: 1.2, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              {stat.value}
                            </motion.p>
                            <motion.div
                              className={`flex items-center text-xs font-medium ${
                                stat.trend === "up" ? "text-green-600" : "text-red-600"
                              }`}
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              {stat.trend === "up" ? (
                                <ArrowUp className="w-3 h-3 mr-1" />
                              ) : (
                                <ArrowDown className="w-3 h-3 mr-1" />
                              )}
                              {Math.abs(stat.change)}
                            </motion.div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                        </div>
                        <motion.div
                          className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg`}
                          whileHover={{
                            scale: 1.1,
                          }}
                          transition={{ duration: 0.6 }}
                        >
                          <stat.icon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
              {/* Main Chart */}
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card className="hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <CardTitle className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                          <TrendingUp className="h-5 w-5 text-[#581c87]" />
                        </motion.div>
                        Weekly Analytics
                      </CardTitle>
                      <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
                        <TabsList className="bg-purple-100">
                          <TabsTrigger
                            value="patients"
                            className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                          >
                            Patients
                          </TabsTrigger>
                          <TabsTrigger
                            value="revenue"
                            className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                          >
                            Revenue
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px] lg:h-[300px]">
                      {mounted && (
                        <AnimatePresence mode="wait">
                          {selectedMetric === "patients" ? (
                            <motion.div
                              key="patients"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="h-full"
                            >
                              <Chart
                                options={lineChartOptions}
                                series={[
                                  { name: "Patients", data: chartData.map((item) => item.patients) },
                                  { name: "Completed", data: chartData.map((item) => item.completed) },
                                ]}
                                type="line"
                                height="100%"
                              />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="revenue"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="h-full"
                            >
                              <Chart
                                options={barChartOptions}
                                series={[{ name: "Revenue", data: chartData.map((item) => item.revenue) }]}
                                type="bar"
                                height="100%"
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Service Distribution */}
              <motion.div variants={itemVariants}>
                <Card className="hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm border-0 shadow-lg h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <Activity className="h-5 w-5 text-[#581c87]" />
                      </motion.div>
                      Service Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] lg:h-[250px]">
                      {mounted && (
                        <Chart
                          options={pieChartOptions}
                          series={serviceData.map((item) => item.value)}
                          type="donut"
                          height="100%"
                        />
                      )}
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {serviceData.map((item, index) => (
                        <motion.div
                          key={item.name}
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-xs text-gray-600">{item.name}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {/* Patient Queue */}
              <motion.div variants={itemVariants}>
                <Card className="hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-[#581c87]" />
                        Patients Waiting
                      </CardTitle>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {waitingPatients.length} active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {waitingPatients.map((patient, index) => (
                        <motion.div
                          key={patient.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-[#581c87] to-[#7c3aed] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {patient.avatar}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm lg:text-base">{patient.name}</p>
                              <p className="text-xs lg:text-sm text-gray-600">{patient.id}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 lg:gap-3">
                            <div className="text-right">
                              <Badge
                                variant="outline"
                                className="bg-[#581c87]/10 text-[#581c87] border-[#581c87]/20 mb-1 text-xs"
                              >
                                {patient.waitingFor}
                              </Badge>
                              <p className="text-xs text-gray-500">{patient.waitTime}m</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Activity */}
              <motion.div variants={itemVariants}>
                <Card className="hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-[#581c87]" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => {
                        const IconComponent = getActivityIcon(activity.type)
                        return (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50/50 transition-colors"
                          >
                            <div
                              className={`p-2 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 ${getActivityColor(activity.status)}`}
                            >
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm lg:text-base">{activity.patient}</p>
                              <p className="text-xs lg:text-sm text-gray-600 capitalize">
                                {activity.type} • {activity.status}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </motion.div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
