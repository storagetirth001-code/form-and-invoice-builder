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
  // Resume components
  | "resume-header"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "publications"

export type DocumentType = "form" | "invoice" | "resume"

export type Theme = "clean" | "minimal" | "professional" | "modern" | "developer"

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

// Resume components
export interface ResumeHeaderComponent extends BaseComponent {
  type: "resume-header"
  name: string
  title: string
  email: string
  phone?: string
  location?: string
  website?: string
  linkedin?: string
  github?: string
}

export interface SummaryComponent extends BaseComponent {
  type: "summary"
  content: string
}

export interface ExperienceItem {
  id: string
  role: string
  company: string
  duration: string
  location?: string
  description: string
}

export interface ExperienceComponent extends BaseComponent {
  type: "experience"
  title: string
  items: ExperienceItem[]
}

export interface EducationItem {
  id: string
  degree: string
  school: string
  duration: string
  location?: string
  description?: string
}

export interface EducationComponent extends BaseComponent {
  type: "education"
  title: string
  items: EducationItem[]
}

export interface SkillItem {
  id: string
  name: string
  level?: "Beginner" | "Intermediate" | "Advanced" | "Expert"
}

export interface SkillsComponent extends BaseComponent {
  type: "skills"
  title: string
  items: SkillItem[]
}

export interface ProjectItem {
  id: string
  name: string
  role?: string
  duration?: string
  description: string
  link?: string
}

export interface ProjectsComponent extends BaseComponent {
  type: "projects"
  title: string
  items: ProjectItem[]
}

export interface CertificationItem {
  id: string
  name: string
  issuer?: string
  date?: string
  description?: string
}

export interface CertificationsComponent extends BaseComponent {
  type: "certifications" | "publications"
  title: string
  items: CertificationItem[]
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
  | ResumeHeaderComponent
  | SummaryComponent
  | ExperienceComponent
  | EducationComponent
  | SkillsComponent
  | ProjectsComponent
  | CertificationsComponent

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
  category: "form" | "invoice" | "resume"
  icon: string
}
