"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Users,
  Search,
  Stethoscope,
  ClipboardList,
  FileText,
  Activity,
  Heart,
  Thermometer,
  Pill,
  CheckCircle,
  RefreshCw,
} from "lucide-react"
import Sidebar from "@/components/sidebar"
import MobileSidebar from "@/components/mobile-sidebar"
import ScrollToTop from "@/components/scroll-to-top"
import { PageTransition } from "@/components/page-transition"
import { useAppContext } from "@/components/app-context"
import { NotificationPanel } from "@/components/notification-panel"

interface VitalSigns {
  bloodPressure: string
  heartRate: string
  temperature: string
  respiratoryRate: string
  oxygenSaturation: string
}

type Priority = "high" | "medium" | "low"
type Status = "waiting" | "in-progress" | "completed"

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  waitTime: number
  priority: Priority
  status: Status
  vitalSigns: VitalSigns
  chiefComplaint: string
}

const patientQueue: Patient[] = [
  {
    id: "P-1234",
    name: "John Doe",
    age: 45,
    gender: "Male",
    waitTime: 14,
    priority: "high",
    status: "waiting",
    vitalSigns: {
      bloodPressure: "140/90",
      heartRate: "88",
      temperature: "99.1",
      respiratoryRate: "18",
      oxygenSaturation: "97%",
    },
    chiefComplaint: "Chest pain and shortness of breath for the past 2 days",
  },
  {
    id: "P-1235",
    name: "Jane Smith",
    age: 32,
    gender: "Female",
    waitTime: 22,
    priority: "medium",
    status: "in-progress",
    vitalSigns: {
      bloodPressure: "120/80",
      heartRate: "72",
      temperature: "98.6",
      respiratoryRate: "16",
      oxygenSaturation: "99%",
    },
    chiefComplaint: "Persistent headache for 3 days, not responding to over-the-counter medication",
  },
  {
    id: "P-1236",
    name: "Bob Johnson",
    age: 58,
    gender: "Male",
    waitTime: 9,
    priority: "low",
    status: "waiting",
    vitalSigns: {
      bloodPressure: "135/85",
      heartRate: "76",
      temperature: "98.4",
      respiratoryRate: "17",
      oxygenSaturation: "98%",
    },
    chiefComplaint: "Lower back pain after lifting heavy objects",
  },
]

const commonDiagnoses = [
  "Hypertension",
  "Type 2 Diabetes",
  "Upper Respiratory Infection",
  "Gastroenteritis",
  "Urinary Tract Infection",
  "Migraine",
  "Anxiety Disorder",
  "Osteoarthritis",
  "Asthma",
  "Allergic Rhinitis",
]

const commonMedications = [
  "Acetaminophen 500mg",
  "Ibuprofen 400mg",
  "Amoxicillin 500mg",
  "Lisinopril 10mg",
  "Metformin 500mg",
  "Atorvastatin 20mg",
  "Albuterol Inhaler",
  "Omeprazole 20mg",
  "Loratadine 10mg",
  "Sertraline 50mg",
]

const labTests = [
  "Complete Blood Count (CBC)",
  "Basic Metabolic Panel",
  "Comprehensive Metabolic Panel",
  "Lipid Panel",
  "Thyroid Function Tests",
  "Urinalysis",
  "HbA1c",
  "Liver Function Tests",
  "Chest X-Ray",
  "Electrocardiogram (ECG)",
]

