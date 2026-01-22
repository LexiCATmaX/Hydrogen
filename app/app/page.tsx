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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [mobileTerminologyOpen, setMobileTerminologyOpen] = useState(false)

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

  const onSectionChange = (section: number) => {
    setCurrentSection(section)
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background">
      <div
        className={`
          fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
          md:relative md:transform-none md:z-auto
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <Sidebar
          currentSection={currentSection}
          onSectionChange={(section) => {
            onSectionChange(section)
            setMobileSidebarOpen(false)
          }}
          sectionOrder={sectionOrder}
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />
      </div>

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      <div className="flex flex-1 flex-col min-w-0">
        <Header
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
          sectionOrder={sectionOrder}
          onSectionOrderChange={setSectionOrder}
          onAddSection={handleAddSection}
          onDeleteSection={handleDeleteSection}
          onMobileSidebarToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onMobileTerminologyToggle={() => setMobileTerminologyOpen(!mobileTerminologyOpen)}
        />
        <div className="hidden md:block">
          <ProjectConfigPanel />
        </div>
        <main className="flex flex-1 overflow-hidden flex-col md:flex-row">
          <div className="flex-1 overflow-auto min-h-0">
            <SectionEditor sectionId={currentSection} />
          </div>

          {mobileTerminologyOpen && (
            <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileTerminologyOpen(false)} />
          )}

          <div
            className={`
              fixed inset-y-0 right-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
              md:relative md:transform-none md:z-auto md:w-auto
              ${mobileTerminologyOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
            `}
          >
            <TerminologyPanel onClose={() => setMobileTerminologyOpen(false)} />
          </div>
        </main>
      </div>
    </div>
  )
}
