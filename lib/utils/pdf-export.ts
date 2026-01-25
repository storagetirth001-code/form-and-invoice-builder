"use client"

/* ============================================================
   Convert any CSS color (including lab/oklch) → rgb
   ============================================================ */
function convertColorToRgb(color: string): string {
  try {
    const canvas = document.createElement("canvas")
    canvas.width = 1
    canvas.height = 1
    const ctx = canvas.getContext("2d")
    if (!ctx) return color

    ctx.fillStyle = color
    ctx.fillRect(0, 0, 1, 1)
    const d = ctx.getImageData(0, 0, 1, 1).data
    return `rgb(${d[0]}, ${d[1]}, ${d[2]})`
  } catch {
    return "rgb(0,0,0)"
  }
}

/* ============================================================
   Inline ALL computed styles (critical for Tailwind v4)
   ============================================================ */
function inlineAllStyles(root: HTMLElement) {
  const elements = root.querySelectorAll<HTMLElement>("*")

  elements.forEach((el) => {
    const computed = window.getComputedStyle(el)
    let cssText = ""

    for (let i = 0; i < computed.length; i++) {
      const prop = computed[i]
      let value = computed.getPropertyValue(prop)

      // Replace unsupported color functions
      if (value.includes("lab(") || value.includes("oklch(")) {
        value = convertColorToRgb(value)
      }

      cssText += `${prop}:${value};`
    }

    el.setAttribute("style", cssText)
  })
}

/* ============================================================
   Create isolated iframe with fully inlined styles
   ============================================================ */
function createStyledIframe(element: HTMLElement) {
  const iframe = document.createElement("iframe")
  iframe.style.position = "fixed"
  iframe.style.left = "-99999px"
  iframe.style.top = "0"
  iframe.width = "1200"
  iframe.height = "2000"

  document.body.appendChild(iframe)

  const doc = iframe.contentDocument!
  doc.open()
  doc.write("<!DOCTYPE html><html><head></head><body></body></html>")
  doc.close()

  const clone = element.cloneNode(true) as HTMLElement

  /* A4 geometry — CSS controls size */
  clone.style.width = "210mm"
  clone.style.minHeight = "297mm"
  clone.style.margin = "0"
  clone.style.padding = "16mm"
  clone.style.boxSizing = "border-box"

  inlineAllStyles(clone)

  doc.body.style.margin = "0"
  doc.body.appendChild(clone)

  return iframe
}

/* ============================================================
   MAIN EXPORT FUNCTION (NO ZOOM, PRINT-ACCURATE)
   ============================================================ */
export async function exportToPDF(elementId: string, filename: string) {
  const html2canvas = (await import("html2canvas")).default
  const jsPDF = (await import("jspdf")).default

  const element = document.getElementById(elementId)
  if (!element) throw new Error("Element not found")

  const iframe = createStyledIframe(element)

  try {
    const canvas = await html2canvas(iframe.contentDocument!.body, {
      scale: 1, // 🔥 CRITICAL: prevents zoom
      backgroundColor: "#ffffff",
      useCORS: true,
      foreignObjectRendering: false,
    })

    const pdf = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      compress: true,
    })

    // CSS px → mm (96 DPI)
    const pxToMm = (px: number) => px * 0.264583

    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      0,
      0,
      pxToMm(canvas.width),
      pxToMm(canvas.height),
      undefined,
      "FAST"
    )

    pdf.save(filename)
  } catch (err) {
    console.error("PDF export failed:", err)
    throw err
  } finally {
    iframe.remove()
  }
}