export default function Consultation() {
  const [activeTab, setActiveTab] = useState("queue")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [diagnosis, setDiagnosis] = useState("")
  const [notes, setNotes] = useState("")
  const [selectedMedications, setSelectedMedications] = useState<string[]>([])
  const [selectedLabTests, setSelectedLabTests] = useState<string[]>([])
  const [customMedication, setCustomMedication] = useState("")
  const [customLabTest, setCustomLabTest] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const { simulateAction, activePatient } = useAppContext()

  // Check if there's an active patient from context
  useEffect(() => {
    if (activePatient) {
      const patient = patientQueue.find((p) => p.id === activePatient.id)
      if (patient) {
        handlePatientSelect({
          ...patient,
          priority: patient.priority,
          status: patient.status,
        })
      }
    }
  }, [activePatient])

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setRefreshing(false)
  }

  const handlePatientSelect = (patient: Patient) => {
    simulateAction(`Loading ${patient.name}'s medical record`, 800).then(() => {
      setSelectedPatient(patient)
      setActiveTab("consultation")

      // Reset form fields
      setDiagnosis("")
      setNotes("")
      setSelectedMedications([])
      setSelectedLabTests([])
    })
  }

  const handleAddMedication = () => {
    if (customMedication.trim()) {
      setSelectedMedications([...selectedMedications, customMedication])
      setCustomMedication("")
    }
  }

  const handleAddLabTest = () => {
    if (customLabTest.trim()) {
      setSelectedLabTests([...selectedLabTests, customLabTest])
      setCustomLabTest("")
    }
  }

  const handleToggleMedication = (medication: string) => {
    if (selectedMedications.includes(medication)) {
      setSelectedMedications(selectedMedications.filter((med) => med !== medication))
    } else {
      setSelectedMedications([...selectedMedications, medication])
    }
  }

  const handleToggleLabTest = (test: string) => {
    if (selectedLabTests.includes(test)) {
      setSelectedLabTests(selectedLabTests.filter((t) => t !== test))
    } else {
      setSelectedLabTests([...selectedLabTests, test])
    }
  }

  const handleCompleteConsultation = () => {
    if (!diagnosis) {
      alert("Please enter a diagnosis before completing the consultation.")
      return
    }

    simulateAction("Completing consultation and updating patient record", 1200).then(() => {
      // In a real app, this would save the consultation data

      // Reset form and go back to queue
      setDiagnosis("")
      setNotes("")
      setSelectedMedications([])
      setSelectedLabTests([])
      setSelectedPatient(null)
      setActiveTab("queue")
    })
  }

  const filteredPatients = patientQueue.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getPriorityColor = (priority: Priority) => {
    const colorMap: Record<Priority, string> = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-green-100 text-green-800 border-green-200",
    }
    return colorMap[priority]
  }

  const getStatusColor = (status: Status) => {
    const colorMap: Record<Status, string> = {
      "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      waiting: "bg-gray-100 text-gray-800 border-gray-200",
    }
    return colorMap[status]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <MobileSidebar />
      <ScrollToTop />

      {/* Main Content Area */}
      <main className="lg:ml-64 pt-20 lg:pt-8 px-3 sm:px-4 lg:px-8 pb-6">
        <PageTransition>
          <div className="p-3 sm:p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              {/* Header with same design as Triage */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col space-y-4 mb-6 sm:mb-8"
              >
                <div className="text-center lg:text-left">
                  <motion.h1
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center lg:justify-start gap-2 sm:gap-3"
                    animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                    transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <motion.div
                      className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <Stethoscope className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </motion.div>
                    Consultation
                  </motion.h1>
                  <motion.p
                    className="text-sm sm:text-base text-gray-600"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  >
                    Examine patients, diagnose conditions, and prescribe treatments
                  </motion.p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                  <div className="relative flex-1 lg:flex-none w-full sm:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search patients..."
                      className="pl-8 w-full lg:w-[250px] bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefresh}
                      disabled={refreshing}
                      className="w-full sm:w-auto bg-white/80 backdrop-blur-sm hover:bg-white text-sm sm:text-base"
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
                  <div className="hidden lg:block">
                    <NotificationPanel />
                  </div>
                </div>
              </motion.div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-6 sm:mb-8 h-auto">
                  <TabsTrigger
                    value="queue"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white text-xs sm:text-sm py-2 sm:py-3"
                  >
                    Patient Queue
                  </TabsTrigger>
                  <TabsTrigger
                    value="consultation"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white text-xs sm:text-sm py-2 sm:py-3"
                  >
                    Consultation
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white text-xs sm:text-sm py-2 sm:py-3"
                  >
                    Patient History
                  </TabsTrigger>
                </TabsList>

                {/* Patient Queue */}
                <TabsContent value="queue">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-[#581c87]" />
                            Patients Waiting for Consultation
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className="bg-purple-50 text-purple-700 border-purple-200 text-xs sm:text-sm"
                          >
                            {filteredPatients.length} patients
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6 pt-0">
                        <div className="space-y-3 sm:space-y-4">
                          {filteredPatients.map((patient, index) => (
                            <motion.div
                              key={patient.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1, duration: 0.4 }}
                              whileHover={{ scale: 1.01, y: -2 }}
                              className="p-4 sm:p-6 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer bg-gray-50/80 hover:bg-gray-100/80"
                              onClick={() => handlePatientSelect(patient)}
                            >
                              <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 gap-4">
                                <div className="flex items-start gap-3 sm:gap-4">
                                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#581c87] to-[#312e81] rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                                    {patient.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{patient.name}</h3>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      <p className="text-xs sm:text-sm text-gray-600">ID: {patient.id}</p>
                                      <p className="text-xs sm:text-sm text-gray-600">
                                        {patient.age} yrs, {patient.gender}
                                      </p>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                                      {patient.chiefComplaint}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                                  <div className="flex flex-wrap gap-2">
                                    <Badge className={getPriorityColor(patient.priority)} variant="outline">
                                      <span className="text-xs sm:text-sm">{patient.priority} priority</span>
                                    </Badge>
                                    <Badge className={getStatusColor(patient.status)} variant="outline">
                                      <span className="text-xs sm:text-sm">{patient.status}</span>
                                    </Badge>
                                  </div>
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full sm:w-auto"
                                  >
                                    <Button
                                      className="w-full sm:w-auto bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white text-xs sm:text-sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handlePatientSelect(patient)
                                      }}
                                    >
                                      <Stethoscope className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                      Start Consultation
                                    </Button>
                                  </motion.div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Consultation */}
                <TabsContent value="consultation">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {selectedPatient ? (
                      <div className="space-y-4 sm:space-y-6">
                        {/* Patient Info Header */}
                        <Card className="bg-gradient-to-r from-[#581c87]/5 to-[#312e81]/5 border-[#581c87]/20">
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-[#581c87] to-[#312e81] rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                                  {selectedPatient.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </div>
                                <div>
                                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                                    {selectedPatient.name}
                                  </h2>
                                  <div className="flex flex-wrap gap-2 sm:gap-4 mt-1">
                                    <p className="text-xs sm:text-sm text-gray-600">ID: {selectedPatient.id}</p>
                                    <p className="text-xs sm:text-sm text-gray-600">
                                      {selectedPatient.age} years, {selectedPatient.gender}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <Badge className={getPriorityColor(selectedPatient.priority)} variant="outline">
                                <span className="text-xs sm:text-sm">{selectedPatient.priority} priority</span>
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                          {/* Patient Information */}
                          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader className="p-4 sm:p-6">
                              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-[#581c87]" />
                                Patient Information
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                              <div>
                                <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Chief Complaint</h3>
                                <p className="text-gray-900 text-sm sm:text-base">{selectedPatient.chiefComplaint}</p>
                              </div>

                              <div>
                                <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">Vital Signs</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                                    <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-[#581c87]" />
                                    <div>
                                      <p className="text-xs text-gray-500">Blood Pressure</p>
                                      <p className="font-medium text-xs sm:text-sm">
                                        {selectedPatient.vitalSigns.bloodPressure}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                                    <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                                    <div>
                                      <p className="text-xs text-gray-500">Heart Rate</p>
                                      <p className="font-medium text-xs sm:text-sm">
                                        {selectedPatient.vitalSigns.heartRate} bpm
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                                    <Thermometer className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                                    <div>
                                      <p className="text-xs text-gray-500">Temperature</p>
                                      <p className="font-medium text-xs sm:text-sm">
                                        {selectedPatient.vitalSigns.temperature} °F
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                                    <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                                    <div>
                                      <p className="text-xs text-gray-500">Respiratory Rate</p>
                                      <p className="font-medium text-xs sm:text-sm">
                                        {selectedPatient.vitalSigns.respiratoryRate} /min
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Diagnosis */}
                          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader className="p-4 sm:p-6">
                              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-[#581c87]" />
                                Diagnosis & Notes
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                              <div className="space-y-2">
                                <Label className="text-xs sm:text-sm">Diagnosis</Label>
                                <Select value={diagnosis} onValueChange={setDiagnosis}>
                                  <SelectTrigger className="bg-white/80 backdrop-blur-sm text-xs sm:text-sm">
                                    <SelectValue placeholder="Select or enter diagnosis" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {commonDiagnoses.map((d) => (
                                      <SelectItem key={d} value={d} className="text-xs sm:text-sm">
                                        {d}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-xs sm:text-sm">Clinical Notes</Label>
                                <Textarea
                                  placeholder="Enter detailed notes about the patient's condition..."
                                  value={notes}
                                  onChange={(e) => setNotes(e.target.value)}
                                  rows={4}
                                  className="bg-white/80 backdrop-blur-sm text-xs sm:text-sm resize-none"
                                />
                              </div>
                            </CardContent>
                          </Card>

                          {/* Prescriptions & Lab Tests */}
                          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader className="p-4 sm:p-6">
                              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                <Pill className="h-4 w-4 sm:h-5 sm:w-5 text-[#581c87]" />
                                Prescriptions & Lab Tests
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                              <div className="space-y-2">
                                <Label className="text-xs sm:text-sm">Medications</Label>
                                <div className="grid grid-cols-1 gap-2 max-h-[120px] sm:max-h-[150px] overflow-y-auto p-2 border rounded-md bg-white/80 backdrop-blur-sm">
                                  {commonMedications.map((med) => (
                                    <div key={med} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`med-${med}`}
                                        checked={selectedMedications.includes(med)}
                                        onCheckedChange={() => handleToggleMedication(med)}
                                      />
                                      <label
                                        htmlFor={`med-${med}`}
                                        className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      >
                                        {med}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex gap-2 mt-2">
                                  <Input
                                    placeholder="Add custom medication..."
                                    value={customMedication}
                                    onChange={(e) => setCustomMedication(e.target.value)}
                                    className="bg-white/80 backdrop-blur-sm text-xs sm:text-sm"
                                  />
                                  <Button
                                    variant="outline"
                                    onClick={handleAddMedication}
                                    size="sm"
                                    className="text-xs sm:text-sm"
                                  >
                                    Add
                                  </Button>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-xs sm:text-sm">Lab Tests</Label>
                                <div className="grid grid-cols-1 gap-2 max-h-[120px] sm:max-h-[150px] overflow-y-auto p-2 border rounded-md bg-white/80 backdrop-blur-sm">
                                  {labTests.map((test) => (
                                    <div key={test} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`test-${test}`}
                                        checked={selectedLabTests.includes(test)}
                                        onCheckedChange={() => handleToggleLabTest(test)}
                                      />
                                      <label
                                        htmlFor={`test-${test}`}
                                        className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      >
                                        {test}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex gap-2 mt-2">
                                  <Input
                                    placeholder="Add custom lab test..."
                                    value={customLabTest}
                                    onChange={(e) => setCustomLabTest(e.target.value)}
                                    className="bg-white/80 backdrop-blur-sm text-xs sm:text-sm"
                                  />
                                  <Button
                                    variant="outline"
                                    onClick={handleAddLabTest}
                                    size="sm"
                                    className="text-xs sm:text-sm"
                                  >
                                    Add
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                          <Button
                            variant="outline"
                            onClick={() => setActiveTab("queue")}
                            className="text-xs sm:text-sm"
                          >
                            Cancel
                          </Button>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full sm:w-auto"
                          >
                            <Button
                              className="w-full sm:w-auto bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white text-xs sm:text-sm"
                              onClick={handleCompleteConsultation}
                            >
                              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                              Complete Consultation
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    ) : (
                      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardContent className="p-6 sm:p-8 text-center">
                          <Stethoscope className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No Patient Selected</h3>
                          <p className="text-gray-500 mb-6 text-sm sm:text-base">
                            Please select a patient from the queue to begin consultation
                          </p>
                          <Button onClick={() => setActiveTab("queue")} className="text-sm sm:text-base">
                            View Queue
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                </TabsContent>

                {/* Patient History */}
                <TabsContent value="history">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader className="p-4 sm:p-6">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                          <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-[#581c87]" />
                          Patient History
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6 pt-0">
                        <div className="text-center py-6 sm:py-8 text-gray-500">
                          <FileText className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-gray-300 mb-4" />
                          <h3 className="text-base sm:text-lg font-medium mb-2">No patient history available</h3>
                          <p className="text-sm sm:text-base">Select a patient to view their medical history</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </PageTransition>
      </main>
    </div>
  )
}
