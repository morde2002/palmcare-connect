"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Clock, Search, ArrowRight, X, RefreshCw } from "lucide-react"
import Sidebar from "@/components/sidebar"
import MobileSidebar from "@/components/mobile-sidebar"
import { PageTransition } from "@/components/page-transition"
import { useAppContext } from "@/components/app-context"
import { NotificationPanel } from "@/components/notification-panel"

const queueData = {
  triage: [
    { id: "P-1234", name: "John Doe", waitTime: 14, priority: "high", status: "waiting", department: "General" },
    { id: "P-1235", name: "Jane Smith", waitTime: 22, priority: "medium", status: "waiting", department: "Pediatrics" },
  ],
  consultation: [
    {
      id: "P-1236",
      name: "Bob Johnson",
      waitTime: 9,
      priority: "low",
      status: "in-progress",
      department: "Cardiology",
    },
    { id: "P-1237", name: "Alice Brown", waitTime: 5, priority: "medium", status: "waiting", department: "General" },
    {
      id: "P-1238",
      name: "Charlie Wilson",
      waitTime: 18,
      priority: "high",
      status: "waiting",
      department: "Orthopedics",
    },
  ],
  laboratory: [
    {
      id: "P-1239",
      name: "David Lee",
      waitTime: 7,
      priority: "medium",
      status: "in-progress",
      department: "Radiology",
    },
    { id: "P-1240", name: "Eva Garcia", waitTime: 12, priority: "low", status: "waiting", department: "Pathology" },
  ],
  pharmacy: [
    { id: "P-1241", name: "Frank Miller", waitTime: 3, priority: "low", status: "waiting", department: "General" },
  ],
}

const waitTimeData = [
  { time: "9:00", triage: 5, consultation: 12, laboratory: 8, prescription: 3 },
  { time: "10:00", triage: 8, consultation: 15, laboratory: 6, prescription: 4 },
  { time: "11:00", triage: 6, consultation: 18, laboratory: 10, prescription: 2 },
  { time: "12:00", triage: 4, consultation: 22, laboratory: 9, prescription: 5 },
  { time: "13:00", triage: 7, consultation: 20, laboratory: 7, prescription: 3 },
  { time: "14:00", triage: 3, consultation: 16, laboratory: 11, prescription: 6 },
]

const departments = ["All Departments", "General", "Cardiology", "Pediatrics", "Orthopedics", "Radiology", "Pathology"]

