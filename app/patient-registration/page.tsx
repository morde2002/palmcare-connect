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
import { UserPlus, Search, Hand, Phone, Calendar, User, Mail, MapPin, CheckCircle, Menu, X } from "lucide-react"
import Sidebar from "@/components/sidebar"
import MobileSidebar from "@/components/mobile-sidebar"

interface Patient {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  phone: string
  email: string
  address: string
  city?: string
  state?: string
  zip?: string
  emergencyContact?: {
    name: string
    phone: string
  }
  medicalInfo?: {
    allergies: string
    history: string
  }
}

interface FormData {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  phone: string
  email: string
  address: string
}

export default function PatientRegistration() {
  const [activeTab, setActiveTab] = useState("new")
  const [searchQuery, setSearchQuery] = useState("")
  const [foundPatient, setFoundPatient] = useState<Patient | null>(null)
  const [showPalmScanModal, setShowPalmScanModal] = useState(false)
  const [scanStage, setScanStage] = useState("initial") // initial, scanning, complete
  const [scanProgress, setScanProgress] = useState(0)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [formData, setFormData] = useState<FormData>({
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
        dateOfBirth: "1985-06-15",
        gender: "Female",
        phone: "555-123-4567",
        email: "emily.j@example.com",
        address: "123 Oak Street",
        city: "Springfield",
        state: "IL",
        zip: "62704",
        emergencyContact: {
          name: "David Johnson",
          phone: "555-987-6543",
        },
        medicalInfo: {
          allergies: "",
          history: "Hypertension",
        },
      })
    }
  }

  const handlePalmScan = () => {
    setShowPalmScanModal(true)
    setScanStage("initial")
    setScanProgress(0)

    // Start scanning animation after a brief delay
    setTimeout(() => {
      setScanStage("scanning")

      // Progress animation
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)

            // Show completion after scan reaches 100%
            setTimeout(() => {
              setScanStage("complete")
              setFoundPatient({
                id: "PC123456",
                firstName: "Emily",
                lastName: "Johnson",
                dateOfBirth: "1985-06-15",
                gender: "Female",
                phone: "555-123-4567",
                email: "emily.j@example.com",
                address: "123 Oak Street",
                city: "Springfield",
                state: "IL",
                zip: "62704",
                emergencyContact: {
                  name: "David Johnson",
                  phone: "555-987-6543",
                },
                medicalInfo: {
                  allergies: "",
                  history: "Hypertension",
                },
              })
            }, 1000)
            return 100
          }
          return prev + 1
        })
      }, 30)
    }, 500)
  }

  const handleContinueAfterScan = () => {
    setShowPalmScanModal(false)
    setActiveTab("new") // Switch to new patient tab
  }

  const handleUpdatePalmRecord = () => {
    setShowUpdateModal(true)
  }

  const processUpdatePalmRecord = () => {
    setShowUpdateModal(false)
    // Simulate update process
    setTimeout(() => {
      alert("Palm record updated successfully!")
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <MobileSidebar />

      {/* Update Palm Record Modal */}


      <main className="lg:ml-64 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="p-4 lg:p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex justify-between items-center mb-6 lg:mb-8">
              <div className="flex items-center gap-4">

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
                          {foundPatient ? (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="bg-blue-100 p-1 rounded-md">
                                  <CheckCircle className="w-4 h-4 text-blue-600" />
                                </div>
                                <p className="font-medium text-blue-900">Patient found with ID: {foundPatient.id}</p>
                              </div>
                              <p className="text-sm text-blue-700">
                                Profile retrieved from PalmCareConnect. Pre-populated fields are marked below.
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-600 mb-6">Enter the patient's personal details</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="firstName" className="flex items-center gap-2">
                              <User className="h-4 w-4 text-[#581c87]" />
                              First Name *
                              {foundPatient && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                  From Palm
                                </Badge>
                              )}
                            </Label>
                            <Input
                              id="firstName"
                              value={foundPatient?.firstName || formData.firstName}
                              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                              className="transition-all duration-300 focus:ring-2 focus:ring-[#581c87]"
                              readOnly={!!foundPatient}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="lastName" className="flex items-center gap-2">
                              <User className="h-4 w-4 text-[#581c87]" />
                              Last Name *
                              {foundPatient && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                  From Palm
                                </Badge>
                              )}
                            </Label>
                            <Input
                              id="lastName"
                              value={foundPatient?.lastName || formData.lastName}
                              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                              className="transition-all duration-300 focus:ring-2 focus:ring-[#581c87]"
                              readOnly={!!foundPatient}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="dob" className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-[#581c87]" />
                              Date of Birth *
                              {foundPatient && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                  From Palm
                                </Badge>
                              )}
                            </Label>
                            <Input
                              id="dob"
                              type="date"
                              value={foundPatient?.dateOfBirth || formData.dateOfBirth}
                              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                              className="transition-all duration-300 focus:ring-2 focus:ring-[#581c87]"
                              readOnly={!!foundPatient}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                              <User className="h-4 w-4 text-[#581c87]" />
                              Gender *
                              {foundPatient && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                  From Palm
                                </Badge>
                              )}
                            </Label>
                            {foundPatient ? (
                              <Input
                                value={foundPatient.gender}
                                readOnly
                                className="transition-all duration-300 focus:ring-2 focus:ring-[#581c87]"
                              />
                            ) : (
                              <Select
                                value={formData.gender}
                                onValueChange={(value) => setFormData({ ...formData, gender: value })}
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
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone" className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-[#581c87]" />
                              Phone *
                              {foundPatient && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                  From Palm
                                </Badge>
                              )}
                            </Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={foundPatient?.phone || formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="transition-all duration-300 focus:ring-2 focus:ring-[#581c87]"
                              readOnly={!!foundPatient}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-[#581c87]" />
                              Email
                              {foundPatient && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                  From Palm
                                </Badge>
                              )}
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={foundPatient?.email || formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="transition-all duration-300 focus:ring-2 focus:ring-[#581c87]"
                              readOnly={!!foundPatient}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-[#581c87]" />
                            Address
                            {foundPatient && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                From Palm
                              </Badge>
                            )}
                          </Label>
                          <Input
                            id="address"
                            value={foundPatient?.address || formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Street Address"
                            className="transition-all duration-300 focus:ring-2 focus:ring-[#581c87]"
                            readOnly={!!foundPatient}
                          />
                        </div>

                        {foundPatient && (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="city" className="flex items-center gap-2">
                                  City
                                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                    From Palm
                                  </Badge>
                                </Label>
                                <Input id="city" value={foundPatient.city} readOnly />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="state" className="flex items-center gap-2">
                                  State
                                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                    From Palm
                                  </Badge>
                                </Label>
                                <Input id="state" value={foundPatient.state} readOnly />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="zip" className="flex items-center gap-2">
                                  ZIP Code
                                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                    From Palm
                                  </Badge>
                                </Label>
                                <Input id="zip" value={foundPatient.zip} readOnly />
                              </div>
                            </div>

                            <div>
                              <h4 className="text-md font-semibold text-gray-900 mb-4">Emergency Contact</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="emergencyName" className="flex items-center gap-2">
                                    Contact Name
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                    >
                                      From Palm
                                    </Badge>
                                  </Label>
                                  <Input id="emergencyName" value={foundPatient.emergencyContact?.name} readOnly />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="emergencyPhone" className="flex items-center gap-2">
                                    Contact Phone
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                    >
                                      From Palm
                                    </Badge>
                                  </Label>
                                  <Input id="emergencyPhone" value={foundPatient.emergencyContact?.phone} readOnly />
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-md font-semibold text-gray-900 mb-4">Medical Information</h4>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="allergies" className="flex items-center gap-2">
                                    Allergies
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                    >
                                      From Palm
                                    </Badge>
                                  </Label>
                                  <Input id="allergies" value={foundPatient.medicalInfo?.allergies} readOnly />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="medicalHistory" className="flex items-center gap-2">
                                    Medical History
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                    >
                                      From Palm
                                    </Badge>
                                  </Label>
                                  <Input id="medicalHistory" value={foundPatient.medicalInfo?.history} readOnly />
                                </div>
                              </div>
                            </div>
                          </>
                        )}

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

                        {foundPatient && (
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
                                  <Button
                                    onClick={() => setActiveTab("new")}
                                    className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white"
                                  >
                                    View Complete Record
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
      <AnimatePresence>
        {showPalmScanModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
            >
              <AnimatePresence mode="wait">
                {scanStage === "initial" && (
                  <motion.div
                    key="initial"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-6"
                  >
                    <motion.div
                      className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    >
                      <Hand className="w-12 h-12 text-blue-500" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Place Palm on Scanner</h3>
                      <p className="text-gray-600">Position your palm on the scanner to retrieve information</p>
                    </div>
                    <div className="flex justify-center space-x-4">
                      <Button variant="outline" onClick={() => setShowPalmScanModal(false)} className="px-8">
                        Cancel
                      </Button>
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-8"
                        onClick={() => setScanStage("scanning")}
                      >
                        Start Scan
                      </Button>
                    </div>
                  </motion.div>
                )}

                {scanStage === "scanning" && (
                  <motion.div
                    key="scanning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-6"
                  >
                    <motion.div className="relative mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
                      <Hand className="w-12 h-12 text-blue-500" />

                      {/* Scanning effect */}
                      <motion.div
                        className="absolute inset-0 w-full bg-blue-200/30"
                        initial={{ height: "0%", top: "100%" }}
                        animate={{
                          height: ["0%", "100%", "0%"],
                          top: ["100%", "0%", "0%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      />
                    </motion.div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Scanning Palm...</h3>
                      <p className="text-gray-600 mb-4">Please keep your hand steady on the scanner</p>

                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <motion.div className="bg-blue-500 h-2 rounded-full" style={{ width: `${scanProgress}%` }} />
                      </div>
                      <p className="text-sm text-gray-500">{Math.round(scanProgress)}% Complete</p>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowPalmScanModal(false)
                        setScanStage("initial")
                      }}
                    >
                      Cancel
                    </Button>
                  </motion.div>
                )}

                {scanStage === "complete" && (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-6"
                  >
                    <motion.div
                      className="mx-auto w-24 h-24 bg-green-50 rounded-full flex items-center justify-center"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </motion.div>

                    <div>
                      <h3 className="text-xl font-bold text-green-800 mb-2">Patient Found!</h3>
                      <p className="text-gray-600">Palm scan successful. Patient data retrieved.</p>

                      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="font-medium text-green-800">PalmCareConnect ID: {foundPatient?.id}</p>
                        <p className="text-green-700">
                          {foundPatient?.firstName} {foundPatient?.lastName}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={handleContinueAfterScan}
                      className="bg-green-500 hover:bg-green-600 text-white w-full"
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

      {/* Update Palm Modal */}
      <AnimatePresence>
        {showUpdateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
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
                    Keeping biometric records current ensures faster check-ins for future visits and more accurate
                    patient identification.
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
    </div>
  )
}
