import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { formId, data } = await request.json()

    const supabase = await createClient()

    // Get form details including Google Sheet URL
    const { data: formData, error: formError } = await supabase
      .from("forms")
      .select("google_sheet_url")
      .eq("id", formId)
      .single()

    if (formError) {
      console.error("[v0] Error fetching form:", formError)
    }

    // Save submission to database
    const { error: dbError } = await supabase.from("form_submissions").insert({
      form_id: formId,
      data: data,
    })

    if (dbError) {
      console.error("[v0] Database error:", dbError)
      throw dbError
    }

    // If Google Sheet URL is provided, log it for future integration
    if (formData?.google_sheet_url) {
      // Note: Google Sheets integration requires:
      // 1. Google Apps Script webhook setup
      // 2. Or use Zapier/Make.com with form submissions webhook
      // Data is safely stored in database for now
    }

    return NextResponse.json({ success: true, message: "Form submitted successfully" })
  } catch (error) {
    console.error("[v0] Form submission error:", error)
    return NextResponse.json({ success: false, message: "Failed to submit form" }, { status: 500 })
  }
}
