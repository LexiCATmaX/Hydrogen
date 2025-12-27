"use client"

import { Sidebar } from "@/components/sidebar"
import { ChapterEditor } from "@/components/chapter-editor"
import { Header } from "@/components/header"
import { TerminologyPanel } from "@/components/terminology-panel"
import { ProjectConfigPanel } from "@/components/project-config-panel"
import { useState } from "react"

export default function AppPage() {
  const [currentChapter, setCurrentChapter] = useState(1)
  const [chapterOrder, setChapterOrder] = useState([1, 2, 3, 4, 5])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleAddChapter = () => {
    const newChapterNumber = Math.max(...chapterOrder) + 1
    setChapterOrder([...chapterOrder, newChapterNumber])
    setCurrentChapter(chapterOrder.length + 1)
  }

  const handleDeleteChapter = (chapterToDelete: number) => {
    if (chapterOrder.length <= 1) {
      return
    }

    const newOrder = chapterOrder.filter((_, index) => index + 1 !== chapterToDelete)
    setChapterOrder(newOrder)

    if (chapterToDelete === currentChapter) {
      setCurrentChapter(Math.max(1, chapterToDelete - 1))
    } else if (chapterToDelete < currentChapter) {
      setCurrentChapter(currentChapter - 1)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        currentChapter={currentChapter}
        onChapterChange={setCurrentChapter}
        chapterOrder={chapterOrder}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      <div className="flex flex-1 flex-col">
        <Header
          currentChapter={currentChapter}
          onChapterChange={setCurrentChapter}
          chapterOrder={chapterOrder}
          onChapterOrderChange={setChapterOrder}
          onAddChapter={handleAddChapter}
          onDeleteChapter={handleDeleteChapter}
        />
        <ProjectConfigPanel />
        <main className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto">
            <ChapterEditor chapterId={currentChapter} />
          </div>
          <TerminologyPanel />
        </main>
      </div>
    </div>
  )
}
