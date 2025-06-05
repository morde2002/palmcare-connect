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
import { Search, FlaskConical, FileText, CheckCircle, AlertTriangle, BarChart, Upload, RefreshCw } from "lucide-react"
import Sidebar from "@/components/sidebar"
import MobileSidebar from "@/components/mobile-sidebar"
import { PageTransition } from "@/components/page-transition"
import { useAppContext } from "@/components/app-context"
import { NotificationPanel } from "@/components/notification-panel"

const labQueue = [
  {
    id: "P-1234",
    name: "John Doe",
    age: 45,
    gender: "Male",
    waitTime: 14,
    priority: "high",
    status: "waiting",
    tests: [
      { name: "Complete Blood Count", status: "pending" },
      { name: "Basic Metabolic Panel", status: "pending" },
      { name: "Chest X-Ray", status: "pending" },
    ],
  },
  {
    id: "P-1235",
    name: "Jane Smith",
    age: 32,
    gender: "Female",
    waitTime: 22,
    priority: "medium",
    status: "in-progress",
    tests: [
      { name: "Urinalysis", status: "completed" },
      { name: "Thyroid Function Tests", status: "in-progress" },
    ],
  },
  {
    id: "P-1236",
    name: "Bob Johnson",
    age: 58,
    gender: "Male",
    waitTime: 9,
    priority: "low",
    status: "waiting",
    tests: [
      { name: "Lipid Panel", status: "pending" },
      { name: "HbA1c", status: "pending" },
    ],
  },
]

const testResults = {
  "Complete Blood Count": {
    fields: [
      { name: "WBC", value: "", unit: "10³/µL", reference: "4.5-11.0" },
      { name: "RBC", value: "", unit: "10⁶/µL", reference: "4.5-5.9" },
      { name: "Hemoglobin", value: "", unit: "g/dL", reference: "13.5-17.5" },
      { name: "Hematocrit", value: "", unit: "%", reference: "41-53" },
      { name: "Platelets", value: "", unit: "10³/µL", reference: "150-450" },
    ],
  },
  "Basic Metabolic Panel": {
    fields: [
      { name: "Sodium", value: "", unit: "mmol/L", reference: "135-145" },
      { name: "Potassium", value: "", unit: "mmol/L", reference: "3.5-5.0" },
      { name: "Chloride", value: "", unit: "mmol/L", reference: "98-107" },
      { name: "CO2", value: "", unit: "mmol/L", reference: "22-29" },
      { name: "Glucose", value: "", unit: "mg/dL", reference: "70-99" },
      { name: "BUN", value: "", unit: "mg/dL", reference: "7-20" },
      { name: "Creatinine", value: "", unit: "mg/dL", reference: "0.6-1.2" },
    ],
  },
  "Lipid Panel": {
    fields: [
      { name: "Total Cholesterol", value: "", unit: "mg/dL", reference: "<200" },
      { name: "Triglycerides", value: "", unit: "mg/dL", reference: "<150" },
      { name: "HDL", value: "", unit: "mg/dL", reference: ">40" },
      { name: "LDL", value: "", unit: "mg/dL", reference: "<100" },
    ],
  },
  Urinalysis: {
    fields: [
      { name: "Color", value: "", unit: "", reference: "Yellow" },
      { name: "Clarity", value: "", unit: "", reference: "Clear" },
      { name: "pH", value: "", unit: "", reference: "4.5-8.0" },
      { name: "Protein", value: "", unit: "", reference: "Negative" },
      { name: "Glucose", value: "", unit: "", reference: "Negative" },
      { name: "Ketones", value: "", unit: "", reference: "Negative" },
      { name: "Blood", value: "", unit: "", reference: "Negative" },
    ],
  },
  "Thyroid Function Tests": {
    fields: [
      { name: "TSH", value: "", unit: "mIU/L", reference: "0.4-4.0" },
      { name: "Free T4", value: "", unit: "ng/dL", reference: "0.8-1.8" },
      { name: "Free T3", value: "", unit: "pg/mL", reference: "2.3-4.2" },
    ],
  },
  HbA1c: {
    fields: [{ name: "HbA1c", value: "", unit: "%", reference: "<5.7" }],
  },
  "Chest X-Ray": {
    fields: [
      { name: "Findings", value: "", unit: "", reference: "Normal" },
      { name: "Impression", value: "", unit: "", reference: "Normal" },
    ],
  },
}

