"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CreditCard,
  DollarSign,
  Receipt,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Plus,
  Download,
  Calendar,
  TrendingUp,
} from "lucide-react"
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import Sidebar from "@/components/sidebar"

const pendingPayments = [
  {
    id: "P-1237",
    name: "Alice Brown",
    services: ["Consultation", "Lab Tests"],
    amount: 285.5,
    insurance: "Blue Cross",
    copay: 25.0,
    status: "pending",
    date: "2025-01-03",
  },
  {
    id: "P-1243",
    name: "Robert Davis",
    services: ["Consultation", "Prescription"],
    amount: 150.0,
    insurance: "Aetna",
    copay: 20.0,
    status: "pending",
    date: "2025-01-03",
  },
]

const completedPayments = [
  {
    id: "P-1220",
    name: "Mary Johnson",
    amount: 320.75,
    paymentMethod: "Credit Card",
    status: "paid",
    date: "2025-01-03",
    time: "10:45 AM",
  },
  {
    id: "P-1225",
    name: "James Wilson",
    amount: 95.0,
    paymentMethod: "Cash",
    status: "paid",
    date: "2025-01-03",
    time: "11:20 AM",
  },
]

const revenueData = [
  { month: "Jul", revenue: 45000, patients: 180 },
  { month: "Aug", revenue: 52000, patients: 210 },
  { month: "Sep", revenue: 48000, patients: 195 },
  { month: "Oct", revenue: 58000, patients: 235 },
  { month: "Nov", revenue: 61000, patients: 250 },
  { month: "Dec", revenue: 67000, patients: 275 },
  { month: "Jan", revenue: 72000, patients: 290 },
]

const paymentMethodData = [
  { method: "Insurance", amount: 45000, color: "#581c87" },
  { method: "Credit Card", amount: 18000, color: "#7c3aed" },
  { method: "Cash", amount: 6000, color: "#a855f7" },
  { method: "Debit Card", amount: 3000, color: "#c084fc" },
]

