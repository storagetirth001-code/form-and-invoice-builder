"use client"

import { useDocumentStore } from "@/lib/store/document-store"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import type {
  TextComponent,
  TextareaComponent,
  SelectComponent,
  CheckboxComponent,
  HeaderComponent,
  ClientComponent,
  ItemsComponent,
  TaxComponent,
  DiscountComponent,
  NotesComponent,
  FooterComponent,
} from "@/lib/types/schema"

export function PropertiesPanel() {
  const document = useDocumentStore((state) => state.document)
  const selectedComponentId = useDocumentStore((state) => state.selectedComponentId)
  const updateComponent = useDocumentStore((state) => state.updateComponent)

  if (!document || !selectedComponentId) {
    return (
      <div className="w-80 border-l bg-background p-4">
        <div className="text-center text-muted-foreground">
          <p className="text-sm">Select a component to edit its properties</p>
        </div>
      </div>
    )
  }

  const component = document.components.find((c) => c.id === selectedComponentId)

  if (!component) {
    return (
      <div className="w-80 border-l bg-background p-4">
        <div className="text-center text-muted-foreground">
          <p className="text-sm">Component not found</p>
        </div>
      </div>
    )
  }

  const renderProperties = () => {
    switch (component.type) {
      case "text":
      case "email":
      case "number":
      case "date": {
        const comp = component as TextComponent
        return (
          <div className="space-y-4">
            <div>
              <Label>Label</Label>
              <Input
                value={comp.label}
                onChange={(e) => updateComponent(comp.id, { label: e.target.value })}
                placeholder="Field label"
              />
            </div>
            <div>
              <Label>Placeholder</Label>
              <Input
                value={comp.placeholder || ""}
                onChange={(e) => updateComponent(comp.id, { placeholder: e.target.value })}
                placeholder="Placeholder text"
              />
            </div>
            <div>
              <Label>Default Value</Label>
              <Input
                value={comp.defaultValue || ""}
                onChange={(e) => updateComponent(comp.id, { defaultValue: e.target.value })}
                placeholder="Default value"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Required</Label>
              <Switch
                checked={comp.required}
                onCheckedChange={(checked) => updateComponent(comp.id, { required: checked })}
              />
            </div>
          </div>
        )
      }

      case "textarea": {
        const comp = component as TextareaComponent
        return (
          <div className="space-y-4">
            <div>
              <Label>Label</Label>
              <Input
                value={comp.label}
                onChange={(e) => updateComponent(comp.id, { label: e.target.value })}
                placeholder="Field label"
              />
            </div>
            <div>
              <Label>Placeholder</Label>
              <Input
                value={comp.placeholder || ""}
                onChange={(e) => updateComponent(comp.id, { placeholder: e.target.value })}
                placeholder="Placeholder text"
              />
            </div>
            <div>
              <Label>Rows</Label>
              <Input
                type="number"
                value={comp.rows || 4}
                onChange={(e) => updateComponent(comp.id, { rows: Number.parseInt(e.target.value) })}
                min={1}
                max={20}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Required</Label>
              <Switch
                checked={comp.required}
                onCheckedChange={(checked) => updateComponent(comp.id, { required: checked })}
              />
            </div>
          </div>
        )
      }

      case "select": {
        const comp = component as SelectComponent
        return (
          <div className="space-y-4">
            <div>
              <Label>Label</Label>
              <Input
                value={comp.label}
                onChange={(e) => updateComponent(comp.id, { label: e.target.value })}
                placeholder="Field label"
              />
            </div>
            <div>
              <Label>Placeholder</Label>
              <Input
                value={comp.placeholder || ""}
                onChange={(e) => updateComponent(comp.id, { placeholder: e.target.value })}
                placeholder="Placeholder text"
              />
            </div>
            <div>
              <Label>Options</Label>
              <div className="space-y-2">
                {comp.options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...comp.options]
                        newOptions[index] = e.target.value
                        updateComponent(comp.id, { options: newOptions })
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newOptions = comp.options.filter((_, i) => i !== index)
                        updateComponent(comp.id, { options: newOptions })
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updateComponent(comp.id, { options: [...comp.options, `Option ${comp.options.length + 1}`] })
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Required</Label>
              <Switch
                checked={comp.required}
                onCheckedChange={(checked) => updateComponent(comp.id, { required: checked })}
              />
            </div>
          </div>
        )
      }

      case "checkbox": {
        const comp = component as CheckboxComponent
        return (
          <div className="space-y-4">
            <div>
              <Label>Label</Label>
              <Input
                value={comp.label}
                onChange={(e) => updateComponent(comp.id, { label: e.target.value })}
                placeholder="Checkbox label"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Default Checked</Label>
              <Switch
                checked={comp.defaultValue}
                onCheckedChange={(checked) => updateComponent(comp.id, { defaultValue: checked })}
              />
            </div>
          </div>
        )
      }

      case "header": {
        const comp = component as HeaderComponent
        return (
          <div className="space-y-4">
            <div>
              <Label>Company Name</Label>
              <Input
                value={comp.company}
                onChange={(e) => updateComponent(comp.id, { company: e.target.value })}
                placeholder="Company name"
              />
            </div>
            <div>
              <Label>Address</Label>
              <Textarea
                value={comp.address || ""}
                onChange={(e) => updateComponent(comp.id, { address: e.target.value })}
                placeholder="Business address"
                rows={2}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={comp.phone || ""}
                onChange={(e) => updateComponent(comp.id, { phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={comp.email || ""}
                onChange={(e) => updateComponent(comp.id, { email: e.target.value })}
                placeholder="contact@company.com"
              />
            </div>
          </div>
        )
      }

      case "client": {
        const comp = component as ClientComponent
        return (
          <div className="space-y-4">
            <div>
              <Label>Client Name</Label>
              <Input
                value={comp.name}
                onChange={(e) => updateComponent(comp.id, { name: e.target.value })}
                placeholder="Client name"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={comp.email || ""}
                onChange={(e) => updateComponent(comp.id, { email: e.target.value })}
                placeholder="client@example.com"
              />
            </div>
            <div>
              <Label>Address</Label>
              <Textarea
                value={comp.address || ""}
                onChange={(e) => updateComponent(comp.id, { address: e.target.value })}
                placeholder="Client address"
                rows={2}
              />
            </div>
          </div>
        )
      }

      case "items": {
        const comp = component as ItemsComponent
        return (
          <div className="space-y-4">
            <Label>Line Items</Label>
            <div className="space-y-3">
              {comp.items.map((item, index) => (
                <Card key={item.id} className="p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Item {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newItems = comp.items.filter((_, i) => i !== index)
                        updateComponent(comp.id, { items: newItems })
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    value={item.name}
                    onChange={(e) => {
                      const newItems = [...comp.items]
                      newItems[index] = { ...item, name: e.target.value }
                      updateComponent(comp.id, { items: newItems })
                    }}
                    placeholder="Item name"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const newItems = [...comp.items]
                        newItems[index] = { ...item, quantity: Number.parseFloat(e.target.value) || 0 }
                        updateComponent(comp.id, { items: newItems })
                      }}
                      placeholder="Qty"
                    />
                    <Input
                      type="number"
                      value={item.price}
                      onChange={(e) => {
                        const newItems = [...comp.items]
                        newItems[index] = { ...item, price: Number.parseFloat(e.target.value) || 0 }
                        updateComponent(comp.id, { items: newItems })
                      }}
                      placeholder="Price"
                    />
                  </div>
                </Card>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  updateComponent(comp.id, {
                    items: [
                      ...comp.items,
                      {
                        id: crypto.randomUUID(),
                        name: "New Item",
                        quantity: 1,
                        price: 0,
                      },
                    ],
                  })
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        )
      }

      case "tax": {
        const comp = component as TaxComponent
        return (
          <div className="space-y-4">
            <div>
              <Label>Tax Rate (%)</Label>
              <Input
                type="number"
                value={comp.rate}
                onChange={(e) => updateComponent(comp.id, { rate: Number.parseFloat(e.target.value) || 0 })}
                placeholder="10"
                min={0}
                max={100}
                step={0.01}
              />
            </div>
          </div>
        )
      }

      case "discount": {
        const comp = component as DiscountComponent
        return (
          <div className="space-y-4">
            <div>
              <Label>Discount Amount</Label>
              <Input
                type="number"
                value={comp.amount}
                onChange={(e) => updateComponent(comp.id, { amount: Number.parseFloat(e.target.value) || 0 })}
                placeholder="0"
                min={0}
                step={0.01}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Is Percentage</Label>
              <Switch
                checked={comp.isPercentage}
                onCheckedChange={(checked) => updateComponent(comp.id, { isPercentage: checked })}
              />
            </div>
          </div>
        )
      }

      case "notes": {
        const comp = component as NotesComponent
        return (
          <div className="space-y-4">
            <div>
              <Label>Notes Content</Label>
              <Textarea
                value={comp.content}
                onChange={(e) => updateComponent(comp.id, { content: e.target.value })}
                placeholder="Additional notes or terms"
                rows={4}
              />
            </div>
          </div>
        )
      }

      case "footer": {
        const comp = component as FooterComponent
        return (
          <div className="space-y-4">
            <div>
              <Label>Footer Content</Label>
              <Textarea
                value={comp.content}
                onChange={(e) => updateComponent(comp.id, { content: e.target.value })}
                placeholder="Footer text"
                rows={3}
              />
            </div>
          </div>
        )
      }

      default:
        return <p className="text-sm text-muted-foreground">No properties available</p>
    }
  }

  return (
    <div className="w-80 border-l bg-background p-4 overflow-auto">
      <div className="mb-4">
        <h2 className="font-semibold">Properties</h2>
        <p className="text-xs text-muted-foreground mt-1">Edit component settings</p>
      </div>

      {renderProperties()}
    </div>
  )
}
