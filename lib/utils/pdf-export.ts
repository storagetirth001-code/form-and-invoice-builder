"use client"

export async function exportToPDF(elementId: string, filename: string) {
  // Dynamic import to avoid SSR issues
  const html2canvas = (await import("html2canvas")).default
  const jsPDF = (await import("jspdf")).default

  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error("Element not found")
  }

  const clonedElement = element.cloneNode(true) as HTMLElement
  clonedElement.style.position = "absolute"
  clonedElement.style.left = "-9999px"
  clonedElement.style.top = "0"
  document.body.appendChild(clonedElement)

  // Convert all oklch colors to rgb
  const allElements = clonedElement.querySelectorAll("*")
  allElements.forEach((el) => {
    const htmlEl = el as HTMLElement
    const computedStyle = window.getComputedStyle(htmlEl)

    // Convert background color
    const bgColor = computedStyle.backgroundColor
    if (bgColor) {
      htmlEl.style.backgroundColor = bgColor
    }

    // Convert text color
    const textColor = computedStyle.color
    if (textColor) {
      htmlEl.style.color = textColor
    }

    // Convert border color
    const borderColor = computedStyle.borderColor
    if (borderColor) {
      htmlEl.style.borderColor = borderColor
    }
  })

  try {
    // Create canvas from the cloned element
    const canvas = await html2canvas(clonedElement, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    })

    // Calculate PDF dimensions (A4 size)
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4")
    let position = 0

    // Add image to PDF
    const imgData = canvas.toDataURL("image/png")
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Add additional pages if content is longer than one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Download the PDF
    pdf.save(filename)
  } finally {
    // Clean up cloned element
    document.body.removeChild(clonedElement)
  }
}
