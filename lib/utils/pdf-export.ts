"use client"

export async function exportToPDF(elementId: string, filename: string) {
  const html2canvas = (await import("html2canvas")).default
  const jsPDF = (await import("jspdf")).default

  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error("Element not found")
  }

  // We use the element directly. To ensure we capture the full scrollable content
  // if it's within a scroll container, html2canvas usually handles this if we configure it right.
  // But often for "preview-content", it might be a scrollable div.
  // A safe bet for high fidelity capture of a specific element is to clone it
  // into a container that allows it to expand to full size, but this can be tricky with
  // Tailwind's reliance on media queries or parent constraints.
  //
  // Given the existing implementation tried to strip styles, the simple approach
  // is often best: just capture the element.

  try {
    // We use onclone to modify the document before capture
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 1200, // Sufficient width for the clone
      onclone: (clonedDoc) => {
        const el = clonedDoc.getElementById(elementId) as HTMLElement
        if (!el) return

        // FORCED RESET for PDF logic: 
        // We want the element to be at the top-left of the canvas with NO margins
        // and exactly 210mm wide (the standard A4 width we use in renderers)
        el.style.position = "absolute"
        el.style.top = "0"
        el.style.left = "0"
        el.style.margin = "0"
        el.style.width = "210mm"
        el.style.maxWidth = "210mm"
        el.style.minHeight = "297mm"
        el.style.boxShadow = "none"
        el.style.borderRadius = "0"
        el.style.border = "none"

        // Ensure parent containers in the clone don't shift or pad the element
        if (el.parentElement) {
          el.parentElement.style.padding = "0"
          el.parentElement.style.margin = "0"
        }

        // Helper to convert any color to rgba using canvas
        const colorToRgba = (color: string) => {
          const canvas = document.createElement("canvas")
          canvas.width = 1
          canvas.height = 1
          const ctx = canvas.getContext("2d")
          if (!ctx) return color
          ctx.fillStyle = color
          ctx.fillRect(0, 0, 1, 1)
          const data = ctx.getImageData(0, 0, 1, 1).data
          return `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`
        }

        const elements = clonedDoc.getElementsByTagName("*")
        for (let i = 0; i < elements.length; i++) {
          const item = elements[i] as HTMLElement
          const styles = window.getComputedStyle(item)

          // Color Sanitization for oklch/lab
          const colorProps = ["color", "backgroundColor", "borderColor", "fill", "stroke"]
          colorProps.forEach(prop => {
            const value = (item.style as any)[prop] || styles[prop as any]
            if (value && (value.includes("oklch") || value.includes("lab") || value.includes("var("))) {
              try {
                const computed = styles[prop as any]
                if (computed.includes("oklch") || computed.includes("lab")) {
                  item.style[prop as any] = colorToRgba(computed)
                }
              } catch (e) { }
            }
          })
        }
      },
    })

    // Prepare PDF
    const pdf = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      compress: true
    })

    const imgData = canvas.toDataURL("image/png")

    // A4 dimensions in mm
    const a4Width = 210
    const a4Height = 297

    // The canvas width represents 210mm because we forced el.style.width = "210mm"
    const imgWidth = a4Width
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // Handle multi-page
    let heightLeft = imgHeight
    let position = 0

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, 'FAST')
    heightLeft -= a4Height

    // Add extra pages if needed
    while (heightLeft > 0) {
      pdf.addPage()
      position = heightLeft - imgHeight
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, 'FAST')
      heightLeft -= a4Height
    }

    pdf.save(filename)
  } catch (error) {
    console.error("PDF Export failed:", error)
    throw error
  }
}
