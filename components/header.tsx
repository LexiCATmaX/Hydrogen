"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Save, Printer, Download, LogOut, User } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function Header({
  currentChapter,
  onChapterChange,
  chapterOrder,
  onChapterOrderChange,
  onAddChapter,
  onDeleteChapter,
}: {
  currentChapter: number
  onChapterChange: (chapter: number) => void
  chapterOrder: number[]
  onChapterOrderChange: (order: number[]) => void
  onAddChapter: () => void
  onDeleteChapter: (chapter: number) => void
}) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [showAddChapter, setShowAddChapter] = useState(false)
  const [showDeleteChapter, setShowDeleteChapter] = useState(false)
  const [showReorderChapters, setShowReorderChapters] = useState(false)
  const [reorderedChapters, setReorderedChapters] = useState<number[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [newChapterName, setNewChapterName] = useState("")
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const handlePreviousChapter = () => {
    if (currentChapter > 1) {
      onChapterChange(currentChapter - 1)
    }
  }

  const handleNextChapter = () => {
    if (currentChapter < chapterOrder.length) {
      onChapterChange(currentChapter + 1)
    }
  }

  const handleAddChapterClick = () => {
    setShowAddChapter(true)
    setOpenMenu(null)
    setNewChapterName("")
  }

  const handleDeleteChapterClick = () => {
    setShowDeleteChapter(true)
    setOpenMenu(null)
  }

  const handleConfirmAddChapter = () => {
    onAddChapter()
    setShowAddChapter(false)
    setNewChapterName("")
  }

  const handleConfirmDeleteChapter = () => {
    onDeleteChapter(currentChapter)
    setShowDeleteChapter(false)
  }

  const handleReorderChapters = () => {
    setReorderedChapters([...chapterOrder])
    setShowReorderChapters(true)
    setOpenMenu(null)
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newOrder = [...reorderedChapters]
    const draggedItem = newOrder[draggedIndex]
    newOrder.splice(draggedIndex, 1)
    newOrder.splice(index, 0, draggedItem)

    setReorderedChapters(newOrder)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleSaveOrder = () => {
    onChapterOrderChange(reorderedChapters)
    setShowReorderChapters(false)
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
    Chapters: [
      { label: "Previous Chapter", shortcut: "⌘[", action: handlePreviousChapter },
      { label: "Next Chapter", shortcut: "⌘]", action: handleNextChapter },
      { separator: true },
      { label: "Add New Chapter...", action: handleAddChapterClick },
      { label: "Delete Chapter...", action: handleDeleteChapterClick },
      { label: "Reorder Chapters...", action: handleReorderChapters },
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
            <span className="text-sm font-semibold text-foreground">Chapter {currentChapter}</span>
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

      {showAddChapter && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowAddChapter(false)}
        >
          <div
            className="w-96 rounded-lg border border-border bg-card p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-semibold">Add New Chapter</h2>
            <div className="mb-4">
              <label className="mb-2 block text-sm text-muted-foreground">Chapter Name</label>
              <input
                type="text"
                placeholder="Enter chapter name..."
                value={newChapterName}
                onChange={(e) => setNewChapterName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleConfirmAddChapter()
                  }
                }}
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowAddChapter(false)}>
                Cancel
              </Button>
              <Button variant="default" size="sm" onClick={handleConfirmAddChapter}>
                Add Chapter
              </Button>
            </div>
          </div>
        </div>
      )}

      {showDeleteChapter && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowDeleteChapter(false)}
        >
          <div
            className="w-96 rounded-lg border border-border bg-card p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-semibold">Delete Chapter</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Are you sure you want to delete Chapter {currentChapter}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowDeleteChapter(false)}>
                Cancel
              </Button>
              <Button variant="destructive" size="sm" onClick={handleConfirmDeleteChapter}>
                Delete Chapter
              </Button>
            </div>
          </div>
        </div>
      )}

      {showReorderChapters && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowReorderChapters(false)}
        >
          <div
            className="w-96 rounded-lg border border-border bg-card p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-semibold">Reorder Chapters</h2>
            <div className="mb-4 space-y-2">
              {reorderedChapters.map((chapter, index) => (
                <div
                  key={chapter}
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
                  <span className="text-sm">Chapter {chapter}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowReorderChapters(false)}>
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