export default function Laboratory() {
  const [activeTab, setActiveTab] = useState("queue")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [selectedTest, setSelectedTest] = useState(null)
  const [testData, setTestData] = useState([])
  const [notes, setNotes] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const { simulateAction, activePatient } = useAppContext()

  // Check if there's an active patient from context
  useEffect(() => {
    if (activePatient) {
      const patient = labQueue.find((p) => p.id === activePatient.id)
      if (patient) {
        handlePatientSelect(patient)
      }
    }
  }, [activePatient])

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setRefreshing(false)
  }

  const handlePatientSelect = (patient) => {
    simulateAction(`Loading ${patient.name}'s lab orders`, 800).then(() => {
      setSelectedPatient(patient)
      setSelectedTest(null)
      setActiveTab("tests")
    })
  }

  const handleTestSelect = (test) => {
    simulateAction(`Preparing ${test.name} test form`, 600).then(() => {
      setSelectedTest(test)

      // Pre-populate with random data for demo purposes
      if (testResults[test.name]) {
        const fields = testResults[test.name].fields.map((field) => {
          // Generate random values within reference range
          let value = ""
          if (field.reference.includes("-")) {
            const [min, max] = field.reference.split("-").map(Number.parseFloat)
            value = (Math.random() * (max - min) + min).toFixed(1)
          } else if (field.reference.includes("<")) {
            const max = Number.parseFloat(field.reference.replace("<", ""))
            value = (Math.random() * max * 0.8).toFixed(1)
          } else if (field.reference.includes(">")) {
            const min = Number.parseFloat(field.reference.replace(">", ""))
            value = (min + Math.random() * min * 0.5).toFixed(1)
          } else if (["Negative", "Positive", "Normal", "Abnormal", "Clear", "Yellow"].includes(field.reference)) {
            value = field.reference
          }

          return { ...field, value }
        })

        setTestData(fields)
      } else {
        setTestData([])
      }

      setNotes("")
    })
  }

  const handleCompleteTest = () => {
    simulateAction("Saving test results", 1000).then(() => {
      // Update the test status
      if (selectedPatient && selectedTest) {
        const updatedPatient = {
          ...selectedPatient,
          tests: selectedPatient.tests.map((t) => (t.name === selectedTest.name ? { ...t, status: "completed" } : t)),
        }

        setSelectedPatient(updatedPatient)
        setSelectedTest(null)
      }
    })
  }

  const handleGenerateRandomResults = () => {
    if (selectedTest && testResults[selectedTest.name]) {
      const fields = testResults[selectedTest.name].fields.map((field) => {
        // Generate random values within reference range
        let value = ""
        if (field.reference.includes("-")) {
          const [min, max] = field.reference.split("-").map(Number.parseFloat)
          value = (Math.random() * (max - min) + min).toFixed(1)
        } else if (field.reference.includes("<")) {
          const max = Number.parseFloat(field.reference.replace("<", ""))
          value = (Math.random() * max * 0.8).toFixed(1)
        } else if (field.reference.includes(">")) {
          const min = Number.parseFloat(field.reference.replace(">", ""))
          value = (min + Math.random() * min * 0.5).toFixed(1)
        } else if (["Negative", "Positive", "Normal", "Abnormal", "Clear", "Yellow"].includes(field.reference)) {
          value = field.reference
        }

        return { ...field, value }
      })

      setTestData(fields)
    }
  }

  const filteredPatients = labQueue.filter(
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
      case "pending":
      case "waiting":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const isFieldOutOfRange = (field) => {
    if (!field.value || !field.reference) return false

    if (field.reference.includes("-")) {
      const [min, max] = field.reference.split("-").map(Number.parseFloat)
      const value = Number.parseFloat(field.value)
      return value < min || value > max
    } else if (field.reference.includes("<")) {
      const max = Number.parseFloat(field.reference.replace("<", ""))
      const value = Number.parseFloat(field.value)
      return value >= max
    } else if (field.reference.includes(">")) {
      const min = Number.parseFloat(field.reference.replace(">", ""))
      const value = Number.parseFloat(field.value)
      return value <= min
    }

    return false
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <MobileSidebar />

      {/* Main content area */}
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
                      className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <FlaskConical className="h-8 w-8 text-white" />
                    </motion.div>
                    Laboratory
                  </motion.h1>
                  <motion.p
                    className="text-gray-600"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  >
                    Process lab tests and manage test results
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
                  </div>
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

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger
                    value="queue"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                  >
                    Lab Queue
                  </TabsTrigger>
                  <TabsTrigger
                    value="tests"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                  >
                    Test Results
                  </TabsTrigger>
                  <TabsTrigger
                    value="reports"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                  >
                    Reports
                  </TabsTrigger>
                </TabsList>

                {/* Lab Queue */}
                <TabsContent value="queue">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <FlaskConical className="h-5 w-5 text-[#581c87]" />
                            Patients Waiting for Lab Tests
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
                              whileHover={{ scale: 1.01, y: -2 }}
                              className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer bg-gray-50/80 hover:bg-gray-100/80"
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
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {patient.tests.map((test, idx) => (
                                        <Badge key={idx} className={getStatusColor(test.status)} variant="outline">
                                          {test.name}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge className={getPriorityColor(patient.priority)}>
                                    {patient.priority} priority
                                  </Badge>
                                  <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                                </div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handlePatientSelect(patient)
                                    }}
                                  >
                                    <FlaskConical className="h-4 w-4 mr-2" />
                                    Process Tests
                                  </Button>
                                </motion.div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Test Results */}
                <TabsContent value="tests">
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
                          {/* Test List */}
                          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-[#581c87]" />
                                Ordered Tests
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                {selectedPatient.tests.map((test, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                                      selectedTest?.name === test.name
                                        ? "border-[#581c87] bg-purple-50"
                                        : "hover:bg-gray-50"
                                    }`}
                                    onClick={() => handleTestSelect(test)}
                                  >
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-medium text-gray-900">{test.name}</h4>
                                      <Badge className={getStatusColor(test.status)} variant="outline">
                                        {test.status}
                                      </Badge>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Test Results Form */}
                          <div className="lg:col-span-2">
                            {selectedTest ? (
                              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                                <CardHeader>
                                  <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                      <BarChart className="h-5 w-5 text-[#581c87]" />
                                      {selectedTest.name} Results
                                    </CardTitle>
                                    <div className="flex gap-2">
                                      <Button variant="outline" size="sm" onClick={handleGenerateRandomResults}>
                                        Generate Sample Data
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        <Upload className="h-4 w-4 mr-2" />
                                        Import
                                      </Button>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {testData.map((field, index) => (
                                      <div key={index} className="space-y-2">
                                        <Label className="flex items-center justify-between">
                                          <span>{field.name}</span>
                                          {isFieldOutOfRange(field) && (
                                            <AlertTriangle className="h-4 w-4 text-red-500" />
                                          )}
                                        </Label>
                                        <div className="flex gap-2">
                                          <Input
                                            value={field.value}
                                            onChange={(e) => {
                                              const updatedData = [...testData]
                                              updatedData[index].value = e.target.value
                                              setTestData(updatedData)
                                            }}
                                            className={
                                              isFieldOutOfRange(field)
                                                ? "border-red-300 bg-red-50"
                                                : "bg-white/80 backdrop-blur-sm"
                                            }
                                          />
                                          {field.unit && (
                                            <div className="flex items-center px-3 bg-gray-100 border rounded-md text-sm text-gray-600">
                                              {field.unit}
                                            </div>
                                          )}
                                        </div>
                                        <p className="text-xs text-gray-500">Reference: {field.reference}</p>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Notes</Label>
                                    <Textarea
                                      placeholder="Enter any additional notes or observations..."
                                      value={notes}
                                      onChange={(e) => setNotes(e.target.value)}
                                      rows={3}
                                      className="bg-white/80 backdrop-blur-sm"
                                    />
                                  </div>

                                  <div className="flex justify-end gap-4">
                                    <Button variant="outline" onClick={() => setSelectedTest(null)}>
                                      Cancel
                                    </Button>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                      <Button
                                        className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white"
                                        onClick={handleCompleteTest}
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Complete Test
                                      </Button>
                                    </motion.div>
                                  </div>
                                </CardContent>
                              </Card>
                            ) : (
                              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                                <CardContent className="p-8 text-center">
                                  <FlaskConical className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Test</h3>
                                  <p className="text-gray-500">Choose a test from the list to enter results</p>
                                </CardContent>
                              </Card>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardContent className="p-8 text-center">
                          <FlaskConical className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Patient Selected</h3>
                          <p className="text-gray-500 mb-6">
                            Please select a patient from the queue to process lab tests
                          </p>
                          <Button onClick={() => setActiveTab("queue")}>View Queue</Button>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                </TabsContent>

                {/* Reports */}
                <TabsContent value="reports">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart className="h-5 w-5 text-[#581c87]" />
                          Lab Reports
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8 text-gray-500">
                          <BarChart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                          <h3 className="text-lg font-medium mb-2">No reports available</h3>
                          <p>Completed lab reports will appear here</p>
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
