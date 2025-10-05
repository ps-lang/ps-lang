"use client"

interface ConsentAndZonesProps {
  sessionId: string
  consentGranted: boolean
  activeZone: string
  activePersona: string
  onConsentChange: (granted: boolean) => void
  onZoneChange: (zone: string) => void
  onPersonaChange: (persona: string) => void
}

const zones = [
  { value: "public", label: "Public", color: "green" },
  { value: "private", label: "Private", color: "red" },
  { value: "managed", label: "Managed", color: "purple" },
  { value: "read-only", label: "Read-Only", color: "blue" },
]

const personas = ["Builder", "Researcher", "Reviewer"]

export default function ConsentAndZones({
  sessionId,
  consentGranted,
  activeZone,
  activePersona,
  onConsentChange,
  onZoneChange,
  onPersonaChange,
}: ConsentAndZonesProps) {
  return (
    <div
      className="border border-stone-200 bg-stone-50 p-6"
      data-ai-section="consent-and-zones"
      data-ai-zone="interactive"
    >
      <h4 className="text-sm uppercase tracking-wider text-stone-700 font-medium mb-4">
        Consent & Zone Controls
      </h4>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Consent Toggle */}
        <div>
          <label className="block text-xs text-stone-600 mb-2">Consent</label>
          <button
            onClick={() => onConsentChange(!consentGranted)}
            className={`w-full px-4 py-3 border text-sm font-medium tracking-wide transition-all ${
              consentGranted
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-600 border-stone-300 hover:border-stone-900'
            }`}
            data-ai-control="consent-toggle"
            data-ai-state={consentGranted ? 'granted' : 'not-granted'}
          >
            {consentGranted ? '✓ Consent Granted' : 'Grant Consent'}
          </button>
          {consentGranted && (
            <p className="text-xs text-stone-500 mt-2">
              Scopes: meta.public, meta.private, analytics.rl, export.artifacts
            </p>
          )}
        </div>

        {/* Zone Selector */}
        <div>
          <label className="block text-xs text-stone-600 mb-2">Active Zone</label>
          <select
            value={activeZone}
            onChange={(e) => onZoneChange(e.target.value)}
            disabled={!consentGranted}
            className="w-full px-4 py-3 border border-stone-300 text-stone-900 text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-stone-900"
            data-ai-control="zone-selector"
            data-ai-value={activeZone}
          >
            {zones.map((zone) => (
              <option key={zone.value} value={zone.value}>
                {zone.label}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2 mt-2">
            <div
              className={`w-2 h-2 rounded-full ${
                activeZone === 'public'
                  ? 'bg-green-500'
                  : activeZone === 'private'
                  ? 'bg-red-500'
                  : activeZone === 'managed'
                  ? 'bg-purple-500'
                  : 'bg-blue-500'
              }`}
            />
            <span className="text-xs text-stone-500">Zone: {activeZone}</span>
          </div>
        </div>

        {/* Persona Selector */}
        <div>
          <label className="block text-xs text-stone-600 mb-2">Persona</label>
          <select
            value={activePersona}
            onChange={(e) => onPersonaChange(e.target.value)}
            disabled={!consentGranted}
            className="w-full px-4 py-3 border border-stone-300 text-stone-900 text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-stone-900"
            data-ai-control="persona-selector"
            data-ai-value={activePersona}
          >
            {personas.map((persona) => (
              <option key={persona} value={persona}>
                {persona}
              </option>
            ))}
          </select>
          <p className="text-xs text-stone-500 mt-2">
            Mode: {activePersona}
          </p>
        </div>
      </div>
    </div>
  )
}
