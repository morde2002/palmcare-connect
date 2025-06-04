"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  FlaskConical,
  TestTube,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Download,
  Upload,
  Microscope,
  Activity,
  FileText,
} from "lucide-react"
import Sidebar from "@/components/sidebar"

const labQueue = [
  {
    id: "P-1236",
    name: "Bob Johnson",
    testType: "Blood Work",
    tests: ["CBC", "Basic Metabolic Panel", "Lipid Panel"],
    priority: "routine",
    orderTime: "10:30 AM",
    estimatedTime: "45 min",
    status: "pending",
  },
  {
    id: "P-1241",
    name: "Emma Taylor",
    testType: "Urinalysis",
    tests: ["Urinalysis", "Urine Culture"],
    priority: "urgent",
    orderTime: "11:15 AM",
    estimatedTime: "30 min",
    status: "in-progress",
  },
  {
    id: "P-1242",
    name: "David Wilson",
    testType: "Imaging",
    tests: ["Chest X-Ray", "ECG"],
    priority: "stat",
    orderTime: "11:45 AM",
    estimatedTime: "20 min",
    status: "pending",
  },
]

const completedTests = [
  {
    id: "P-1230",
    name: "Sarah Connor",
    testType: "Blood Work",
    tests: ["CBC", "Thyroid Panel"],
    completedTime: "09:45 AM",
    status: "completed",
    results: "Normal ranges",
  },
  {
    id: "P-1231",
    name: "John Smith",
    testType: "Urinalysis",
    tests: ["Urinalysis"],
    completedTime: "10:15 AM",
    status: "completed",
    results: "Abnormal - Follow up required",
  },
]

