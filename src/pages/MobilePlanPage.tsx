import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Download } from 'lucide-react'
import { PlanSheet } from '../components/PlanSheet'
import { useStore } from '../store'

export function MobilePlanPage() {
  const { id } = useParams()
  const { state, vigenteOf } = useStore()
  const plano = state.planos.find((p) => p.id === id)
  const vigente = plano ? vigenteOf(plano.id) : undefined

  if (!plano || !vigente) {
    return (
      <div className="mobile-shell">
        <p>No hay plano vigente para consultar en campo.</p>
        <Link to="/">Volver</Link>
      </div>
    )
  }

  const payload = {
    clave: vigente.clave,
    version: vigente.version,
    medidas: vigente.construction.medidasClave,
    materiales: vigente.construction.materiales,
    vanos: vigente.construction.esquema,
  }
  const bytes = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }).size

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
        <a
          className="icon-btn"
          href={`data:application/json,${encodeURIComponent(JSON.stringify(payload))}`}
          download={`${vigente.clave}_${vigente.version}.json`}
          aria-label="Descargar paquete ligero"
        >
          <Download size={16} />
        </a>
      </header>
      <p className="mobile-note">
        Formato adaptado a teléfono: esquema de vanos, cotas, materiales y anotaciones. Paquete ligero ≈ {bytes} bytes.
        El DWG de taller no viaja; el PDF de consulta y las cotas sí.
      </p>
      <PlanSheet version={vigente} compact />
    </div>
  )
}
