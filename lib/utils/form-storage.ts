import type { DocumentSchema } from "@/lib/types/schema"
import { createClient } from "@/lib/supabase/client"

export async function saveFormToStorage(schema: DocumentSchema) {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("forms").upsert({
      id: schema.id,
      schema: schema,
      google_sheet_url: schema.googleSheetUrl || null,
      updated_at: new Date().toISOString(),
    })

    if (error) throw error
    console.log("[v0] Form saved to database:", schema.id)
  } catch (error) {
    console.error("[v0] Failed to save form:", error)
  }
}

export async function getFormFromStorage(formId: string): Promise<DocumentSchema | null> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("forms").select("schema").eq("id", formId).single()

    if (error) throw error
    return data?.schema || null
  } catch (error) {
    console.error("[v0] Failed to retrieve form:", error)
    return null
  }
}

export async function getAllFormsFromStorage(): Promise<DocumentSchema[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("forms").select("schema")

    if (error) throw error
    return data?.map((row) => row.schema) || []
  } catch (error) {
    console.error("[v0] Failed to retrieve forms:", error)
    return []
  }
}
