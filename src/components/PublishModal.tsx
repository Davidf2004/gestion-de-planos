import { useState, type FormEvent } from 'react'
import { DEFAULT_CONSTRUCTION } from '../data'
import { useStore } from '../store'
import type { ConstructionInfo, Disciplina, Plano } from '../types'

const DISCIPLINAS: Disciplina[] = ['Ventanas', 'Fachada', 'Arquitectónico', 'Cancelería']

function nextVersionLabel(existing: string[]) {
  const letters = existing
    .map((v) => v.replace(/^Rev\s+/i, '').trim())
    .filter((v) => /^[A-Z]$/i.test(v))
    .map((v) => v.toUpperCase())
  if (letters.length === 0) return 'Rev A'
  const max = letters.reduce((acc, l) => (l > acc ? l : acc), 'A')
  return `Rev ${String.fromCharCode(max.charCodeAt(0) + 1)}`
}

export function PublishModal({
  plano,
  onClose,
}: {
  plano?: Plano
  onClose: () => void
}) {
  const { versionsOf, publishVersion, vigenteOf } = useStore()
  const existing = plano ? versionsOf(plano.id) : []
  const vigente = plano ? vigenteOf(plano.id) : undefined

  const [clave, setClave] = useState(plano?.clave ?? '')
  const [nombre, setNombre] = useState(plano?.nombre ?? '')
  const [disciplina, setDisciplina] = useState<Disciplina>(plano?.disciplina ?? 'Ventanas')
  const [zona, setZona] = useState(plano?.zona ?? '')
  const [nivel, setNivel] = useState(plano?.nivel ?? '')
  const [version, setVersion] = useState(nextVersionLabel(existing.map((v) => v.version)))
  const [motivo, setMotivo] = useState('')
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10))
  const [afectaObra, setAfectaObra] = useState(true)
  const [pdfName, setPdfName] = useState('')
  const [pdfDataUrl, setPdfDataUrl] = useState<string | undefined>()
  const [dwgName, setDwgName] = useState('')
  const [error, setError] = useState('')
  const [construction, setConstruction] = useState<ConstructionInfo>(
    vigente?.construction ?? DEFAULT_CONSTRUCTION,
  )

  function readFile(file: File, setterName: (n: string) => void, setterData?: (d: string) => void) {
    setterName(file.name)
    if (!setterData) return
    if (file.size > 1_800_000) {
      setError('El PDF de demostración debe pesar menos de 1.8 MB (límite de almacenamiento local).')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setterData(String(reader.result))
    reader.readAsDataURL(file)
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const result = publishVersion({
      planoId: plano?.id,
      newPlano: plano
        ? undefined
        : { clave, nombre, disciplina, zona, nivel },
      version,
      clave,
      motivoCambio: motivo,
      fechaEmision: fecha,
      pdfName: pdfName || `${clave}_${version.replace(/\s+/g, '')}.pdf`,
      pdfDataUrl,
      dwgName: dwgName || undefined,
      afectaObra,
      construction,
    })
    if (!result.ok) {
      setError(result.error)
      return
    }
    onClose()
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal" role="dialog" aria-labelledby="publish-title" onClick={(e) => e.stopPropagation()}>
        <header>
          <p className="kicker">RF-01 · Publicar versión</p>
          <h2 id="publish-title">{plano ? `Nueva versión de ${plano.clave}` : 'Registrar plano y primera versión'}</h2>
          <p className="muted">
            Solo una persona autorizada puede publicar. El archivo PDF es obligatorio. La versión no queda vigente hasta el visto bueno (RF-09).
          </p>
        </header>
        <form onSubmit={onSubmit} className="form-grid">
          <label>
            Clave
            <input value={clave} onChange={(e) => setClave(e.target.value)} required placeholder="VEN-N3-FN-01" />
          </label>
          <label>
            Versión
            <input value={version} onChange={(e) => setVersion(e.target.value)} required />
          </label>
          {!plano && (
            <>
              <label className="span-2">
                Nombre del plano
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </label>
              <label>
                Disciplina
                <select value={disciplina} onChange={(e) => setDisciplina(e.target.value as Disciplina)}>
                  {DISCIPLINAS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </label>
              <label>
                Nivel
                <input value={nivel} onChange={(e) => setNivel(e.target.value)} required />
              </label>
              <label className="span-2">
                Zona / frente
                <input value={zona} onChange={(e) => setZona(e.target.value)} required />
              </label>
            </>
          )}
          <label>
            Fecha de emisión
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
          </label>
          <label className="check">
            <input type="checkbox" checked={afectaObra} onChange={(e) => setAfectaObra(e.target.checked)} />
            El cambio afecta la obra (requiere autorización del cliente)
          </label>
          <label className="span-2">
            Motivo del cambio
            <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} required rows={3} placeholder="Describe qué se corrige y por qué." />
          </label>
          <label>
            PDF de consulta (obligatorio)
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) readFile(f, setPdfName, setPdfDataUrl)
              }}
            />
            <small>{pdfName || 'Si no subes archivo, se genera un PDF de consulta con el esquema y las cotas.'}</small>
          </label>
          <label>
            AutoCAD (opcional)
            <input
              type="file"
              accept=".dwg,.dxf"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) setDwgName(f.name)
              }}
            />
            <small>{dwgName || 'Sin DWG'}</small>
          </label>
          <label className="span-2">
            Medidas clave (una por línea: etiqueta | valor)
            <textarea
              rows={3}
              value={construction.medidasClave.map((m) => `${m.etiqueta} | ${m.valor}`).join('\n')}
              onChange={(e) =>
                setConstruction({
                  ...construction,
                  medidasClave: e.target.value
                    .split('\n')
                    .filter(Boolean)
                    .map((line) => {
                      const [etiqueta, valor] = line.split('|').map((s) => s.trim())
                      return { etiqueta: etiqueta || 'Medida', valor: valor || '—' }
                    }),
                })
              }
            />
          </label>
          {error && <p className="form-error span-2">{error}</p>}
          <div className="modal__actions span-2">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn--primary">
              Enviar a revisión
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
