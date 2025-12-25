"use client"

export async function exportToPDF(elementId: string, filename: string) {
  const html2canvas = (await import("html2canvas")).default
  const jsPDF = (await import("jspdf")).default

  const element = document.getElementById(elementId)
  if (!element) throw new Error("Element not found")

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",

      // Stability flags
      foreignObjectRendering: false,
      windowWidth: 1200,

      onclone: (clonedDoc) => {
        const root = clonedDoc.getElementById(elementId) as HTMLElement
        if (!root) return

        /* ===============================
         * FORCE A4 LAYOUT
         * =============================== */
        root.style.position = "absolute"
        root.style.top = "0"
        root.style.left = "0"
        root.style.margin = "0"
        root.style.width = "210mm"
        root.style.maxWidth = "210mm"
        root.style.minHeight = "297mm"
        root.style.boxShadow = "none"
        root.style.borderRadius = "0"
        root.style.border = "none"

        if (root.parentElement) {
          root.parentElement.style.margin = "0"
          root.parentElement.style.padding = "0"
        }

        /* ===============================
         * SVG → IMG (LAB-SAFE)
         * =============================== */
        const svgs = Array.from(clonedDoc.getElementsByTagName("svg"))

        svgs.forEach(svg => {
          try {
            const width = svg.clientWidth || 16
            const height = svg.clientHeight || 16

            const serializer = new XMLSerializer()
            let svgText = serializer.serializeToString(svg)

            // 🔥 REMOVE MODERN COLOR FUNCTIONS FROM SVG SOURCE
            svgText = svgText.replace(
              /(lab|oklch|lch)\([^)]+\)/gi,
              "rgb(0,0,0)"
            )

            const encoded = encodeURIComponent(svgText)
              .replace(/'/g, "%27")
              .replace(/"/g, "%22")

            const img = clonedDoc.createElement("img")
            img.src = `data:image/svg+xml;charset=utf-8,${encoded}`
            img.width = width
            img.height = height
            img.style.display = "inline-block"

            if (svg.getAttribute("style")) {
              img.setAttribute("style", svg.getAttribute("style")!)
            }

            svg.replaceWith(img)
          } catch {
            svg.remove()
          }
        })

        /* ===============================
         * COLOR SANITIZATION (CSS)
         * =============================== */
        const colorToRgba = (color: string) => {
          if (!color || color === "transparent") return "rgba(0,0,0,0)"
          const c = document.createElement("canvas")
          c.width = 1
          c.height = 1
          const ctx = c.getContext("2d")
          if (!ctx) return color
          ctx.fillStyle = color
          ctx.fillRect(0, 0, 1, 1)
          const d = ctx.getImageData(0, 0, 1, 1).data
          return `rgba(${d[0]}, ${d[1]}, ${d[2]}, ${d[3] / 255})`
        }

        const nodes = Array.from(clonedDoc.getElementsByTagName("*"))
        nodes.push(clonedDoc.documentElement, clonedDoc.body)

        const colorProps = [
          "color",
          "background-color",
          "border-color",
          "outline-color",
          "text-decoration-color",
          "box-shadow",
        ]

        nodes.forEach(node => {
          const el = node as HTMLElement
          if (!el.style) return
          const styles = window.getComputedStyle(el)

          colorProps.forEach(prop => {
            const value = styles.getPropertyValue(prop)
            if (value && (value.includes("lab(") || value.includes("oklch("))) {
              el.style.setProperty(prop, colorToRgba(value), "important")
            }
          })
        })

        /* ===============================
         * SANITIZE <style> TAGS
         * =============================== */
        Array.from(clonedDoc.getElementsByTagName("style")).forEach(style => {
          if (style.textContent) {
            style.textContent = style.textContent.replace(
              /(lab|oklch|lch)\([^)]+\)/gi,
              "rgb(0,0,0)"
            )
          }
        })

        /* ===============================
         * REMOVE EXTERNAL STYLESHEETS
         * =============================== */
        Array.from(clonedDoc.getElementsByTagName("link")).forEach(link => {
          if (
            link.rel === "stylesheet" &&
            (link.href.includes("tailwind") || link.href.includes("globals"))
          ) {
            link.remove()
          }
        })
      },
    })

    /* ===============================
     * CREATE PDF (LINKS PRESERVED)
     * =============================== */
    const pdf = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      compress: true,
    })

    const imgData = canvas.toDataURL("image/png")
    const pageWidth = 210
    const pageHeight = 297
    const imgHeight = (canvas.height * pageWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft > 0) {
      pdf.addPage()
      position = heightLeft - imgHeight
      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(filename)
  } catch (err) {
    console.error("PDF export failed:", err)
    throw err
  }
}