export default function Payments() {
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handlePaymentSelect = (payment) => {
    setSelectedPayment(payment)
    setPaymentAmount(payment.copay?.toString() || payment.amount?.toString() || "")
    setActiveTab("processing")
  }

  const getTotalRevenue = () => {
    return completedPayments.reduce((total, payment) => total + payment.amount, 0)
  }

  const getPendingAmount = () => {
    return pendingPayments.reduce((total, payment) => total + (payment.copay || payment.amount), 0)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen overflow-y-auto">
        <div className="p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
                <p className="text-gray-600">Process payments and manage billing</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="hover:bg-gray-50">
                  <Search className="h-4 w-4 mr-2" />
                  Search Payments
                </Button>
                <Button className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Manual Payment
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
                        <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">${getTotalRevenue().toFixed(2)}</p>
                      </div>
                      <div className="p-3 rounded-full bg-gradient-to-r from-green-500 to-green-600">
                        <DollarSign className="h-6 w-6 text-white" />
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
                        <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">${getPendingAmount().toFixed(2)}</p>
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
                        <p className="text-sm font-medium text-gray-600">Processed Today</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{completedPayments.length}</p>
                      </div>
                      <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600">
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
                        <p className="text-sm font-medium text-gray-600">Overdue</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                      </div>
                      <div className="p-3 rounded-full bg-gradient-to-r from-red-500 to-red-600">
                        <AlertTriangle className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mb-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[#581c87]" />
                    Revenue Trends
                  </CardTitle>
                  <p className="text-sm text-gray-600">Monthly revenue and patient volume</p>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      revenue: { label: "Revenue", color: "#581c87" },
                      patients: { label: "Patients", color: "#7c3aed" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="revenue" stroke="#581c87" strokeWidth={3} />
                        <Line type="monotone" dataKey="patients" stroke="#7c3aed" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </motion.div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger
                  value="pending"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                >
                  Pending Payments
                </TabsTrigger>
                <TabsTrigger
                  value="processing"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                >
                  Process Payment
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                >
                  Completed
                </TabsTrigger>
                <TabsTrigger
                  value="reports"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#581c87] data-[state=active]:to-[#312e81] data-[state=active]:text-white"
                >
                  Reports
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
                        <CreditCard className="h-5 w-5 text-[#581c87]" />
                        Pending Payments
                      </CardTitle>
                      <p className="text-sm text-gray-600">Click on a payment to process</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {pendingPayments.map((payment, index) => (
                          <motion.div
                            key={payment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            className="p-6 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
                            onClick={() => handlePaymentSelect(payment)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-gradient-to-r from-[#581c87] to-[#312e81] rounded-full flex items-center justify-center text-white font-bold text-lg">
                                  {payment.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{payment.name}</h3>
                                    <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                                    <p>ID: {payment.id}</p>
                                    <p>Date: {payment.date}</p>
                                    <p>Insurance: {payment.insurance}</p>
                                    <p>Total: ${payment.amount.toFixed(2)}</p>
                                  </div>
                                  <div className="mb-3">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Services:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {payment.services.map((service, idx) => (
                                        <Badge key={idx} variant="outline" className="text-xs">
                                          {service}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="bg-yellow-50 p-3 rounded-lg">
                                    <p className="text-sm font-medium text-yellow-800">
                                      Patient Copay: ${payment.copay.toFixed(2)}
                                    </p>
                                    <p className="text-xs text-yellow-600">
                                      Insurance will cover: ${(payment.amount - payment.copay).toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <Button className="bg-gradient-to-r from-[#581c87] to-[#312e81] hover:from-[#6b21a8] hover:to-[#3730a3] text-white">
                                Process Payment
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Process Payment */}
              <TabsContent value="processing">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {selectedPayment ? (
                    <div className="space-y-6">
                      {/* Patient Header */}
                      <Card className="bg-gradient-to-r from-[#581c87]/5 to-[#312e81]/5 border-[#581c87]/20">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-20 h-20 bg-gradient-to-r from-[#581c87] to-[#312e81] rounded-full flex items-center justify-center text-white font-bold text-2xl">
                                {selectedPayment.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div>
                                <h2 className="text-2xl font-bold text-gray-900">{selectedPayment.name}</h2>
                                <p className="text-gray-600">Patient ID: {selectedPayment.id}</p>
                                <p className="text-sm text-gray-500">Date: {selectedPayment.date}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-[#581c87]">
                                $
                                {selectedPayment.copay
                                  ? selectedPayment.copay.toFixed(2)
                                  : selectedPayment.amount.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-600">Amount Due</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Payment Details */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Receipt className="h-5 w-5 text-[#581c87]" />
                              Payment Details
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Total Amount:</span>
                                <span className="font-semibold">${selectedPayment.amount.toFixed(2)}</span>
                              </div>
                              {selectedPayment.insurance && (
                                <>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Insurance ({selectedPayment.insurance}):</span>
                                    <span className="text-green-600">
                                      -${(selectedPayment.amount - selectedPayment.copay).toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                                    <span>Patient Responsibility:</span>
                                    <span className="text-[#581c87]">${selectedPayment.copay.toFixed(2)}</span>
                                  </div>
                                </>
                              )}
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm font-medium text-gray-700 mb-2">Services Provided:</p>
                              <div className="space-y-1">
                                {selectedPayment.services.map((service, idx) => (
                                  <div key={idx} className="flex justify-between text-sm">
                                    <span>{service}</span>
                                    <Badge variant="outline">{idx === 0 ? "$150.00" : "$135.50"}</Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Payment Processing */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <CreditCard className="h-5 w-5 text-[#581c87]" />
                              Process Payment
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="amount">Payment Amount</Label>
                              <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                className="text-lg font-semibold"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="method">Payment Method</Label>
                              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="cash">Cash</SelectItem>
                                  <SelectItem value="credit">Credit Card</SelectItem>
                                  <SelectItem value="debit">Debit Card</SelectItem>
                                  <SelectItem value="check">Check</SelectItem>
                                  <SelectItem value="insurance">Insurance Direct</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {paymentMethod === "credit" || paymentMethod === "debit" ? (
                              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                <div className="space-y-2">
                                  <Label htmlFor="cardNumber">Card Number</Label>
                                  <Input id="cardNumber" placeholder="**** **** **** 1234" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="expiry">Expiry</Label>
                                    <Input id="expiry" placeholder="MM/YY" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="cvv">CVV</Label>
                                    <Input id="cvv" placeholder="123" />
                                  </div>
                                </div>
                              </div>
                            ) : null}

                            <div className="pt-4 space-y-3">
                              <Button variant="outline" className="w-full">
                                Save for Later
                              </Button>
                              <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Process Payment
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Payment Selected</h3>
                        <p className="text-gray-500">Select a payment from the pending list to process</p>
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
                        Completed Payments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {completedPayments.map((payment, index) => (
                          <motion.div
                            key={payment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            className="p-4 border rounded-lg hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                                  {payment.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">{payment.name}</h3>
                                  <p className="text-sm text-gray-600">ID: {payment.id}</p>
                                  <p className="text-sm text-gray-500">
                                    Paid: {payment.time} - {payment.paymentMethod}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-semibold text-gray-900">${payment.amount.toFixed(2)}</p>
                                <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Download className="h-4 w-4 mr-2" />
                                  Receipt
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-[#581c87]" />
                          Payment Methods
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer
                          config={{
                            insurance: { label: "Insurance", color: "#581c87" },
                            credit: { label: "Credit Card", color: "#7c3aed" },
                            cash: { label: "Cash", color: "#a855f7" },
                            debit: { label: "Debit Card", color: "#c084fc" },
                          }}
                          className="h-[300px]"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={paymentMethodData}>
                              <XAxis dataKey="method" />
                              <YAxis />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Bar dataKey="amount" fill="#581c87" radius={4} />
                            </BarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-[#581c87]" />
                          Financial Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-600 font-medium">Today's Revenue</p>
                            <p className="text-2xl font-bold text-green-800">${getTotalRevenue().toFixed(2)}</p>
                          </div>
                          <div className="p-4 bg-yellow-50 rounded-lg">
                            <p className="text-sm text-yellow-600 font-medium">Pending Collections</p>
                            <p className="text-2xl font-bold text-yellow-800">${getPendingAmount().toFixed(2)}</p>
                          </div>
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-600 font-medium">Monthly Target</p>
                            <p className="text-2xl font-bold text-blue-800">$75,000</p>
                            <div className="mt-2">
                              <div className="flex justify-between text-sm text-blue-600 mb-1">
                                <span>Progress</span>
                                <span>96%</span>
                              </div>
                              <div className="w-full bg-blue-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "96%" }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
