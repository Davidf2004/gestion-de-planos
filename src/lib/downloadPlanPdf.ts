import type { Plano, Version } from '../types'

const TYPE_LABEL = {
  fija: 'Fija',
  corredera: 'Corredera',
  proyectante: 'Proyectante',
  oscilobatiente: 'Oscilo-batiente',
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function wrapJpegAsPdf(jpeg: Uint8Array, imgW: number, imgH: number) {
  const pageW = 595.28
  const pageH = 841.89
  const scale = Math.min(pageW / imgW, pageH / imgH)
  const w = imgW * scale
  const h = imgH * scale
  const x = (pageW - w) / 2
  const y = (pageH - h) / 2

  const encoder = new TextEncoder()
  const header = encoder.encode('%PDF-1.4\n')
  const parts: Uint8Array[] = [header]
  let offset = header.length
  const offsets = [0]

  function addObject(body: Uint8Array) {
    offsets.push(offset)
    parts.push(body)
    offset += body.length
  }

  function ascii(s: string) {
    return encoder.encode(s)
  }

  addObject(ascii('1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n'))
  addObject(ascii('2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n'))
  addObject(
    ascii(
      `3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >> endobj\n`,
    ),
  )
  const content = `q ${w.toFixed(2)} 0 0 ${h.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} cm /Im0 Do Q\n`
  addObject(ascii(`4 0 obj << /Length ${content.length} >> stream\n${content}endstream endobj\n`))

  const imgHead = ascii(
    `5 0 obj << /Type /XObject /Subtype /Image /Width ${imgW} /Height ${imgH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >> stream\n`,
  )
  const imgTail = ascii('\nendstream endobj\n')
  offsets.push(offset)
  parts.push(imgHead, jpeg, imgTail)
  offset += imgHead.length + jpeg.length + imgTail.length

  const xrefStart = offset
  let xref = `xref\n0 6\n0000000000 65535 f \n`
  for (let i = 1; i <= 5; i++) {
    xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`
  }
  xref += `trailer << /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`
  parts.push(ascii(xref))

  const total = parts.reduce((n, p) => n + p.length, 0)
  const out = new Uint8Array(total)
  let p = 0
  for (const part of parts) {
    out.set(part, p)
    p += part.length
  }
  return new Blob([out], { type: 'application/pdf' })
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

function drawConsulta(version: Version, plano: Plano) {
  const width = 1240
  const height = 1754
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const maybeCtx = canvas.getContext('2d')
  if (!maybeCtx) throw new Error('No se pudo generar el PDF en este navegador.')
  const ctx = maybeCtx

  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = '#ffffff'
  roundRect(ctx, 48, 48, width - 96, height - 96, 28)
  ctx.fill()
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 2
  ctx.stroke()

  let y = 110
  ctx.fillStyle = '#64748b'
  ctx.font = '600 22px Outfit, Montserrat, sans-serif'
  ctx.fillText('CIMAS ERP  ·  PDF de consulta de campo', 88, y)
  y += 48
  ctx.fillStyle = '#0f172a'
  ctx.font = '700 42px Outfit, Montserrat, sans-serif'
  ctx.fillText(`${version.clave}  ·  ${version.version}`, 88, y)
  y += 36
  ctx.fillStyle = '#2563eb'
  ctx.font = '600 22px Outfit, Montserrat, sans-serif'
  ctx.fillText('VIGENTE', 88, y)
  y += 34
  ctx.fillStyle = '#475569'
  ctx.font = '400 22px Outfit, Montserrat, sans-serif'
  ctx.fillText(plano.nombre, 88, y)
  y += 30
  ctx.fillText(`${version.construction.ejes}  ·  ${version.construction.niveles.join(', ')}`, 88, y)

  y += 40
  const info = version.construction
  const pad = 88
  const gap = 18
  const maxH = Math.max(...info.esquema.map((b) => b.heightMm + b.sillMm), 1)
  const availW = width - pad * 2
  const scale = Math.min(0.12, (availW - gap * (info.esquema.length - 1)) / info.esquema.reduce((s, b) => s + b.widthMm, 1))
  const schematicH = maxH * scale + 70
  ctx.fillStyle = '#f8fafc'
  roundRect(ctx, pad - 8, y, availW + 16, schematicH + 24, 16)
  ctx.fill()
  ctx.strokeStyle = '#e2e8f0'
  ctx.stroke()

  ctx.fillStyle = '#64748b'
  ctx.font = '400 16px Outfit, Montserrat, sans-serif'
  ctx.fillText('Referencia de vanos — escala esquemática', pad + 8, y + 28)

  info.esquema.forEach((bay, i) => {
    const x =
      pad +
      info.esquema.slice(0, i).reduce((acc, b) => acc + b.widthMm * scale + gap, 0)
    const sillH = bay.sillMm * scale
    const bh = bay.heightMm * scale
    const bw = bay.widthMm * scale
    const by = y + 20 + schematicH - sillH - bh - 10
    if (bay.sillMm > 0) {
      ctx.fillStyle = '#cbd5e1'
      ctx.fillRect(x, by + bh, bw, sillH)
      ctx.strokeStyle = '#64748b'
      ctx.strokeRect(x, by + bh, bw, sillH)
    }
    ctx.fillStyle = '#e0f2fe'
    ctx.fillRect(x, by, bw, bh)
    ctx.strokeStyle = '#1d4ed8'
    ctx.lineWidth = 3
    ctx.strokeRect(x, by, bw, bh)
    ctx.beginPath()
    ctx.setLineDash([8, 6])
    ctx.moveTo(x + bw / 2, by + 12)
    ctx.lineTo(x + bw / 2, by + bh - 12)
    ctx.strokeStyle = '#3b82f6'
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = '#1e3a8a'
    ctx.font = '700 18px Outfit, Montserrat, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(bay.label, x + bw / 2, by + bh / 2 - 6)
    ctx.font = '400 14px Outfit, Montserrat, sans-serif'
    ctx.fillStyle = '#334155'
    ctx.fillText(TYPE_LABEL[bay.type], x + bw / 2, by + bh / 2 + 16)
    ctx.fillStyle = '#0f172a'
    ctx.fillText(`${bay.widthMm} × ${bay.heightMm} mm`, x + bw / 2, by - 10)
    if (i === 0 && bay.sillMm > 0) {
      ctx.textAlign = 'right'
      ctx.fillStyle = '#475569'
      ctx.fillText(`AP ${bay.sillMm}`, x - 8, by + bh + sillH / 2 + 4)
    }
    ctx.textAlign = 'left'
  })

  y += schematicH + 56
  const colW = (availW - 40) / 2
  const left = pad
  const right = pad + colW + 40

  function paintList(title: string, items: string[], x: number, startY: number) {
    ctx.fillStyle = '#0f172a'
    ctx.font = '700 24px Outfit, Montserrat, sans-serif'
    ctx.fillText(title, x, startY)
    let ly = startY + 36
    ctx.font = '400 20px Outfit, Montserrat, sans-serif'
    ctx.fillStyle = '#334155'
    for (const item of items) {
      const lines = wrapText(ctx, item, colW)
      for (const line of lines) {
        ctx.fillText(line, x, ly)
        ly += 28
      }
      ly += 6
    }
    return ly
  }

  const medidas = info.medidasClave.map((m) => `${m.etiqueta}: ${m.valor}`)
  const areas = info.areas.map((a) => `${a.nombre}: ${a.m2.toFixed(1)} m²`)
  paintList('Medidas clave', medidas, left, y)
  paintList('Áreas', areas, right, y)
  y += Math.max(medidas.length, areas.length) * 40 + 70
  paintList('Materiales', info.materiales.map((m) => `• ${m}`), left, y)
  paintList('Anotaciones', info.anotaciones.map((m) => `• ${m}`), right, y)

  ctx.fillStyle = '#64748b'
  ctx.font = '400 18px Outfit, Montserrat, sans-serif'
  const foot = wrapText(
    ctx,
    `Autor ${version.autorName} · Emisión ${version.fechaEmision} · Motivo: ${version.motivoCambio}`,
    availW,
  )
  let fy = height - 100
  for (const line of foot) {
    ctx.fillText(line, pad, fy)
    fy += 24
  }

  return canvas
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function fileBase(version: Version) {
  return `${version.clave}_${version.version.replace(/\s+/g, '')}`
}

export async function downloadConsultaPdf(version: Version, plano: Plano) {
  if (version.pdfDataUrl?.startsWith('data:application/pdf')) {
    const res = await fetch(version.pdfDataUrl)
    downloadBlob(await res.blob(), version.pdfName || `${fileBase(version)}.pdf`)
    return
  }

  const canvas = drawConsulta(version, plano)
  const jpeg = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('No se pudo renderizar el plano.'))),
      'image/jpeg',
      0.86,
    )
  })
  const bytes = new Uint8Array(await jpeg.arrayBuffer())
  const pdf = wrapJpegAsPdf(bytes, canvas.width, canvas.height)
  downloadBlob(pdf, `${fileBase(version)}.pdf`)
}
