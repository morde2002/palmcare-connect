"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Clock, Search, ArrowRight, X, Menu } from "lucide-react"
import Sidebar from "@/components/sidebar"
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
  const { simulateAction } = useAppContext()

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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

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

      <main className="flex-1 lg:ml-64 min-h-screen overflow-y-auto">
        <PageTransition>
          <div className="p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Patient Queue</h1>
                  <p className="text-gray-600">Manage and track patients through different service stages</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-auto">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                      <Menu className="h-5 w-5" />
                    </Button>
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search patients..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="w-full lg:w-auto">
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger className="w-full lg:w-[180px]">
                        <SelectValue placeholder="Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <NotificationPanel />
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger
                    value="triage"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                  >
                    Triage
                  </TabsTrigger>
                  <TabsTrigger
                    value="consultation"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                  >
                    Consultation
                  </TabsTrigger>
                  <TabsTrigger
                    value="laboratory"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                  >
                    Laboratory
                  </TabsTrigger>
                  <TabsTrigger
                    value="pharmacy"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                  >
                    Pharmacy
                  </TabsTrigger>
                </TabsList>

                {/* Triage Queue */}
                <TabsContent value="triage">
                  <QueueContent
                    title="Triage Queue"
                    icon={<Users className="h-5 w-5 text-[#581c87]" />}
                    patients={filteredQueue("triage")}
                    onMoveToNext={(patient) => handleMoveToNext(patient, "triage")}
                    onRemove={(patient) => handleRemoveFromQueue(patient, "triage")}
                    onStartService={(patient) => handleStartService(patient, "triage")}
                    nextStage="Consultation"
                    getPriorityColor={getPriorityColor}
                    getStatusColor={getStatusColor}
                  />
                </TabsContent>

                {/* Consultation Queue */}
                <TabsContent value="consultation">
                  <QueueContent
                    title="Consultation Queue"
                    icon={<Users className="h-5 w-5 text-[#581c87]" />}
                    patients={filteredQueue("consultation")}
                    onMoveToNext={(patient) => handleMoveToNext(patient, "consultation")}
                    onRemove={(patient) => handleRemoveFromQueue(patient, "consultation")}
                    onStartService={(patient) => handleStartService(patient, "consultation")}
                    nextStage="Laboratory"
                    getPriorityColor={getPriorityColor}
                    getStatusColor={getStatusColor}
                  />
                </TabsContent>

                {/* Laboratory Queue */}
                <TabsContent value="laboratory">
                  <QueueContent
                    title="Laboratory Queue"
                    icon={<Users className="h-5 w-5 text-[#581c87]" />}
                    patients={filteredQueue("laboratory")}
                    onMoveToNext={(patient) => handleMoveToNext(patient, "laboratory")}
                    onRemove={(patient) => handleRemoveFromQueue(patient, "laboratory")}
                    onStartService={(patient) => handleStartService(patient, "laboratory")}
                    nextStage="Pharmacy"
                    getPriorityColor={getPriorityColor}
                    getStatusColor={getStatusColor}
                  />
                </TabsContent>

                {/* Pharmacy Queue */}
                <TabsContent value="pharmacy">
                  <QueueContent
                    title="Pharmacy Queue"
                    icon={<Users className="h-5 w-5 text-[#581c87]" />}
                    patients={filteredQueue("pharmacy")}
                    onMoveToNext={(patient) => handleMoveToNext(patient, "pharmacy")}
                    onRemove={(patient) => handleRemoveFromQueue(patient, "pharmacy")}
                    onStartService={(patient) => handleStartService(patient, "pharmacy")}
                    nextStage="Complete"
                    getPriorityColor={getPriorityColor}
                    getStatusColor={getStatusColor}
                    isLastStage={true}
                  />
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </PageTransition>
      </main>
    </div>
  )
}

function QueueContent({
  title,
  icon,
  patients,
  onMoveToNext,
  onRemove,
  onStartService,
  nextStage,
  getPriorityColor,
  getStatusColor,
  isLastStage = false,
}) {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {icon}
              {title}
            </CardTitle>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              {patients.length} patients
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {patients.length > 0 ? (
            <motion.div
              className="space-y-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {patients.map((patient, index) => (
                <motion.div
                  key={patient.id}
                  variants={{
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
                  }}
                  className="p-4 border rounded-lg hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#581c87] to-[#312e81] rounded-full flex items-center justify-center text-white font-semibold">
                        {patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <p className="text-sm text-gray-600">ID: {patient.id}</p>
                          <p className="text-sm text-gray-600">Dept: {patient.department}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={getPriorityColor(patient.priority)}>{patient.priority} priority</Badge>
                      <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                      <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span>{patient.waitTime}m</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {patient.status === "waiting" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                          onClick={() => onStartService(patient)}
                        >
                          Start Service
                        </Button>
                      )}
                      {patient.status === "in-progress" && (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white"
                          onClick={() => onMoveToNext(patient)}
                        >
                          {isLastStage ? "Complete" : `Send to ${nextStage}`}
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-200 hover:bg-red-50 hover:text-red-700"
                        onClick={() => onRemove(patient)}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">No patients in queue</h3>
              <p>Patients will appear here when they are ready for this stage</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
