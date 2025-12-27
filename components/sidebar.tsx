"use client"

import type React from "react"

import { Home, Settings, LogOut, BookOpen, File, Upload, Trash2, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState, useRef, useEffect } from "react"

export function Sidebar({
  currentChapter,
  onChapterChange,
  chapterOrder,
}: {
  currentChapter: number
  onChapterChange: (chapter: number) => void
  chapterOrder: number[]
}) {
  const [files, setFiles] = useState([
    { id: 1, name: "fisherman_wife_de.txt" },
    { id: 2, name: "fisherman_wife_en.txt" },
    { id: 3, name: "terminology.csv" },
  ])
  const [filesPaneHeight, setFilesPaneHeight] = useState(200)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files
    if (uploadedFiles) {
      const newFiles = Array.from(uploadedFiles).map((file, index) => ({
        id: files.length + index + 1,
        name: file.name,
      }))
      setFiles([...files, ...newFiles])
    }
  }

  const handleDeleteFile = (fileId: number) => {
    setFiles(files.filter((file) => file.id !== fileId))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    e.preventDefault()
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const sidebar = document.querySelector("aside")
      if (sidebar) {
        const rect = sidebar.getBoundingClientRect()
        const newHeight = e.clientY - rect.top - 56 // Subtract header height
        if (newHeight >= 100 && newHeight <= 500) {
          setFilesPaneHeight(newHeight)
        }
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  return (
    <aside className="flex w-52 flex-col border-r border-border bg-sidebar">
      <div className="border-b border-sidebar-border">
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
          <div className="flex items-center">
            <FolderOpen className="mr-2 h-5 w-5 text-sidebar-foreground" />
            <span className="text-sm font-semibold text-sidebar-foreground">Files</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-sidebar-accent"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 text-sidebar-foreground" />
          </Button>
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileUpload} />
        </div>

        <div className="overflow-y-auto p-2 space-y-1" style={{ height: `${filesPaneHeight}px` }}>
          {files.map((file) => (
            <div
              key={file.id}
              className="group flex items-center justify-between rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <div className="flex items-center min-w-0 flex-1">
                <File className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">{file.name}</span>
              </div>
              <button
                onClick={() => handleDeleteFile(file.id)}
                className="opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div
          className={cn(
            "h-1 cursor-row-resize hover:bg-sidebar-primary transition-colors",
            isDragging && "bg-sidebar-primary",
          )}
          onMouseDown={handleMouseDown}
        />
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex h-14 items-center border-b border-sidebar-border px-4">
          <BookOpen className="mr-2 h-5 w-5 text-sidebar-foreground" />
          <span className="text-sm font-semibold text-sidebar-foreground">Chapters</span>
        </div>

        <nav className="flex-1 overflow-y-auto space-y-1 p-2">
          {chapterOrder.map((chapterId) => (
            <button
              key={chapterId}
              onClick={() => onChapterChange(chapterId)}
              className={cn(
                "w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
                currentChapter === chapterId
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              Chapter {chapterId}
            </button>
          ))}
        </nav>
      </div>

      <div className="border-t border-sidebar-border p-2 space-y-1">
        <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent">
          <Home className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent">
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </aside>
  )
}
