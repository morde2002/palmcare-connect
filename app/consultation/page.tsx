"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Stethoscope,
  User,
  FileText,
  Clock,
  Heart,
  Activity,
  Pill,
  Calendar,
  Save,
  Send,
  Plus,
  History,
} from "lucide-react"
import Sidebar from "@/components/sidebar"

const consultationQueue = [
  {
    id: "P-1235",
    name: "Jane Smith",
    age: 34,
    gender: "Female",
    chiefComplaint: "Chest pain and shortness of breath",
    triagePriority: "high",
    waitTime: 22,
    vitals: {
      bp: "140/90",
      hr: "88",
      temp: "99.2°F",
      resp: "18",
      o2sat: "96%",
    },
  },
  {
    id: "P-1239",
    name: "Mike Davis",
    age: 45,
    gender: "Male",
    chiefComplaint: "Persistent headache for 3 days",
    triagePriority: "medium",
    waitTime: 15,
    vitals: {
      bp: "130/85",
      hr: "72",
      temp: "98.6°F",
      resp: "16",
      o2sat: "98%",
    },
  },
  {
    id: "P-1240",
    name: "Lisa Chen",
    age: 28,
    gender: "Female",
    chiefComplaint: "Ankle sprain from fall",
    triagePriority: "low",
    waitTime: 7,
    vitals: {
      bp: "120/80",
      hr: "68",
      temp: "98.4°F",
      resp: "14",
      o2sat: "99%",
    },
  },
]

