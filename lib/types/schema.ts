// Core schema types for form and invoice builder

export type ComponentType =
  | "text"
  | "email"
  | "number"
  | "textarea"
  | "select"
  | "checkbox"
  | "date"
  | "header"
  | "client"
  | "items"
  | "tax"
  | "discount"
  | "notes"
  | "footer"

export type DocumentType = "form" | "invoice"

export type Theme = "clean" | "minimal" | "professional" | "modern"

// Base component interface
export interface BaseComponent {
  id: string
  type: ComponentType
}

// Form components
export interface TextComponent extends BaseComponent {
  type: "text" | "email" | "number" | "date"
  label: string
  placeholder?: string
  required?: boolean
  defaultValue?: string
}

export interface TextareaComponent extends BaseComponent {
  type: "textarea"
  label: string
  placeholder?: string
  required?: boolean
  defaultValue?: string
  rows?: number
}

export interface SelectComponent extends BaseComponent {
  type: "select"
  label: string
  placeholder?: string
  required?: boolean
  options: string[]
  defaultValue?: string
}

export interface CheckboxComponent extends BaseComponent {
  type: "checkbox"
  label: string
  defaultValue?: boolean
}

// Invoice components
export interface HeaderComponent extends BaseComponent {
  type: "header"
  company: string
  logo?: string
  address?: string
  phone?: string
  email?: string
}

export interface ClientComponent extends BaseComponent {
  type: "client"
  name: string
  email?: string
  address?: string
}

export interface LineItem {
  id: string
  name: string
  quantity: number
  price: number
}

export interface ItemsComponent extends BaseComponent {
  type: "items"
  items: LineItem[]
}

export interface TaxComponent extends BaseComponent {
  type: "tax"
  rate: number // percentage
}

export interface DiscountComponent extends BaseComponent {
  type: "discount"
  amount: number
  isPercentage: boolean
}

export interface NotesComponent extends BaseComponent {
  type: "notes"
  content: string
}

export interface FooterComponent extends BaseComponent {
  type: "footer"
  content: string
}

// Union type for all components
export type Component =
  | TextComponent
  | TextareaComponent
  | SelectComponent
  | CheckboxComponent
  | HeaderComponent
  | ClientComponent
  | ItemsComponent
  | TaxComponent
  | DiscountComponent
  | NotesComponent
  | FooterComponent

// Main schema
export interface DocumentSchema {
  id: string
  type: DocumentType
  theme: Theme
  title: string
  components: Component[]
  createdAt: string
  updatedAt: string
  googleSheetId?: string
  googleSheetUrl?: string
}

// Available components for dragging
export interface AvailableComponent {
  type: ComponentType
  label: string
  category: "form" | "invoice"
  icon: string
}
