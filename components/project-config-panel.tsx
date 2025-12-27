"use client"

import { useState } from "react"
import { ChevronDown, Settings2, Book, Pencil, Database, Star, Info } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

type DocumentType = "general" | "novel" | "legal" | "technical" | "marketing" | "software" | "academic"

interface ProjectConfig {
  documentType: DocumentType
  // Novel options
  genre: string
  narrativePerspective: string
  tense: string
  register: string
  consistencyStrictness: string
  // Legal options
  fieldOfLaw: string
  jurisdiction: string
  translationPosture: string
  requireHumanReview: boolean
  // Technical options
  technicalDomain: string
  audience: string
  terminologyEnforcement: string
  simplificationLevel: string
  // Marketing options
  brandVoice: string
  targetMarket: string
  riskTolerance: string
  // Software options
  platform: string
  characterLimits: boolean
  tone: string
  // Academic options
  discipline: string
  targetAudience: string
  styleGuide: string
  // AI Constraints
  allowContentAddition: boolean
  allowStructuralChanges: boolean
  showDiffAutomatically: boolean
}

const documentTypeLabels: Record<DocumentType, string> = {
  general: "General / Mixed",
  novel: "Novel / Narrative",
  legal: "Legal / Regulatory",
  technical: "Technical Manual",
  marketing: "Marketing / Transcreation",
  software: "Software / UI Localization",
  academic: "Academic / Scientific",
}

function Select({
  label,
  value,
  onChange,
  options,
  tooltip,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  tooltip?: string
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-muted-foreground whitespace-nowrap" title={tooltip}>
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 appearance-none rounded border border-border bg-background pl-2 pr-7 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  )
}

function Toggle({
  label,
  checked,
  onChange,
  tooltip,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  tooltip?: string
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer" title={tooltip}>
      <span className="text-xs text-muted-foreground whitespace-nowrap">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  )
}

function ToggleGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground whitespace-nowrap">{label}</span>
      <div className="flex rounded border border-border overflow-hidden">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-2 py-1 text-xs transition-colors ${
              value === opt.value
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground hover:bg-muted"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function Divider() {
  return <div className="h-6 w-px bg-border mx-2" />
}

