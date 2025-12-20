"use client"

import { BuilderLayout } from "@/components/builder/builder-layout"
import { PreviewPanel } from "@/components/preview/preview-panel"
import { useDocumentStore } from "@/lib/store/document-store"
import { Button } from "@/components/ui/button"
import { Undo, Redo, Eye, Code } from "lucide-react"
import { useState, useEffect } from "react"
import { exportToPDF } from "@/lib/utils/pdf-export"
import { useToast } from "@/hooks/use-toast"
import { saveFormToStorage } from "@/lib/utils/form-storage"

export default function BuilderPage() {
  const [showPreview, setShowPreview] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const undo = useDocumentStore((state) => state.undo)
  const redo = useDocumentStore((state) => state.redo)
  const canUndo = useDocumentStore((state) => state.canUndo())
  const canRedo = useDocumentStore((state) => state.canRedo())
  const document = useDocumentStore((state) => state.document)
  const { toast } = useToast()

  useEffect(() => {
    if (document && document.type === "form") {
      saveFormToStorage(document)
    }
  }, [document])

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
          <Button variant="ghost" size="sm" onClick={undo} disabled={!canUndo}>
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={redo} disabled={!canRedo}>
            <Redo className="w-4 h-4" />
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
