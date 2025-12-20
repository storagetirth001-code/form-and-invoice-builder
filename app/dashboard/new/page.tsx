"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Receipt, Plus } from "lucide-react"
import type { DocumentType } from "@/lib/types/schema"
import { getTemplatesByType } from "@/lib/templates"
import { createBrowserClient } from "@supabase/ssr"
import { useToast } from "@/hooks/use-toast"

export default function NewDocumentPage() {
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const handleCreateBlank = async () => {
    if (!selectedType) return

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const newDoc = {
        id: crypto.randomUUID(),
        type: selectedType,
        title: selectedType === "form" ? "New Form" : "New Invoice",
        components: [],
        theme: "default",
        user_id: user.id,
        is_published: false,
      }

      const { error } = await supabase.from("forms").insert([
        {
          id: newDoc.id,
          schema: newDoc,
          title: newDoc.title,
          user_id: user.id,
          is_published: false,
        },
      ])

      if (error) throw error

      router.push(`/builder/${newDoc.id}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create document",
        variant: "destructive",
      })
    }
  }

  const handleSelectTemplate = async (templateId: string) => {
    if (!selectedType) return

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const templates = getTemplatesByType(selectedType)
      const template = templates.find((t) => t.id === templateId)
      if (!template) return

      const newDoc = {
        ...template,
        id: crypto.randomUUID(),
        user_id: user.id,
        is_published: false,
      }

      const { error } = await supabase.from("forms").insert([
        {
          id: newDoc.id,
          schema: newDoc,
          title: newDoc.title,
          user_id: user.id,
          is_published: false,
        },
      ])

      if (error) throw error

      router.push(`/builder/${newDoc.id}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create from template",
        variant: "destructive",
      })
    }
  }

  if (!selectedType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-8">
        <div className="max-w-4xl w-full">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-8">
            ← Back to Dashboard
          </Button>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Create New Document</h1>
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
    <div className="min-h-screen bg-background p-8">
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
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
