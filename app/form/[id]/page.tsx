"use client"

import { useParams } from "next/navigation"
import { FormRenderer } from "@/components/preview/form-renderer"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2 } from "lucide-react"
import type { DocumentSchema } from "@/lib/types/schema"
import { getFormFromStorage } from "@/lib/utils/form-storage"

export default function PublicFormPage() {
  const params = useParams()
  const [formSchema, setFormSchema] = useState<DocumentSchema | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const schema = getFormFromStorage(params.id as string)
    setFormSchema(schema)
  }, [params.id])

  const handleSubmit = async (data: Record<string, any>) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Submit to API route which handles Google Sheets
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId: params.id,
          data,
          googleSheetId: formSchema?.googleSheetId,
        }),
      })

      if (!response.ok) throw new Error("Submission failed")

      setIsSubmitted(true)
    } catch (err) {
      setError("Failed to submit form. Please try again.")
      console.error("[v0] Form submission error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!formSchema) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <p className="text-lg font-semibold">Form not found</p>
          <p className="text-sm text-muted-foreground mt-2">This form may have been deleted or the link is invalid</p>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="max-w-md w-full mx-4 bg-background p-8 rounded-lg border text-center">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Thank you!</h1>
          <p className="text-muted-foreground">Your form has been submitted successfully.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-background rounded-lg border p-8">
          <h1 className="text-2xl font-bold mb-6">{formSchema.title}</h1>

          <FormRenderer schema={formSchema} isPublic onSubmit={handleSubmit} />

          {error && <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>}

          <Button
            type="submit"
            className="w-full mt-6"
            size="lg"
            disabled={isSubmitting}
            onClick={() => {
              const form = document.querySelector("form")
              if (form) {
                form.requestSubmit()
              }
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Form"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
