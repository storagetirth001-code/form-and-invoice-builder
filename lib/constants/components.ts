import type { AvailableComponent } from "@/lib/types/schema"

export const FORM_COMPONENTS: AvailableComponent[] = [
  { type: "text", label: "Text Input", category: "form", icon: "Type" },
  { type: "email", label: "Email", category: "form", icon: "Mail" },
  { type: "number", label: "Number", category: "form", icon: "Hash" },
  { type: "textarea", label: "Text Area", category: "form", icon: "AlignLeft" },
  { type: "select", label: "Select", category: "form", icon: "ChevronDown" },
  { type: "checkbox", label: "Checkbox", category: "form", icon: "CheckSquare" },
  { type: "date", label: "Date", category: "form", icon: "Calendar" },
]

export const INVOICE_COMPONENTS: AvailableComponent[] = [
  { type: "header", label: "Header", category: "invoice", icon: "FileText" },
  { type: "client", label: "Client Details", category: "invoice", icon: "User" },
  { type: "items", label: "Line Items", category: "invoice", icon: "List" },
  { type: "tax", label: "Tax", category: "invoice", icon: "Percent" },
  { type: "discount", label: "Discount", category: "invoice", icon: "Tag" },
  { type: "notes", label: "Notes", category: "invoice", icon: "FileText" },
  { type: "footer", label: "Footer", category: "invoice", icon: "AlignLeft" },
]
