"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
  Menu,
} from "lucide-react"
import Sidebar from "@/components/sidebar"
import { PageTransition } from "@/components/page-transition"
import { useAppContext } from "@/components/app-context"
import { NotificationPanel } from "@/components/notification-panel"

const patientQueue = [
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
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [diagnosis, setDiagnosis] = useState("")
  const [notes, setNotes] = useState("")
  const [selectedMedications, setSelectedMedications] = useState([])
  const [selectedLabTests, setSelectedLabTests] = useState([])
  const [customMedication, setCustomMedication] = useState("")
  const [customLabTest, setCustomLabTest] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { simulateAction, activePatient } = useAppContext()

  // Check if there's an active patient from context
  useEffect(() => {
    if (activePatient) {
      const patient = patientQueue.find((p) => p.id === activePatient.id)
      if (patient) {
        handlePatientSelect(patient)
      }
    }
  }, [activePatient])

  const handlePatientSelect = (patient) => {
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

  const handleToggleMedication = (medication) => {
    if (selectedMedications.includes(medication)) {
      setSelectedMedications(selectedMedications.filter((med) => med !== medication))
    } else {
      setSelectedMedications([...selectedMedications, medication])
    }
  }

  const handleToggleLabTest = (test) => {
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
                  <h1 className="text-3xl font-bold text-gray-900">Consultation</h1>
                  <p className="text-gray-600">Examine patients, diagnose conditions, and prescribe treatments</p>
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto">
                  <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                    <Menu className="h-5 w-5" />
                  </Button>
                  <div className="relative flex-1 lg:flex-none">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search patients..."
                      className="pl-8 w-full lg:w-[250px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <NotificationPanel />
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger
                    value="queue"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                  >
                    Patient Queue
                  </TabsTrigger>
                  <TabsTrigger
                    value="consultation"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                  >
                    Consultation
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
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
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-[#581c87]" />
                            Patients Waiting for Consultation
                          </CardTitle>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {filteredPatients.length} patients
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {filteredPatients.map((patient, index) => (
                            <motion.div
                              key={patient.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1, duration: 0.4 }}
                              className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
                              onClick={() => handlePatientSelect(patient)}
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
                                      <p className="text-sm text-gray-600">
                                        {patient.age} yrs, {patient.gender}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge className={getPriorityColor(patient.priority)}>
                                    {patient.priority} priority
                                  </Badge>
                                  <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                                </div>
                                <Button
                                  className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handlePatientSelect(patient)
                                  }}
                                >
                                  <Stethoscope className="h-4 w-4 mr-2" />
                                  Start Consultation
                                </Button>
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
                      <div className="space-y-6">
                        {/* Patient Info Header */}
                        <Card className="bg-gradient-to-r from-[#581c87]/5 to-[#312e81]/5 border-[#581c87]/20">
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-r from-[#581c87] to-[#312e81] rounded-full flex items-center justify-center text-white font-bold text-xl">
                                  {selectedPatient.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </div>
                                <div>
                                  <h2 className="text-2xl font-bold text-gray-900">{selectedPatient.name}</h2>
                                  <div className="flex flex-wrap gap-4 mt-1">
                                    <p className="text-gray-600">ID: {selectedPatient.id}</p>
                                    <p className="text-gray-600">
                                      {selectedPatient.age} years, {selectedPatient.gender}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <Badge className={getPriorityColor(selectedPatient.priority)}>
                                {selectedPatient.priority} priority
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Patient Information */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <ClipboardList className="h-5 w-5 text-[#581c87]" />
                                Patient Information
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Chief Complaint</h3>
                                <p className="text-gray-900">{selectedPatient.chiefComplaint}</p>
                              </div>

                              <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Vital Signs</h3>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                                    <Activity className="h-4 w-4 text-[#581c87]" />
                                    <div>
                                      <p className="text-xs text-gray-500">Blood Pressure</p>
                                      <p className="font-medium">{selectedPatient.vitalSigns.bloodPressure}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                                    <Heart className="h-4 w-4 text-red-500" />
                                    <div>
                                      <p className="text-xs text-gray-500">Heart Rate</p>
                                      <p className="font-medium">{selectedPatient.vitalSigns.heartRate} bpm</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                                    <Thermometer className="h-4 w-4 text-orange-500" />
                                    <div>
                                      <p className="text-xs text-gray-500">Temperature</p>
                                      <p className="font-medium">{selectedPatient.vitalSigns.temperature} °F</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                                    <Activity className="h-4 w-4 text-blue-500" />
                                    <div>
                                      <p className="text-xs text-gray-500">Respiratory Rate</p>
                                      <p className="font-medium">{selectedPatient.vitalSigns.respiratoryRate} /min</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Diagnosis */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-[#581c87]" />
                                Diagnosis & Notes
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                <Label>Diagnosis</Label>
                                <Select value={diagnosis} onValueChange={setDiagnosis}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select or enter diagnosis" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {commonDiagnoses.map((d) => (
                                      <SelectItem key={d} value={d}>
                                        {d}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label>Clinical Notes</Label>
                                <Textarea
                                  placeholder="Enter detailed notes about the patient's condition..."
                                  value={notes}
                                  onChange={(e) => setNotes(e.target.value)}
                                  rows={5}
                                />
                              </div>
                            </CardContent>
                          </Card>

                          {/* Prescriptions & Lab Tests */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Pill className="h-5 w-5 text-[#581c87]" />
                                Prescriptions & Lab Tests
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                <Label>Medications</Label>
                                <div className="grid grid-cols-1 gap-2 max-h-[150px] overflow-y-auto p-2 border rounded-md">
                                  {commonMedications.map((med) => (
                                    <div key={med} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`med-${med}`}
                                        checked={selectedMedications.includes(med)}
                                        onCheckedChange={() => handleToggleMedication(med)}
                                      />
                                      <label
                                        htmlFor={`med-${med}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                                  />
                                  <Button variant="outline" onClick={handleAddMedication}>
                                    Add
                                  </Button>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>Lab Tests</Label>
                                <div className="grid grid-cols-1 gap-2 max-h-[150px] overflow-y-auto p-2 border rounded-md">
                                  {labTests.map((test) => (
                                    <div key={test} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`test-${test}`}
                                        checked={selectedLabTests.includes(test)}
                                        onCheckedChange={() => handleToggleLabTest(test)}
                                      />
                                      <label
                                        htmlFor={`test-${test}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                                  />
                                  <Button variant="outline" onClick={handleAddLabTest}>
                                    Add
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4">
                          <Button variant="outline" onClick={() => setActiveTab("queue")}>
                            Cancel
                          </Button>
                          <Button
                            className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white"
                            onClick={handleCompleteConsultation}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Complete Consultation
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="p-8 text-center">
                          <Stethoscope className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Patient Selected</h3>
                          <p className="text-gray-500 mb-6">
                            Please select a patient from the queue to begin consultation
                          </p>
                          <Button onClick={() => setActiveTab("queue")}>View Queue</Button>
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
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-[#581c87]" />
                          Patient History
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                          <h3 className="text-lg font-medium mb-2">No patient history available</h3>
                          <p>Select a patient to view their medical history</p>
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
