"use client"

import { useParams } from "next/navigation"
import { FormRenderer } from "@/components/preview/form-renderer"
import { useState, useEffect } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import type { DocumentSchema } from "@/lib/types/schema"
import { createBrowserClient } from "@supabase/ssr"

export default function PublicFormPage() {
  const params = useParams()
  const formId = params.id as string
  const [formSchema, setFormSchema] = useState<DocumentSchema | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    loadForm()
  }, [formId])

  const loadForm = async () => {
    try {
      const { data, error } = await supabase
        .from("forms")
        .select("*")
        .eq("id", formId)
        .eq("is_published", true)
        .single()

      if (error) throw error

      if (data) {
        setFormSchema(data.schema)
      }
    } catch (error) {
      console.error("[v0] Error loading form:", error)
      setFormSchema(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (data: Record<string, any>) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId,
          data,
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!formSchema) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg font-semibold">Form not found</p>
          <p className="text-sm text-muted-foreground mt-2">This form may have been deleted or the link is invalid</p>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full mx-4 bg-card p-8 rounded-lg border text-center">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Thank you!</h1>
          <p className="text-muted-foreground">Your form has been submitted successfully.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-card rounded-lg border p-8">
          <h1 className="text-2xl font-bold mb-6">{formSchema.title}</h1>

          {isSubmitting ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <FormRenderer schema={formSchema} isPublic onSubmit={handleSubmit} />
          )}

          {error && <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>}
        </div>
      </div>
    </div>
  )
}
