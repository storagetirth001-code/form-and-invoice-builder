"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createBrowserClient } from "@supabase/ssr"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Download, RefreshCw, ArrowUpDown } from "lucide-react"
import type { DocumentSchema } from "@/lib/types/schema"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"

interface Submission {
  id: string
  form_id: string
  data: Record<string, any>
  submitted_at: string
}

interface FormRecord {
  id: string
  title: string
  schema: DocumentSchema
}

// Create a component to handle the dynamic submissions view
function SubmissionsView({
  submissions,
  fields,
  fieldLabels,
}: {
  submissions: Submission[]
  fields: string[]
  fieldLabels: Record<string, string>
}) {
  const columns: ColumnDef<Submission>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "submitted_at",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Submitted At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <span className="font-mono text-xs">{new Date(row.original.submitted_at).toLocaleString()}</span>
      },
    },
    ...fields.map((field) => ({
      accessorKey: `data.${field}`,
      header: ({ column }: { column: any }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            {fieldLabels[field] || field}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }: { row: any }) => {
        const value = row.original.data[field]
        return value !== undefined && value !== null ? String(value) : "-"
      },
    })),
  ]

  const fullColumnLabels = {
    submitted_at: "Submitted At",
    ...Object.fromEntries(fields.map((field) => [`data.${field}`, fieldLabels[field] || field])),
  }

  return (
    <DataTable
      columns={columns}
      data={submissions}
      filterColumn="submitted_at"
      filterPlaceholder="Filter dates..."
      columnLabels={fullColumnLabels}
    />
  )
}

export default function SubmissionsPage() {
  const params = useParams()
  const formId = params.id as string
  const [form, setForm] = useState<FormRecord | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    loadData()
  }, [formId])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Load form details
      const { data: formData, error: formError } = await supabase.from("forms").select("*").eq("id", formId).single()

      if (formError) throw formError
      setForm(formData)

      // Load submissions
      const { data: submissionsData, error: submissionsError } = await supabase
        .from("form_submissions")
        .select("*")
        .eq("form_id", formId)
        .order("submitted_at", { ascending: false })

      if (submissionsError) throw submissionsError
      console.log(submissionsData)
      setSubmissions(submissionsData || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load submissions",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Generate label map
  const fieldLabels: Record<string, string> = {}
  if (form) {
    form.schema.components.forEach((comp: any) => {
      fieldLabels[comp.id] = comp.label || comp.type
    })
  }

  const handleExportCSV = () => {
    if (!form || submissions.length === 0) return

    // Get all unique field names
    const fieldNames = new Set<string>()
    submissions.forEach((sub) => {
      Object.keys(sub.data).forEach((key) => fieldNames.add(key))
    })

    const fields = Array.from(fieldNames)
    const headers = ["Submission ID", "Submitted At", ...fields.map((f) => fieldLabels[f] || f)]

    // Build CSV content
    const csvRows = [headers.join(",")]

    submissions.forEach((sub) => {
      const escapedDate = `"${new Date(sub.submitted_at).toLocaleString().replace(/"/g, '""')}"`
      const row = [
        sub.id,
        escapedDate,
        ...fields.map((field) => {
          const value = sub.data[field]
          if (value === undefined || value === null) return ""
          // Escape commas and quotes
          const stringValue = String(value)
          if (stringValue.includes(",") || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        }),
      ]
      csvRows.push(row.join(","))
    })

    const csvContent = csvRows.join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${form.title.replace(/[^a-z0-9]/gi, "_")}_submissions_${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export complete",
      description: "CSV file downloaded successfully",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading submissions...</p>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Form not found</p>
      </div>
    )
  }

  // Get all unique field names from submissions
  const fieldNames = new Set<string>()
  submissions.forEach((sub) => {
    Object.keys(sub.data).forEach((key) => fieldNames.add(key))
  })
  const fields = Array.from(fieldNames)

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
            <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Form Submissions</h1>
            <p className="text-muted-foreground">{form.title}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            {submissions.length > 0 && (
              <Button onClick={handleExportCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            )}
          </div>
        </div>

        {submissions.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-2">No submissions yet</h3>
              <p className="text-muted-foreground">Submissions will appear here once people fill out your form</p>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Total submissions: <span className="font-semibold text-foreground">{submissions.length}</span>
              </p>
            </div>

            <SubmissionsView submissions={submissions} fields={fields} fieldLabels={fieldLabels} />
          </Card>
        )}
      </div>
    </div>
  )
}

