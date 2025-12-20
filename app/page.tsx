import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Receipt, Zap, Database, Share2, ArrowRight } from "lucide-react"

export default function LandingPage() {
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
                <Button size="sm">Get started</Button>
              </Link>
            </nav>
            <div className="md:hidden">
              <Link href="/auth/signup">
                <Button size="sm">Get started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Build forms and invoices in minutes, not hours
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-balance">
              The complete platform to create beautiful forms and professional invoices. Share links, collect responses,
              and export PDFs instantly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get started—it's free
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Explore features
                </Button>
              </Link>
            </div>
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
