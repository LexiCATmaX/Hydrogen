"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Printer, Download, LogOut, User, Menu, PanelRight, X } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function Header({
  currentSection,
  onSectionChange,
  sectionOrder,
  onSectionOrderChange,
  onAddSection,
  onDeleteSection,
  onMobileSidebarToggle,
  onMobileTerminologyToggle,
}: {
  currentSection: number
  onSectionChange: (section: number) => void
  sectionOrder: number[]
  onSectionOrderChange: (order: number[]) => void
  onAddSection: () => void
  onDeleteSection: (section: number) => void
  onMobileSidebarToggle?: () => void
  onMobileTerminologyToggle?: () => void
}) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [showAddSection, setShowAddSection] = useState(false)
  const [showDeleteSection, setShowDeleteSection] = useState(false)
  const [showReorderSections, setShowReorderSections] = useState(false)
  const [reorderedSections, setReorderedSections] = useState<number[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [newSectionName, setNewSectionName] = useState("")
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLoginDropdown, setShowLoginDropdown] = useState(false)
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      })
      if (error) throw error
      setShowLoginDropdown(false)
      setLoginEmail("")
      setLoginPassword("")
    } catch (error: unknown) {
      setLoginError(error instanceof Error ? error.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: "google" | "apple") => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      if (data?.url) window.location.href = data.url
    } catch (error) {
      console.error("OAuth error:", error)
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
    setUser(null)
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
      <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="sm" className="md:hidden h-8 w-8 p-0" onClick={onMobileSidebarToggle}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">Editing</span>
            <span className="text-sm font-semibold text-foreground">Section {currentSection}</span>
          </div>
          <div className="h-4 w-px bg-border hidden md:block" />
          <nav className="hidden md:flex gap-1">
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

        <div className="flex items-center gap-1 md:gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button variant="outline" size="sm" className="hidden lg:flex bg-transparent">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="default" size="sm" className="hidden sm:flex">
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Translate Exp</span>
            <span className="md:hidden">Export</span>
          </Button>

          <Button variant="ghost" size="sm" className="md:hidden h-8 w-8 p-0" onClick={onMobileTerminologyToggle}>
            <PanelRight className="h-5 w-5" />
          </Button>

          <div className="relative ml-1 md:ml-2">
            {user ? (
              <>
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
                      <div className="px-3 py-2 text-xs text-muted-foreground truncate border-b border-border">
                        {user.email}
                      </div>
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
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-transparent"
                  onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                >
                  Sign in
                </Button>
                {showLoginDropdown && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-md border border-border bg-card shadow-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">Sign in</span>
                      <button
                        onClick={() => setShowLoginDropdown(false)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="login-email" className="text-xs">
                          Email
                        </Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="name@example.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          disabled={isLoading}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="login-password" className="text-xs">
                          Password
                        </Label>
                        <Input
                          id="login-password"
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          disabled={isLoading}
                          className="h-8 text-sm"
                        />
                      </div>
                      {loginError && <p className="text-xs text-destructive">{loginError}</p>}
                      <Button type="submit" size="sm" className="w-full h-8" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign in"}
                      </Button>
                    </form>
                    <div className="relative my-3">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-card px-2 text-muted-foreground">or</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => handleOAuthLogin("google")}
                        disabled={isLoading}
                        className="flex h-8 w-full items-center justify-center gap-2 rounded-md border border-input bg-white px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                            fill="#4285F4"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
                            fill="#34A853"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                            fill="#FBBC05"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                            fill="#EA4335"
                          />
                        </svg>
                        Google
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOAuthLogin("apple")}
                        disabled={isLoading}
                        className="flex h-8 w-full items-center justify-center gap-2 rounded-md bg-black px-3 text-xs font-medium text-white hover:bg-gray-900 disabled:opacity-50"
                      >
                        <svg width="12" height="14" viewBox="0 0 16 18" fill="none">
                          <path
                            d="M12.5 0C12.5 0 12.8 1.3 12 2.5C11.2 3.7 10 3.5 10 3.5C10 3.5 9.7 2.3 10.5 1.2C11.3 0.1 12.5 0 12.5 0Z"
                            fill="white"
                          />
                          <path
                            d="M15.2 6.1C15.2 6.1 13.4 7.2 13.4 9.4C13.4 12 15.7 12.8 15.7 12.8C15.7 12.8 14.3 17 12.1 17C11.1 17 10.4 16.3 9.2 16.3C8 16.3 7.1 17 6.2 17C4.1 17 1.5 12.5 1.5 9.2C1.5 6.1 3.5 4.4 5.5 4.4C6.6 4.4 7.6 5.2 8.3 5.2C9 5.2 10.2 4.3 11.5 4.3C12.1 4.3 14.1 4.4 15.2 6.1Z"
                            fill="white"
                          />
                        </svg>
                        Apple
                      </button>
                    </div>
                    <div className="mt-3 text-center">
                      <Link href="/auth/register" className="text-xs text-muted-foreground hover:text-foreground">
                        Don't have an account? Sign up
                      </Link>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {showAddSection && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowAddSection(false)}
        >
          <div
            className="w-full max-w-96 rounded-lg border border-border bg-card p-6 shadow-lg"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowDeleteSection(false)}
        >
          <div
            className="w-full max-w-96 rounded-lg border border-border bg-card p-6 shadow-lg"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowReorderSections(false)}
        >
          <div
            className="w-full max-w-96 rounded-lg border border-border bg-card p-6 shadow-lg"
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
