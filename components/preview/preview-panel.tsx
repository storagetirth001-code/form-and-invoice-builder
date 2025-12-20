"use client"

import { useDocumentStore } from "@/lib/store/document-store"
import { FormRenderer } from "./form-renderer"
import { InvoiceRenderer } from "./invoice-renderer"
import { Button } from "@/components/ui/button"
import { Download, Loader2, Share2 } from "lucide-react"
import { useState } from "react"
import { ShareFormDialog } from "./share-form-dialog"

interface PreviewPanelProps {
  onExportPDF?: () => void
  isExporting?: boolean
}

export function PreviewPanel({ onExportPDF, isExporting }: PreviewPanelProps) {
  const document = useDocumentStore((state) => state.document)
  const [showShareDialog, setShowShareDialog] = useState(false)

  if (!document) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <p className="text-muted-foreground">No document to preview</p>
      </div>
    )
  }

  const isForm = document.type === "form"

  return (
    <div className="flex-1 flex flex-col bg-muted/20 overflow-auto">
      <div className="border-b bg-background p-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Live Preview</h2>
          <p className="text-xs text-muted-foreground">Real-time preview of your {document.type}</p>
        </div>

        {isForm ? (
          <Button onClick={() => setShowShareDialog(true)}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Form
          </Button>
        ) : (
          onExportPDF && (
            <Button onClick={onExportPDF} disabled={isExporting}>
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </>
              )}
            </Button>
          )
        )}
      </div>

      <div className="flex-1 overflow-auto p-8" id="preview-content">
        {document.type === "form" ? <FormRenderer schema={document} /> : <InvoiceRenderer schema={document} />}
      </div>

      {isForm && <ShareFormDialog open={showShareDialog} onOpenChange={setShowShareDialog} />}
    </div>
  )
}
