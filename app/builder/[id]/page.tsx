"use client"

import { BuilderLayout } from "@/components/builder/builder-layout"
import { PreviewPanel } from "@/components/preview/preview-panel"
import { useDocumentStore } from "@/lib/store/document-store"
import { Button } from "@/components/ui/button"
import { Undo, Redo, Eye, Code, ArrowLeft, Save, Download } from "lucide-react"
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
      const previewId =
        document.type === "resume" ? "resume-preview" :
          document.type === "invoice" ? "invoice-preview" :
            document.type === "form" ? "form-preview" :
              "preview-content"

      await exportToPDF(previewId, filename)
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
      <div className="border-b bg-background p-2 flex items-center justify-between shrink-0 h-14">
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="h-9 w-9 p-0 sm:w-auto sm:px-3">
            <ArrowLeft className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="h-6 w-px bg-border mx-1 hidden sm:block" />
          <Button variant="ghost" size="sm" onClick={undo} disabled={!canUndo} className="h-9 w-9 p-0">
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={redo} disabled={!canRedo} className="h-9 w-9 p-0">
            <Redo className="w-4 h-4" />
          </Button>
          <div className="h-6 w-px bg-border mx-1" />
          <Button variant="ghost" size="sm" onClick={handleManualSave} disabled={isSaving} className="h-9 px-2 sm:px-3">
            <Save className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">{isSaving ? "Saving..." : "Save"}</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)} className="h-9 px-2 sm:px-3">
            {showPreview ? <Code className="w-4 h-4 sm:mr-2" /> : <Eye className="w-4 h-4 sm:mr-2" />}
            <span className="hidden sm:inline">{showPreview ? "Builder" : "Preview"}</span>
          </Button>
          <Button onClick={handleExportPDF} disabled={isExporting} className="h-9 px-3">
            <Download className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      {showPreview ? <PreviewPanel onExportPDF={handleExportPDF} isExporting={isExporting} /> : <BuilderLayout />}
    </div>
  )
}
