"use client"

import { Sidebar } from "@/components/sidebar"
import { SectionEditor } from "@/components/section-editor"
import { Header } from "@/components/header"
import { TerminologyPanel } from "@/components/terminology-panel"
import { ProjectConfigPanel } from "@/components/project-config-panel"
import { useState } from "react"

export default function AppPage() {
  const [currentSection, setCurrentSection] = useState(1)
  const [sectionOrder, setSectionOrder] = useState([1, 2, 3, 4, 5])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleAddSection = () => {
    const newSectionNumber = Math.max(...sectionOrder) + 1
    setSectionOrder([...sectionOrder, newSectionNumber])
    setCurrentSection(sectionOrder.length + 1)
  }

  const handleDeleteSection = (sectionToDelete: number) => {
    if (sectionOrder.length <= 1) {
      return
    }

    const newOrder = sectionOrder.filter((_, index) => index + 1 !== sectionToDelete)
    setSectionOrder(newOrder)

    if (sectionToDelete === currentSection) {
      setCurrentSection(Math.max(1, sectionToDelete - 1))
    } else if (sectionToDelete < currentSection) {
      setCurrentSection(currentSection - 1)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        sectionOrder={sectionOrder}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      <div className="flex flex-1 flex-col">
        <Header
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
          sectionOrder={sectionOrder}
          onSectionOrderChange={setSectionOrder}
          onAddSection={handleAddSection}
          onDeleteSection={handleDeleteSection}
        />
        <ProjectConfigPanel />
        <main className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto">
            <SectionEditor sectionId={currentSection} />
          </div>
          <TerminologyPanel />
        </main>
      </div>
    </div>
  )
}
