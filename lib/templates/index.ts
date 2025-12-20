import { FORM_TEMPLATES } from "./form-templates"
import { INVOICE_TEMPLATES } from "./invoice-templates"

export { FORM_TEMPLATES, INVOICE_TEMPLATES }

export const ALL_TEMPLATES = [...FORM_TEMPLATES, ...INVOICE_TEMPLATES]

export function getTemplatesByType(type: "form" | "invoice") {
  return type === "form" ? FORM_TEMPLATES : INVOICE_TEMPLATES
}

export function getTemplateById(id: string) {
  return ALL_TEMPLATES.find((template) => template.id === id)
}