export function ProjectConfigPanel() {
  const [config, setConfig] = useState<ProjectConfig>({
    documentType: "general",
    // Novel defaults
    genre: "literary",
    narrativePerspective: "third-limited",
    tense: "past",
    register: "neutral",
    consistencyStrictness: "medium",
    // Legal defaults
    fieldOfLaw: "contract",
    jurisdiction: "eu",
    translationPosture: "strict",
    requireHumanReview: true,
    // Technical defaults
    technicalDomain: "software",
    audience: "end-user",
    terminologyEnforcement: "mandatory",
    simplificationLevel: "none",
    // Marketing defaults
    brandVoice: "formal",
    targetMarket: "germany",
    riskTolerance: "moderate",
    // Software defaults
    platform: "web",
    characterLimits: true,
    tone: "neutral",
    // Academic defaults
    discipline: "natural-sciences",
    targetAudience: "expert",
    styleGuide: "none",
    // AI Constraints - defaults vary by type
    allowContentAddition: false,
    allowStructuralChanges: false,
    showDiffAutomatically: true,
  })

  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [advancedConfig, setAdvancedConfig] = useState({
    contentType: "literary",
    editingMode: "drafting",
    segmentationBias: 50, // 0=Coarse, 50=Balanced, 100=Fine
    tmPriority: "low",
    aiLatitude: "guided",
  })

  const updateConfig = <K extends keyof ProjectConfig>(key: K, value: ProjectConfig[K]) => {
    setConfig((prev) => {
      const next = { ...prev, [key]: value }
      // Update AI constraint defaults when document type changes
      if (key === "documentType") {
        const type = value as DocumentType
        if (type === "novel" || type === "marketing") {
          next.allowContentAddition = true
          next.allowStructuralChanges = true
        } else {
          next.allowContentAddition = false
          next.allowStructuralChanges = false
        }
        if (type === "legal") {
          next.requireHumanReview = true
        }
      }
      return next
    })
  }

  const renderContextOptions = () => {
    switch (config.documentType) {
      case "novel":
        return (
          <>
            <Select
              label="Genre"
              value={config.genre}
              onChange={(v) => updateConfig("genre", v)}
              options={[
                { value: "literary", label: "Literary" },
                { value: "sci-fi", label: "Science Fiction" },
                { value: "fantasy", label: "Fantasy" },
                { value: "crime", label: "Crime / Thriller" },
                { value: "romance", label: "Romance" },
                { value: "historical", label: "Historical" },
                { value: "other", label: "Other" },
              ]}
            />
            <Select
              label="Perspective"
              value={config.narrativePerspective}
              onChange={(v) => updateConfig("narrativePerspective", v)}
              options={[
                { value: "first", label: "First person" },
                { value: "second", label: "Second person" },
                { value: "third-limited", label: "Third (limited)" },
                { value: "third-omniscient", label: "Third (omniscient)" },
              ]}
            />
            <Select
              label="Tense"
              value={config.tense}
              onChange={(v) => updateConfig("tense", v)}
              options={[
                { value: "past", label: "Past" },
                { value: "present", label: "Present" },
                { value: "mixed", label: "Mixed" },
              ]}
            />
            <Select
              label="Register"
              value={config.register}
              onChange={(v) => updateConfig("register", v)}
              options={[
                { value: "neutral", label: "Neutral" },
                { value: "elevated", label: "Elevated" },
                { value: "colloquial", label: "Colloquial" },
              ]}
            />
            <ToggleGroup
              label="Consistency"
              value={config.consistencyStrictness}
              onChange={(v) => updateConfig("consistencyStrictness", v)}
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Med" },
                { value: "high", label: "High" },
              ]}
            />
          </>
        )

      case "legal":
        return (
          <>
            <Select
              label="Field"
              value={config.fieldOfLaw}
              onChange={(v) => updateConfig("fieldOfLaw", v)}
              options={[
                { value: "contract", label: "Contract" },
                { value: "corporate", label: "Corporate" },
                { value: "employment", label: "Employment" },
                { value: "privacy", label: "Privacy / GDPR" },
                { value: "ip", label: "IP" },
                { value: "litigation", label: "Litigation" },
                { value: "other", label: "Other" },
              ]}
            />
            <Select
              label="Jurisdiction"
              value={config.jurisdiction}
              onChange={(v) => updateConfig("jurisdiction", v)}
              options={[
                { value: "eu", label: "EU" },
                { value: "germany", label: "Germany" },
                { value: "uk", label: "UK" },
                { value: "us", label: "US" },
                { value: "other", label: "Other" },
              ]}
            />
            <Select
              label="Posture"
              value={config.translationPosture}
              onChange={(v) => updateConfig("translationPosture", v)}
              options={[
                { value: "strict", label: "Strict literal" },
                { value: "conservative", label: "Conservative" },
              ]}
            />
            <Toggle
              label="Human Review"
              checked={config.requireHumanReview}
              onChange={(v) => updateConfig("requireHumanReview", v)}
              tooltip="Require human review before finalizing"
            />
          </>
        )

      case "technical":
        return (
          <>
            <Select
              label="Domain"
              value={config.technicalDomain}
              onChange={(v) => updateConfig("technicalDomain", v)}
              options={[
                { value: "software", label: "Software" },
                { value: "mechanical", label: "Mechanical" },
                { value: "electrical", label: "Electrical" },
                { value: "medical", label: "Medical Device" },
                { value: "other", label: "Other" },
              ]}
            />
            <Select
              label="Audience"
              value={config.audience}
              onChange={(v) => updateConfig("audience", v)}
              options={[
                { value: "end-user", label: "End user" },
                { value: "technician", label: "Technician" },
                { value: "engineer", label: "Engineer" },
              ]}
            />
            <Select
              label="Terminology"
              value={config.terminologyEnforcement}
              onChange={(v) => updateConfig("terminologyEnforcement", v)}
              options={[
                { value: "mandatory", label: "Mandatory" },
                { value: "advisory", label: "Advisory" },
              ]}
            />
            <Select
              label="Simplify"
              value={config.simplificationLevel}
              onChange={(v) => updateConfig("simplificationLevel", v)}
              options={[
                { value: "none", label: "None" },
                { value: "mild", label: "Mild" },
                { value: "strong", label: "Strong" },
              ]}
            />
          </>
        )

      case "marketing":
        return (
          <>
            <Select
              label="Voice"
              value={config.brandVoice}
              onChange={(v) => updateConfig("brandVoice", v)}
              options={[
                { value: "formal", label: "Formal" },
                { value: "friendly", label: "Friendly" },
                { value: "bold", label: "Bold" },
                { value: "playful", label: "Playful" },
              ]}
            />
            <Select
              label="Market"
              value={config.targetMarket}
              onChange={(v) => updateConfig("targetMarket", v)}
              options={[
                { value: "germany", label: "Germany" },
                { value: "austria", label: "Austria" },
                { value: "switzerland", label: "Switzerland" },
                { value: "global", label: "Global" },
                { value: "custom", label: "Custom" },
              ]}
            />
            <ToggleGroup
              label="Risk"
              value={config.riskTolerance}
              onChange={(v) => updateConfig("riskTolerance", v)}
              options={[
                { value: "conservative", label: "Safe" },
                { value: "moderate", label: "Mod" },
                { value: "aggressive", label: "Bold" },
              ]}
            />
          </>
        )

      case "software":
        return (
          <>
            <Select
              label="Platform"
              value={config.platform}
              onChange={(v) => updateConfig("platform", v)}
              options={[
                { value: "desktop", label: "Desktop" },
                { value: "mobile", label: "Mobile" },
                { value: "web", label: "Web" },
              ]}
            />
            <Toggle
              label="Char Limits"
              checked={config.characterLimits}
              onChange={(v) => updateConfig("characterLimits", v)}
              tooltip="Enforce character limits for UI strings"
            />
            <Select
              label="Tone"
              value={config.tone}
              onChange={(v) => updateConfig("tone", v)}
              options={[
                { value: "neutral", label: "Neutral" },
                { value: "friendly", label: "Friendly" },
                { value: "formal", label: "Formal" },
              ]}
            />
            <ToggleGroup
              label="Consistency"
              value={config.consistencyStrictness}
              onChange={(v) => updateConfig("consistencyStrictness", v)}
              options={[
                { value: "high", label: "High" },
                { value: "very-high", label: "V.High" },
              ]}
            />
          </>
        )

      case "academic":
        return (
          <>
            <Select
              label="Discipline"
              value={config.discipline}
              onChange={(v) => updateConfig("discipline", v)}
              options={[
                { value: "natural-sciences", label: "Natural Sciences" },
                { value: "social-sciences", label: "Social Sciences" },
                { value: "engineering", label: "Engineering" },
                { value: "humanities", label: "Humanities" },
                { value: "other", label: "Other" },
              ]}
            />
            <Select
              label="Audience"
              value={config.targetAudience}
              onChange={(v) => updateConfig("targetAudience", v)}
              options={[
                { value: "expert", label: "Expert" },
                { value: "mixed", label: "Mixed" },
                { value: "general", label: "General" },
              ]}
            />
            <Select
              label="Style"
              value={config.styleGuide}
              onChange={(v) => updateConfig("styleGuide", v)}
              options={[
                { value: "none", label: "None" },
                { value: "apa", label: "APA" },
                { value: "mla", label: "MLA" },
                { value: "chicago", label: "Chicago" },
              ]}
            />
          </>
        )

      default:
        return <span className="text-xs text-muted-foreground italic">Select a document type to see options</span>
    }
  }

  const getStatusSummary = () => {
    const type = documentTypeLabels[config.documentType]
    const aiMode = config.allowContentAddition ? "Flexible" : "Conservative"
    const additions = config.allowContentAddition ? "Yes" : "No"
    return `${type} • AI: ${aiMode}, Additions: ${additions}`
  }

  const getSegmentationLabel = (value: number) => {
    if (value < 33) return "Coarse"
    if (value > 66) return "Fine"
    return "Balanced"
  }

  const sampleSegments = [
    "Alice walked slowly through the mysterious forest, listening to the rustling of leaves.",
    '"I wonder what\'s beyond that hill," she thought to herself.',
    "The setting sun cast a golden glow on everything around her.",
  ]

  return (
    <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-2 flex-wrap">
      {/* Document Type Selector */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-foreground whitespace-nowrap">Type</label>
        <div className="relative">
          <select
            value={config.documentType}
            onChange={(e) => updateConfig("documentType", e.target.value as DocumentType)}
            className="h-8 appearance-none rounded border border-border bg-background pl-3 pr-8 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {Object.entries(documentTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <Divider />

      {/* Context Options (Dynamic) */}
      <div className="flex items-center gap-3 flex-wrap">{renderContextOptions()}</div>

      <Divider />

      {/* AI Constraints (Always Visible) */}
      <div className="flex items-center gap-3">
        <Toggle
          label="Add Content"
          checked={config.allowContentAddition}
          onChange={(v) => updateConfig("allowContentAddition", v)}
          tooltip="Allow AI to add content not in source"
        />
        <Toggle
          label="Restructure"
          checked={config.allowStructuralChanges}
          onChange={(v) => updateConfig("allowStructuralChanges", v)}
          tooltip="Allow AI to change document structure"
        />
        <Toggle
          label="Show Diff"
          checked={config.showDiffAutomatically}
          onChange={(v) => updateConfig("showDiffAutomatically", v)}
          tooltip="Automatically show changes"
        />
      </div>

      <Divider />

      {/* Status Summary */}
      <div className="ml-auto flex items-center gap-3">
        <span className="text-xs text-muted-foreground whitespace-nowrap">{getStatusSummary()}</span>

        <Button variant="outline" size="sm" onClick={() => setAdvancedOpen(true)} className="h-7 text-xs gap-1.5">
          <Settings2 className="h-3.5 w-3.5" />
          Advanced
        </Button>
      </div>

      <Dialog open={advancedOpen} onOpenChange={setAdvancedOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Project Context Settings</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground mb-4">
            Adjust settings to match the needs of your translation project. These preferences guide segmentation and AI
            behavior.
          </p>

          <div className="space-y-4">
            {/* Content Type */}
            <div className="flex items-center justify-between py-3 border-t border-border">
              <span className="text-sm font-medium">Content Type:</span>
              <div className="relative w-56">
                <select
                  value={advancedConfig.contentType}
                  onChange={(e) => setAdvancedConfig((prev) => ({ ...prev, contentType: e.target.value }))}
                  className="w-full h-9 appearance-none rounded border border-border bg-background pl-9 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="literary">Literary</option>
                  <option value="technical">Technical</option>
                  <option value="legal">Legal</option>
                  <option value="marketing">Marketing</option>
                  <option value="software">Software</option>
                </select>
                <Book className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Editing Mode */}
            <div className="flex items-center justify-between py-3 border-t border-border">
              <span className="text-sm font-medium">Editing Mode:</span>
              <div className="relative w-56">
                <select
                  value={advancedConfig.editingMode}
                  onChange={(e) => setAdvancedConfig((prev) => ({ ...prev, editingMode: e.target.value }))}
                  className="w-full h-9 appearance-none rounded border border-border bg-background pl-9 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="drafting">Drafting</option>
                  <option value="review">Review</option>
                  <option value="final">Final</option>
                </select>
                <Pencil className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Segmentation Bias */}
            <div className="py-3 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Segmentation Bias:</span>
                <span className="text-sm font-semibold">{getSegmentationLabel(advancedConfig.segmentationBias)}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Coarse</span>
                <Slider
                  value={[advancedConfig.segmentationBias]}
                  onValueChange={(v) => setAdvancedConfig((prev) => ({ ...prev, segmentationBias: v[0] }))}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground">Fine</span>
              </div>
            </div>

            {/* TM Priority */}
            <div className="flex items-center justify-between py-3 border-t border-border">
              <span className="text-sm font-medium">TM Priority:</span>
              <div className="relative w-56">
                <select
                  value={advancedConfig.tmPriority}
                  onChange={(e) => setAdvancedConfig((prev) => ({ ...prev, tmPriority: e.target.value }))}
                  className="w-full h-9 appearance-none rounded border border-border bg-background pl-9 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <Database className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* AI Latitude */}
            <div className="flex items-center justify-between py-3 border-t border-border">
              <span className="text-sm font-medium">AI Latitude:</span>
              <div className="relative w-56">
                <select
                  value={advancedConfig.aiLatitude}
                  onChange={(e) => setAdvancedConfig((prev) => ({ ...prev, aiLatitude: e.target.value }))}
                  className="w-full h-9 appearance-none rounded border border-border bg-background pl-9 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="strict">Strict</option>
                  <option value="guided">Guided</option>
                  <option value="creative">Creative</option>
                </select>
                <Star className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Recommendation Box */}
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <span className="font-semibold">Recommended:</span> Paragraph-level segmentation is suitable for
                    Literary Drafting projects. Switch to Paragraph Mode?
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="h-8">
                      Switch to Paragraph Mode
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 bg-transparent">
                      Keep Current
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Segmentation Preview */}
            <div className="border border-border rounded-lg p-4 bg-muted/30">
              <h4 className="text-sm font-medium mb-3">Segmentation Preview:</h4>
              <div className="space-y-2">
                {sampleSegments.map((segment, index) => (
                  <div key={index} className="flex items-start gap-2 bg-background rounded p-2">
                    <span className="text-xs font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded flex-shrink-0">
                      [{index + 1}]
                    </span>
                    <span className="text-sm">{segment}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dialog Footer */}
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
            <Button onClick={() => setAdvancedOpen(false)}>Apply Settings</Button>
            <Button variant="outline" onClick={() => setAdvancedOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
