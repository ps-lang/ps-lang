"use client"

import { motion } from "framer-motion"

interface CapabilityPickerProps {
  onSelect: (id: string) => void
  activeCapability: string | null
}

const capabilities = [
  {
    id: "cap.logging",
    title: "AI Conversation Logging",
    icon: "📝",
    description: "Archive AI dialogues with full context, metadata, and timestamps.",
    zone: "private",
  },
  {
    id: "cap.bench",
    title: "Workflow Benchmarking",
    icon: "📊",
    description: "Measure improvements, track efficiency gains, and visualize evolution.",
    zone: "public",
  },
  {
    id: "cap.audit",
    title: "Professional Audit Trail",
    icon: "🔍",
    description: "Comprehensive logs for compliance and reproducibility.",
    zone: "managed",
  },
]

export default function CapabilityPicker({ onSelect, activeCapability }: CapabilityPickerProps) {
  return (
    <div
      data-ai-component="capability-picker"
      data-ai-zone="public"
      data-ai-purpose="capability-selection"
    >
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-block border-b border-stone-300 pb-2 mb-2">
          <h2
            className="text-3xl font-light text-stone-900 tracking-tight"
            style={{ fontFamily: 'var(--font-crimson)' }}
          >
            Explore Capabilities
          </h2>
        </div>
        <p className="text-sm text-stone-500 tracking-wide">
          Select a capability to begin your agentic stream
        </p>
      </div>

      {/* Capability Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {capabilities.map((cap, index) => (
          <motion.button
            key={cap.id}
            onClick={() => onSelect(cap.id)}
            className={`border bg-white p-8 text-left hover:shadow-md transition-all ${
              activeCapability === cap.id
                ? 'border-stone-900 shadow-md'
                : 'border-stone-200'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.32,
              ease: "easeInOut",
              delay: index * 0.1,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-ai-card={cap.id}
            data-ai-zone={cap.zone}
            data-ai-state={activeCapability === cap.id ? 'active' : 'inactive'}
          >
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-4">
              <span className="text-2xl">{cap.icon}</span>
            </div>

            {/* Title */}
            <h3
              className="text-lg font-medium text-stone-900 mb-3 tracking-wide"
              data-ai-element="capability-title"
            >
              {cap.title}
            </h3>

            {/* Description */}
            <p
              className="text-sm text-stone-600 leading-relaxed mb-4"
              style={{ fontFamily: 'var(--font-crimson)' }}
              data-ai-description="capability-benefit"
            >
              {cap.description}
            </p>

            {/* Zone Badge */}
            <div className="flex items-center gap-2">
              <div
                className={`text-xs uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  cap.zone === 'private'
                    ? 'bg-red-100 text-red-800'
                    : cap.zone === 'managed'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-green-100 text-green-800'
                }`}
                data-ai-badge="zone"
              >
                {cap.zone}
              </div>
              {activeCapability === cap.id && (
                <span className="text-xs text-stone-500">● Active</span>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
