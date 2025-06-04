"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Clock, ArrowRight, Pause, SkipForward, AlertCircle, CheckCircle, Timer, Activity } from "lucide-react"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import Sidebar from "@/components/sidebar"

const queueData = {
  triage: [
    { id: "P-1234", name: "John Doe", waitTime: 14, priority: "high", status: "waiting" },
    { id: "P-1238", name: "Sarah Wilson", waitTime: 8, priority: "medium", status: "waiting" },
  ],
  consultation: [
    {
      id: "P-1235",
      name: "Jane Smith",
      waitTime: 22,
      priority: "medium",
      status: "in-progress",
      doctor: "Dr. Johnson",
    },
    { id: "P-1239", name: "Mike Davis", waitTime: 15, priority: "low", status: "waiting" },
    { id: "P-1240", name: "Lisa Chen", waitTime: 7, priority: "high", status: "waiting" },
  ],
  laboratory: [
    { id: "P-1236", name: "Bob Johnson", waitTime: 9, priority: "low", status: "waiting" },
    { id: "P-1241", name: "Emma Taylor", waitTime: 12, priority: "medium", status: "waiting" },
  ],
  prescription: [{ id: "P-1237", name: "Alice Brown", waitTime: 5, priority: "medium", status: "waiting" }],
}

const waitTimeData = [
  { time: "9:00", triage: 5, consultation: 12, laboratory: 8, prescription: 3 },
  { time: "10:00", triage: 8, consultation: 15, laboratory: 6, prescription: 4 },
  { time: "11:00", triage: 6, consultation: 18, laboratory: 10, prescription: 2 },
  { time: "12:00", triage: 4, consultation: 22, laboratory: 9, prescription: 5 },
  { time: "13:00", triage: 7, consultation: 20, laboratory: 7, prescription: 3 },
  { time: "14:00", triage: 3, consultation: 16, laboratory: 11, prescription: 6 },
]

export default function QueueManagement() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedQueue, setSelectedQueue] = useState("all")

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

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

  const getTotalPatients = () => {
    return Object.values(queueData).reduce((total, queue) => total + queue.length, 0)
  }

  const getAverageWaitTime = () => {
    const allPatients = Object.values(queueData).flat()
    const totalWaitTime = allPatients.reduce((total, patient) => total + patient.waitTime, 0)
    return Math.round(totalWaitTime / allPatients.length) || 0
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen overflow-y-auto">
        <div className="p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Queue Management</h1>
                <p className="text-gray-600">Monitor and manage patient queues across all departments</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Current Time</p>
                <p className="text-lg font-semibold text-[#581c87]">{currentTime.toLocaleTimeString()}</p>
              </div>
            </div>

            {/* Overview Cards */}
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
                        <p className="text-sm font-medium text-gray-600">Total in Queue</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{getTotalPatients()}</p>
                      </div>
                      <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600">
                        <Users className="h-6 w-6 text-white" />
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
                        <p className="text-sm font-medium text-gray-600">Average Wait Time</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{getAverageWaitTime()} min</p>
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
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">High Priority</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {
                            Object.values(queueData)
                              .flat()
                              .filter((p) => p.priority === "high").length
                          }
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-gradient-to-r from-red-500 to-red-600">
                        <AlertCircle className="h-6 w-6 text-white" />
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
                        <p className="text-sm font-medium text-gray-600">In Progress</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {
                            Object.values(queueData)
                              .flat()
                              .filter((p) => p.status === "in-progress").length
                          }
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-gradient-to-r from-green-500 to-green-600">
                        <Activity className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Wait Time Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mb-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-[#581c87]" />
                    Wait Time Trends
                  </CardTitle>
                  <p className="text-sm text-gray-600">Average wait times by department throughout the day</p>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      triage: { label: "Triage", color: "#581c87" },
                      consultation: { label: "Consultation", color: "#7c3aed" },
                      laboratory: { label: "Laboratory", color: "#a855f7" },
                      prescription: { label: "Prescription", color: "#c084fc" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={waitTimeData}>
                        <XAxis dataKey="time" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="triage" stroke="#581c87" strokeWidth={2} />
                        <Line type="monotone" dataKey="consultation" stroke="#7c3aed" strokeWidth={2} />
                        <Line type="monotone" dataKey="laboratory" stroke="#a855f7" strokeWidth={2} />
                        <Line type="monotone" dataKey="prescription" stroke="#c084fc" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Queue Tabs */}
            <Tabs value={selectedQueue} onValueChange={setSelectedQueue}>
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                >
                  All Queues
                </TabsTrigger>
                <TabsTrigger
                  value="triage"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                >
                  Triage ({queueData.triage.length})
                </TabsTrigger>
                <TabsTrigger
                  value="consultation"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                >
                  Consultation ({queueData.consultation.length})
                </TabsTrigger>
                <TabsTrigger
                  value="laboratory"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                >
                  Laboratory ({queueData.laboratory.length})
                </TabsTrigger>
                <TabsTrigger
                  value="prescription"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                >
                  Prescription ({queueData.prescription.length})
                </TabsTrigger>
              </TabsList>

              {/* All Queues */}
              <TabsContent value="all">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {Object.entries(queueData).map(([queueName, patients]) => (
                    <motion.div
                      key={queueName}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="capitalize flex items-center justify-between">
                            {queueName} Queue
                            <Badge variant="outline">{patients.length} patients</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {patients.map((patient, index) => (
                              <div key={patient.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-r from-[#581c87] to-[#312e81] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <p className="font-medium">{patient.name}</p>
                                    <p className="text-sm text-gray-600">{patient.id}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className={getPriorityColor(patient.priority)}>{patient.priority}</Badge>
                                  <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                                  <span className="text-sm text-gray-500">{patient.waitTime}m</span>
                                </div>
                              </div>
                            ))}
                            {patients.length === 0 && (
                              <div className="text-center py-8 text-gray-500">No patients in {queueName} queue</div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* Individual Queue Tabs */}
              {Object.entries(queueData).map(([queueName, patients]) => (
                <TabsContent key={queueName} value={queueName}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="capitalize">{queueName} Queue Management</CardTitle>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Pause className="h-4 w-4 mr-2" />
                              Pause Queue
                            </Button>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white"
                            >
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Next Patient
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {patients.map((patient, index) => (
                            <motion.div
                              key={patient.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1, duration: 0.4 }}
                              className="p-4 border rounded-lg hover:shadow-md transition-all duration-200"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-gradient-to-r from-[#581c87] to-[#312e81] rounded-full flex items-center justify-center text-white font-bold">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                                    <p className="text-sm text-gray-600">ID: {patient.id}</p>
                                    {patient.doctor && (
                                      <p className="text-sm text-blue-600">Assigned to: {patient.doctor}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <p className="text-sm text-gray-600">Wait Time</p>
                                    <p className="text-lg font-semibold text-gray-900">{patient.waitTime} min</p>
                                  </div>
                                  <Badge className={getPriorityColor(patient.priority)}>
                                    {patient.priority} priority
                                  </Badge>
                                  <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline">
                                      <SkipForward className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white"
                                    >
                                      Call Next
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3">
                                <Progress value={((30 - patient.waitTime) / 30) * 100} className="h-2" />
                                <p className="text-xs text-gray-500 mt-1">Target wait time: 30 minutes</p>
                              </div>
                            </motion.div>
                          ))}
                          {patients.length === 0 && (
                            <div className="text-center py-12">
                              <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Patients in Queue</h3>
                              <p className="text-gray-500">The {queueName} queue is currently empty</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
