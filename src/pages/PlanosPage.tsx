import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FilePlus2, Filter, Smartphone } from 'lucide-react'
import { PublishModal } from '../components/PublishModal'
import { statusLabel, useStore } from '../store'

export function PlanosPage() {
  const { state, vigenteOf, pendingOf, currentUser } = useStore()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<'todos' | 'vigentes' | 'revision'>('todos')

  const rows = useMemo(() => {
    return state.planos
      .map((p) => ({
        plano: p,
        vigente: vigenteOf(p.id),
        pending: pendingOf(p.id),
        versions: state.versions.filter((v) => v.planoId === p.id).length,
      }))
      .filter((r) => {
        const hay = `${r.plano.clave} ${r.plano.nombre} ${r.plano.zona}`.toLowerCase()
        if (q && !hay.includes(q.toLowerCase())) return false
        if (filter === 'vigentes') return Boolean(r.vigente)
        if (filter === 'revision') return Boolean(r.pending)
        return true
      })
  }, [filter, pendingOf, q, state.planos, state.versions, vigenteOf])

  const pendingCount = state.versions.filter(
    (v) => v.status === 'en_revision' || v.status === 'pendiente_cliente',
  ).length

  return (
    <div className="page">
      <div className="page__tabs">
        <span className="tab is-active">2.1 Inventario de planos</span>
        <span className="tab">RF-01 · RF-09 · RF-10 · RF-12</span>
      </div>

      <div className="toolbar">
        {currentUser.role === 'proyectista' ? (
          <button className="btn btn--primary" onClick={() => setOpen(true)}>
            <FilePlus2 size={16} /> Publicar plano / versión
          </button>
        ) : (
          <p className="muted">Consulta: inicia sesión como proyectista autorizada para publicar.</p>
        )}
        <div className="toolbar__right">
          <label className="field-inline">
            <Filter size={14} />
            <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
              <option value="todos">Todos</option>
              <option value="vigentes">Con vigente</option>
              <option value="revision">En revisión</option>
            </select>
          </label>
          <input
            className="search-inline"
            placeholder="Filtrar por clave o zona"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <section className="hero-card">
        <div>
          <h2>Gestión de planos</h2>
          <p>
            Una sola versión vigente por plano, PDF obligatorio, historial completo y autorización
            antes de construir. {pendingCount} versión(es) esperan visto bueno.
          </p>
        </div>
        <div className="hero-stats">
          <div>
            <span>Planos</span>
            <strong>{state.planos.length}</strong>
          </div>
          <div>
            <span>Vigentes</span>
            <strong>{state.versions.filter((v) => v.status === 'vigente').length}</strong>
          </div>
          <div>
            <span>Obsoletas conservadas</span>
            <strong>{state.versions.filter((v) => v.status === 'obsoleta').length}</strong>
          </div>
        </div>
      </section>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Clave</th>
              <th>Plano</th>
              <th>Zona / nivel</th>
              <th>Vigente</th>
              <th>PDF</th>
              <th>Revisión</th>
              <th>Historial</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map(({ plano, vigente, pending, versions }) => (
              <tr key={plano.id}>
                <td className="mono">{plano.clave}</td>
                <td>
                  <strong>{plano.nombre}</strong>
                  <div className="muted">{plano.disciplina}</div>
                </td>
                <td>
                  {plano.zona}
                  <div className="muted">{plano.nivel}</div>
                </td>
                <td>
                  {vigente ? (
                    <span className="badge badge--vigente">{vigente.version}</span>
                  ) : (
                    <span className="badge badge--en_revision">Sin vigente</span>
                  )}
                </td>
                <td>{vigente?.pdfName ? 'Sí' : '—'}</td>
                <td>
                  {pending ? (
                    <span className={`badge badge--${pending.status}`}>
                      {statusLabel(pending.status)} · {pending.version}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
                <td>{versions} vers.</td>
                <td className="row-actions">
                  <Link className="btn btn--ghost btn--sm" to={`/planos/${plano.id}`}>
                    Abrir
                  </Link>
                  {vigente && (
                    <Link className="btn btn--ghost btn--sm" to={`/planos/${plano.id}/movil`}>
                      <Smartphone size={14} /> Móvil
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {open && <PublishModal onClose={() => setOpen(false)} />}
    </div>
  )
}
