"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronRight, Plus, Check, FileText, X, Edit } from "lucide-react"
import { useState } from "react"

interface TermEntry {
  source: string
  target: string
}

interface PipelineStep {
  label: string
  status: "complete" | "in-progress" | "pending"
}

const initialTerms: TermEntry[] = [
  { source: "Fisherman", target: "Fischer" },
  { source: "Wife", target: "Frau" },
  { source: "Hovel", target: "Pisspott" },
  { source: "Sea-shore", target: "See" },
  { source: "Flounder", target: "Butt" },
  { source: "Enchanted Prince", target: "Verwunschener Prinz" },
  { source: "Hook and line", target: "Angel" },
  { source: "Clear water", target: "Blankes Wasser" },
  { source: "Streak of blood", target: "Streifen Blut" },
]

const pipelineSteps: PipelineStep[] = [
  { label: "Extracting Terms", status: "complete" },
  { label: "Translating Text", status: "complete" },
  { label: "Reviewing", status: "complete" },
  { label: "Ready to Export", status: "in-progress" },
]

export function TerminologyPanel({ onClose }: { onClose?: () => void }) {
  const [terms, setTerms] = useState(initialTerms)
  const [isExpanded, setIsExpanded] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTerms, setEditingTerms] = useState<TermEntry[]>([])

  const handleOpenEditDialog = () => {
    setEditingTerms([...terms])
    setIsEditDialogOpen(true)
  }

  const handleSaveTerms = () => {
    setTerms(editingTerms)
    setIsEditDialogOpen(false)
  }

  const handleAddTerm = () => {
    setEditingTerms([...editingTerms, { source: "", target: "" }])
  }

  const handleRemoveTerm = (index: number) => {
    setEditingTerms(editingTerms.filter((_, i) => i !== index))
  }

  const handleUpdateTerm = (index: number, field: "source" | "target", value: string) => {
    const updated = [...editingTerms]
    updated[index][field] = value
    setEditingTerms(updated)
  }

  return (
    <>
      <aside
        className={`flex flex-col border-l border-border bg-card transition-all duration-300 h-full w-full md:w-64 ${
          isExpanded ? "md:w-64" : "md:w-12"
        }`}
      >
        {isExpanded ? (
          <>
            <div className="flex items-center justify-between border-b border-border p-4">
              <h3 className="text-sm font-semibold text-foreground">Terminology Constraints</h3>
              <div className="flex items-center gap-1">
                {onClose && (
                  <Button variant="ghost" size="icon" className="h-6 w-6 md:hidden" onClick={onClose}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hidden md:flex"
                  onClick={() => setIsExpanded(false)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto border-b border-border">
              <div className="space-y-1 p-3">
                {terms.map((term, index) => (
                  <div key={index} className="flex items-center gap-2 rounded px-2 py-1.5 text-xs hover:bg-muted/50">
                    <span className="text-muted-foreground">"{term.source}"</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium text-foreground">{term.target}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-b border-border p-3">
              <Button variant="outline" className="w-full bg-transparent" size="sm" onClick={handleOpenEditDialog}>
                <Edit className="mr-2 h-3 w-3" />
                Edit Terms
              </Button>
            </div>

            <div className="space-y-3 p-4">
              <h4 className="text-sm font-semibold text-foreground">Pipeline Status:</h4>
              <div className="space-y-2">
                {pipelineSteps.map((step, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{index + 1}.</span>
                      <span className="text-foreground">{step.label}</span>
                    </div>
                    {step.status === "complete" && <Check className="h-4 w-4 text-primary" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 p-4">
              <Button variant="outline" className="w-full bg-transparent" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Export TMX
              </Button>
              <Button variant="outline" className="w-full bg-transparent" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Export XLIFF
              </Button>
            </div>

            <div className="space-y-2 border-t border-border p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">CI Status: Build #1023</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                  Success
                </Badge>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center pt-4">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsExpanded(true)}>
              <ChevronRight className="h-4 w-4 rotate-180" />
            </Button>
          </div>
        )}
      </aside>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] md:max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Edit Terminology Constraints</DialogTitle>
          </DialogHeader>
          <div className="max-h-[50vh] md:max-h-[400px] space-y-3 overflow-auto py-4">
            {editingTerms.map((term, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2 sm:gap-3">
                <div className="flex-1 space-y-1.5">
                  <Label htmlFor={`source-${index}`} className="text-xs">
                    Source Term
                  </Label>
                  <Input
                    id={`source-${index}`}
                    value={term.source}
                    onChange={(e) => handleUpdateTerm(index, "source", e.target.value)}
                    placeholder="English term"
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Label htmlFor={`target-${index}`} className="text-xs">
                    Target Term
                  </Label>
                  <Input
                    id={`target-${index}`}
                    value={term.target}
                    onChange={(e) => handleUpdateTerm(index, "target", e.target.value)}
                    placeholder="German translation"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 self-end"
                  onClick={() => handleRemoveTerm(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full bg-transparent" onClick={handleAddTerm}>
            <Plus className="mr-2 h-4 w-4" />
            Add Term
          </Button>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSaveTerms} className="w-full sm:w-auto">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
