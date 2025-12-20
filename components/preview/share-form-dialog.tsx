"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDocumentStore } from "@/lib/store/document-store"
import { Copy, Check, ExternalLink } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface ShareFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShareFormDialog({ open, onOpenChange }: ShareFormDialogProps) {
  const document = useDocumentStore((state) => state.document)
  const updateGoogleSheet = useDocumentStore((state) => state.updateGoogleSheet)
  const [copied, setCopied] = useState(false)
  const [sheetUrl, setSheetUrl] = useState(document?.googleSheetUrl || "")
  const { toast } = useToast()

  if (!document) return null

  const formUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/form/${document.id}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Link copied!",
      description: "Form link has been copied to clipboard",
    })
  }

  const handleSaveGoogleSheet = () => {
    if (sheetUrl.trim()) {
      // Extract sheet ID from URL
      const match = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
      const sheetId = match ? match[1] : sheetUrl
      updateGoogleSheet(sheetId, sheetUrl)
      toast({
        title: "Google Sheet connected!",
        description: "Form submissions will be stored in your Google Sheet",
      })
    }
  }

  const handleOpenForm = () => {
    window.open(formUrl, "_blank")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share Form</DialogTitle>
          <DialogDescription>Anyone with this link can fill out your form</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Form Link</Label>
            <div className="flex gap-2">
              <Input value={formUrl} readOnly className="flex-1" />
              <Button size="icon" variant="outline" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button size="icon" variant="outline" onClick={handleOpenForm}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Google Sheets Integration (Optional)</Label>
            <p className="text-sm text-muted-foreground">
              Connect a Google Sheet to automatically store form submissions
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Paste Google Sheet URL or ID"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSaveGoogleSheet} disabled={!sheetUrl.trim()}>
                Save
              </Button>
            </div>
            {document.googleSheetUrl && <p className="text-xs text-green-600">Connected to Google Sheet</p>}
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="text-sm font-medium">How to connect Google Sheets:</p>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Create a new Google Sheet</li>
              <li>Share it with anyone with the link (Editor access)</li>
              <li>Copy the sheet URL and paste it above</li>
              <li>Form submissions will appear in your sheet automatically</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
