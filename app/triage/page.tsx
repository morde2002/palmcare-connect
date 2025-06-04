"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, AlertTriangle, Heart, Thermometer, Weight, User, Search, Plus, CheckCircle } from "lucide-react"
import Sidebar from "@/components/sidebar"

const triageQueue = [
  { id: "P-1234", name: "John Doe", arrivalTime: "09:15 AM", priority: "high", status: "waiting" },
  { id: "P-1235", name: "Jane Smith", arrivalTime: "09:22 AM", priority: "medium", status: "in-progress" },
  { id: "P-1236", name: "Bob Johnson", arrivalTime: "09:30 AM", priority: "low", status: "waiting" },
  { id: "P-1237", name: "Alice Brown", arrivalTime: "09:45 AM", priority: "medium", status: "waiting" },
]

const vitalSigns = {
  bloodPressure: { systolic: "", diastolic: "" },
  heartRate: "",
  temperature: "",
  respiratoryRate: "",
  oxygenSaturation: "",
  weight: "",
  height: "",
}

export default function Triage() {
  const [activeTab, setActiveTab] = useState("queue")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [vitals, setVitals] = useState(vitalSigns)
  const [chiefComplaint, setChiefComplaint] = useState("")
  const [painScale, setPainScale] = useState("")
  const [triagePriority, setTriagePriority] = useState("")

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient)
    setActiveTab("assessment")
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen overflow-y-auto">
        <div className="p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Triage</h1>
                <p className="text-gray-600">Assess and prioritize patient care based on urgency</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="hover:bg-gray-50">
                  <Search className="h-4 w-4 mr-2" />
                  Find Patient
                </Button>
                <Button className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  New Assessment
                </Button>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger
                  value="queue"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                >
                  Triage Queue
                </TabsTrigger>
                <TabsTrigger
                  value="assessment"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                >
                  Patient Assessment
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                >
                  Completed
                </TabsTrigger>
              </TabsList>

              {/* Triage Queue */}
              <TabsContent value="queue">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-[#581c87]" />
                        Patients Waiting for Triage
                      </CardTitle>
                      <p className="text-sm text-gray-600">Click on a patient to begin assessment</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {triageQueue.map((patient, index) => (
                          <motion.div
                            key={patient.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
                            onClick={() => handlePatientSelect(patient)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-[#581c87] to-[#312e81] rounded-full flex items-center justify-center text-white font-semibold">
                                  {patient.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                                  <p className="text-sm text-gray-600">ID: {patient.id}</p>
                                  <p className="text-sm text-gray-500">Arrived: {patient.arrivalTime}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge className={getPriorityColor(patient.priority)}>
                                  {patient.priority} priority
                                </Badge>
                                <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white"
                                >
                                  Start Triage
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Patient Assessment */}
              <TabsContent value="assessment">
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
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-[#581c87] to-[#312e81] rounded-full flex items-center justify-center text-white font-bold text-xl">
                              {selectedPatient.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold text-gray-900">{selectedPatient.name}</h2>
                              <p className="text-gray-600">Patient ID: {selectedPatient.id}</p>
                              <p className="text-sm text-gray-500">Arrived: {selectedPatient.arrivalTime}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Vital Signs */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Heart className="h-5 w-5 text-red-500" />
                              Vital Signs
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                  <Activity className="h-4 w-4 text-[#581c87]" />
                                  Blood Pressure
                                </Label>
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Systolic"
                                    value={vitals.bloodPressure.systolic}
                                    onChange={(e) =>
                                      setVitals({
                                        ...vitals,
                                        bloodPressure: { ...vitals.bloodPressure, systolic: e.target.value },
                                      })
                                    }
                                  />
                                  <Input
                                    placeholder="Diastolic"
                                    value={vitals.bloodPressure.diastolic}
                                    onChange={(e) =>
                                      setVitals({
                                        ...vitals,
                                        bloodPressure: { ...vitals.bloodPressure, diastolic: e.target.value },
                                      })
                                    }
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                  <Heart className="h-4 w-4 text-red-500" />
                                  Heart Rate (bpm)
                                </Label>
                                <Input
                                  placeholder="72"
                                  value={vitals.heartRate}
                                  onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                  <Thermometer className="h-4 w-4 text-orange-500" />
                                  Temperature (°F)
                                </Label>
                                <Input
                                  placeholder="98.6"
                                  value={vitals.temperature}
                                  onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Respiratory Rate</Label>
                                <Input
                                  placeholder="16"
                                  value={vitals.respiratoryRate}
                                  onChange={(e) => setVitals({ ...vitals, respiratoryRate: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>O2 Saturation (%)</Label>
                                <Input
                                  placeholder="98"
                                  value={vitals.oxygenSaturation}
                                  onChange={(e) => setVitals({ ...vitals, oxygenSaturation: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                  <Weight className="h-4 w-4 text-blue-500" />
                                  Weight (lbs)
                                </Label>
                                <Input
                                  placeholder="150"
                                  value={vitals.weight}
                                  onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Assessment */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5 text-yellow-500" />
                              Clinical Assessment
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label>Chief Complaint</Label>
                              <Textarea
                                placeholder="Describe the patient's primary concern..."
                                value={chiefComplaint}
                                onChange={(e) => setChiefComplaint(e.target.value)}
                                rows={3}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Pain Scale (0-10)</Label>
                              <Select value={painScale} onValueChange={setPainScale}>
                                <SelectTrigger>
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

                            <div className="space-y-2">
                              <Label>Triage Priority</Label>
                              <Select value={triagePriority} onValueChange={setTriagePriority}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Assign priority level" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="high">High Priority - Immediate attention</SelectItem>
                                  <SelectItem value="medium">Medium Priority - Urgent care</SelectItem>
                                  <SelectItem value="low">Low Priority - Standard care</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="pt-4">
                              <Button className="w-full bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Complete Triage Assessment
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Patient Selected</h3>
                        <p className="text-gray-500">Select a patient from the triage queue to begin assessment</p>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              </TabsContent>

              {/* Completed */}
              <TabsContent value="completed">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Completed Triage Assessments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Completed Assessments</h3>
                        <p className="text-gray-500">Completed triage assessments will appear here</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