export default function Laboratory() {
  const [activeTab, setActiveTab] = useState("queue")
  const [selectedTest, setSelectedTest] = useState(null)
  const [testResults, setTestResults] = useState("")
  const [technician, setTechnician] = useState("")

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "stat":
        return "bg-red-100 text-red-800 border-red-200"
      case "urgent":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "routine":
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
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleTestSelect = (test) => {
    setSelectedTest(test)
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
                <h1 className="text-3xl font-bold text-gray-900">Laboratory</h1>
                <p className="text-gray-600">Manage laboratory tests and results</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="hover:bg-gray-50">
                  <Search className="h-4 w-4 mr-2" />
                  Search Tests
                </Button>
                <Button className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white">
                  <TestTube className="h-4 w-4 mr-2" />
                  New Test Order
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
                        <p className="text-sm font-medium text-gray-600">Pending Tests</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {labQueue.filter((test) => test.status === "pending").length}
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
                        <p className="text-sm font-medium text-gray-600">In Progress</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {labQueue.filter((test) => test.status === "in-progress").length}
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600">
                        <Activity className="h-6 w-6 text-white" />
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
                        <p className="text-sm font-medium text-gray-600">Completed Today</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{completedTests.length}</p>
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
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">STAT Orders</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {labQueue.filter((test) => test.priority === "stat").length}
                        </p>
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
                  Test Queue
                </TabsTrigger>
                <TabsTrigger
                  value="processing"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                >
                  Processing
                </TabsTrigger>
                <TabsTrigger
                  value="results"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                >
                  Results
                </TabsTrigger>
                <TabsTrigger
                  value="reports"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                >
                  Reports
                </TabsTrigger>
              </TabsList>

              {/* Test Queue */}
              <TabsContent value="queue">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FlaskConical className="h-5 w-5 text-[#581c87]" />
                        Laboratory Test Queue
                      </CardTitle>
                      <p className="text-sm text-gray-600">Click on a test to begin processing</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {labQueue.map((test, index) => (
                          <motion.div
                            key={test.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            className="p-6 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
                            onClick={() => handleTestSelect(test)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-gradient-to-r from-[#581c87] to-[#312e81] rounded-full flex items-center justify-center text-white font-bold text-lg">
                                  {test.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{test.name}</h3>
                                    <Badge className={getPriorityColor(test.priority)}>{test.priority}</Badge>
                                    <Badge className={getStatusColor(test.status)}>{test.status}</Badge>
                                  </div>
                                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                                    <p>ID: {test.id}</p>
                                    <p>Ordered: {test.orderTime}</p>
                                    <p>Est. Time: {test.estimatedTime}</p>
                                  </div>
                                  <div className="mb-3">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Test Type: {test.testType}</p>
                                    <div className="flex flex-wrap gap-2">
                                      {test.tests.map((testName, idx) => (
                                        <Badge key={idx} variant="outline" className="text-xs">
                                          {testName}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  {test.status === "in-progress" && (
                                    <div className="mt-3">
                                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                                        <span>Progress</span>
                                        <span>65%</span>
                                      </div>
                                      <Progress value={65} className="h-2" />
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Button className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white">
                                {test.status === "pending" ? "Start Processing" : "Continue"}
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
                  {selectedTest ? (
                    <div className="space-y-6">
                      {/* Test Header */}
                      <Card className="bg-gradient-to-r from-[#581c87]/5 to-[#312e81]/5 border-[#581c87]/20">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-20 h-20 bg-gradient-to-r from-[#581c87] to-[#312e81] rounded-full flex items-center justify-center text-white font-bold text-2xl">
                                {selectedTest.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div>
                                <h2 className="text-2xl font-bold text-gray-900">{selectedTest.name}</h2>
                                <p className="text-gray-600">Patient ID: {selectedTest.id}</p>
                                <p className="text-sm text-gray-500">Test Type: {selectedTest.testType}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={getPriorityColor(selectedTest.priority)}>
                                {selectedTest.priority} priority
                              </Badge>
                              <p className="text-sm text-gray-600 mt-2">
                                <Clock className="h-4 w-4 inline mr-1" />
                                Ordered: {selectedTest.orderTime}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Test Details */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <TestTube className="h-5 w-5 text-[#581c87]" />
                              Test Details
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Ordered Tests</Label>
                              <div className="mt-2 space-y-2">
                                {selectedTest.tests.map((test, idx) => (
                                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <span className="text-sm">{test}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {idx === 0 ? "In Progress" : "Pending"}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="technician">Assigned Technician</Label>
                              <Select value={technician} onValueChange={setTechnician}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select technician" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="tech1">Sarah Johnson, MLT</SelectItem>
                                  <SelectItem value="tech2">Mike Chen, MT</SelectItem>
                                  <SelectItem value="tech3">Lisa Rodriguez, MLT</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="text-sm font-medium text-gray-700">Processing Status</Label>
                              <div className="mt-2">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                  <span>Overall Progress</span>
                                  <span>65%</span>
                                </div>
                                <Progress value={65} className="h-3" />
                                <p className="text-xs text-gray-500 mt-1">Estimated completion: 15 minutes</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Results Entry */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Microscope className="h-5 w-5 text-[#581c87]" />
                              Results Entry
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="results">Test Results</Label>
                              <Textarea
                                id="results"
                                placeholder="Enter test results, observations, and measurements..."
                                value={testResults}
                                onChange={(e) => setTestResults(e.target.value)}
                                rows={6}
                                className="resize-none"
                              />
                            </div>

                            <div className="flex gap-2">
                              <Button variant="outline" className="flex-1">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Images
                              </Button>
                              <Button variant="outline" className="flex-1">
                                <FileText className="h-4 w-4 mr-2" />
                                Add Report
                              </Button>
                            </div>

                            <div className="pt-4 space-y-3">
                              <Button variant="outline" className="w-full">
                                Save Progress
                              </Button>
                              <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Complete Test
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <TestTube className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Test Selected</h3>
                        <p className="text-gray-500">Select a test from the queue to begin processing</p>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              </TabsContent>

              {/* Results */}
              <TabsContent value="results">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Completed Test Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {completedTests.map((test, index) => (
                          <motion.div
                            key={test.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            className="p-4 border rounded-lg hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                                  {test.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">{test.name}</h3>
                                  <p className="text-sm text-gray-600">ID: {test.id}</p>
                                  <p className="text-sm text-gray-500">Completed: {test.completedTime}</p>
                                  <p className="text-sm text-gray-700 mt-1">Results: {test.results}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
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

              {/* Reports */}
              <TabsContent value="reports">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-[#581c87]" />
                        Laboratory Reports
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Reports Available</h3>
                        <p className="text-gray-500">Laboratory reports and analytics will appear here</p>
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
