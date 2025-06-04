"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useAppContext } from "./app-context"
import { Loader2 } from "lucide-react"

export function LoadingOverlay() {
  const { isLoading } = useAppContext()

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl p-6 flex flex-col items-center gap-4 max-w-md"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Loader2 className="h-10 w-10 text-purple-600" />
            </motion.div>
            <p className="text-lg font-medium text-gray-700">Processing your request...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
