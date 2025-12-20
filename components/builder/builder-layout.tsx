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

export function BuilderLayout() {
  const document = useDocumentStore((state) => state.document)
  const addComponent = useDocumentStore((state) => state.addComponent)
  const reorderComponents = useDocumentStore((state) => state.reorderComponents)
  const [activeId, setActiveId] = useState<string | null>(null)

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
      <div className="flex h-screen overflow-hidden">
        <ComponentPalette documentType={document.type} />
        <Canvas />
        <PropertiesPanel />
      </div>
      <DragOverlay>{activeId ? <div className="opacity-50">Dragging...</div> : null}</DragOverlay>
    </DndContext>
  )
}