export default function Queue() {
  const [activeTab, setActiveTab] = useState("triage")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [queue, setQueue] = useState(queueData)
  const [refreshing, setRefreshing] = useState(false)
  const { simulateAction } = useAppContext()

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setRefreshing(false)
  }

  const handleMoveToNext = (patient, currentQueue) => {
    simulateAction(`Moving ${patient.name} to next stage`, 800).then(() => {
      // Remove from current queue
      const updatedCurrentQueue = queue[currentQueue].filter((p) => p.id !== patient.id)

      // Determine next queue based on current queue
      let nextQueue
      switch (currentQueue) {
        case "triage":
          nextQueue = "consultation"
          break
        case "consultation":
          nextQueue = "laboratory"
          break
        case "laboratory":
          nextQueue = "pharmacy"
          break
        default:
          nextQueue = null
      }

      // Add to next queue if there is one
      if (nextQueue) {
        const updatedNextQueue = [...queue[nextQueue], { ...patient, status: "waiting", waitTime: 0 }]
        setQueue({
          ...queue,
          [currentQueue]: updatedCurrentQueue,
          [nextQueue]: updatedNextQueue,
        })
      } else {
        // If pharmacy (last stage), just remove from queue
        setQueue({
          ...queue,
          [currentQueue]: updatedCurrentQueue,
        })
      }
    })
  }

  const handleRemoveFromQueue = (patient, currentQueue) => {
    simulateAction(`Removing ${patient.name} from queue`, 600).then(() => {
      const updatedQueue = queue[currentQueue].filter((p) => p.id !== patient.id)
      setQueue({
        ...queue,
        [currentQueue]: updatedQueue,
      })
    })
  }

  const handleStartService = (patient, currentQueue) => {
    simulateAction(`Starting service for ${patient.name}`, 600).then(() => {
      const updatedQueue = queue[currentQueue].map((p) => {
        if (p.id === patient.id) {
          return { ...p, status: "in-progress" }
        }
        return p
      })
      setQueue({
        ...queue,
        [currentQueue]: updatedQueue,
      })
    })
  }

  const filteredQueue = (queueType) => {
    return queue[queueType].filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDepartment = selectedDepartment === "All Departments" || patient.department === selectedDepartment
      return matchesSearch && matchesDepartment
    })
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "waiting":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <MobileSidebar />

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <main className="lg:ml-64 p-4 lg:p-8 pt-16 lg:pt-8">
        <PageTransition>
          <div className="p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              {/* Header with same design as Triage */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
              >
                <div>
                  <motion.h1
                    className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3"
                    animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                    transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <motion.div
                      className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-lg"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <Users className="h-8 w-8 text-white" />
                    </motion.div>
                    Patient Queue
                  </motion.h1>
                  <motion.p
                    className="text-gray-600"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  >
                    Manage and track patients through different service stages
                  </motion.p>
                </div>

                <div className="flex items-center gap-4 mt-4 lg:mt-0">
                  <div className="relative flex-1 lg:flex-none">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search patients..."
                      className="pl-8 w-full lg:w-[250px] bg-white/80 backdrop-blur-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => setSearchTerm("")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-[180px] bg-white/80 backdrop-blur-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefresh}
                      disabled={refreshing}
                      className="bg-white/80 backdrop-blur-sm hover:bg-white"
                    >
                      <motion.div
                        animate={refreshing ? { rotate: 360 } : {}}
                        transition={{ duration: 1, repeat: refreshing ? Number.POSITIVE_INFINITY : 0 }}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                      </motion.div>
                      Refresh
                    </Button>
                  </motion.div>
                  <NotificationPanel />
                </div>
              </motion.div>

              {/* Stats Cards */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {Object.entries(queue).map(([queueType, patients], index) => (
                  <motion.div key={queueType} variants={itemVariants}>
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                      <CardContent className="p-6 relative">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600 capitalize">{queueType}</p>
                            <motion.p
                              className="text-3xl font-bold text-gray-900 mt-2"
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            >
                              {patients.length}
                            </motion.p>
                            <p className="text-xs text-gray-500 mt-1">
                              {patients.filter((p) => p.status === "waiting").length} waiting
                            </p>
                          </div>
                          <motion.div
                            className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-lg group-hover:scale-110 transition-transform duration-300"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Users className="h-6 w-6 text-white" />
                          </motion.div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger
                    value="triage"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                  >
                    Triage ({queue.triage.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="consultation"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                  >
                    Consultation ({queue.consultation.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="laboratory"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                  >
                    Laboratory ({queue.laboratory.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="pharmacy"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                  >
                    Pharmacy ({queue.pharmacy.length})
                  </TabsTrigger>
                </TabsList>

                {Object.entries(queue).map(([queueType, patients]) => (
                  <TabsContent key={queueType} value={queueType}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 capitalize">
                            <Users className="h-5 w-5 text-[#581c87]" />
                            {queueType} Queue
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <AnimatePresence>
                            {filteredQueue(queueType).length === 0 ? (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center py-12"
                              >
                                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Patients in Queue</h3>
                                <p className="text-gray-500">All patients have been processed</p>
                              </motion.div>
                            ) : (
                              <motion.div
                                className="space-y-4"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                              >
                                {filteredQueue(queueType).map((patient, index) => (
                                  <motion.div
                                    key={patient.id}
                                    variants={itemVariants}
                                    className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 group bg-gray-50/80 hover:bg-gray-100/80"
                                    whileHover={{ scale: 1.01 }}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-[#581c87] to-[#312e81] rounded-full flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform duration-300">
                                          {patient.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                        </div>
                                        <div>
                                          <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                                          <div className="flex items-center gap-2 mt-1">
                                            <p className="text-sm text-gray-600">ID: {patient.id}</p>
                                            <p className="text-sm text-gray-600">Dept: {patient.department}</p>
                                          </div>
                                          <div className="flex items-center gap-2 mt-1">
                                            <Clock className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm text-gray-600">
                                              Wait time: {patient.waitTime} min
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <div className="flex flex-col gap-2">
                                          <Badge className={getPriorityColor(patient.priority)}>
                                            {patient.priority} priority
                                          </Badge>
                                          <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                                        </div>
                                        <div className="flex gap-2">
                                          {patient.status === "waiting" && (
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                              <Button
                                                size="sm"
                                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                                                onClick={() => handleStartService(patient, queueType)}
                                              >
                                                Start Service
                                              </Button>
                                            </motion.div>
                                          )}
                                          {queueType !== "pharmacy" && (
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                              <Button
                                                size="sm"
                                                className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white"
                                                onClick={() => handleMoveToNext(patient, queueType)}
                                              >
                                                <ArrowRight className="h-4 w-4 mr-1" />
                                                Next Stage
                                              </Button>
                                            </motion.div>
                                          )}
                                          {queueType === "pharmacy" && (
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                              <Button
                                                size="sm"
                                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                                                onClick={() => handleRemoveFromQueue(patient, queueType)}
                                              >
                                                Complete
                                              </Button>
                                            </motion.div>
                                          )}
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleRemoveFromQueue(patient, queueType)}
                                          >
                                            <X className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                ))}
              </Tabs>
            </motion.div>
          </div>
        </PageTransition>
      </main>
    </div>
  )
}
