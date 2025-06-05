"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Pill,
  Plus,
  Search,
  Clock,
  CheckCircle,
  AlertTriangle,
  Printer,
  Send,
  FileText,
  Trash2,
  Info,
  X,
  ChevronRight,
  AlertCircle,
  CheckSquare,
  Loader2,
  ArrowRight,
  Clipboard,
  RefreshCw,
} from "lucide-react"
import Sidebar from "@/components/sidebar"
import MobileSidebar from "@/components/mobile-sidebar"
import { useToast } from "@/components/ui/use-toast"
import ScrollToTop from "@/components/scroll-to-top"
import { PageTransition } from "@/components/page-transition"
import { useAppContext } from "@/components/app-context"

interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
  strength?: string
  stock?: number
  reorderLevel?: number
  category?: string
}

interface Prescription {
  id: string
  name: string
  age: number
  diagnosis: string
  doctor: string
  orderTime: string
  status: "pending" | "ready" | "dispensed"
  medications: Medication[]
}

interface AlertItem {
  id: string
  type: "low-stock" | "expiring" | "recall"
  message: string
  severity: "high" | "medium" | "low"
  timestamp: string
  category?: string
  name?: string
  strength?: string
  stock?: number
  reorderLevel?: number
}

const prescriptionQueue: Prescription[] = [
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
  {
    id: "P-1251",
    name: "Emily Wilson",
    age: 34,
    diagnosis: "Migraine",
    doctor: "Dr. Martinez",
    orderTime: "1:45 PM",
    status: "pending",
    medications: [
      { name: "Sumatriptan", dosage: "50mg", frequency: "As needed", duration: "30 days" },
      { name: "Propranolol", dosage: "40mg", frequency: "Twice daily", duration: "60 days" },
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
  {
    id: "P-1230",
    name: "Sarah Thompson",
    completedTime: "9:30 AM",
    medications: ["Levothyroxine 75mcg", "Vitamin D 1000IU"],
    status: "dispensed",
  },
]

const medicationInventory = [
  { name: "Lisinopril", strength: "10mg", stock: 120, reorderLevel: 30, category: "Cardiovascular" },
  { name: "Metformin", strength: "500mg", stock: 85, reorderLevel: 40, category: "Diabetes" },
  { name: "Metformin", strength: "1000mg", stock: 62, reorderLevel: 30, category: "Diabetes" },
  { name: "Amoxicillin", strength: "500mg", stock: 45, reorderLevel: 25, category: "Antibiotics" },
  { name: "Atorvastatin", strength: "20mg", stock: 78, reorderLevel: 20, category: "Cardiovascular" },
  { name: "Levothyroxine", strength: "75mcg", stock: 56, reorderLevel: 15, category: "Hormones" },
  { name: "Ibuprofen", strength: "400mg", stock: 110, reorderLevel: 40, category: "Pain Relief" },
  { name: "Sumatriptan", strength: "50mg", stock: 32, reorderLevel: 15, category: "Neurology" },
  { name: "Propranolol", strength: "40mg", stock: 48, reorderLevel: 20, category: "Cardiovascular" },
  { name: "Glipizide", strength: "5mg", stock: 54, reorderLevel: 25, category: "Diabetes" },
  { name: "Vitamin D", strength: "1000IU", stock: 95, reorderLevel: 30, category: "Supplements" },
]

const frequencyOptions = [
  { value: "once", label: "Once daily" },
  { value: "twice", label: "Twice daily" },
  { value: "three", label: "Three times daily" },
  { value: "four", label: "Four times daily" },
  { value: "asneeded", label: "As needed" },
]

export default function Prescription() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("queue")
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(prescriptionQueue)
  const [completed, setCompleted] = useState(completedPrescriptions)
  const [inventory, setInventory] = useState(medicationInventory)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showMedicationDialog, setShowMedicationDialog] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showPrintDialog, setShowPrintDialog] = useState(false)
  const [showAlertDialog, setShowAlertDialog] = useState(false)
  const [alertItem, setAlertItem] = useState<AlertItem | null>(null)
  const [inventoryFilter, setInventoryFilter] = useState("all")
  const [refreshing, setRefreshing] = useState(false)
  const { simulateAction } = useAppContext()

  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
  })

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  }

  useEffect(() => {
    // Simulate loading state
    if (activeTab === "inventory") {
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [activeTab])

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setRefreshing(false)
  }

  // Filter inventory based on search term and category filter
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase())

    if (inventoryFilter === "all") return matchesSearch
    if (inventoryFilter === "low" && item.stock <= item.reorderLevel) return matchesSearch
    if (inventoryFilter === item.category?.toLowerCase()) return matchesSearch

    return false
  })

  const getStatusColor = (status: Prescription["status"]) => {
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

  type InventoryItem = {
    name: string
    strength: string
    stock: number
    reorderLevel: number
    category: string
  }

  const getStockStatus = (item: { stock?: number; reorderLevel?: number }) => {
    const stock = item.stock ?? 0
    const reorderLevel = item.reorderLevel ?? 0
    if (stock <= reorderLevel * 0.5) {
      return { color: "bg-red-100 text-red-800 border-red-200", label: "Critical" }
    } else if (stock <= reorderLevel) {
      return { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Low" }
    }
    return { color: "bg-green-100 text-green-800 border-green-200", label: "In Stock" }
  }

  const handlePrescriptionSelect = (prescription: Prescription) => {
    setSelectedPrescription(prescription)
    setActiveTab("processing")
  }

  const handleAddMedication = () => {
    if (selectedPrescription) {
      const newMedication = {
        name: "New Medication",
        dosage: "1 tablet",
        frequency: "Once daily",
        duration: "7 days",
        stock: 100,
        reorderLevel: 20,
        strength: "500mg",
      }

      const updatedPrescription = {
        ...selectedPrescription,
        medications: [...selectedPrescription.medications, newMedication],
      }

      setPrescriptions(prescriptions.map((p) => (p.id === selectedPrescription.id ? updatedPrescription : p)))
      setSelectedPrescription(updatedPrescription)
    }
  }

  const handleRemoveMedication = (index: number) => {
    if (selectedPrescription) {
      const updatedMedications = [...selectedPrescription.medications]
      updatedMedications.splice(index, 1)

      const updatedPrescription = {
        ...selectedPrescription,
        medications: updatedMedications,
      }

      setPrescriptions(prescriptions.map((p) => (p.id === selectedPrescription.id ? updatedPrescription : p)))
      setSelectedPrescription(updatedPrescription)
    }
  }

  const handleMarkAsReady = () => {
    if (selectedPrescription) {
      setIsProcessing(true)
      simulateAction("Marking prescription as ready", 1200).then(() => {
        setTimeout(() => {
          const updatedPrescription = {
            ...selectedPrescription,
            status: "ready" as const,
          }

          setPrescriptions(prescriptions.map((p) => (p.id === selectedPrescription.id ? updatedPrescription : p)))
          setSelectedPrescription(updatedPrescription)

          toast({
            title: "Status Updated",
            description: `Prescription ${selectedPrescription.id} is now ready for dispensing`,
          })

          setIsProcessing(false)
        }, 1000)
      })
    }
  }

  const handleDispense = () => {
    if (selectedPrescription) {
      setIsProcessing(true)
      simulateAction("Dispensing prescription", 1500).then(() => {
        setTimeout(() => {
          setPrescriptions(prescriptions.filter((p) => p.id !== selectedPrescription.id))

          const newCompletedPrescription = {
            id: selectedPrescription.id,
            name: selectedPrescription.name,
            completedTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            medications: selectedPrescription.medications.map((m) => `${m.name} ${m.dosage}`),
            status: "dispensed" as const,
            age: selectedPrescription.age,
            diagnosis: selectedPrescription.diagnosis,
            orderTime: selectedPrescription.orderTime,
          }

          setCompleted([...completed, newCompletedPrescription])

          toast({
            title: "Prescription Dispensed",
            description: `Prescription ${selectedPrescription.id} has been successfully dispensed`,
            variant: "success",
          })

          setIsProcessing(false)
          setSelectedPrescription(null)
          setActiveTab("queue")
        }, 1000)
      })
    }
  }

  const handlePrintLabel = () => {
    setShowPrintDialog(true)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setIsSearching(!!e.target.value)
  }

  const handleAlertClick = (item: AlertItem | Medication) => {
    setAlertItem(item as AlertItem)
    setShowAlertDialog(true)
  }

  const reorderMedication = () => {
    if (alertItem) {
      setIsProcessing(true)

      // Simulate processing delay
      setTimeout(() => {
        toast({
          title: "Reorder Placed",
          description: `Reorder for ${alertItem.name} ${alertItem.strength} has been placed`,
        })

        setIsProcessing(false)
        setShowAlertDialog(false)
      }, 800)
    }
  }

  const handleAddAlert = () => {
    const newAlert: AlertItem = {
      id: `alert-${Date.now()}`,
      type: "low-stock",
      message: "Low stock alert for medication",
      severity: "high",
      timestamp: new Date().toISOString(),
      category: "Pharmacy",
    }
    setAlertItem(newAlert)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <MobileSidebar />
      <main className="lg:ml-64 p-3 sm:p-4 lg:p-8 pt-20 sm:pt-24 lg:pt-8">
        <div className="p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Header with same design as Triage */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 mb-6 sm:mb-8"
            >
              <div>
                <motion.h1
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2 sm:gap-3"
                  animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                  transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                >
                  <motion.div
                    className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Pill className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </motion.div>
                  Prescription Management
                </motion.h1>
                <motion.p
                  className="text-sm sm:text-base text-gray-600"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  Manage prescriptions and medication dispensing
                </motion.p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="w-full sm:w-auto bg-white/80 backdrop-blur-sm hover:bg-white h-10 sm:h-9"
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
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto bg-white/80 backdrop-blur-sm hover:bg-white group transition-all duration-200 h-10 sm:h-9"
                    onClick={() => {
                      setSearchTerm("")
                      toast({
                        title: "Search Activated",
                        description: "Enter patient name or ID to search prescriptions",
                      })
                    }}
                  >
                    <Search className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    Search Prescriptions
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    className="w-full sm:w-auto bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white group transition-all duration-200 h-10 sm:h-9"
                    onClick={() => {
                      toast({
                        title: "New Prescription",
                        description: "Create a new prescription form",
                      })
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    New Prescription
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pending</p>
                        <motion.p
                          className="text-3xl font-bold text-gray-900 mt-2"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          {prescriptions.filter((p) => p.status === "pending").length}
                        </motion.p>
                      </div>
                      <motion.div
                        className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-lg group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Clock className="h-6 w-6 text-white" />
                      </motion.div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Ready</p>
                        <motion.p
                          className="text-3xl font-bold text-gray-900 mt-2"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          {prescriptions.filter((p) => p.status === "ready").length}
                        </motion.p>
                      </div>
                      <motion.div
                        className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 shadow-lg group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CheckCircle className="h-6 w-6 text-white" />
                      </motion.div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Dispensed Today</p>
                        <motion.p
                          className="text-3xl font-bold text-gray-900 mt-2"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          {completed.length}
                        </motion.p>
                      </div>
                      <motion.div
                        className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Pill className="h-6 w-6 text-white" />
                      </motion.div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                  onClick={() => {
                    setActiveTab("inventory")
                    setInventoryFilter("low")
                  }}
                >
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Alerts</p>
                        <motion.p
                          className="text-3xl font-bold text-gray-900 mt-2"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          {inventory.filter((item) => item.stock <= item.reorderLevel).length}
                        </motion.p>
                      </div>
                      <motion.div
                        className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 shadow-lg group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <AlertTriangle className="h-6 w-6 text-white" />
                      </motion.div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger
                  value="queue"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Clock className="h-4 w-4 transition-transform group-data-[state=active]:rotate-0 group-hover:rotate-12 duration-300" />
                    Prescription Queue
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#581c87] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </TabsTrigger>
                <TabsTrigger
                  value="processing"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Pill className="h-4 w-4 transition-transform group-data-[state=active]:rotate-0 group-hover:rotate-12 duration-300" />
                    Processing
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#581c87] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </TabsTrigger>
                <TabsTrigger
                  value="dispensed"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 transition-transform group-data-[state=active]:rotate-0 group-hover:rotate-12 duration-300" />
                    Dispensed
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#581c87] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </TabsTrigger>
                <TabsTrigger
                  value="inventory"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <FileText className="h-4 w-4 transition-transform group-data-[state=active]:rotate-0 group-hover:rotate-12 duration-300" />
                    Inventory
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#581c87] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </TabsTrigger>
              </TabsList>

              {/* Prescription Queue */}
              <TabsContent value="queue">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Pill className="h-5 w-5 text-[#581c87]" />
                        Prescription Queue
                      </CardTitle>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">Click on a prescription to process</p>
                        <div className="relative">
                          <Input
                            placeholder="Search prescriptions..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-64 pl-8 bg-white/80 backdrop-blur-sm"
                          />
                          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          {isSearching && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                              onClick={() => setSearchTerm("")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <AnimatePresence>
                        {prescriptions.length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-12"
                          >
                            <Pill className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Prescriptions in Queue</h3>
                            <p className="text-gray-500">All prescriptions have been processed</p>
                          </motion.div>
                        ) : (
                          <motion.div
                            className="space-y-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            {prescriptions
                              .filter(
                                (prescription) =>
                                  prescription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  prescription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()),
                              )
                              .map((prescription, index) => (
                                <motion.div
                                  key={prescription.id}
                                  variants={itemVariants}
                                  className="p-4 sm:p-6 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer group bg-gray-50/80 hover:bg-gray-100/80"
                                  onClick={() => handlePrescriptionSelect(prescription)}
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                >
                                  <div className="flex flex-col space-y-4 lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
                                    <div className="flex items-start gap-3 sm:gap-4">
                                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-[#581c87] to-[#312e81] rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg group-hover:scale-110 transition-transform duration-300">
                                        {prescription.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                                            {prescription.name}
                                          </h3>
                                          <Badge className={`${getStatusColor(prescription.status)} text-xs`}>
                                            <span className="flex items-center gap-1">
                                              {prescription.status === "pending" && <Clock className="h-3 w-3" />}
                                              {prescription.status === "ready" && <CheckCircle className="h-3 w-3" />}
                                              {prescription.status}
                                            </span>
                                          </Badge>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                                          <p>ID: {prescription.id}</p>
                                          <p>Age: {prescription.age}</p>
                                          <p>Ordered: {prescription.orderTime}</p>
                                        </div>
                                        <div className="mb-3">
                                          <p className="text-xs sm:text-sm font-medium text-gray-700">
                                            Diagnosis: {prescription.diagnosis}
                                          </p>
                                          <p className="text-xs sm:text-sm text-gray-600">
                                            Prescribed by: {prescription.doctor}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                            Medications:
                                          </p>
                                          <div className="space-y-1">
                                            {prescription.medications.map((med, idx) => (
                                              <div
                                                key={idx}
                                                className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 rounded group-hover:bg-gray-100 transition-colors duration-200"
                                              >
                                                <span className="font-medium">{med.name}</span> - {med.dosage},{" "}
                                                {med.frequency} for {med.duration}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                      <Button className="w-full sm:w-auto bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white group-hover:scale-105 transition-transform duration-300 text-xs sm:text-sm h-8 sm:h-9">
                                        <span className="flex items-center gap-1 sm:gap-2">
                                          Process
                                          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                        </span>
                                      </Button>
                                    </motion.div>
                                  </div>
                                </motion.div>
                              ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
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
                      <Card className="bg-gradient-to-r from-[#581c87]/5 to-[#312e81]/5 border-[#581c87]/20 overflow-hidden">
                        <CardContent className="p-4 sm:p-6">
                          <motion.div
                            className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                          >
                            <div className="flex items-center gap-3 sm:gap-4">
                              <motion.div
                                className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-[#581c87] to-[#312e81] rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-2xl"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
                                {selectedPrescription.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </motion.div>
                              <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                  {selectedPrescription.name}
                                </h2>
                                <p className="text-sm sm:text-base text-gray-600">
                                  Patient ID: {selectedPrescription.id}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500">Age: {selectedPrescription.age}</p>
                                <p className="text-xs sm:text-sm text-gray-500">
                                  Diagnosis: {selectedPrescription.diagnosis}
                                </p>
                              </div>
                            </div>
                            <div className="text-left sm:text-right">
                              <Badge className={`${getStatusColor(selectedPrescription.status)} text-xs`}>
                                <span className="flex items-center gap-1">
                                  {selectedPrescription.status === "pending" && <Clock className="h-3 w-3" />}
                                  {selectedPrescription.status === "ready" && <CheckCircle className="h-3 w-3" />}
                                  {selectedPrescription.status}
                                </span>
                              </Badge>
                              <p className="text-xs sm:text-sm text-gray-600 mt-2">
                                <Clock className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
                                Ordered: {selectedPrescription.orderTime}
                              </p>
                            </div>
                          </motion.div>
                        </CardContent>
                      </Card>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Current Medications */}
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Pill className="h-5 w-5 text-[#581c87]" />
                              Prescribed Medications
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <AnimatePresence>
                              {selectedPrescription.medications.map((med, idx) => (
                                <motion.div
                                  key={`${med.name}-${idx}`}
                                  className="p-4 border rounded-lg hover:shadow-sm transition-all duration-200 group bg-gray-50/80 hover:bg-gray-100/80"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  layout
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-gray-900">{med.name}</h4>
                                      <p className="text-sm text-gray-600">Dosage: {med.dosage}</p>
                                      <p className="text-sm text-gray-600">Frequency: {med.frequency}</p>
                                      <p className="text-sm text-gray-600">Duration: {med.duration}</p>
                                      {med.instructions && (
                                        <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded">
                                          <span className="font-medium">Instructions:</span> {med.instructions}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex gap-2">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Badge variant="outline" className="text-xs">
                                              In Stock
                                            </Badge>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Medication available in inventory</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleRemoveMedication(idx)
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                      </Button>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </AnimatePresence>

                            <Button
                              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 group"
                              onClick={() => setShowMedicationDialog(true)}
                            >
                              <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                              Add Medication
                            </Button>
                          </CardContent>
                        </Card>

                        {/* Add Medication */}
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Info className="h-5 w-5 text-[#581c87]" />
                              Prescription Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-4">
                              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                                  <Info className="h-4 w-4" />
                                  Patient Information
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <p className="text-blue-700">
                                    <span className="font-medium">Age:</span> {selectedPrescription.age}
                                  </p>
                                  <p className="text-blue-700">
                                    <span className="font-medium">Weight:</span> 68 kg
                                  </p>
                                  <p className="text-blue-700">
                                    <span className="font-medium">Height:</span> 172 cm
                                  </p>
                                  <p className="text-blue-700">
                                    <span className="font-medium">Allergies:</span> None
                                  </p>
                                </div>
                              </div>

                              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4" />
                                  Diagnosis & Notes
                                </h4>
                                <p className="text-sm text-yellow-700 mb-2">
                                  <span className="font-medium">Diagnosis:</span> {selectedPrescription.diagnosis}
                                </p>
                                <p className="text-sm text-yellow-700">
                                  <span className="font-medium">Doctor's Notes:</span> Patient reports symptoms for the
                                  past 2 weeks. Follow-up appointment scheduled in 30 days.
                                </p>
                              </div>

                              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                                  <CheckSquare className="h-4 w-4" />
                                  Prescription Details
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <p className="text-green-700">
                                    <span className="font-medium">Prescribed by:</span> {selectedPrescription.doctor}
                                  </p>
                                  <p className="text-green-700">
                                    <span className="font-medium">Date:</span> {new Date().toLocaleDateString()}
                                  </p>
                                  <p className="text-green-700">
                                    <span className="font-medium">Time:</span> {selectedPrescription.orderTime}
                                  </p>
                                  <p className="text-green-700">
                                    <span className="font-medium">Status:</span> {selectedPrescription.status}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Actions */}
                      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex justify-end gap-3">
                            <Button variant="outline" className="group" onClick={handlePrintLabel}>
                              <Printer className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                              Print Label
                            </Button>
                            <Button
                              variant="outline"
                              className="group"
                              onClick={() => {
                                toast({
                                  title: "Instructions Generated",
                                  description: "Patient instructions have been generated and are ready to print",
                                })
                              }}
                            >
                              <FileText className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                              Patient Instructions
                            </Button>
                            {selectedPrescription.status === "pending" && (
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white group"
                                  onClick={handleMarkAsReady}
                                  disabled={isProcessing}
                                >
                                  {isProcessing ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                                  )}
                                  Mark as Ready
                                </Button>
                              </motion.div>
                            )}
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white group"
                                onClick={handleDispense}
                                disabled={isProcessing}
                              >
                                {isProcessing ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Send className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                                )}
                                Dispense
                              </Button>
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardContent className="p-12 text-center">
                        <Pill className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Prescription Selected</h3>
                        <p className="text-gray-500">Select a prescription from the queue to process</p>
                        <Button
                          className="mt-6 bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white"
                          onClick={() => setActiveTab("queue")}
                        >
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Go to Queue
                        </Button>
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
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Dispensed Prescriptions
                      </CardTitle>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">Prescriptions that have been dispensed today</p>
                        <div className="relative">
                          <Input
                            placeholder="Search dispensed..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-64 pl-8 bg-white/80 backdrop-blur-sm"
                          />
                          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          {isSearching && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                              onClick={() => setSearchTerm("")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <AnimatePresence>
                        {completed.length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-12"
                          >
                            <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Dispensed Prescriptions</h3>
                            <p className="text-gray-500">No prescriptions have been dispensed today</p>
                          </motion.div>
                        ) : (
                          <motion.div
                            className="space-y-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            {completed
                              .filter(
                                (prescription) =>
                                  prescription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  prescription.id.toLowerCase().includes(searchTerm.toLowerCase()),
                              )
                              .map((prescription, index) => (
                                <motion.div
                                  key={prescription.id}
                                  variants={itemVariants}
                                  className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 group bg-green-50/80"
                                  whileHover={{ scale: 1.01 }}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform duration-300">
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
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="group/btn bg-white/80 backdrop-blur-sm hover:bg-white"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          toast({
                                            title: "Receipt Printed",
                                            description: `Receipt for ${prescription.id} has been sent to the printer`,
                                          })
                                        }}
                                      >
                                        <Printer className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
                                        Reprint
                                      </Button>
                                      <Button
                                        size="sm"
                                        className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white group/btn"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          toast({
                                            title: "Viewing Details",
                                            description: `Viewing details for prescription ${prescription.id}`,
                                          })
                                        }}
                                      >
                                        <span className="flex items-center gap-2">
                                          View Details
                                          <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                        </span>
                                      </Button>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
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
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-[#581c87]" />
                        Medication Inventory
                      </CardTitle>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div className="flex gap-2">
                          <Button
                            variant={inventoryFilter === "all" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setInventoryFilter("all")}
                            className={inventoryFilter === "all" ? "bg-[#581c87] hover:bg-[#6b21a8]" : ""}
                          >
                            All
                          </Button>
                          <Button
                            variant={inventoryFilter === "low" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setInventoryFilter("low")}
                            className={inventoryFilter === "low" ? "bg-[#581c87] hover:bg-[#6b21a8]" : ""}
                          >
                            Low Stock
                          </Button>
                          <Button
                            variant={inventoryFilter === "cardiovascular" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setInventoryFilter("cardiovascular")}
                            className={inventoryFilter === "cardiovascular" ? "bg-[#581c87] hover:bg-[#6b21a8]" : ""}
                          >
                            Cardiovascular
                          </Button>
                          <Button
                            variant={inventoryFilter === "diabetes" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setInventoryFilter("diabetes")}
                            className={inventoryFilter === "diabetes" ? "bg-[#581c87] hover:bg-[#6b21a8]" : ""}
                          >
                            Diabetes
                          </Button>
                        </div>
                        <div className="relative">
                          <Input
                            placeholder="Search medications..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full sm:w-64 pl-8 bg-white/80 backdrop-blur-sm"
                          />
                          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          {isSearching && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                              onClick={() => setSearchTerm("")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <Loader2 className="h-12 w-12 text-[#581c87] animate-spin mb-4" />
                          <p className="text-lg font-medium text-gray-600">Loading inventory data...</p>
                        </div>
                      ) : (
                        <AnimatePresence>
                          {filteredInventory.length === 0 ? (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="text-center py-12"
                            >
                              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Medications Found</h3>
                              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                            </motion.div>
                          ) : (
                            <motion.div
                              className="relative overflow-x-auto rounded-lg border"
                              variants={fadeInVariants}
                              initial="hidden"
                              animate="visible"
                            >
                              <table className="w-full text-sm text-left text-gray-700">
                                <thead className="text-xs uppercase bg-gray-50">
                                  <tr>
                                    <th scope="col" className="px-6 py-3">
                                      Medication
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                      Strength
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                      Category
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                      Stock
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                      Status
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                      Actions
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <AnimatePresence>
                                    {filteredInventory.map((item, index) => {
                                      const stockStatus = getStockStatus(item)
                                      return (
                                        <motion.tr
                                          key={`${item.name}-${item.strength}`}
                                          className="bg-white border-b hover:bg-gray-50"
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, height: 0 }}
                                          transition={{ delay: index * 0.05, duration: 0.2 }}
                                        >
                                          <td className="px-6 py-4 font-medium">{item.name}</td>
                                          <td className="px-6 py-4">{item.strength}</td>
                                          <td className="px-6 py-4">{item.category}</td>
                                          <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                              <span>{item.stock}</span>
                                              {item.stock <= item.reorderLevel && (
                                                <TooltipProvider>
                                                  <Tooltip>
                                                    <TooltipTrigger>
                                                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                      <p>Stock below reorder level ({item.reorderLevel})</p>
                                                    </TooltipContent>
                                                  </Tooltip>
                                                </TooltipProvider>
                                              )}
                                            </div>
                                          </td>
                                          <td className="px-6 py-4">
                                            <Badge className={stockStatus.color}>{stockStatus.label}</Badge>
                                          </td>
                                          <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 px-2 text-xs"
                                                onClick={() => {
                                                  toast({
                                                    title: "Updating Inventory",
                                                    description: `Updating stock for ${item.name} ${item.strength}`,
                                                  })
                                                }}
                                              >
                                                <RefreshCw className="h-3 w-3 mr-1" />
                                                Update
                                              </Button>
                                              {item.stock <= item.reorderLevel && (
                                                <Button
                                                  size="sm"
                                                  className="h-8 px-2 text-xs bg-[#581c87] hover:bg-[#6b21a8]"
                                                  onClick={() =>
                                                    handleAlertClick({
                                                      id: `alert-${item.name}-${item.strength}`,
                                                      type: "low-stock",
                                                      message: `Low stock alert for ${item.name} ${item.strength}`,
                                                      severity: "high",
                                                      timestamp: new Date().toISOString(),
                                                      category: item.category,
                                                      name: item.name,
                                                      strength: item.strength,
                                                      stock: item.stock,
                                                      reorderLevel: item.reorderLevel,
                                                    })
                                                  }
                                                >
                                                  <Plus className="h-3 w-3 mr-1" />
                                                  Reorder
                                                </Button>
                                              )}
                                            </div>
                                          </td>
                                        </motion.tr>
                                      )
                                    })}
                                  </AnimatePresence>
                                </tbody>
                              </table>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        {/* Add Medication Dialog */}
        <Dialog open={showMedicationDialog} onOpenChange={setShowMedicationDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-[#581c87]" />
                Add Medication
              </DialogTitle>
              <DialogDescription>Add a new medication to the prescription</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="medication-name">Medication Name</Label>
                <Input
                  id="medication-name"
                  placeholder="Enter medication name"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                />
              </div>
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
                    {frequencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                <Textarea
                  id="instructions"
                  placeholder="Enter any special instructions"
                  value={newMedication.instructions}
                  onChange={(e) => setNewMedication({ ...newMedication, instructions: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowMedicationDialog(false)} disabled={isProcessing}>
                Cancel
              </Button>
              <Button
                onClick={handleAddMedication}
                disabled={isProcessing}
                className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white"
              >
                {isProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Medication
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirm Dispense Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-[#581c87]" />
                Confirm Dispensing
              </DialogTitle>
              <DialogDescription>Are you sure you want to dispense this prescription?</DialogDescription>
            </DialogHeader>
            {selectedPrescription && (
              <div className="py-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Prescription Details:</h4>
                  <p className="text-sm text-gray-600">Patient: {selectedPrescription.name}</p>
                  <p className="text-sm text-gray-600">ID: {selectedPrescription.id}</p>
                  <p className="text-sm text-gray-600">Medications: {selectedPrescription.medications.length} items</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isProcessing}>
                Cancel
              </Button>
              <Button
                onClick={handleDispense}
                disabled={isProcessing}
                className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white"
              >
                {isProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                Confirm Dispense
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Print Dialog */}
        <Dialog open={showPrintDialog} onOpenChange={setShowPrintDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Printer className="h-5 w-5 text-[#581c87]" />
                Print Prescription Label
              </DialogTitle>
              <DialogDescription>Select what you would like to print</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Button
                  className="w-full justify-start bg-gray-50 hover:bg-gray-100 text-gray-700"
                  onClick={() => {
                    toast({
                      title: "Printing Label",
                      description: "Prescription label is being printed",
                    })
                    setShowPrintDialog(false)
                  }}
                >
                  <Clipboard className="h-4 w-4 mr-2" />
                  Prescription Label
                </Button>
                <Button
                  className="w-full justify-start bg-gray-50 hover:bg-gray-100 text-gray-700"
                  onClick={() => {
                    toast({
                      title: "Printing Instructions",
                      description: "Patient instructions are being printed",
                    })
                    setShowPrintDialog(false)
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Patient Instructions
                </Button>
                <Button
                  className="w-full justify-start bg-gray-50 hover:bg-gray-100 text-gray-700"
                  onClick={() => {
                    toast({
                      title: "Printing Receipt",
                      description: "Dispensing receipt is being printed",
                    })
                    setShowPrintDialog(false)
                  }}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Dispensing Receipt
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPrintDialog(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Alert Dialog */}
        <Dialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Low Stock Alert
              </DialogTitle>
              <DialogDescription>This medication is running low and needs to be reordered</DialogDescription>
            </DialogHeader>
            {alertItem && (
              <div className="py-4">
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-800 mb-2">
                    {alertItem.name} {alertItem.strength}
                  </h4>
                  <div className="text-sm text-yellow-700 space-y-1">
                    <p>Current Stock: {alertItem.stock}</p>
                    <p>Reorder Level: {alertItem.reorderLevel}</p>
                    <p>Category: {alertItem.category}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAlertDialog(false)} disabled={isProcessing}>
                Cancel
              </Button>
              <Button
                onClick={reorderMedication}
                disabled={isProcessing}
                className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white"
              >
                {isProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Place Reorder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <ScrollToTop />
      </main>
    </div>
  )
}
