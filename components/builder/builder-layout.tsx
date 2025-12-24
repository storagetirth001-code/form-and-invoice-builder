"use client"

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { ComponentPalette } from "./component-palette"
import { Canvas } from "./canvas"
import { PropertiesPanel } from "./properties-panel"
import { useDocumentStore } from "@/lib/store/document-store"
import { createComponent } from "@/lib/utils/component-factory"
import { useState } from "react"
import type { ComponentType } from "@/lib/types/schema"
import { cn } from "@/lib/utils"

export function BuilderLayout() {
  const document = useDocumentStore((state) => state.document)
  const addComponent = useDocumentStore((state) => state.addComponent)
  const reorderComponents = useDocumentStore((state) => state.reorderComponents)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [mobileView, setMobileView] = useState<"palette" | "canvas" | "properties">("canvas")

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over || !document) return

    // Dropping a new component from palette
    if (active.data.current?.component) {
      const componentType = active.id as ComponentType
      const newComponent = createComponent(componentType)
      addComponent(newComponent)
      return
    }

    // Reordering existing components
    if (active.id !== over.id) {
      const oldIndex = document.components.findIndex((c) => c.id === active.id)
      const newIndex = document.components.findIndex((c) => c.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderComponents(oldIndex, newIndex)
      }
    }
  }

  if (!document) {
    return <div>Loading...</div>
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col lg:flex-row h-[calc(100vh-56px)] overflow-hidden">
        {/* Mobile Navigation */}
        <div className="lg:hidden flex border-b bg-background sticky top-0 z-10 overflow-x-auto shrink-0">
          <button
            onClick={() => setMobileView("palette")}
            className={cn(
              "flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
              mobileView === "palette" ? "border-primary text-primary" : "border-transparent text-muted-foreground",
            )}
          >
            Components
          </button>
          <button
            onClick={() => setMobileView("canvas")}
            className={cn(
              "flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
              mobileView === "canvas" ? "border-primary text-primary" : "border-transparent text-muted-foreground",
            )}
          >
            Design
          </button>
          <button
            onClick={() => setMobileView("properties")}
            className={cn(
              "flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
              mobileView === "properties" ? "border-primary text-primary" : "border-transparent text-muted-foreground",
            )}
          >
            Properties
          </button>
        </div>

        <div className={cn("lg:flex lg:w-80 border-r overflow-hidden shrink-0", mobileView === "palette" ? "flex flex-col" : "hidden")}>
          <ComponentPalette documentType={document.type} />
        </div>
        <div className={cn("lg:flex lg:flex-1 bg-muted/30 overflow-hidden", mobileView === "canvas" ? "flex flex-col" : "hidden")}>
          <Canvas />
        </div>
        <div className={cn("lg:flex lg:w-80 border-l overflow-hidden shrink-0", mobileView === "properties" ? "flex flex-col" : "hidden")}>
          <PropertiesPanel />
        </div>
      </div>
      <DragOverlay>
        {activeId ? (
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg opacity-80 scale-105 transition-transform">
            Dragging Component...
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
