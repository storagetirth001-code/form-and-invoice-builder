"use client"

import { BuilderLayout } from "@/components/builder/builder-layout"
import { PreviewPanel } from "@/components/preview/preview-panel"
import { useDocumentStore } from "@/lib/store/document-store"
import { Button } from "@/components/ui/button"
import { Undo, Redo, Eye, Code, ArrowLeft, Save } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { exportToPDF } from "@/lib/utils/pdf-export"
import { useToast } from "@/hooks/use-toast"
import { createBrowserClient } from "@supabase/ssr"

export default function BuilderPage() {
  const params = useParams()
  const formId = params.id as string
  const [showPreview, setShowPreview] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const undo = useDocumentStore((state) => state.undo)
  const redo = useDocumentStore((state) => state.redo)
  const canUndo = useDocumentStore((state) => state.canUndo())
  const canRedo = useDocumentStore((state) => state.canRedo())
  const document = useDocumentStore((state) => state.document)
  const loadDocument = useDocumentStore((state) => state.loadDocument)
  const { toast } = useToast()
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    loadFormFromDatabase()
  }, [formId])

  const loadFormFromDatabase = async () => {
    try {
      const { data, error } = await supabase.from("forms").select("*").eq("id", formId).single()

      if (error) throw error

      if (data) {
        loadDocument(data.schema)
      }
    } catch (error: any) {
      console.error("[v0] Error loading form:", error)
      toast({
        title: "Error",
        description: "Failed to load form",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (document) {
      const timeoutId = setTimeout(() => {
        saveToDatabase()
      }, 1000) // Auto-save after 1 second of inactivity

      return () => clearTimeout(timeoutId)
    }
  }, [document])

  const saveToDatabase = async () => {
    if (!document) return

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from("forms")
        .update({
          schema: document,
          title: document.title,
          updated_at: new Date().toISOString(),
        })
        .eq("id", formId)
        .eq("user_id", user.id)

      if (error) throw error
    } catch (error: any) {
      console.error("[v0] Auto-save error:", error)
    }
  }

  const handleManualSave = async () => {
    setIsSaving(true)
    try {
      await saveToDatabase()
      toast({
        title: "Saved",
        description: "Your changes have been saved",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportPDF = async () => {
    if (!document) return

    setIsExporting(true)
    try {
      const filename = `${document.title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.pdf`
      await exportToPDF("preview-content", filename)
      toast({
        title: "PDF Exported",
        description: "Your document has been successfully exported as PDF.",
      })
    } catch (error) {
      console.error("[v0] PDF export error:", error)
      toast({
        title: "Export Failed",
        description: "There was an error exporting your document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Toolbar */}
      <div className="border-b bg-background p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={undo} disabled={!canUndo}>
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={redo} disabled={!canRedo}>
            <Redo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleManualSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? <Code className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showPreview ? "Builder" : "Preview"}
          </Button>
        </div>
      </div>

      {/* Main content */}
      {showPreview ? <PreviewPanel onExportPDF={handleExportPDF} isExporting={isExporting} /> : <BuilderLayout />}
    </div>
  )
}
