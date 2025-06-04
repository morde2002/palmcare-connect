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
import {
  CreditCard,
  DollarSign,
  Receipt,
  Search,
  Clock,
  CheckCircle,
  AlertTriangle,
  Printer,
  FileText,
  X,
  ChevronRight,
  Loader2,
  Wallet,
  Calculator,
  TrendingUp,
  Calendar,
  Eye,
  Download,
  Plus,
  Minus,
} from "lucide-react"
import Sidebar from "@/components/sidebar"
import { useToast } from "@/components/ui/use-toast"

const pendingPayments = [
  {
    id: "INV-2024-001",
    patientName: "Alice Brown",
    patientId: "P-1237",
    services: [
      { name: "Consultation", amount: 150.0 },
      { name: "Blood Test", amount: 75.0 },
      { name: "X-Ray", amount: 200.0 },
    ],
    totalAmount: 425.0,
    insuranceCoverage: 340.0,
    patientResponsibility: 85.0,
    status: "pending",
    dateCreated: "2024-01-15",
    dueDate: "2024-01-30",
    insuranceProvider: "Blue Cross",
    policyNumber: "BC123456789",
  },
  {
    id: "INV-2024-002",
    patientName: "Robert Davis",
    patientId: "P-1243",
    services: [
      { name: "Consultation", amount: 150.0 },
      { name: "Prescription", amount: 45.0 },
    ],
    totalAmount: 195.0,
    insuranceCoverage: 0.0,
    patientResponsibility: 195.0,
    status: "overdue",
    dateCreated: "2024-01-10",
    dueDate: "2024-01-25",
    insuranceProvider: "Self-Pay",
    policyNumber: null,
  },
  {
    id: "INV-2024-003",
    patientName: "Emily Wilson",
    patientId: "P-1251",
    services: [
      { name: "Emergency Visit", amount: 500.0 },
      { name: "CT Scan", amount: 800.0 },
      { name: "Medication", amount: 120.0 },
    ],
    totalAmount: 1420.0,
    insuranceCoverage: 1136.0,
    patientResponsibility: 284.0,
    status: "pending",
    dateCreated: "2024-01-18",
    dueDate: "2024-02-02",
    insuranceProvider: "Aetna",
    policyNumber: "AET987654321",
  },
]

const completedPayments = [
  {
    id: "INV-2024-004",
    patientName: "Mary Johnson",
    patientId: "P-1220",
    totalAmount: 275.0,
    amountPaid: 275.0,
    paymentMethod: "Credit Card",
    paymentDate: "2024-01-20",
    status: "paid",
    transactionId: "TXN-20240120-001",
  },
  {
    id: "INV-2024-005",
    patientName: "James Wilson",
    patientId: "P-1225",
    totalAmount: 150.0,
    amountPaid: 150.0,
    paymentMethod: "Cash",
    paymentDate: "2024-01-19",
    status: "paid",
    transactionId: "TXN-20240119-002",
  },
  {
    id: "INV-2024-006",
    patientName: "Sarah Thompson",
    patientId: "P-1230",
    totalAmount: 320.0,
    amountPaid: 320.0,
    paymentMethod: "Insurance",
    paymentDate: "2024-01-18",
    status: "paid",
    transactionId: "TXN-20240118-003",
  },
]

const paymentMethods = [
  { value: "cash", label: "Cash", icon: DollarSign },
  { value: "credit", label: "Credit Card", icon: CreditCard },
  { value: "debit", label: "Debit Card", icon: CreditCard },
  { value: "insurance", label: "Insurance", icon: FileText },
  { value: "check", label: "Check", icon: Receipt },
]

