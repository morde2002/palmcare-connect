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
import { Pill, Plus, Search, Clock, CheckCircle, AlertTriangle, Printer, Send, FileText, Trash2 } from "lucide-react"
import Sidebar from "@/components/sidebar"

const prescriptionQueue = [
  {
    id: "P-1237",
    name: "Alice Brown",
    age: 42,
    diagnosis: "Hypertension",
    doctor: "Dr. Johnson",
    orderTime: "11:30 AM",
    status: "pending",
    medications: [
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "30 days" },
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily", duration: "30 days" },
    ],
  },
  {
    id: "P-1243",
    name: "Robert Davis",
    age: 55,
    diagnosis: "Type 2 Diabetes",
    doctor: "Dr. Smith",
    orderTime: "12:15 PM",
    status: "ready",
    medications: [
      { name: "Metformin", dosage: "1000mg", frequency: "Twice daily", duration: "90 days" },
      { name: "Glipizide", dosage: "5mg", frequency: "Once daily", duration: "90 days" },
    ],
  },
]

const completedPrescriptions = [
  {
    id: "P-1220",
    name: "Mary Johnson",
    completedTime: "10:45 AM",
    medications: ["Amoxicillin 500mg", "Ibuprofen 400mg"],
    status: "dispensed",
  },
  {
    id: "P-1225",
    name: "James Wilson",
    completedTime: "11:20 AM",
    medications: ["Atorvastatin 20mg"],
    status: "dispensed",
  },
]

