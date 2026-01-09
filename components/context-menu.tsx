"use client"

import { useEffect, useRef, useState, useLayoutEffect } from "react"

interface MenuItemBase {
  label: string
  action?: string
  disabled?: boolean
  submenu?: MenuItem[]
}

interface MenuItemDivider {
  divider: true
}

export type MenuItem = MenuItemBase | MenuItemDivider

interface ContextMenuProps {
  x: number
  y: number
  items: MenuItem[]
  onAction: (action: string) => void
  onClose: () => void
}

export function ContextMenu({ x, y, items, onAction, onClose }: ContextMenuProps) {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const [position, setPosition] = useState({ x, y })
  const [submenuPositions, setSubmenuPositions] = useState<Map<string, { left: boolean; topOffset: number }>>(new Map())
  const menuRef = useRef<HTMLDivElement>(null)
  const submenuRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const parentItemRefs = useRef<Map<string, HTMLLIElement>>(new Map())

  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let adjustedX = x
      let adjustedY = y

      if (x + rect.width > viewportWidth) {
        adjustedX = Math.max(0, viewportWidth - rect.width - 8)
      }

      if (y + rect.height > viewportHeight) {
        adjustedY = Math.max(0, viewportHeight - rect.height - 8)
      }

      setPosition({ x: adjustedX, y: adjustedY })
    }
  }, [x, y])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [onClose])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [onClose])

  useLayoutEffect(() => {
    if (activeSubmenu) {
      const submenuEl = submenuRefs.current.get(activeSubmenu)
      const parentEl = parentItemRefs.current.get(activeSubmenu)

      if (submenuEl && parentEl && menuRef.current) {
        const menuRect = menuRef.current.getBoundingClientRect()
        const parentRect = parentEl.getBoundingClientRect()
        const submenuRect = submenuEl.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        const openLeft = menuRect.right + submenuRect.width > viewportWidth

        let topOffset = 0
        const submenuTop = parentRect.top
        const submenuBottom = submenuTop + submenuRect.height

        if (submenuBottom > viewportHeight - 8) {
          topOffset = viewportHeight - 8 - submenuBottom
        }

        setSubmenuPositions((prev) => {
          const next = new Map(prev)
          next.set(activeSubmenu, { left: openLeft, topOffset })
          return next
        })
      }
    }
  }, [activeSubmenu])

  const getSubmenuStyle = (label: string) => {
    const pos = submenuPositions.get(label)
    if (!pos) {
      return {
        left: "100%",
        right: "auto",
        top: 0,
        marginLeft: "-4px",
      }
    }
    return {
      left: pos.left ? "auto" : "100%",
      right: pos.left ? "100%" : "auto",
      top: pos.topOffset,
      marginLeft: pos.left ? "4px" : "-4px",
      marginRight: pos.left ? "-4px" : "0",
    }
  }

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[140px] rounded-md border border-border bg-popover shadow-lg py-1"
      style={{ left: position.x, top: position.y }}
    >
      <ul className="list-none m-0 p-0">
        {items.map((item, i) => {
          if ("divider" in item && item.divider) {
            return <li key={i} className="h-px bg-border my-1" />
          }

          const menuItem = item as MenuItemBase
          const hasSubmenu = menuItem.submenu && menuItem.submenu.length > 0

          return (
            <li
              key={i}
              className="relative"
              onMouseEnter={() => hasSubmenu && setActiveSubmenu(menuItem.label)}
              ref={(el) => {
                if (el && hasSubmenu) parentItemRefs.current.set(menuItem.label, el)
              }}
            >
              <button
                disabled={menuItem.disabled}
                onClick={() => !hasSubmenu && menuItem.action && onAction(menuItem.action)}
                className="w-full px-3 py-1.5 text-left text-[11px] hover:bg-accent hover:text-accent-foreground flex items-center justify-between disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{menuItem.label}</span>
                {hasSubmenu && <span className="text-[10px] ml-4">▶</span>}
              </button>

              {hasSubmenu && activeSubmenu === menuItem.label && (
                <div
                  ref={(el) => {
                    if (el) submenuRefs.current.set(menuItem.label, el)
                  }}
                  className="absolute min-w-[140px] rounded-md border border-border bg-popover shadow-lg py-1"
                  style={getSubmenuStyle(menuItem.label)}
                >
                  <ul className="list-none m-0 p-0">
                    {menuItem.submenu!.map((subItem, j) => {
                      if ("divider" in subItem && subItem.divider) {
                        return <li key={j} className="h-px bg-border my-1" />
                      }
                      const subMenuItem = subItem as MenuItemBase
                      return (
                        <li key={j}>
                          <button
                            disabled={subMenuItem.disabled}
                            onClick={() => subMenuItem.action && onAction(subMenuItem.action)}
                            className="w-full px-3 py-1.5 text-left text-[11px] hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                          >
                            {subMenuItem.label}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
