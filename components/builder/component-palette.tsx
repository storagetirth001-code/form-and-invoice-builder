"use client"

import type React from "react"

import { FORM_COMPONENTS, INVOICE_COMPONENTS, RESUME_COMPONENTS } from "@/lib/constants/components"
import type { AvailableComponent, DocumentType } from "@/lib/types/schema"
import { Card } from "@/components/ui/card"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import * as Icons from "lucide-react"

interface ComponentPaletteProps {
  documentType: DocumentType
}

function DraggableComponent({ component }: { component: AvailableComponent }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: component.type,
    data: { component },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  const IconComponent = Icons[component.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
      <Card className="p-3 hover:bg-accent transition-colors">
        <div className="flex items-center gap-2">
          {IconComponent && <IconComponent className="w-4 h-4 text-muted-foreground" />}
          <span className="text-sm font-medium">{component.label}</span>
        </div>
      </Card>
    </div>
  )
}

export function ComponentPalette({ documentType }: ComponentPaletteProps) {
  let components: AvailableComponent[] = []

  switch (documentType) {
    case "form":
      components = FORM_COMPONENTS
      break
    case "invoice":
      components = INVOICE_COMPONENTS
      break
    case "resume":
      components = RESUME_COMPONENTS
      break
  }

  return (
    <div className="w-64 border-r bg-background p-4 flex flex-col gap-4">
      <div>
        <h2 className="font-semibold mb-2">Components</h2>
        <p className="text-xs text-muted-foreground mb-4">Drag components to the canvas</p>
      </div>

      <div className="flex flex-col gap-2">
        {components.map((component) => (
          <DraggableComponent key={component.type} component={component} />
        ))}
      </div>
    </div>
  )
}