export default function Prescription() {
  const [activeTab, setActiveTab] = useState("queue")
  const [selectedPrescription, setSelectedPrescription] = useState(null)
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "dispensed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handlePrescriptionSelect = (prescription) => {
    setSelectedPrescription(prescription)
    setActiveTab("processing")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen overflow-y-auto">
        <div className="p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Prescription Management</h1>
                <p className="text-gray-600">Manage prescriptions and medication dispensing</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="hover:bg-gray-50">
                  <Search className="h-4 w-4 mr-2" />
                  Search Prescriptions
                </Button>
                <Button className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  New Prescription
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pending</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {prescriptionQueue.filter((p) => p.status === "pending").length}
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Ready</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {prescriptionQueue.filter((p) => p.status === "ready").length}
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-gradient-to-r from-green-500 to-green-600">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Dispensed Today</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{completedPrescriptions.length}</p>
                      </div>
                      <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600">
                        <Pill className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Alerts</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">2</p>
                      </div>
                      <div className="p-3 rounded-full bg-gradient-to-r from-red-500 to-red-600">
                        <AlertTriangle className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger
                  value="queue"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                >
                  Prescription Queue
                </TabsTrigger>
                <TabsTrigger
                  value="processing"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                >
                  Processing
                </TabsTrigger>
                <TabsTrigger
                  value="dispensed"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                >
                  Dispensed
                </TabsTrigger>
                <TabsTrigger
                  value="inventory"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                >
                  Inventory
                </TabsTrigger>
              </TabsList>

              {/* Prescription Queue */}
              <TabsContent value="queue">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Pill className="h-5 w-5 text-[#581c87]" />
                        Prescription Queue
                      </CardTitle>
                      <p className="text-sm text-gray-600">Click on a prescription to process</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {prescriptionQueue.map((prescription, index) => (
                          <motion.div
                            key={prescription.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            className="p-6 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
                            onClick={() => handlePrescriptionSelect(prescription)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-gradient-to-r from-[#581c87] to-[#312e81] rounded-full flex items-center justify-center text-white font-bold text-lg">
                                  {prescription.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{prescription.name}</h3>
                                    <Badge className={getStatusColor(prescription.status)}>{prescription.status}</Badge>
                                  </div>
                                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                                    <p>ID: {prescription.id}</p>
                                    <p>Age: {prescription.age}</p>
                                    <p>Ordered: {prescription.orderTime}</p>
                                  </div>
                                  <div className="mb-3">
                                    <p className="text-sm font-medium text-gray-700">
                                      Diagnosis: {prescription.diagnosis}
                                    </p>
                                    <p className="text-sm text-gray-600">Prescribed by: {prescription.doctor}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">Medications:</p>
                                    <div className="space-y-1">
                                      {prescription.medications.map((med, idx) => (
                                        <div key={idx} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                          <span className="font-medium">{med.name}</span> - {med.dosage},{" "}
                                          {med.frequency} for {med.duration}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <Button className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white">
                                Process
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Processing */}
              <TabsContent value="processing">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {selectedPrescription ? (
                    <div className="space-y-6">
                      {/* Patient Header */}
                      <Card className="bg-gradient-to-r from-[#581c87]/5 to-[#312e81]/5 border-[#581c87]/20">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-20 h-20 bg-gradient-to-r from-[#581c87] to-[#312e81] rounded-full flex items-center justify-center text-white font-bold text-2xl">
                                {selectedPrescription.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div>
                                <h2 className="text-2xl font-bold text-gray-900">{selectedPrescription.name}</h2>
                                <p className="text-gray-600">Patient ID: {selectedPrescription.id}</p>
                                <p className="text-sm text-gray-500">Age: {selectedPrescription.age}</p>
                                <p className="text-sm text-gray-500">Diagnosis: {selectedPrescription.diagnosis}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(selectedPrescription.status)}>
                                {selectedPrescription.status}
                              </Badge>
                              <p className="text-sm text-gray-600 mt-2">
                                <Clock className="h-4 w-4 inline mr-1" />
                                Ordered: {selectedPrescription.orderTime}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Current Medications */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Pill className="h-5 w-5 text-[#581c87]" />
                              Prescribed Medications
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {selectedPrescription.medications.map((med, idx) => (
                              <div key={idx} className="p-4 border rounded-lg">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">{med.name}</h4>
                                    <p className="text-sm text-gray-600">Dosage: {med.dosage}</p>
                                    <p className="text-sm text-gray-600">Frequency: {med.frequency}</p>
                                    <p className="text-sm text-gray-600">Duration: {med.duration}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      In Stock
                                    </Badge>
                                    <Button variant="outline" size="sm">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>

                        {/* Add Medication */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Plus className="h-5 w-5 text-[#581c87]" />
                              Add Medication
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="medName">Medication Name</Label>
                              <Input
                                id="medName"
                                placeholder="Search medication..."
                                value={newMedication.name}
                                onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="dosage">Dosage</Label>
                                <Input
                                  id="dosage"
                                  placeholder="e.g., 500mg"
                                  value={newMedication.dosage}
                                  onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="frequency">Frequency</Label>
                                <Select
                                  value={newMedication.frequency}
                                  onValueChange={(value) => setNewMedication({ ...newMedication, frequency: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="once">Once daily</SelectItem>
                                    <SelectItem value="twice">Twice daily</SelectItem>
                                    <SelectItem value="three">Three times daily</SelectItem>
                                    <SelectItem value="four">Four times daily</SelectItem>
                                    <SelectItem value="asneeded">As needed</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="duration">Duration</Label>
                              <Input
                                id="duration"
                                placeholder="e.g., 30 days"
                                value={newMedication.duration}
                                onChange={(e) => setNewMedication({ ...newMedication, duration: e.target.value })}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="instructions">Special Instructions</Label>
                              <Textarea
                                id="instructions"
                                placeholder="Take with food, avoid alcohol, etc."
                                value={newMedication.instructions}
                                onChange={(e) => setNewMedication({ ...newMedication, instructions: e.target.value })}
                                rows={2}
                              />
                            </div>

                            <Button className="w-full bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Medication
                            </Button>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Actions */}
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex justify-end gap-3">
                            <Button variant="outline">
                              <Printer className="h-4 w-4 mr-2" />
                              Print Label
                            </Button>
                            <Button variant="outline">
                              <FileText className="h-4 w-4 mr-2" />
                              Patient Instructions
                            </Button>
                            <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Ready
                            </Button>
                            <Button className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white">
                              <Send className="h-4 w-4 mr-2" />
                              Dispense
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Pill className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Prescription Selected</h3>
                        <p className="text-gray-500">Select a prescription from the queue to process</p>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              </TabsContent>

              {/* Dispensed */}
              <TabsContent value="dispensed">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Dispensed Prescriptions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {completedPrescriptions.map((prescription, index) => (
                          <motion.div
                            key={prescription.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            className="p-4 border rounded-lg hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                                  {prescription.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">{prescription.name}</h3>
                                  <p className="text-sm text-gray-600">ID: {prescription.id}</p>
                                  <p className="text-sm text-gray-500">Dispensed: {prescription.completedTime}</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {prescription.medications.map((med, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {med}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Printer className="h-4 w-4 mr-2" />
                                  Reprint
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white"
                                >
                                  View Details
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

              {/* Inventory */}
              <TabsContent value="inventory">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-[#581c87]" />
                        Medication Inventory
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Inventory Management</h3>
                        <p className="text-gray-500">Medication inventory and stock levels will appear here</p>
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
