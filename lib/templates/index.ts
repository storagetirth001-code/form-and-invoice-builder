import { FORM_TEMPLATES } from "./form-templates"
import { INVOICE_TEMPLATES } from "./invoice-templates"
import { RESUME_TEMPLATES } from "./resume-templates"

export { FORM_TEMPLATES, INVOICE_TEMPLATES, RESUME_TEMPLATES }

export const ALL_TEMPLATES = [...FORM_TEMPLATES, ...INVOICE_TEMPLATES, ...RESUME_TEMPLATES]

export function getTemplatesByType(type: "form" | "invoice" | "resume") {
  switch (type) {
    case "form":
      return FORM_TEMPLATES
    case "invoice":
      return INVOICE_TEMPLATES
    case "resume":
      return RESUME_TEMPLATES
    default:
      return []
  }
}

export function getTemplateById(id: string) {
  return ALL_TEMPLATES.find((template) => template.id === id)
}

