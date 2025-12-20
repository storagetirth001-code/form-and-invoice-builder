import type { Component, ComponentType } from "@/lib/types/schema"

export function createComponent(type: ComponentType): Component {
  const id = crypto.randomUUID()

  switch (type) {
    case "text":
      return {
        id,
        type: "text",
        label: "Text Field",
        placeholder: "Enter text",
        required: false,
      }

    case "email":
      return {
        id,
        type: "email",
        label: "Email",
        placeholder: "email@example.com",
        required: false,
      }

    case "number":
      return {
        id,
        type: "number",
        label: "Number",
        placeholder: "0",
        required: false,
      }

    case "textarea":
      return {
        id,
        type: "textarea",
        label: "Text Area",
        placeholder: "Enter text",
        required: false,
        rows: 4,
      }

    case "select":
      return {
        id,
        type: "select",
        label: "Select Option",
        placeholder: "Choose an option",
        required: false,
        options: ["Option 1", "Option 2", "Option 3"],
      }

    case "checkbox":
      return {
        id,
        type: "checkbox",
        label: "Checkbox",
        defaultValue: false,
      }

    case "date":
      return {
        id,
        type: "date",
        label: "Date",
        placeholder: "Select date",
        required: false,
      }

    case "header":
      return {
        id,
        type: "header",
        company: "Your Company Name",
        address: "123 Business St, City, State 12345",
        phone: "+1 (555) 123-4567",
        email: "contact@company.com",
      }

    case "client":
      return {
        id,
        type: "client",
        name: "Client Name",
        email: "client@example.com",
        address: "456 Client Ave, City, State 12345",
      }

    case "items":
      return {
        id,
        type: "items",
        items: [
          {
            id: crypto.randomUUID(),
            name: "Service/Product",
            quantity: 1,
            price: 0,
          },
        ],
      }

    case "tax":
      return {
        id,
        type: "tax",
        rate: 10,
      }

    case "discount":
      return {
        id,
        type: "discount",
        amount: 0,
        isPercentage: true,
      }

    case "notes":
      return {
        id,
        type: "notes",
        content: "Additional notes or terms and conditions",
      }

    case "footer":
      return {
        id,
        type: "footer",
        content: "Thank you for your business!",
      }

    default:
      throw new Error(`Unknown component type: ${type}`)
  }
}
