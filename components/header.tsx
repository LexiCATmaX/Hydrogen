"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Save, Printer, Download, LogOut, User } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function Header({
  currentSection,
  onSectionChange,
  sectionOrder,
  onSectionOrderChange,
  onAddSection,
  onDeleteSection,
}: {
  currentSection: number
  onSectionChange: (section: number) => void
  sectionOrder: number[]
  onSectionOrderChange: (order: number[]) => void
  onAddSection: () => void
  onDeleteSection: (section: number) => void
}) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [showAddSection, setShowAddSection] = useState(false)
  const [showDeleteSection, setShowDeleteSection] = useState(false)
  const [showReorderSections, setShowReorderSections] = useState(false)
  const [reorderedSections, setReorderedSections] = useState<number[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [newSectionName, setNewSectionName] = useState("")
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const handlePreviousSection = () => {
    if (currentSection > 1) {
      onSectionChange(currentSection - 1)
    }
  }

  const handleNextSection = () => {
    if (currentSection < sectionOrder.length) {
      onSectionChange(currentSection + 1)
    }
  }

  const handleAddSectionClick = () => {
    setShowAddSection(true)
    setOpenMenu(null)
    setNewSectionName("")
  }

  const handleDeleteSectionClick = () => {
    setShowDeleteSection(true)
    setOpenMenu(null)
  }

  const handleConfirmAddSection = () => {
    onAddSection()
    setShowAddSection(false)
    setNewSectionName("")
  }

  const handleConfirmDeleteSection = () => {
    onDeleteSection(currentSection)
    setShowDeleteSection(false)
  }

  const handleReorderSections = () => {
    setReorderedSections([...sectionOrder])
    setShowReorderSections(true)
    setOpenMenu(null)
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newOrder = [...reorderedSections]
    const draggedItem = newOrder[draggedIndex]
    newOrder.splice(draggedIndex, 1)
    newOrder.splice(index, 0, draggedItem)

    setReorderedSections(newOrder)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleSaveOrder = () => {
    onSectionOrderChange(reorderedSections)
    setShowReorderSections(false)
  }

  const menus = {
    File: [
      { label: "New Project", shortcut: "⌘N" },
      { label: "Open...", shortcut: "⌘O" },
      { label: "Save", shortcut: "⌘S" },
      { label: "Save As...", shortcut: "⇧⌘S" },
      { separator: true },
      { label: "Import TMX..." },
      { label: "Import XLIFF..." },
      { separator: true },
      { label: "Export", shortcut: "⌘E" },
      { label: "Print", shortcut: "⌘P" },
    ],
    Edit: [
      { label: "Undo", shortcut: "⌘Z" },
      { label: "Redo", shortcut: "⇧⌘Z" },
      { separator: true },
      { label: "Cut", shortcut: "⌘X" },
      { label: "Copy", shortcut: "⌘C" },
      { label: "Paste", shortcut: "⌘V" },
      { separator: true },
      { label: "Find...", shortcut: "⌘F" },
      { label: "Replace...", shortcut: "⌘R" },
    ],
    Sections: [
      { label: "Previous Section", shortcut: "⌘[", action: handlePreviousSection },
      { label: "Next Section", shortcut: "⌘]", action: handleNextSection },
      { separator: true },
      { label: "Add New Section...", action: handleAddSectionClick },
      { label: "Delete Section...", action: handleDeleteSectionClick },
      { label: "Reorder Sections...", action: handleReorderSections },
    ],
    Settings: [
      { label: "Translation Settings..." },
      { label: "Terminology Settings..." },
      { label: "Export Settings..." },
      { separator: true },
      { label: "Language Pairs..." },
      { label: "Preferences..." },
    ],
  }

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Editing</span>
            <span className="text-sm font-semibold text-foreground">Section {currentSection}</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <nav className="flex gap-1">
            {Object.entries(menus).map(([menuName, items]) => (
              <div
                key={menuName}
                className="relative"
                onMouseEnter={() => setOpenMenu(menuName)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  {menuName}
                </Button>
                {openMenu === menuName && (
                  <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-md border border-border bg-card shadow-lg">
                    <div className="py-1">
                      {items.map((item, index) =>
                        item.separator ? (
                          <div key={index} className="my-1 h-px bg-border" />
                        ) : (
                          <button
                            key={index}
                            onClick={() => {
                              if (item.action) {
                                item.action()
                              }
                              setOpenMenu(null)
                            }}
                            className="flex w-full items-center justify-between px-3 py-2 text-sm text-foreground hover:bg-muted"
                          >
                            <span>{item.label}</span>
                            {item.shortcut && <span className="text-xs text-muted-foreground">{item.shortcut}</span>}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="default" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Translate Exp
          </Button>
          <div className="relative ml-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-full p-0"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <User className="h-4 w-4" />
            </Button>
            {showUserMenu && (
              <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-md border border-border bg-card shadow-lg">
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {showAddSection && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowAddSection(false)}
        >
          <div
            className="w-96 rounded-lg border border-border bg-card p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-semibold">Add New Section</h2>
            <div className="mb-4">
              <label className="mb-2 block text-sm text-muted-foreground">Section Name</label>
              <input
                type="text"
                placeholder="Enter section name..."
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleConfirmAddSection()
                  }
                }}
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowAddSection(false)}>
                Cancel
              </Button>
              <Button variant="default" size="sm" onClick={handleConfirmAddSection}>
                Add Section
              </Button>
            </div>
          </div>
        </div>
      )}

      {showDeleteSection && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowDeleteSection(false)}
        >
          <div
            className="w-96 rounded-lg border border-border bg-card p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-semibold">Delete Section</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Are you sure you want to delete Section {currentSection}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowDeleteSection(false)}>
                Cancel
              </Button>
              <Button variant="destructive" size="sm" onClick={handleConfirmDeleteSection}>
                Delete Section
              </Button>
            </div>
          </div>
        </div>
      )}

      {showReorderSections && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowReorderSections(false)}
        >
          <div
            className="w-96 rounded-lg border border-border bg-card p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-semibold">Reorder Sections</h2>
            <div className="mb-4 space-y-2">
              {reorderedSections.map((section, index) => (
                <div
                  key={section}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 rounded border border-border bg-background px-3 py-2 transition-opacity ${
                    draggedIndex === index ? "opacity-50" : "opacity-100"
                  }`}
                >
                  <div className="flex cursor-move flex-col gap-0.5">
                    <div className="h-0.5 w-3 bg-muted-foreground"></div>
                    <div className="h-0.5 w-3 bg-muted-foreground"></div>
                    <div className="h-0.5 w-3 bg-muted-foreground"></div>
                  </div>
                  <span className="text-sm">Section {section}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowReorderSections(false)}>
                Cancel
              </Button>
              <Button variant="default" size="sm" onClick={handleSaveOrder}>
                Save Order
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
