"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Search, Hand, Phone, Calendar, User, Mail, MapPin, Scan, CheckCircle, Menu, X } from "lucide-react"
import Sidebar from "@/components/sidebar"

export default function PatientRegistration() {
  const [activeTab, setActiveTab] = useState("new")
  const [searchQuery, setSearchQuery] = useState("")
  const [foundPatient, setFoundPatient] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [palmScanState, setPalmScanState] = useState("idle") // idle, scanning, processing, complete
  const [scanProgress, setScanProgress] = useState(0)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
  })

  const handleSearch = () => {
    // Simulate finding a patient
    if (searchQuery === "PC123456" || searchQuery === "555-123-4567") {
      setFoundPatient({
        id: "PC123456",
        firstName: "Emily",
        lastName: "Johnson",
        dateOfBirth: "06/15/1985",
        gender: "Female",
        phone: "555-123-4567",
        email: "emily.j@example.com",
        address: "123 Main St, City, State",
      })
    }
  }

  const handlePalmScan = async () => {
    setPalmScanState("scanning")
    setScanProgress(0)

    // Simulate scanning progress - smooth and professional
    const scanInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(scanInterval)
          setPalmScanState("processing")

          // Simulate processing
          setTimeout(() => {
            setPalmScanState("complete")
            setFoundPatient({
              id: "PC789012",
              firstName: "Michael",
              lastName: "Davis",
              dateOfBirth: "03/22/1978",
              gender: "Male",
              phone: "555-987-6543",
              email: "m.davis@example.com",
              address: "456 Oak Ave, City, State",
            })
          }, 1500)

          return 100
        }
        return prev + 1.5
      })
    }, 60)
  }

  const resetPalmScan = () => {
    setPalmScanState("idle")
    setScanProgress(0)
    setFoundPatient(null)
  }

  const handleUpdatePalmRecord = () => {
    setShowUpdateModal(true)
  }

  const processUpdatePalmRecord = () => {
    setShowUpdateModal(false)
    // Simulate update process
    setTimeout(() => {
      alert("Palm record updated successfully!")
    }, 1000)
  }

  const PalmScanModal = () => (
    <AnimatePresence>
      {palmScanState !== "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
          >
            <AnimatePresence mode="wait">
              {palmScanState === "scanning" && (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Professional Hand Icon with Subtle Animation */}
                  <motion.div
                    className="relative mx-auto w-24 h-24 flex items-center justify-center"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.3, 0.1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                    <Hand className="w-12 h-12 text-blue-600" />

                    {/* Subtle Scanning Line */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent h-0.5"
                      animate={{
                        y: [-10, 30, -10],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Scanning Palm...</h3>
                    <p className="text-gray-600 mb-4">Please keep your hand steady on the scanner</p>

                    {/* Professional Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${scanProgress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>

                    <p className="text-sm text-gray-500">{Math.round(scanProgress)}% Complete</p>
                  </div>

                  <Button variant="outline" onClick={resetPalmScan} className="hover:bg-gray-50">
                    Cancel
                  </Button>
                </motion.div>
              )}

              {palmScanState === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <motion.div
                    className="mx-auto w-24 h-24 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Scan className="w-12 h-12 text-purple-600" />
                  </motion.div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Processing...</h3>
                    <p className="text-gray-600">Matching palm print with database</p>
                  </div>

                  <motion.div
                    className="flex justify-center space-x-1"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-purple-500 rounded-full"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              )}

              {palmScanState === "complete" && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <motion.div
                    className="mx-auto w-24 h-24 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </motion.div>

                  <div>
                    <h3 className="text-xl font-bold text-green-900 mb-2">Patient Found!</h3>
                    <p className="text-gray-600 mb-4">Palm scan successful. Patient data retrieved.</p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-green-800">PalmCareConnect ID: {foundPatient?.id}</p>
                      <p className="text-sm text-green-700">
                        {foundPatient?.firstName} {foundPatient?.lastName}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      resetPalmScan()
                      setActiveTab("new") // Switch to new patient tab to show populated form
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white w-full"
                  >
                    Continue
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  const UpdatePalmModal = () => (
    <AnimatePresence>
      {showUpdateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Update Palm Scan Record</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowUpdateModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-center space-y-6">
              <motion.div
                className="mx-auto w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Hand className="w-8 h-8 text-blue-600" />
              </motion.div>

              <div>
                <p className="text-gray-600 mb-4">
                  Update the patient's biometric profile in the PalmCareConnect system
                </p>
                <p className="text-sm text-gray-800 font-medium">
                  This will update {foundPatient?.firstName} {foundPatient?.lastName}'s palm scan record with their
                  latest information.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <h4 className="font-medium text-blue-900 mb-2">Why update palm records?</h4>
                <p className="text-sm text-blue-700">
                  Keeping biometric records current ensures faster check-ins for future visits and more accurate patient
                  identification.
                </p>
              </div>

              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setShowUpdateModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={processUpdatePalmRecord} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  Update Palm Record
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

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
        <div className="p-4 lg:p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex justify-between items-center mb-6 lg:mb-8">
              <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                  <Menu className="h-5 w-5" />
                </Button>

                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Patient Registration</h1>
                  <p className="text-gray-600 text-sm lg:text-base">
                    Register new patients or search for existing patient records
                  </p>
                </div>
              </div>

              <Button className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white">
                <UserPlus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Register New Patient</span>
                <span className="sm:hidden">Register</span>
              </Button>
            </div>

            <Card className="max-w-6xl mx-auto">
              <CardHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="new"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                    >
                      New Patient
                    </TabsTrigger>
                    <TabsTrigger
                      value="search"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                    >
                      Search Patients
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>

              <CardContent>
                <Tabs value={activeTab}>
                  {/* New Patient Form */}
                  <TabsContent value="new">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
                          <p className="text-sm text-gray-600 mb-6">Enter the patient's personal details</p>

                          {foundPatient && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-5 h-5 text-blue-600" />
                                <span className="font-medium text-blue-900">Patient Found via Palm Scan</span>
                              </div>
                              <p className="text-sm text-blue-700">
                                Form has been pre-populated with patient data from PalmCareConnect ID: {foundPatient.id}
                              </p>
                            </motion.div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="firstName" className="flex items-center gap-2">
                              <User className="h-4 w-4 text-[#581c87]" />
                              First Name *
                            </Label>
                            <Input
                              id="firstName"
                              value={foundPatient?.firstName || formData.firstName}
                              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                              className="transition-all duration-300 focus:ring-2 focus:ring-[#581c87]"
                              readOnly={!!foundPatient}
                            />
                            {foundPatient && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                From Palm Scan
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="lastName" className="flex items-center gap-2">
                              <User className="h-4 w-4 text-[#581c87]" />
                              Last Name *
                            </Label>
                            <Input
                              id="lastName"
                              value={foundPatient?.lastName || formData.lastName}
                              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                              className="transition-all duration-300 focus:ring-2 focus:ring-[#581c87]"
                              readOnly={!!foundPatient}
                            />
                            {foundPatient && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                From Palm Scan
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="dob" className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-[#581c87]" />
                              Date of Birth *
                            </Label>
                            <Input
                              id="dob"
                              type="date"
                              value={foundPatient?.dateOfBirth || formData.dateOfBirth}
                              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                              className="transition-all duration-300 focus:ring-2 focus:ring-[#581c87]"
                              readOnly={!!foundPatient}
                            />
                            {foundPatient && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                From Palm Scan
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                              <User className="h-4 w-4 text-[#581c87]" />
                              Gender *
                            </Label>
                            <Select
                              value={foundPatient?.gender || formData.gender}
                              onValueChange={(value) => setFormData({ ...formData, gender: value })}
                              disabled={!!foundPatient}
                            >
                              <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-[#581c87]">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            {foundPatient && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                From Palm Scan
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone" className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-[#581c87]" />
                              Phone *
                            </Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={foundPatient?.phone || formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="transition-all duration-300 focus:ring-2 focus:ring-[#581c87]"
                              readOnly={!!foundPatient}
                            />
                            {foundPatient && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                From Palm Scan
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-[#581c87]" />
                              Email
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={foundPatient?.email || formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="transition-all duration-300 focus:ring-2 focus:ring-[#581c87]"
                              readOnly={!!foundPatient}
                            />
                            {foundPatient && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                From Palm Scan
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-[#581c87]" />
                            Address
                          </Label>
                          <Input
                            id="address"
                            value={foundPatient?.address || formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Street Address"
                            className="transition-all duration-300 focus:ring-2 focus:ring-[#581c87]"
                            readOnly={!!foundPatient}
                          />
                          {foundPatient && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              From Palm Scan
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-6">
                          <Button variant="outline" className="hover:bg-gray-50">
                            Cancel
                          </Button>
                          {foundPatient ? (
                            <Button
                              onClick={handleUpdatePalmRecord}
                              className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white"
                            >
                              Update Palm Record
                            </Button>
                          ) : (
                            <Button className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white">
                              Register Patient
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </TabsContent>

                  {/* Search Patients */}
                  <TabsContent value="search">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Find Patient Record</h3>
                          <p className="text-sm text-gray-600 mb-6">Search by PalmCareConnect ID or use palm scan</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <Input
                              placeholder="Enter PalmCareConnect ID"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="transition-all duration-300 focus:ring-2 focus:ring-[#581c87]"
                            />
                          </div>
                          <Button variant="outline" className="hover:bg-gray-50">
                            Search by Phone
                          </Button>
                          <Button
                            onClick={handleSearch}
                            className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white"
                          >
                            <Search className="h-4 w-4 mr-2" />
                            Search
                          </Button>
                        </div>

                        <div className="text-center py-8">
                          <p className="text-gray-500 mb-4">OR</p>
                          <Button
                            onClick={handlePalmScan}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                          >
                            <Hand className="h-4 w-4 mr-2" />
                            Use Palm Scan
                          </Button>
                          <p className="text-sm text-gray-500 mt-4">
                            Scan your palm, search by ID, or search by phone number to retrieve information
                          </p>
                        </div>

                        {foundPatient && palmScanState === "idle" && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Card className="bg-blue-50 border-blue-200">
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-blue-900">PalmCareConnect ID: {foundPatient.id}</CardTitle>
                                  <Badge className="bg-blue-100 text-blue-800">
                                    Patient found! Form pre-populated with patient data.
                                  </Badge>
                                </div>
                                <p className="text-blue-700">
                                  Profile retrieved from PalmCareConnect. Pre-populated fields are marked below.
                                </p>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                                  <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-blue-700">
                                      First Name *{" "}
                                      <Badge variant="outline" className="text-xs">
                                        From Palm
                                      </Badge>
                                    </Label>
                                    <Input value={foundPatient.firstName} readOnly className="bg-blue-50" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-blue-700">
                                      Last Name *{" "}
                                      <Badge variant="outline" className="text-xs">
                                        From Palm
                                      </Badge>
                                    </Label>
                                    <Input value={foundPatient.lastName} readOnly className="bg-blue-50" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-blue-700">
                                      Date of Birth *{" "}
                                      <Badge variant="outline" className="text-xs">
                                        From Palm
                                      </Badge>
                                    </Label>
                                    <Input value={foundPatient.dateOfBirth} readOnly className="bg-blue-50" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-blue-700">
                                      Gender *{" "}
                                      <Badge variant="outline" className="text-xs">
                                        From Palm
                                      </Badge>
                                    </Label>
                                    <Input value={foundPatient.gender} readOnly className="bg-blue-50" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-blue-700">
                                      Phone *{" "}
                                      <Badge variant="outline" className="text-xs">
                                        From Palm
                                      </Badge>
                                    </Label>
                                    <Input value={foundPatient.phone} readOnly className="bg-blue-50" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-blue-700">
                                      Email{" "}
                                      <Badge variant="outline" className="text-xs">
                                        From Palm
                                      </Badge>
                                    </Label>
                                    <Input value={foundPatient.email} readOnly className="bg-blue-50" />
                                  </div>
                                </div>
                                <div className="flex justify-end mt-6">
                                  <Button className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white">
                                    Update Palm Record
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Palm Scan Modal */}
      <PalmScanModal />
      {/* Update Palm Modal */}
      <UpdatePalmModal />
    </div>
  )
}
