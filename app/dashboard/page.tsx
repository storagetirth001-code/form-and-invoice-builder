"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createBrowserClient } from "@supabase/ssr"
import { FileText, Receipt, Plus, LogOut, Eye, Trash2, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { DocumentSchema } from "@/lib/types/schema"

interface FormRecord {
  id: string
  title: string
  schema: DocumentSchema
  is_published: boolean
  created_at: string
  user_id: string
}

export default function DashboardPage() {
  const [forms, setForms] = useState<FormRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    loadUser()
    loadForms()
  }, [])

  const loadUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUser(user)
  }

  const loadForms = async () => {
    try {
      const { data, error } = await supabase.from("forms").select("*").order("created_at", { ascending: false })

      if (error) throw error

      setForms(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load forms",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this form?")) return

    try {
      const { error } = await supabase.from("forms").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Form deleted",
        description: "Your form has been successfully deleted.",
      })

      loadForms()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete form",
        variant: "destructive",
      })
    }
  }

  const handleCopyLink = (id: string) => {
    const link = `${window.location.origin}/form/${id}`
    navigator.clipboard.writeText(link)
    toast({
      title: "Link copied!",
      description: "Form link copied to clipboard",
    })
  }

  const handleCreateNew = () => {
    router.push("/dashboard/new")
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
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Forms & Invoices</h1>
            <p className="text-muted-foreground">Create, manage, and share your documents</p>
          </div>
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Create New
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your forms...</p>
          </div>
        ) : forms.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No forms yet</h3>
              <p className="text-muted-foreground mb-6">Create your first form or invoice to get started</p>
              <Button onClick={handleCreateNew}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Form
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <Card key={form.id} className="p-6 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    {form.schema.type === "form" ? (
                      <FileText className="w-6 h-6 text-primary" />
                    ) : (
                      <Receipt className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/dashboard/submissions/${form.id}`)}
                      title="View submissions"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(form.id)} title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-2">{form.title || "Untitled"}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {form.schema.components.length} components · {form.schema.type}
                </p>

                <div className="mt-auto flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => router.push(`/builder/${form.id}`)}
                  >
                    Edit
                  </Button>
                  {form.schema.type === "form" && form.is_published && (
                    <Button variant="outline" size="sm" onClick={() => handleCopyLink(form.id)} title="Copy link">
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {form.is_published && (
                  <div className="mt-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Published</span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
