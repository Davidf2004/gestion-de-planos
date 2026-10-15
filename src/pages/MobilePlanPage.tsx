import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Download } from 'lucide-react'
import { PlanSheet } from '../components/PlanSheet'
import { downloadConsultaPdf } from '../lib/downloadPlanPdf'
import { useStore } from '../store'

export function MobilePlanPage() {
  const { id } = useParams()
  const { state, vigenteOf } = useStore()
  const plano = state.planos.find((p) => p.id === id)
  const vigente = plano ? vigenteOf(plano.id) : undefined
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!plano || !vigente) {
    return (
      <div className="mobile-shell">
        <p>No hay plano vigente para consultar en campo.</p>
        <Link to="/">Volver</Link>
      </div>
    )
  }

  async function onDownload() {
    if (!plano || !vigente) return
    setError('')
    setBusy(true)
    try {
      await downloadConsultaPdf(vigente, plano)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo descargar el PDF.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mobile-shell">
      <header className="mobile-bar">
        <Link to={`/planos/${plano.id}`} aria-label="Volver">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <strong>{plano.clave}</strong>
          <small>Vista de campo · RF-12</small>
        </div>
        <button
          type="button"
          className="icon-btn"
          onClick={() => void onDownload()}
          disabled={busy}
          aria-label="Descargar PDF de consulta"
          title="Descargar PDF de consulta"
        >
          <Download size={16} />
        </button>
      </header>
      <p className="mobile-note">
        Formato adaptado a teléfono: esquema de vanos, cotas, materiales y anotaciones.
        El botón de descarga genera un <strong>PDF de consulta</strong> para obra (sin el DWG de taller).
      </p>
      {error && <p className="form-error">{error}</p>}
      <PlanSheet version={vigente} compact />
    </div>
  )
}