export default function Consultation() {
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [activeTab, setActiveTab] = useState("queue")
  const [consultationNotes, setConsultationNotes] = useState("")
  const [diagnosis, setDiagnosis] = useState("")
  const [treatmentPlan, setTreatmentPlan] = useState("")
  const [followUp, setFollowUp] = useState("")

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient)
    setActiveTab("consultation")
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen overflow-y-auto">
        <div className="p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Consultation</h1>
                <p className="text-gray-600">Conduct patient consultations and document medical findings</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="hover:bg-gray-50">
                  <History className="h-4 w-4 mr-2" />
                  Patient History
                </Button>
                <Button className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  New Consultation
                </Button>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger
                  value="queue"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                >
                  Consultation Queue
                </TabsTrigger>
                <TabsTrigger
                  value="consultation"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                >
                  Active Consultation
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                >
                  Completed
                </TabsTrigger>
              </TabsList>

              {/* Consultation Queue */}
              <TabsContent value="queue">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-[#581c87]" />
                        Patients Waiting for Consultation
                      </CardTitle>
                      <p className="text-sm text-gray-600">Click on a patient to begin consultation</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {consultationQueue.map((patient, index) => (
                          <motion.div
                            key={patient.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            className="p-6 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
                            onClick={() => handlePatientSelect(patient)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-gradient-to-r from-[#581c87] to-[#312e81] rounded-full flex items-center justify-center text-white font-bold text-lg">
                                  {patient.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                                    <Badge className={getPriorityColor(patient.triagePriority)}>
                                      {patient.triagePriority} priority
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                                    <p>ID: {patient.id}</p>
                                    <p>
                                      Age: {patient.age}, {patient.gender}
                                    </p>
                                    <p>Wait Time: {patient.waitTime} minutes</p>
                                  </div>
                                  <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Chief Complaint:</p>
                                    <p className="text-gray-600">{patient.chiefComplaint}</p>
                                  </div>
                                  <div className="grid grid-cols-5 gap-4 text-sm">
                                    <div>
                                      <p className="font-medium text-gray-700">BP</p>
                                      <p className="text-gray-600">{patient.vitals.bp}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-700">HR</p>
                                      <p className="text-gray-600">{patient.vitals.hr}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-700">Temp</p>
                                      <p className="text-gray-600">{patient.vitals.temp}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-700">Resp</p>
                                      <p className="text-gray-600">{patient.vitals.resp}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-700">O2 Sat</p>
                                      <p className="text-gray-600">{patient.vitals.o2sat}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <Button className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white">
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

              {/* Active Consultation */}
              <TabsContent value="consultation">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {selectedPatient ? (
                    <div className="space-y-6">
                      {/* Patient Header */}
                      <Card className="bg-gradient-to-r from-[#581c87]/5 to-[#312e81]/5 border-[#581c87]/20">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-20 h-20 bg-gradient-to-r from-[#581c87] to-[#312e81] rounded-full flex items-center justify-center text-white font-bold text-2xl">
                                {selectedPatient.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div>
                                <h2 className="text-2xl font-bold text-gray-900">{selectedPatient.name}</h2>
                                <p className="text-gray-600">Patient ID: {selectedPatient.id}</p>
                                <p className="text-sm text-gray-500">
                                  Age: {selectedPatient.age}, {selectedPatient.gender}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={getPriorityColor(selectedPatient.triagePriority)}>
                                {selectedPatient.triagePriority} priority
                              </Badge>
                              <p className="text-sm text-gray-600 mt-2">
                                <Clock className="h-4 w-4 inline mr-1" />
                                Wait time: {selectedPatient.waitTime} minutes
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Patient Information */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <User className="h-5 w-5 text-[#581c87]" />
                              Patient Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Chief Complaint</Label>
                              <p className="text-gray-900 mt-1">{selectedPatient.chiefComplaint}</p>
                            </div>

                            <div>
                              <Label className="text-sm font-medium text-gray-700 mb-2 block">Current Vitals</Label>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                  <Heart className="h-4 w-4 text-red-500" />
                                  <span>BP: {selectedPatient.vitals.bp}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Activity className="h-4 w-4 text-blue-500" />
                                  <span>HR: {selectedPatient.vitals.hr}</span>
                                </div>
                                <div>Temp: {selectedPatient.vitals.temp}</div>
                                <div>Resp: {selectedPatient.vitals.resp}</div>
                                <div>O2 Sat: {selectedPatient.vitals.o2sat}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Consultation Notes */}
                        <Card className="lg:col-span-2">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <FileText className="h-5 w-5 text-[#581c87]" />
                              Consultation Documentation
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="space-y-2">
                              <Label htmlFor="notes">Consultation Notes</Label>
                              <Textarea
                                id="notes"
                                placeholder="Document your examination findings, patient history, and observations..."
                                value={consultationNotes}
                                onChange={(e) => setConsultationNotes(e.target.value)}
                                rows={4}
                                className="resize-none"
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="diagnosis">Diagnosis</Label>
                                <Textarea
                                  id="diagnosis"
                                  placeholder="Primary and secondary diagnoses..."
                                  value={diagnosis}
                                  onChange={(e) => setDiagnosis(e.target.value)}
                                  rows={3}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="treatment">Treatment Plan</Label>
                                <Textarea
                                  id="treatment"
                                  placeholder="Prescribed medications, procedures, recommendations..."
                                  value={treatmentPlan}
                                  onChange={(e) => setTreatmentPlan(e.target.value)}
                                  rows={3}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="followup">Follow-up Instructions</Label>
                              <Textarea
                                id="followup"
                                placeholder="Follow-up appointments, monitoring instructions, patient education..."
                                value={followUp}
                                onChange={(e) => setFollowUp(e.target.value)}
                                rows={2}
                              />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                              <Button variant="outline">
                                <Save className="h-4 w-4 mr-2" />
                                Save Draft
                              </Button>
                              <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                                <Pill className="h-4 w-4 mr-2" />
                                Send to Pharmacy
                              </Button>
                              <Button className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white">
                                <Send className="h-4 w-4 mr-2" />
                                Complete Consultation
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Stethoscope className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Patient Selected</h3>
                        <p className="text-gray-500">Select a patient from the consultation queue to begin</p>
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
                        <Calendar className="h-5 w-5 text-green-500" />
                        Completed Consultations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Completed Consultations</h3>
                        <p className="text-gray-500">Completed consultations will appear here</p>
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
