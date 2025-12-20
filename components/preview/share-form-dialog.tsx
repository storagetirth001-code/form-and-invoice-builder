"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDocumentStore } from "@/lib/store/document-store"
import { Copy, Check, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { createBrowserClient } from "@supabase/ssr"

interface ShareFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShareFormDialog({ open, onOpenChange }: ShareFormDialogProps) {
  const document = useDocumentStore((state) => state.document)
  const [copied, setCopied] = useState(false)
  const [sheetUrl, setSheetUrl] = useState("")
  const [isPublished, setIsPublished] = useState(false)
  const { toast } = useToast()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    if (document && open) {
      loadFormData()
    }
  }, [document, open])

  const loadFormData = async () => {
    if (!document) return

    try {
      const { data } = await supabase
        .from("forms")
        .select("google_sheet_url, is_published")
        .eq("id", document.id)
        .single()

      if (data) {
        setSheetUrl(data.google_sheet_url || "")
        setIsPublished(data.is_published || false)
      }
    } catch (error) {
      console.error("[v0] Error loading form data:", error)
    }
  }

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

  const handlePublish = async () => {
    try {
      const { error } = await supabase.from("forms").update({ is_published: true }).eq("id", document.id)

      if (error) throw error

      setIsPublished(true)
      toast({
        title: "Form published!",
        description: "Your form is now live and can be filled out",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to publish form",
        variant: "destructive",
      })
    }
  }

  const handleSaveGoogleSheet = async () => {
    if (!sheetUrl.trim()) return

    try {
      const { error } = await supabase.from("forms").update({ google_sheet_url: sheetUrl }).eq("id", document.id)

      if (error) throw error

      toast({
        title: "Google Sheet connected!",
        description: "Form submissions will be stored in your Google Sheet",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save Google Sheet",
        variant: "destructive",
      })
    }
  }

  const handleOpenForm = () => {
    if (!isPublished) {
      toast({
        title: "Form not published",
        description: "Please publish your form first",
        variant: "destructive",
      })
      return
    }
    window.open(formUrl, "_blank")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share Form</DialogTitle>
          <DialogDescription>
            {isPublished ? "Anyone with this link can fill out your form" : "Publish your form to make it accessible"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!isPublished && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm mb-3">
                Your form is currently unpublished. Publish it to start collecting responses.
              </p>
              <Button onClick={handlePublish} className="w-full">
                Publish Form
              </Button>
            </div>
          )}

          {isPublished && (
            <>
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
                {sheetUrl && <p className="text-xs text-green-600">Connected to Google Sheet</p>}
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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