export default function Payments() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [payments, setPayments] = useState(pendingPayments)
  const [completed, setCompleted] = useState(completedPayments)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showReceiptDialog, setShowReceiptDialog] = useState(false)
  const [showRefundDialog, setShowRefundDialog] = useState(false)
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [dateRange, setDateRange] = useState("all")

  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    method: "",
    reference: "",
    notes: "",
    partialPayment: false,
  })

  const [refundForm, setRefundForm] = useState({
    amount: "",
    reason: "",
    method: "",
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
    if (activeTab === "analytics") {
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [activeTab])

  // Calculate statistics
  const totalPending = payments.reduce((sum, payment) => sum + payment.patientResponsibility, 0)
  const totalOverdue = payments
    .filter((p) => p.status === "overdue")
    .reduce((sum, payment) => sum + payment.patientResponsibility, 0)
  const totalPaidToday = completed
    .filter((p) => p.paymentDate === new Date().toISOString().split("T")[0])
    .reduce((sum, payment) => sum + payment.amountPaid, 0)
  const totalRevenue = completed.reduce((sum, payment) => sum + payment.amountPaid, 0)

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200"
      case "partial":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handlePaymentSelect = (payment) => {
    setSelectedPayment(payment)
    setPaymentForm({
      amount: payment.patientResponsibility.toString(),
      method: "",
      reference: "",
      notes: "",
      partialPayment: false,
    })
    setShowPaymentDialog(true)
  }

  const handleProcessPayment = () => {
    if (!paymentForm.method || !paymentForm.amount) {
      toast({
        title: "Missing Information",
        description: "Please select a payment method and enter the amount",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // Simulate processing delay
    setTimeout(() => {
      if (selectedPayment) {
        const paymentAmount = Number.parseFloat(paymentForm.amount)
        const isFullPayment = paymentAmount >= selectedPayment.patientResponsibility

        // Remove from pending payments or update if partial
        if (isFullPayment) {
          setPayments(payments.filter((p) => p.id !== selectedPayment.id))

          // Add to completed payments
          const newCompletedPayment = {
            id: selectedPayment.id,
            patientName: selectedPayment.patientName,
            patientId: selectedPayment.patientId,
            totalAmount: selectedPayment.totalAmount,
            amountPaid: paymentAmount,
            paymentMethod: paymentMethods.find((m) => m.value === paymentForm.method)?.label || paymentForm.method,
            paymentDate: new Date().toISOString().split("T")[0],
            status: "paid",
            transactionId: `TXN-${Date.now()}`,
          }

          setCompleted([newCompletedPayment, ...completed])

          toast({
            title: "Payment Processed",
            description: `Payment of $${paymentAmount.toFixed(2)} has been successfully processed`,
          })
        } else {
          // Update pending payment for partial payment
          const updatedPayment = {
            ...selectedPayment,
            patientResponsibility: selectedPayment.patientResponsibility - paymentAmount,
            status: "partial",
          }

          setPayments(payments.map((p) => (p.id === selectedPayment.id ? updatedPayment : p)))

          toast({
            title: "Partial Payment Processed",
            description: `Partial payment of $${paymentAmount.toFixed(2)} has been processed. Remaining balance: $${(selectedPayment.patientResponsibility - paymentAmount).toFixed(2)}`,
          })
        }

        setPaymentForm({
          amount: "",
          method: "",
          reference: "",
          notes: "",
          partialPayment: false,
        })
      }

      setIsProcessing(false)
      setShowPaymentDialog(false)
      setSelectedPayment(null)
    }, 1200)
  }

  const handleRefund = () => {
    if (!refundForm.amount || !refundForm.reason) {
      toast({
        title: "Missing Information",
        description: "Please enter the refund amount and reason",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // Simulate processing delay
    setTimeout(() => {
      toast({
        title: "Refund Processed",
        description: `Refund of $${Number.parseFloat(refundForm.amount).toFixed(2)} has been initiated`,
      })

      setRefundForm({
        amount: "",
        reason: "",
        method: "",
      })

      setIsProcessing(false)
      setShowRefundDialog(false)
    }, 1000)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setIsSearching(!!e.target.value)
  }

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.patientId.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterStatus === "all") return matchesSearch
    return matchesSearch && payment.status === filterStatus
  })

  const filteredCompleted = completed.filter((payment) => {
    const matchesSearch =
      payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.patientId.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen overflow-y-auto">
        <div className="p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
                <p className="text-gray-600">Manage patient payments and billing</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="hover:bg-gray-50 group transition-all duration-200"
                  onClick={() => {
                    toast({
                      title: "Generating Report",
                      description: "Payment report is being generated",
                    })
                  }}
                >
                  <Download className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  Export Report
                </Button>
                <Button
                  className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white group transition-all duration-200"
                  onClick={() => {
                    toast({
                      title: "New Invoice",
                      description: "Create a new patient invoice",
                    })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  New Invoice
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <Card className="hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">${totalPending.toFixed(2)}</p>
                        <p className="text-xs text-gray-500 mt-1">{payments.length} invoices</p>
                      </div>
                      <div className="p-3 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 group-hover:scale-110 transition-transform duration-300">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Overdue</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">${totalOverdue.toFixed(2)}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {payments.filter((p) => p.status === "overdue").length} invoices
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 group-hover:scale-110 transition-transform duration-300">
                        <AlertTriangle className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Paid Today</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">${totalPaidToday.toFixed(2)}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {completed.filter((p) => p.paymentDate === new Date().toISOString().split("T")[0]).length}{" "}
                          payments
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 group-hover:scale-110 transition-transform duration-300">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">${totalRevenue.toFixed(2)}</p>
                        <p className="text-xs text-green-600 mt-1 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +12.5% from last month
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 group-hover:scale-110 transition-transform duration-300">
                        <DollarSign className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger
                  value="pending"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Clock className="h-4 w-4 transition-transform group-data-[state=active]:rotate-0 group-hover:rotate-12 duration-300" />
                    Pending Payments
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#581c87] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 transition-transform group-data-[state=active]:rotate-0 group-hover:rotate-12 duration-300" />
                    Completed
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#581c87] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 transition-transform group-data-[state=active]:rotate-0 group-hover:rotate-12 duration-300" />
                    Analytics
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#581c87] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </TabsTrigger>
                <TabsTrigger
                  value="reports"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <FileText className="h-4 w-4 transition-transform group-data-[state=active]:rotate-0 group-hover:rotate-12 duration-300" />
                    Reports
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#581c87] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </TabsTrigger>
              </TabsList>

              {/* Pending Payments */}
              <TabsContent value="pending">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-[#581c87]" />
                        Pending Payments
                      </CardTitle>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div className="flex gap-2">
                          <Button
                            variant={filterStatus === "all" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilterStatus("all")}
                            className={filterStatus === "all" ? "bg-[#581c87] hover:bg-[#6b21a8]" : ""}
                          >
                            All
                          </Button>
                          <Button
                            variant={filterStatus === "pending" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilterStatus("pending")}
                            className={filterStatus === "pending" ? "bg-[#581c87] hover:bg-[#6b21a8]" : ""}
                          >
                            Pending
                          </Button>
                          <Button
                            variant={filterStatus === "overdue" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilterStatus("overdue")}
                            className={filterStatus === "overdue" ? "bg-[#581c87] hover:bg-[#6b21a8]" : ""}
                          >
                            Overdue
                          </Button>
                          <Button
                            variant={filterStatus === "partial" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilterStatus("partial")}
                            className={filterStatus === "partial" ? "bg-[#581c87] hover:bg-[#6b21a8]" : ""}
                          >
                            Partial
                          </Button>
                        </div>
                        <div className="relative">
                          <Input
                            placeholder="Search payments..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full sm:w-64 pl-8"
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
                        {filteredPayments.length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-12"
                          >
                            <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Pending Payments</h3>
                            <p className="text-gray-500">All payments have been processed</p>
                          </motion.div>
                        ) : (
                          <motion.div
                            className="space-y-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            {filteredPayments.map((payment, index) => (
                              <motion.div
                                key={payment.id}
                                variants={itemVariants}
                                className="p-6 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer group"
                                onClick={() => handlePaymentSelect(payment)}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start gap-4 flex-1">
                                    <div className="w-16 h-16 bg-gradient-to-r from-[#581c87] to-[#312e81] rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                                      {payment.patientName
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{payment.patientName}</h3>
                                        <Badge className={getStatusColor(payment.status)}>
                                          <span className="flex items-center gap-1">
                                            {payment.status === "pending" && <Clock className="h-3 w-3" />}
                                            {payment.status === "overdue" && <AlertTriangle className="h-3 w-3" />}
                                            {payment.status}
                                          </span>
                                        </Badge>
                                      </div>
                                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                                        <p>Invoice: {payment.id}</p>
                                        <p>Patient ID: {payment.patientId}</p>
                                        <p>Created: {payment.dateCreated}</p>
                                        <p>Due: {payment.dueDate}</p>
                                      </div>
                                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                                        <div className="bg-gray-50 p-3 rounded group-hover:bg-gray-100 transition-colors duration-200">
                                          <p className="text-sm font-medium text-gray-700 mb-1">Services</p>
                                          <div className="space-y-1">
                                            {payment.services.map((service, idx) => (
                                              <div key={idx} className="flex justify-between text-xs text-gray-600">
                                                <span>{service.name}</span>
                                                <span>${service.amount.toFixed(2)}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                        <div className="bg-blue-50 p-3 rounded group-hover:bg-blue-100 transition-colors duration-200">
                                          <p className="text-sm font-medium text-blue-700 mb-1">Payment Summary</p>
                                          <div className="space-y-1 text-xs">
                                            <div className="flex justify-between text-gray-600">
                                              <span>Total Amount:</span>
                                              <span>${payment.totalAmount.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-600">
                                              <span>Insurance Coverage:</span>
                                              <span>${payment.insuranceCoverage.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between font-medium text-blue-700 border-t pt-1">
                                              <span>Patient Responsibility:</span>
                                              <span>${payment.patientResponsibility.toFixed(2)}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <p>Insurance: {payment.insuranceProvider}</p>
                                        {payment.policyNumber && <p>Policy: {payment.policyNumber}</p>}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <div className="text-right">
                                      <p className="text-2xl font-bold text-gray-900">
                                        ${payment.patientResponsibility.toFixed(2)}
                                      </p>
                                      <p className="text-sm text-gray-500">Amount Due</p>
                                    </div>
                                    <Button className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white group-hover:scale-105 transition-transform duration-300">
                                      <span className="flex items-center gap-2">
                                        Process Payment
                                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
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

              {/* Completed Payments */}
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
                        Completed Payments
                      </CardTitle>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">Payments that have been successfully processed</p>
                        <div className="relative">
                          <Input
                            placeholder="Search completed..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-64 pl-8"
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
                        {filteredCompleted.length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-12"
                          >
                            <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Completed Payments</h3>
                            <p className="text-gray-500">No payments have been processed yet</p>
                          </motion.div>
                        ) : (
                          <motion.div
                            className="space-y-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            {filteredCompleted.map((payment, index) => (
                              <motion.div
                                key={payment.id}
                                variants={itemVariants}
                                className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 group"
                                whileHover={{ scale: 1.01 }}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform duration-300">
                                      {payment.patientName
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-gray-900">{payment.patientName}</h3>
                                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                        <p>Invoice: {payment.id}</p>
                                        <p>Patient ID: {payment.patientId}</p>
                                      </div>
                                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                        <p>Paid: {payment.paymentDate}</p>
                                        <p>Method: {payment.paymentMethod}</p>
                                        <p>Transaction: {payment.transactionId}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <div className="text-right">
                                      <p className="text-xl font-bold text-green-600">
                                        ${payment.amountPaid.toFixed(2)}
                                      </p>
                                      <Badge className="bg-green-100 text-green-800 border-green-200">Paid</Badge>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="group/btn"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setSelectedPayment(payment)
                                          setShowReceiptDialog(true)
                                        }}
                                      >
                                        <Receipt className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
                                        Receipt
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="group/btn"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setSelectedPayment(payment)
                                          setShowRefundDialog(true)
                                        }}
                                      >
                                        <Minus className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
                                        Refund
                                      </Button>
                                      <Button
                                        size="sm"
                                        className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white group/btn"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          toast({
                                            title: "Viewing Details",
                                            description: `Viewing details for payment ${payment.id}`,
                                          })
                                        }}
                                      >
                                        <span className="flex items-center gap-2">
                                          <Eye className="h-4 w-4" />
                                          View
                                        </span>
                                      </Button>
                                    </div>
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

              {/* Analytics */}
              <TabsContent value="analytics">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {isLoading ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-12 w-12 text-[#581c87] animate-spin mb-4" />
                        <p className="text-lg font-medium text-gray-600">Loading analytics data...</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <TrendingUp className="h-5 w-5 text-[#581c87]" />
                              Revenue Trends
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                              <div className="text-center">
                                <TrendingUp className="h-16 w-16 text-[#581c87] mx-auto mb-4" />
                                <p className="text-lg font-semibold text-gray-700">Revenue Chart</p>
                                <p className="text-sm text-gray-500">Interactive chart would be displayed here</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Wallet className="h-5 w-5 text-[#581c87]" />
                              Payment Methods
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {paymentMethods.map((method, index) => (
                                <div
                                  key={method.value}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                  <div className="flex items-center gap-3">
                                    <method.icon className="h-5 w-5 text-[#581c87]" />
                                    <span className="font-medium">{method.label}</span>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold">${(Math.random() * 5000).toFixed(2)}</p>
                                    <p className="text-sm text-gray-500">
                                      {Math.floor(Math.random() * 50)} transactions
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Calculator className="h-5 w-5 text-[#581c87]" />
                            Financial Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                              <div className="flex items-center gap-3 mb-3">
                                <TrendingUp className="h-8 w-8 text-green-600" />
                                <div>
                                  <h3 className="font-semibold text-green-800">Total Collections</h3>
                                  <p className="text-2xl font-bold text-green-900">${totalRevenue.toFixed(2)}</p>
                                </div>
                              </div>
                              <p className="text-sm text-green-600">+15.3% from last month</p>
                            </div>

                            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100">
                              <div className="flex items-center gap-3 mb-3">
                                <Clock className="h-8 w-8 text-yellow-600" />
                                <div>
                                  <h3 className="font-semibold text-yellow-800">Outstanding</h3>
                                  <p className="text-2xl font-bold text-yellow-900">${totalPending.toFixed(2)}</p>
                                </div>
                              </div>
                              <p className="text-sm text-yellow-600">{payments.length} pending invoices</p>
                            </div>

                            <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                              <div className="flex items-center gap-3 mb-3">
                                <AlertTriangle className="h-8 w-8 text-red-600" />
                                <div>
                                  <h3 className="font-semibold text-red-800">Overdue</h3>
                                  <p className="text-2xl font-bold text-red-900">${totalOverdue.toFixed(2)}</p>
                                </div>
                              </div>
                              <p className="text-sm text-red-600">Requires immediate attention</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
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
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-[#581c87]" />
                        Financial Reports
                      </CardTitle>
                      <p className="text-sm text-gray-600">Generate and download financial reports</p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                          {
                            name: "Daily Revenue Report",
                            description: "Daily payment collections and revenue summary",
                            icon: Calendar,
                          },
                          {
                            name: "Outstanding Invoices",
                            description: "List of all pending and overdue payments",
                            icon: AlertTriangle,
                          },
                          {
                            name: "Payment Method Analysis",
                            description: "Breakdown of payments by method",
                            icon: CreditCard,
                          },
                          {
                            name: "Insurance Claims Report",
                            description: "Insurance coverage and claim status",
                            icon: FileText,
                          },
                          {
                            name: "Patient Payment History",
                            description: "Individual patient payment records",
                            icon: Receipt,
                          },
                          {
                            name: "Monthly Financial Summary",
                            description: "Comprehensive monthly financial overview",
                            icon: TrendingUp,
                          },
                        ].map((report, index) => (
                          <motion.div
                            key={report.name}
                            className="p-6 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              toast({
                                title: "Generating Report",
                                description: `${report.name} is being generated`,
                              })
                            }}
                          >
                            <div className="flex items-start gap-4">
                              <div className="p-3 rounded-full bg-gradient-to-r from-[#581c87] to-[#312e81] group-hover:scale-110 transition-transform duration-300">
                                <report.icon className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-2">{report.name}</h3>
                                <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white group-hover:scale-105 transition-transform duration-300"
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Generate
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
            </Tabs>
          </motion.div>
        </div>
      </main>

      {/* Payment Processing Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#581c87]" />
              Process Payment
            </DialogTitle>
            <DialogDescription>Process payment for {selectedPayment?.patientName}</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-6 py-4">
              {/* Payment Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Payment Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Invoice ID:</p>
                    <p className="font-medium">{selectedPayment.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Patient:</p>
                    <p className="font-medium">{selectedPayment.patientName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Amount:</p>
                    <p className="font-medium">${selectedPayment.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Insurance Coverage:</p>
                    <p className="font-medium">${selectedPayment.insuranceCoverage.toFixed(2)}</p>
                  </div>
                  <div className="col-span-2 pt-2 border-t">
                    <p className="text-gray-600">Amount Due:</p>
                    <p className="text-xl font-bold text-[#581c87]">
                      ${selectedPayment.patientResponsibility.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment-amount">Payment Amount</Label>
                    <Input
                      id="payment-amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <Select
                      value={paymentForm.method}
                      onValueChange={(value) => setPaymentForm({ ...paymentForm, method: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            <div className="flex items-center gap-2">
                              <method.icon className="h-4 w-4" />
                              {method.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference">Reference Number (Optional)</Label>
                  <Input
                    id="reference"
                    placeholder="Transaction reference or check number"
                    value={paymentForm.reference}
                    onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional payment notes"
                    value={paymentForm.notes}
                    onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4 mr-2" />
              )}
              Process Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-[#581c87]" />
              Payment Receipt
            </DialogTitle>
            <DialogDescription>Print or email payment receipt</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="py-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Receipt Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Transaction ID:</span>
                    <span className="font-medium">{selectedPayment.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Patient:</span>
                    <span className="font-medium">{selectedPayment.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Paid:</span>
                    <span className="font-medium">${selectedPayment.amountPaid?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-medium">{selectedPayment.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">{selectedPayment.paymentDate}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReceiptDialog(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                toast({
                  title: "Receipt Printed",
                  description: "Payment receipt has been sent to the printer",
                })
                setShowReceiptDialog(false)
              }}
              className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Minus className="h-5 w-5 text-red-500" />
              Process Refund
            </DialogTitle>
            <DialogDescription>Process a refund for {selectedPayment?.patientName}</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4 py-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <h4 className="font-medium text-red-800 mb-2">Original Payment</h4>
                <div className="text-sm text-red-700 space-y-1">
                  <p>Amount Paid: ${selectedPayment.amountPaid?.toFixed(2)}</p>
                  <p>Payment Method: {selectedPayment.paymentMethod}</p>
                  <p>Transaction ID: {selectedPayment.transactionId}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="refund-amount">Refund Amount</Label>
                <Input
                  id="refund-amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={refundForm.amount}
                  onChange={(e) => setRefundForm({ ...refundForm, amount: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="refund-reason">Reason for Refund</Label>
                <Textarea
                  id="refund-reason"
                  placeholder="Enter reason for refund"
                  value={refundForm.reason}
                  onChange={(e) => setRefundForm({ ...refundForm, reason: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefundDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleRefund} disabled={isProcessing} className="bg-red-600 hover:bg-red-700 text-white">
              {isProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Minus className="h-4 w-4 mr-2" />}
              Process Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
