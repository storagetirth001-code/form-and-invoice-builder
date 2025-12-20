import type { DocumentSchema } from "@/lib/types/schema"

export function saveFormToStorage(schema: DocumentSchema) {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(`form-${schema.id}`, JSON.stringify(schema))
    console.log("[v0] Form saved to storage:", schema.id)
  } catch (error) {
    console.error("[v0] Failed to save form:", error)
  }
}

export function getFormFromStorage(formId: string): DocumentSchema | null {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem(`form-${formId}`)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("[v0] Failed to retrieve form:", error)
  }

  return null
}

export function getAllFormsFromStorage(): DocumentSchema[] {
  if (typeof window === "undefined") return []

  try {
    const forms: DocumentSchema[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("form-")) {
        const stored = localStorage.getItem(key)
        if (stored) {
          forms.push(JSON.parse(stored))
        }
      }
    }
    return forms
  } catch (error) {
    console.error("[v0] Failed to retrieve forms:", error)
    return []
  }
}
