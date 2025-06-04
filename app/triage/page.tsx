"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertTriangle,
  Clock,
  Heart,
  Thermometer,
  Activity,
  Stethoscope,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Timer,
  Zap,
} from "lucide-react"
import Sidebar from "@/components/sidebar"
import MobileSidebar from "@/components/mobile-sidebar"

export default function Triage() {
  const [activeTab, setActiveTab] = useState("queue")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPriority, setFilterPriority] = useState("all")

  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "John Doe",
      age: 45,
      gender: "Male",
      arrivalTime: "09:30 AM",
      waitTime: "25 min",
      priority: "high",
      chiefComplaint: "Chest pain and shortness of breath",
      vitals: { bp: "140/90", hr: "95", temp: "98.6°F", spo2: "96%" },
      status: "waiting",
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 32,
      gender: "Female",
      arrivalTime: "09:45 AM",
      waitTime: "10 min",
      priority: "medium",
      chiefComplaint: "Severe headache and nausea",
      vitals: { bp: "120/80", hr: "78", temp: "99.2°F", spo2: "98%" },
      status: "waiting",
    },
    {
      id: 3,
      name: "Mike Johnson",
      age: 28,
      gender: "Male",
      arrivalTime: "10:00 AM",
      waitTime: "5 min",
      priority: "low",
      chiefComplaint: "Minor cut on hand",
      vitals: { bp: "118/75", hr: "72", temp: "98.4°F", spo2: "99%" },
      status: "waiting",
    },
  ])

  const [assessmentData, setAssessmentData] = useState({
    chiefComplaint: "",
    painScale: "",
    symptoms: "",
    allergies: "",
    medications: "",
    medicalHistory: "",
    vitals: {
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      oxygenSaturation: "",
      respiratoryRate: "",
    },
    priority: "",
    notes: "",
  })

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setRefreshing(false)
  }

  const handleAssessment = (patientId) => {
    setSelectedPatient(patients.find((p) => p.id === patientId))
    setActiveTab("assessment")
  }

  const handleCompleteAssessment = () => {
    if (selectedPatient) {
      setPatients((prev) =>
        prev.map((p) =>
          p.id === selectedPatient.id ? { ...p, status: "assessed", priority: assessmentData.priority } : p,
        ),
      )
      setSelectedPatient(null)
      setAssessmentData({
        chiefComplaint: "",
        painScale: "",
        symptoms: "",
        allergies: "",
        medications: "",
        medicalHistory: "",
        vitals: {
          bloodPressure: "",
          heartRate: "",
          temperature: "",
          oxygenSaturation: "",
          respiratoryRate: "",
        },
        priority: "",
        notes: "",
      })
      setActiveTab("queue")
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500 text-white"
      case "medium":
        return "bg-yellow-500 text-white"
      case "low":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "medium":
        return <AlertCircle className="h-4 w-4" />
      case "low":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === "all" || patient.priority === filterPriority
    return matchesSearch && matchesPriority
  })

  const stats = [
    {
      title: "Total in Queue",
      value: patients.filter((p) => p.status === "waiting").length.toString(),
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "High Priority",
      value: patients.filter((p) => p.priority === "high").length.toString(),
      icon: AlertTriangle,
      color: "from-red-500 to-red-600",
    },
    {
      title: "Average Wait",
      value: "18 min",
      icon: Timer,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      title: "Assessed Today",
      value: patients.filter((p) => p.status === "assessed").length.toString(),
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Include both sidebars */}
      <Sidebar />
      <MobileSidebar />
      {/* Main Content - Responsive padding for both mobile and desktop */}
      <div className="lg:ml-64 p-4 lg:p-8 pt-16 lg:pt-8">
        {/* Header */}
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
                className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 shadow-lg"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Activity className="h-8 w-8 text-white" />
              </motion.div>
              Triage
            </motion.h1>
            <motion.p
              className="text-gray-600"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              Patient assessment and prioritization
            </motion.p>
          </div>

          <div className="flex items-center gap-4 mt-4 lg:mt-0">
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
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <motion.p
                        className="text-3xl font-bold text-gray-900"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        {stat.value}
                      </motion.p>
                    </div>
                    <motion.div
                      className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <stat.icon className="h-6 w-6 text-white" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                  <TabsTrigger value="queue" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Patient Queue</span>
                    <span className="sm:hidden">Queue</span>
                  </TabsTrigger>
                  <TabsTrigger value="assessment" className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" />
                    <span className="hidden sm:inline">Assessment</span>
                    <span className="sm:hidden">Assess</span>
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Completed</span>
                    <span className="sm:hidden">Done</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="queue" className="mt-6">
                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search patients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/80 backdrop-blur-sm"
                      />
                    </div>
                    <Select value={filterPriority} onValueChange={setFilterPriority}>
                      <SelectTrigger className="w-full sm:w-[180px] bg-white/80 backdrop-blur-sm">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter by priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="low">Low Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Patient List */}
                  <div className="space-y-4">
                    <AnimatePresence>
                      {filteredPatients
                        .filter((p) => p.status === "waiting")
                        .map((patient, index) => (
                          <motion.div
                            key={patient.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            whileHover={{ scale: 1.01, y: -2 }}
                            className="p-6 rounded-lg bg-gray-50/80 hover:bg-gray-100/80 transition-all duration-300 border border-gray-200"
                          >
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                                  <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                                  <div className="flex items-center gap-2">
                                    <Badge className={getPriorityColor(patient.priority)}>
                                      {getPriorityIcon(patient.priority)}
                                      <span className="ml-1 capitalize">{patient.priority}</span>
                                    </Badge>
                                    <Badge variant="outline" className="bg-white/80">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {patient.waitTime}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                  <div>
                                    <p className="text-sm text-gray-600">Age/Gender</p>
                                    <p className="font-medium">
                                      {patient.age} / {patient.gender}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Arrival Time</p>
                                    <p className="font-medium">{patient.arrivalTime}</p>
                                  </div>
                                  <div className="sm:col-span-2">
                                    <p className="text-sm text-gray-600">Chief Complaint</p>
                                    <p className="font-medium">{patient.chiefComplaint}</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Heart className="h-4 w-4 text-red-500" />
                                    <span>BP: {patient.vitals.bp}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-blue-500" />
                                    <span>HR: {patient.vitals.hr}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Thermometer className="h-4 w-4 text-orange-500" />
                                    <span>Temp: {patient.vitals.temp}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-green-500" />
                                    <span>SpO2: {patient.vitals.spo2}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-2">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    onClick={() => handleAssessment(patient.id)}
                                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg"
                                  >
                                    <Stethoscope className="h-4 w-4 mr-2" />
                                    Assess
                                  </Button>
                                </motion.div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredPatients.filter((p) => p.status === "waiting").length === 0 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No patients in queue matching your criteria</p>
                      </motion.div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="assessment" className="mt-6">
                  {selectedPatient ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      {/* Patient Info Header */}
                      <div className="p-6 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                        <h3 className="text-xl font-bold mb-2">Assessing: {selectedPatient.name}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div>Age: {selectedPatient.age}</div>
                          <div>Gender: {selectedPatient.gender}</div>
                          <div>Arrival: {selectedPatient.arrivalTime}</div>
                        </div>
                      </div>

                      {/* Assessment Form */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                          <div>
                            <Label htmlFor="chiefComplaint">Chief Complaint</Label>
                            <Textarea
                              id="chiefComplaint"
                              value={assessmentData.chiefComplaint}
                              onChange={(e) => setAssessmentData({ ...assessmentData, chiefComplaint: e.target.value })}
                              placeholder="Patient's primary concern..."
                              className="bg-white/80 backdrop-blur-sm"
                            />
                          </div>

                          <div>
                            <Label htmlFor="painScale">Pain Scale (0-10)</Label>
                            <Select
                              value={assessmentData.painScale}
                              onValueChange={(value) => setAssessmentData({ ...assessmentData, painScale: value })}
                            >
                              <SelectTrigger className="bg-white/80 backdrop-blur-sm">
                                <SelectValue placeholder="Select pain level" />
                              </SelectTrigger>
                              <SelectContent>
                                {[...Array(11)].map((_, i) => (
                                  <SelectItem key={i} value={i.toString()}>
                                    {i} - {i === 0 ? "No pain" : i <= 3 ? "Mild" : i <= 6 ? "Moderate" : "Severe"}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="symptoms">Current Symptoms</Label>
                            <Textarea
                              id="symptoms"
                              value={assessmentData.symptoms}
                              onChange={(e) => setAssessmentData({ ...assessmentData, symptoms: e.target.value })}
                              placeholder="List all current symptoms..."
                              className="bg-white/80 backdrop-blur-sm"
                            />
                          </div>

                          <div>
                            <Label htmlFor="allergies">Known Allergies</Label>
                            <Input
                              id="allergies"
                              value={assessmentData.allergies}
                              onChange={(e) => setAssessmentData({ ...assessmentData, allergies: e.target.value })}
                              placeholder="List any known allergies..."
                              className="bg-white/80 backdrop-blur-sm"
                            />
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                          <div>
                            <Label>Vital Signs</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                              <div>
                                <Label htmlFor="bp" className="text-sm">
                                  Blood Pressure
                                </Label>
                                <Input
                                  id="bp"
                                  value={assessmentData.vitals.bloodPressure}
                                  onChange={(e) =>
                                    setAssessmentData({
                                      ...assessmentData,
                                      vitals: { ...assessmentData.vitals, bloodPressure: e.target.value },
                                    })
                                  }
                                  placeholder="120/80"
                                  className="bg-white/80 backdrop-blur-sm"
                                />
                              </div>
                              <div>
                                <Label htmlFor="hr" className="text-sm">
                                  Heart Rate
                                </Label>
                                <Input
                                  id="hr"
                                  value={assessmentData.vitals.heartRate}
                                  onChange={(e) =>
                                    setAssessmentData({
                                      ...assessmentData,
                                      vitals: { ...assessmentData.vitals, heartRate: e.target.value },
                                    })
                                  }
                                  placeholder="72 bpm"
                                  className="bg-white/80 backdrop-blur-sm"
                                />
                              </div>
                              <div>
                                <Label htmlFor="temp" className="text-sm">
                                  Temperature
                                </Label>
                                <Input
                                  id="temp"
                                  value={assessmentData.vitals.temperature}
                                  onChange={(e) =>
                                    setAssessmentData({
                                      ...assessmentData,
                                      vitals: { ...assessmentData.vitals, temperature: e.target.value },
                                    })
                                  }
                                  placeholder="98.6°F"
                                  className="bg-white/80 backdrop-blur-sm"
                                />
                              </div>
                              <div>
                                <Label htmlFor="spo2" className="text-sm">
                                  Oxygen Saturation
                                </Label>
                                <Input
                                  id="spo2"
                                  value={assessmentData.vitals.oxygenSaturation}
                                  onChange={(e) =>
                                    setAssessmentData({
                                      ...assessmentData,
                                      vitals: { ...assessmentData.vitals, oxygenSaturation: e.target.value },
                                    })
                                  }
                                  placeholder="98%"
                                  className="bg-white/80 backdrop-blur-sm"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="priority">Priority Level</Label>
                            <Select
                              value={assessmentData.priority}
                              onValueChange={(value) => setAssessmentData({ ...assessmentData, priority: value })}
                            >
                              <SelectTrigger className="bg-white/80 backdrop-blur-sm">
                                <SelectValue placeholder="Assign priority level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">High Priority - Immediate attention</SelectItem>
                                <SelectItem value="medium">Medium Priority - Urgent care</SelectItem>
                                <SelectItem value="low">Low Priority - Standard care</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="notes">Assessment Notes</Label>
                            <Textarea
                              id="notes"
                              value={assessmentData.notes}
                              onChange={(e) => setAssessmentData({ ...assessmentData, notes: e.target.value })}
                              placeholder="Additional notes and observations..."
                              className="bg-white/80 backdrop-blur-sm"
                              rows={4}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                          <Button
                            onClick={handleCompleteAssessment}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                            disabled={!assessmentData.priority}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Complete Assessment
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedPatient(null)
                              setActiveTab("queue")
                            }}
                            className="bg-white/80 backdrop-blur-sm hover:bg-white"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                      <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Select a patient from the queue to begin assessment</p>
                    </motion.div>
                  )}
                </TabsContent>

                <TabsContent value="completed" className="mt-6">
                  <div className="space-y-4">
                    <AnimatePresence>
                      {patients
                        .filter((p) => p.status === "assessed")
                        .map((patient, index) => (
                          <motion.div
                            key={patient.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="p-6 rounded-lg bg-green-50/80 border border-green-200"
                          >
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                                  <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                                  <div className="flex items-center gap-2">
                                    <Badge className={getPriorityColor(patient.priority)}>
                                      {getPriorityIcon(patient.priority)}
                                      <span className="ml-1 capitalize">{patient.priority}</span>
                                    </Badge>
                                    <Badge className="bg-green-500 text-white">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Assessed
                                    </Badge>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-600">Age/Gender</p>
                                    <p className="font-medium">
                                      {patient.age} / {patient.gender}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Assessment Time</p>
                                    <p className="font-medium">{patient.arrivalTime}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Chief Complaint</p>
                                    <p className="font-medium">{patient.chiefComplaint}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-white/80 backdrop-blur-sm hover:bg-white"
                                  >
                                    View Details
                                  </Button>
                                </motion.div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </AnimatePresence>

                    {patients.filter((p) => p.status === "assessed").length === 0 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                        <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No completed assessments today</p>
                      </motion.div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
