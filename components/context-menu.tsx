"use client"

import { useEffect, useRef, useState } from "react"

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
  const menuRef = useRef<HTMLDivElement>(null)

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

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[140px] rounded-md border border-border bg-popover shadow-lg py-1"
      style={{ left: x, top: y }}
    >
      <ul className="list-none m-0 p-0">
        {items.map((item, i) => {
          if ("divider" in item && item.divider) {
            return <li key={i} className="h-px bg-border my-1" />
          }

          const menuItem = item as MenuItemBase
          const hasSubmenu = menuItem.submenu && menuItem.submenu.length > 0

          return (
            <li key={i} className="relative" onMouseEnter={() => hasSubmenu && setActiveSubmenu(menuItem.label)}>
              <button
                disabled={menuItem.disabled}
                onClick={() => !hasSubmenu && menuItem.action && onAction(menuItem.action)}
                className="w-full px-3 py-1.5 text-left text-[11px] hover:bg-accent hover:text-accent-foreground flex items-center justify-between disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{menuItem.label}</span>
                {hasSubmenu && <span className="text-[10px] ml-4">▶</span>}
              </button>

              {hasSubmenu && activeSubmenu === menuItem.label && (
                <div className="absolute left-full top-0 min-w-[140px] rounded-md border border-border bg-popover shadow-lg py-1 -ml-1">
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
                            className="w-full px-3 py-1.5 text-left text-[11px] hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:cursor-not-allowed"
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
