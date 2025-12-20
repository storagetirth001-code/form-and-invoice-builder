"use client"

import type { Component, DocumentSchema, ItemsComponent, TaxComponent, DiscountComponent } from "@/lib/types/schema"
import { Card } from "@/components/ui/card"

interface InvoiceRendererProps {
  schema: DocumentSchema
}

function calculateInvoiceTotals(components: Component[]) {
  const itemsComponent = components.find((c) => c.type === "items") as ItemsComponent | undefined
  const taxComponent = components.find((c) => c.type === "tax") as TaxComponent | undefined
  const discountComponent = components.find((c) => c.type === "discount") as DiscountComponent | undefined

  let subtotal = 0
  if (itemsComponent) {
    subtotal = itemsComponent.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  }

  let discount = 0
  if (discountComponent) {
    discount = discountComponent.isPercentage ? (subtotal * discountComponent.amount) / 100 : discountComponent.amount
  }

  const afterDiscount = subtotal - discount

  let tax = 0
  if (taxComponent) {
    tax = (afterDiscount * taxComponent.rate) / 100
  }

  const total = afterDiscount + tax

  return { subtotal, discount, tax, total }
}

function RenderInvoiceComponent({
  component,
  totals,
}: { component: Component; totals: ReturnType<typeof calculateInvoiceTotals> }) {
  switch (component.type) {
    case "header": {
      const comp = component as any
      return (
        <div className="border-b pb-6">
          <h1 className="text-3xl font-bold mb-4">{comp.company}</h1>
          {comp.address && <p className="text-sm text-muted-foreground">{comp.address}</p>}
          {comp.phone && <p className="text-sm text-muted-foreground">{comp.phone}</p>}
          {comp.email && <p className="text-sm text-muted-foreground">{comp.email}</p>}
        </div>
      )
    }

    case "client": {
      const comp = component as any
      return (
        <div className="py-6 border-b">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">BILL TO</h3>
          <p className="font-semibold">{comp.name}</p>
          {comp.email && <p className="text-sm text-muted-foreground">{comp.email}</p>}
          {comp.address && <p className="text-sm text-muted-foreground">{comp.address}</p>}
        </div>
      )
    }

    case "items": {
      const comp = component as ItemsComponent
      return (
        <div className="py-6 border-b">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-sm font-semibold">DESCRIPTION</th>
                <th className="text-right py-2 text-sm font-semibold">QTY</th>
                <th className="text-right py-2 text-sm font-semibold">PRICE</th>
                <th className="text-right py-2 text-sm font-semibold">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {comp.items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-3">{item.name}</td>
                  <td className="text-right py-3">{item.quantity}</td>
                  <td className="text-right py-3">${item.price.toFixed(2)}</td>
                  <td className="text-right py-3">${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 space-y-2 ml-auto max-w-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${totals.subtotal.toFixed(2)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span>-${totals.discount.toFixed(2)}</span>
              </div>
            )}
            {totals.tax > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${totals.tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 font-bold text-lg">
              <span>Total</span>
              <span>${totals.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )
    }

    case "notes": {
      const comp = component as any
      return (
        <div className="py-6 border-b">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">NOTES</h3>
          <p className="text-sm whitespace-pre-wrap">{comp.content}</p>
        </div>
      )
    }

    case "footer": {
      const comp = component as any
      return (
        <div className="py-6">
          <p className="text-sm text-center text-muted-foreground">{comp.content}</p>
        </div>
      )
    }

    default:
      return null
  }
}

export function InvoiceRenderer({ schema }: InvoiceRendererProps) {
  const totals = calculateInvoiceTotals(schema.components)

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <Card className="p-8 space-y-0 print:shadow-none">
        {schema.components.map((component) => (
          <RenderInvoiceComponent key={component.id} component={component} totals={totals} />
        ))}
      </Card>
    </div>
  )
}
