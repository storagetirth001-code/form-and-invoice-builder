import type { DocumentSchema } from "@/lib/types/schema"

export const INVOICE_TEMPLATES: DocumentSchema[] = [
  {
    id: "minimal-invoice",
    type: "invoice",
    theme: "minimal",
    title: "Invoice",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    components: [
      {
        id: crypto.randomUUID(),
        type: "header",
        company: "Your Company",
        address: "123 Business Street, City, State 12345",
        phone: "+1 (555) 123-4567",
        email: "billing@company.com",
      },
      {
        id: crypto.randomUUID(),
        type: "client",
        name: "Client Name",
        email: "client@email.com",
        address: "456 Client Avenue, City, State 12345",
      },
      {
        id: crypto.randomUUID(),
        type: "items",
        items: [
          {
            id: crypto.randomUUID(),
            name: "Service Description",
            quantity: 1,
            price: 1000,
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        type: "footer",
        content: "Thank you for your business!",
      },
    ],
  },
  {
    id: "professional-invoice",
    type: "invoice",
    theme: "professional",
    title: "Professional Invoice",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    components: [
      {
        id: crypto.randomUUID(),
        type: "header",
        company: "Professional Services Inc.",
        address: "789 Corporate Blvd, Suite 100, City, State 12345",
        phone: "+1 (555) 987-6543",
        email: "invoices@professional.com",
      },
      {
        id: crypto.randomUUID(),
        type: "client",
        name: "Client Corporation",
        email: "accounts@client.com",
        address: "321 Client Plaza, City, State 12345",
      },
      {
        id: crypto.randomUUID(),
        type: "items",
        items: [
          {
            id: crypto.randomUUID(),
            name: "Consulting Services",
            quantity: 40,
            price: 150,
          },
          {
            id: crypto.randomUUID(),
            name: "Project Management",
            quantity: 20,
            price: 125,
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        type: "tax",
        rate: 10,
      },
      {
        id: crypto.randomUUID(),
        type: "notes",
        content: "Payment is due within 30 days. Please include invoice number with payment.",
      },
      {
        id: crypto.randomUUID(),
        type: "footer",
        content: "Thank you for choosing Professional Services Inc.",
      },
    ],
  },
  {
    id: "modern-invoice",
    type: "invoice",
    theme: "modern",
    title: "Modern Invoice",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    components: [
      {
        id: crypto.randomUUID(),
        type: "header",
        company: "Modern Studio",
        address: "456 Creative Lane, City, State 12345",
        phone: "+1 (555) 246-8135",
        email: "hello@modernstudio.com",
      },
      {
        id: crypto.randomUUID(),
        type: "client",
        name: "Startup Inc.",
        email: "finance@startup.com",
        address: "789 Innovation Drive, City, State 12345",
      },
      {
        id: crypto.randomUUID(),
        type: "items",
        items: [
          {
            id: crypto.randomUUID(),
            name: "Website Design",
            quantity: 1,
            price: 3500,
          },
          {
            id: crypto.randomUUID(),
            name: "Brand Identity",
            quantity: 1,
            price: 2500,
          },
          {
            id: crypto.randomUUID(),
            name: "Content Creation",
            quantity: 5,
            price: 300,
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        type: "discount",
        amount: 10,
        isPercentage: true,
      },
      {
        id: crypto.randomUUID(),
        type: "tax",
        rate: 8.5,
      },
      {
        id: crypto.randomUUID(),
        type: "notes",
        content: "50% deposit required to begin work. Final payment due upon project completion.",
      },
      {
        id: crypto.randomUUID(),
        type: "footer",
        content: "We appreciate your business! Let's create something amazing together.",
      },
    ],
  },
]
