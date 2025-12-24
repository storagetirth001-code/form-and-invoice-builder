"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import type { Component, DocumentSchema } from "@/lib/types/schema"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FormRendererProps {
  schema: DocumentSchema
  isPublic?: boolean
  onSubmit?: (data: Record<string, any>) => void
}

function RenderFormComponent({ component, isPublic }: { component: Component; isPublic?: boolean }) {
  switch (component.type) {
    case "text":
    case "email":
    case "number":
    case "date": {
      const comp = component as any
      return (
        <div className="space-y-2">
          <Label htmlFor={isPublic ? comp.id : undefined}>
            {comp.label}
            {comp.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input
            id={isPublic ? comp.id : undefined}
            name={isPublic ? comp.id : undefined}
            type={component.type}
            placeholder={comp.placeholder}
            defaultValue={comp.defaultValue}
            required={comp.required}
          />
        </div>
      )
    }

    case "textarea": {
      const comp = component as any
      return (
        <div className="space-y-2">
          <Label htmlFor={isPublic ? comp.id : undefined}>
            {comp.label}
            {comp.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Textarea
            id={isPublic ? comp.id : undefined}
            name={isPublic ? comp.id : undefined}
            placeholder={comp.placeholder}
            defaultValue={comp.defaultValue}
            rows={comp.rows || 4}
            required={comp.required}
          />
        </div>
      )
    }

    case "select": {
      const comp = component as any
      return (
        <div className="space-y-2">
          <Label htmlFor={isPublic ? comp.id : undefined}>
            {comp.label}
            {comp.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Select name={isPublic ? comp.id : undefined} defaultValue={comp.defaultValue} required={comp.required}>
            <SelectTrigger id={isPublic ? comp.id : undefined}>
              <SelectValue placeholder={comp.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {comp.options.map((option: string, index: number) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )
    }

    case "checkbox": {
      const comp = component as any
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={comp.id}
            name={isPublic ? comp.id : undefined}
            defaultChecked={comp.defaultValue}
            value="true"
          />
          <Label htmlFor={comp.id} className="cursor-pointer">
            {comp.label}
          </Label>
        </div>
      )
    }

    default:
      return null
  }
}

export function FormRenderer({ schema, isPublic, onSubmit }: FormRendererProps) {
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (isPublic && onSubmit) {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      const data: Record<string, any> = {}

      formData.forEach((value, key) => {
        data[key] = value
      })

      schema.components.forEach((component) => {
        if (component.type === "checkbox" && !data[component.id]) {
          data[component.id] = "false"
        }
      })

      onSubmit(data)
    }
  }

  return (
    <div className="w-full max-w-[210mm] mx-auto bg-white min-h-[297mm] p-6 sm:p-12 shadow-sm" id="form-preview">
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="space-y-4">
          {schema.components.map((component) => (
            <RenderFormComponent key={component.id} component={component} isPublic={isPublic} />
          ))}
        </div>

        {isPublic && (
          <Button type="submit" className="w-full" size="lg">
            Submit
          </Button>
        )}
      </form>
    </div>
  )
}
