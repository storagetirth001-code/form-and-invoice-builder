"use client"

import { useDocumentStore } from "@/lib/store/document-store"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GripVertical, Trash2 } from "lucide-react"
import type { Component } from "@/lib/types/schema"
import { cn } from "@/lib/utils"

function SortableComponent({ component }: { component: Component }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: component.id,
  })

  const selectedComponentId = useDocumentStore((state) => state.selectedComponentId)
  const selectComponent = useDocumentStore((state) => state.selectComponent)
  const removeComponent = useDocumentStore((state) => state.removeComponent)

  const isSelected = selectedComponentId === component.id

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getComponentLabel = (comp: Component): string => {
    if ("label" in comp && comp.label) return comp.label
    if (comp.type === "header") return "Header"
    if (comp.type === "client") return "Client Details"
    if (comp.type === "items") return "Line Items"
    if (comp.type === "tax") return "Tax"
    if (comp.type === "discount") return "Discount"
    if (comp.type === "notes") return "Notes"
    if (comp.type === "footer") return "Footer"
    if (comp.type === "resume-header") return "Header"
    if (comp.type === "summary") return "Summary"
    if (comp.type === "experience") return "Experience"
    if (comp.type === "education") return "Education"
    if (comp.type === "skills") return "Skills"
    if (comp.type === "projects") return "Projects"
    if (comp.type === "certifications") return "Certifications"
    return comp.type
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        className={cn(
          "p-4 cursor-pointer hover:border-primary/50 transition-colors",
          isSelected && "border-primary ring-2 ring-primary/20",
        )}
        onClick={() => selectComponent(component.id)}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button {...listeners} className="cursor-grab active:cursor-grabbing touch-none">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </button>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-medium truncate">{getComponentLabel(component)}</span>
              <span className="text-xs text-muted-foreground">{component.type}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              removeComponent(component.id)
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}

export function Canvas() {
  const document = useDocumentStore((state) => state.document)
  const { setNodeRef } = useDroppable({
    id: "canvas",
  })

  if (!document) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <p className="text-muted-foreground">No document loaded</p>
      </div>
    )
  }

  return (
    <div ref={setNodeRef} className="flex-1 bg-muted/20 p-8 overflow-auto">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">{document.title}</h1>
          <p className="text-sm text-muted-foreground">
            {document.type === "form"
              ? "Form Builder"
              : document.type === "invoice"
                ? "Invoice Builder"
                : "Resume Builder"}
          </p>
        </div>

        {document.components.length === 0 ? (
          <Card className="p-12 border-dashed">
            <div className="text-center text-muted-foreground">
              <p className="text-lg mb-2">Drop components here</p>
              <p className="text-sm">Drag components from the left panel to start building</p>
            </div>
          </Card>
        ) : (
          <SortableContext items={document.components.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-3">
              {document.components.map((component) => (
                <SortableComponent key={component.id} component={component} />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  )
}
