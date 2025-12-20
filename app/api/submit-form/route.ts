import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { formId, data, googleSheetId } = await request.json()

    console.log("[v0] Form submission received:", { formId, googleSheetId })

    // Store submission locally (in a real app, use a database)
    if (typeof window === "undefined") {
      // Server-side: Store in temporary memory or database
      console.log("[v0] Form data:", data)
    }

    // If Google Sheet is connected, send data to it
    if (googleSheetId) {
      try {
        // Format data for Google Sheets
        const timestamp = new Date().toISOString()
        const row = {
          Timestamp: timestamp,
          ...data,
        }

        // In a real implementation, this would use Google Sheets API
        // For MVP, we'll use a webhook service like Zapier or Make.com
        // Or directly integrate with Google Sheets API

        console.log("[v0] Sending to Google Sheets:", row)

        // Example: Using a webhook endpoint
        // await fetch(`https://hooks.zapier.com/hooks/catch/${googleSheetId}/`, {
        //   method: 'POST',
        //   body: JSON.stringify(row),
        // })

        // For now, we'll simulate success
        await new Promise((resolve) => setTimeout(resolve, 500))
      } catch (error) {
        console.error("[v0] Google Sheets integration error:", error)
        // Continue even if Google Sheets fails
      }
    }

    return NextResponse.json({ success: true, message: "Form submitted successfully" })
  } catch (error) {
    console.error("[v0] Form submission error:", error)
    return NextResponse.json({ success: false, message: "Failed to submit form" }, { status: 500 })
  }
}
