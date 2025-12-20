"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Receipt, Plus } from "lucide-react"
import type { DocumentType } from "@/lib/types/schema"
import { useDocumentStore } from "@/lib/store/document-store"
import { getTemplatesByType } from "@/lib/templates"

export default function HomePage() {
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null)
  const createDocument = useDocumentStore((state) => state.createDocument)
  const loadDocument = useDocumentStore((state) => state.loadDocument)
  const router = useRouter()

  const handleCreateBlank = () => {
    if (!selectedType) return
    createDocument(selectedType, selectedType === "form" ? "New Form" : "New Invoice")
    router.push("/builder/new")
  }

  const handleSelectTemplate = (templateId: string) => {
    if (!selectedType) return
    const templates = getTemplatesByType(selectedType)
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      // Create a new document from template with new ID
      const newDoc = {
        ...template,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      loadDocument(newDoc)
      router.push("/builder/new")
    }
  }

  if (!selectedType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20 p-8">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Form & Invoice Builder</h1>
            <p className="text-lg text-muted-foreground">Choose what you want to create</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card
              className="p-8 cursor-pointer hover:border-primary transition-colors"
              onClick={() => setSelectedType("form")}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Form Builder</h2>
                  <p className="text-muted-foreground">
                    Create custom forms with text inputs, dropdowns, checkboxes, and more
                  </p>
                </div>
              </div>
            </Card>

            <Card
              className="p-8 cursor-pointer hover:border-primary transition-colors"
              onClick={() => setSelectedType("invoice")}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Receipt className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Invoice Builder</h2>
                  <p className="text-muted-foreground">
                    Design professional invoices with line items, tax calculations, and more
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const templates = getTemplatesByType(selectedType)

  return (
    <div className="min-h-screen bg-muted/20 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => setSelectedType(null)} className="mb-4">
            ← Back
          </Button>
          <h1 className="text-3xl font-bold mb-2">Choose a {selectedType === "form" ? "Form" : "Invoice"} Template</h1>
          <p className="text-muted-foreground">Start with a template or create from scratch</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            className="p-6 cursor-pointer hover:border-primary transition-colors border-dashed"
            onClick={handleCreateBlank}
          >
            <div className="flex flex-col items-center justify-center text-center h-full min-h-[200px] gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Start Blank</h3>
                <p className="text-sm text-muted-foreground">Build from scratch</p>
              </div>
            </div>
          </Card>

          {templates.map((template) => (
            <Card
              key={template.id}
              className="p-6 cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleSelectTemplate(template.id)}
            >
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {selectedType === "form" ? (
                    <FileText className="w-6 h-6 text-primary" />
                  ) : (
                    <Receipt className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{template.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{template.components.length} components</p>
                  <div className="text-xs text-muted-foreground">
                    Theme: <span className="capitalize">{template.theme}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
