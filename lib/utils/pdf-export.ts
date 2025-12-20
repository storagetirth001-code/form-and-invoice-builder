"use client"

export async function exportToPDF(elementId: string, filename: string) {
  const html2canvas = (await import("html2canvas")).default
  const jsPDF = (await import("jspdf")).default

  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error("Element not found")
  }

  // Create a deep clone
  const clonedElement = element.cloneNode(true) as HTMLElement
  clonedElement.style.position = "absolute"
  clonedElement.style.left = "-9999px"
  clonedElement.style.top = "0"
  clonedElement.style.width = element.offsetWidth + "px"
  document.body.appendChild(clonedElement)

  try {
    // Get all elements including the clone itself
    const allElements = [clonedElement, ...Array.from(clonedElement.querySelectorAll("*"))]

    allElements.forEach((el) => {
      const htmlEl = el as HTMLElement
      const computedStyle = window.getComputedStyle(htmlEl)

      // Create a style object to hold converted colors
      const styleOverrides: any = {}

      // Handle all color properties
      const colorProperties = [
        "backgroundColor",
        "color",
        "borderTopColor",
        "borderRightColor",
        "borderBottomColor",
        "borderLeftColor",
        "borderColor",
        "outlineColor",
      ]

      colorProperties.forEach((prop) => {
        try {
          const value = computedStyle.getPropertyValue(prop.replace(/([A-Z])/g, "-$1").toLowerCase())
          if (value && value !== "rgba(0, 0, 0, 0)" && value !== "transparent") {
            // Force the browser to give us an RGB value by setting and reading
            const tempDiv = document.createElement("div")
            tempDiv.style.color = value
            document.body.appendChild(tempDiv)
            const rgbValue = window.getComputedStyle(tempDiv).color
            document.body.removeChild(tempDiv)
            styleOverrides[prop] = rgbValue
          }
        } catch (err) {
          // Silently skip problematic properties
        }
      })

      // Apply all color overrides
      Object.keys(styleOverrides).forEach((prop) => {
        ;(htmlEl.style as any)[prop] = styleOverrides[prop]
      })

      // Force font rendering
      if (computedStyle.fontFamily) {
        htmlEl.style.fontFamily = computedStyle.fontFamily
      }
      if (computedStyle.fontSize) {
        htmlEl.style.fontSize = computedStyle.fontSize
      }
      if (computedStyle.fontWeight) {
        htmlEl.style.fontWeight = computedStyle.fontWeight
      }
    })

    // Give the browser time to apply styles
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Create canvas with better quality settings
    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: clonedElement.scrollWidth,
      windowHeight: clonedElement.scrollHeight,
    })

    // Calculate PDF dimensions (A4 size)
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4")
    let position = 0

    // Convert canvas to image
    const imgData = canvas.toDataURL("image/png")

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Download the PDF
    pdf.save(filename)
  } finally {
    // Always clean up
    if (clonedElement.parentNode) {
      document.body.removeChild(clonedElement)
    }
  }
}
