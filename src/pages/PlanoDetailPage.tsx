import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, FilePlus2, Smartphone } from 'lucide-react'
import { PlanSheet } from '../components/PlanSheet'
import { PublishModal } from '../components/PublishModal'
import { statusLabel, useStore } from '../store'

export function PlanoDetailPage() {
  const { id } = useParams()
  const { state, versionsOf, vigenteOf, currentUser, decide } = useStore()
  const plano = state.planos.find((p) => p.id === id)
  const [tab, setTab] = useState<'vigente' | 'historial' | 'aprobacion'>('vigente')
  const [open, setOpen] = useState(false)
  const [comentario, setComentario] = useState('')
  const [msg, setMsg] = useState('')

  if (!plano) {
    return (
      <div className="page">
        <p>Plano no encontrado.</p>
        <Link to="/">Volver</Link>
      </div>
    )
  }

  const versions = versionsOf(plano.id)
  const vigente = vigenteOf(plano.id)
  const pending = versions.find((v) => v.status === 'en_revision' || v.status === 'pendiente_cliente')
  const viewing = tab === 'vigente' ? vigente : undefined

  function onDecide(decision: 'aprobado' | 'rechazado') {
    if (!pending) return
    const res = decide(pending.id, decision, comentario)
    setMsg(res.ok ? 'Registro actualizado.' : res.error)
    if (res.ok) setComentario('')
  }

  const canInternal = currentUser.role === 'autorizador' && pending?.status === 'en_revision'
  const canClient =
    currentUser.role === 'cliente' && pending?.status === 'pendiente_cliente'

  return (
    <div className="page">
      <div className="page__tabs">
        <Link className="tab" to="/">
          <ArrowLeft size={14} /> Inventario
        </Link>
        <span className="tab is-active">{plano.clave}</span>
      </div>

      <div className="detail-head">
        <div>
          <p className="kicker">{plano.disciplina} · {plano.zona}</p>
          <h1>{plano.nombre}</h1>
          <p className="muted">{plano.nivel} · Una versión vigente · El historial no se borra</p>
        </div>
        <div className="detail-head__actions">
          {currentUser.role === 'proyectista' && (
            <button className="btn btn--primary" onClick={() => setOpen(true)}>
              <FilePlus2 size={16} /> Nueva versión
            </button>
          )}
          {vigente && (
            <Link className="btn btn--ghost" to={`/planos/${plano.id}/movil`}>
              <Smartphone size={16} /> Vista móvil
            </Link>
          )}
        </div>
      </div>

      <div className="segment">
        <button className={tab === 'vigente' ? 'is-on' : ''} onClick={() => setTab('vigente')}>
          Plano vigente
        </button>
        <button className={tab === 'historial' ? 'is-on' : ''} onClick={() => setTab('historial')}>
          Historial ({versions.length})
        </button>
        <button className={tab === 'aprobacion' ? 'is-on' : ''} onClick={() => setTab('aprobacion')}>
          Aprobación {pending ? '· 1' : ''}
        </button>
      </div>

      {tab === 'vigente' && (
        <div className="split">
          {viewing ? (
            <>
              <PlanSheet version={viewing} />
              <aside className="side-card">
                <h3>Datos de emisión</h3>
                <dl>
                  <dt>Versión</dt>
                  <dd>{viewing.version}</dd>
                  <dt>Fecha</dt>
                  <dd>{viewing.fechaEmision}</dd>
                  <dt>Autor</dt>
                  <dd>{viewing.autorName}</dd>
                  <dt>Motivo</dt>
                  <dd>{viewing.motivoCambio}</dd>
                  <dt>PDF</dt>
                  <dd>{viewing.pdfName}</dd>
                  <dt>AutoCAD</dt>
                  <dd>{viewing.dwgName || 'No adjunto (PDF disponible)'}</dd>
                </dl>
                {viewing.pdfDataUrl && (
                  <iframe title="PDF" className="pdf-frame" src={viewing.pdfDataUrl} />
                )}
                <h3>Quién autorizó</h3>
                <ul className="timeline">
                  <li>
                    <strong>Solicitó</strong> {viewing.solicitanteName}
                  </li>
                  {viewing.approvals.map((a) => (
                    <li key={a.fecha}>
                      <strong>{a.tipo === 'interno' ? 'Visto bueno' : 'Cliente'}</strong>{' '}
                      {a.actorName} · {new Date(a.fecha).toLocaleString('es-MX')}
                      <div className="muted">{a.comentario}</div>
                    </li>
                  ))}
                </ul>
              </aside>
            </>
          ) : (
            <p className="empty">Aún no hay versión vigente. Debe completar el flujo de aprobación.</p>
          )}
        </div>
      )}

      {tab === 'historial' && (
        <ol className="history">
          {versions.map((v) => (
            <li key={v.id} className={`history__item history__item--${v.status}`}>
              <div className="history__meta">
                <span className={`badge badge--${v.status}`}>{statusLabel(v.status)}</span>
                <strong>{v.version}</strong>
                <span className="muted">{v.fechaEmision}</span>
              </div>
              <p>
                <strong>Autor:</strong> {v.autorName}
              </p>
              <p>
                <strong>Motivo:</strong> {v.motivoCambio}
              </p>
              <p className="muted">
                PDF {v.pdfName}
                {v.dwgName ? ` · ${v.dwgName}` : ''} · no se elimina al quedar obsoleta
              </p>
              <details>
                <summary>Medidas y datos de referencia</summary>
                <PlanSheet version={v} compact />
              </details>
            </li>
          ))}
        </ol>
      )}

      {tab === 'aprobacion' && (
        <div className="approval">
          {!pending ? (
            <p className="empty">No hay versiones en revisión. La vigente permanece hasta que se apruebe un cambio.</p>
          ) : (
            <>
              <div className="approval__banner">
                <div>
                  <p className="kicker">RF-09 · Control de cambios</p>
                  <h3>
                    {pending.version} — {statusLabel(pending.status)}
                  </h3>
                  <p>
                    Solicitó <strong>{pending.solicitanteName}</strong> el {pending.fechaEmision}.{' '}
                    {pending.afectaObra
                      ? 'Este cambio afecta la obra: requiere visto bueno interno y autorización del cliente.'
                      : 'No marca impacto en obra: basta el visto bueno interno.'}
                  </p>
                </div>
                <span className={`badge badge--${pending.status}`}>{statusLabel(pending.status)}</span>
              </div>
              <p>
                <strong>Motivo:</strong> {pending.motivoCambio}
              </p>
              <PlanSheet version={pending} compact />
              <ul className="timeline">
                {pending.approvals.map((a) => (
                  <li key={a.fecha}>
                    {a.decision === 'aprobado' ? 'Aprobó' : 'Rechazó'} ({a.tipo}) {a.actorName} — {a.comentario}
                  </li>
                ))}
              </ul>
              {(canInternal || canClient) && (
                <div className="approval__form">
                  <label>
                    Comentario / fundamento
                    <textarea rows={3} value={comentario} onChange={(e) => setComentario(e.target.value)} />
                  </label>
                  <div className="modal__actions">
                    <button className="btn btn--danger" type="button" onClick={() => onDecide('rechazado')}>
                      Rechazar
                    </button>
                    <button className="btn btn--primary" type="button" onClick={() => onDecide('aprobado')}>
                      {canClient ? 'Autorizar como cliente' : 'Dar visto bueno'}
                    </button>
                  </div>
                </div>
              )}
              {!canInternal && !canClient && (
                <p className="muted">
                  Cambia de usuario en la esquina superior para aprobar: autorizador interno o cliente propietario.
                </p>
              )}
              {msg && <p className="form-error">{msg}</p>}
            </>
          )}
        </div>
      )}

      {open && <PublishModal plano={plano} onClose={() => setOpen(false)} />}
    </div>
  )
}
