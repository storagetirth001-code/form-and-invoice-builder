"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Receipt, UserCircle, Zap, Database, Share2, ArrowRight } from "lucide-react" // Added UserCircle
import { useDocumentStore } from "@/lib/store/document-store"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const createDocument = useDocumentStore((state) => state.createDocument)
  const router = useRouter()

  const handleCreate = (type: "form" | "invoice" | "resume") => {
    // Generate a default title based on type
    const title =
      type === "form" ? "Untitled Form" : type === "invoice" ? "Untitled Invoice" : "Untitled Resume"

    createDocument(type, title)
    // We need to wait for the store to update? synchronous.
    // However, createDocument sets the 'document' in store.
    // The previous implementation of createDocument generates an ID.
    // We need to get that ID to navigate.
    // The store's createDocument doesn't return the ID currently, but it sets state.
    // We can modify createDocument to return ID or access it from state.
    // Actually, looking at store code, it uses crypto.randomUUID().
    // Let's modify the store to return the ID, or just access the 'document.id' from state immediately after?
    // State updates might be async in React batching but Zustand sync actions are usually immediate if not inside a callback?
    // Safest is to modify createDocument to return the ID.
    // BUT since I can't easily modify the store interface in this same step without multiple file edits,
    // I will read the store state immediately.
    // Wait, Zustand `set` is synchronous.
    const schema = useDocumentStore.getState().document
    if (schema) {
      router.push(`/builder/${schema.id}`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-foreground rounded-lg" />
              <span className="text-xl font-bold">FormBuilder</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link
                href="/auth/login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Log in
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              What do you want to build?
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-balance">
              Start creating instantly. No account required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card
              className="p-8 hover:border-primary transition-all cursor-pointer group text-center space-y-4"
              onClick={() => handleCreate("form")}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">New Form</h3>
                <p className="text-muted-foreground text-sm">Collect data, feedback, or applications</p>
              </div>
            </Card>

            <Card
              className="p-8 hover:border-primary transition-all cursor-pointer group text-center space-y-4"
              onClick={() => handleCreate("invoice")}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Receipt className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">New Invoice</h3>
                <p className="text-muted-foreground text-sm">Bill clients with professional templates</p>
              </div>
            </Card>

            <Card
              className="p-8 hover:border-primary transition-all cursor-pointer group text-center space-y-4"
              onClick={() => handleCreate("resume")}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <UserCircle className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">New Resume</h3>
                <p className="text-muted-foreground text-sm">Build a standout resume in minutes</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to succeed</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features that make form and invoice creation effortless
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Drag & Drop Builder</h3>
              <p className="text-muted-foreground">
                Build forms and invoices visually with our intuitive drag-and-drop interface. No coding required.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Share2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Live Forms</h3>
              <p className="text-muted-foreground">
                Generate shareable links for your forms. Collect responses from anyone with the link.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Response Management</h3>
              <p className="text-muted-foreground">
                View all form submissions in organized tables. Export data or connect to Google Sheets.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Professional Templates</h3>
              <p className="text-muted-foreground">
                Start fast with pre-built templates for contact forms, feedback surveys, and more.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Receipt className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Invoice Generator</h3>
              <p className="text-muted-foreground">
                Create professional invoices with automatic calculations for tax, discounts, and totals.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <ArrowRight className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">PDF Export</h3>
              <p className="text-muted-foreground">
                Export invoices as high-quality PDFs ready to send to clients. One click, done.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for teams of all sizes</h2>
            <p className="text-lg text-muted-foreground">From freelancers to enterprises</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10x</div>
              <div className="text-muted-foreground">Faster than traditional methods</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-muted-foreground">No-code solution</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">∞</div>
              <div className="text-muted-foreground">Unlimited forms and responses</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-foreground text-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">Ready to build something amazing?</h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join thousands of users creating forms and invoices with FormBuilder
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary">
              Get started for free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-foreground rounded" />
              <span className="font-semibold">FormBuilder</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 FormBuilder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
