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
    const stripStyles = (el: HTMLElement) => {
      el.removeAttribute("style")
      el.removeAttribute("class")

      // Remove all style attributes from children recursively
      Array.from(el.children).forEach((child) => {
        stripStyles(child as HTMLElement)
      })
    }

    stripStyles(clonedElement)

    const allElements = [clonedElement, ...Array.from(clonedElement.querySelectorAll("*"))]

    allElements.forEach((el) => {
      const htmlEl = el as HTMLElement
      const computedStyle = window.getComputedStyle(htmlEl)

      // Only apply safe font properties from computed styles
      const fontSize = computedStyle.fontSize
      const fontWeight = computedStyle.fontWeight
      const lineHeight = computedStyle.lineHeight

      if (fontSize) htmlEl.style.fontSize = fontSize
      if (fontWeight) htmlEl.style.fontWeight = fontWeight
      if (lineHeight) htmlEl.style.lineHeight = lineHeight

      // Set safe default colors
      htmlEl.style.color = "#000000"
      htmlEl.style.backgroundColor = "transparent"
    })

    // Give browser time to apply styles
    await new Promise((resolve) => setTimeout(resolve, 50))

    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: clonedElement.scrollWidth || 800,
      windowHeight: clonedElement.scrollHeight || 600,
      allowTaint: true,
      removeContainer: false,
      ignoreElements: (element) => {
        // Skip problematic elements
        return element.tagName === "SCRIPT" || element.tagName === "STYLE"
      },
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
