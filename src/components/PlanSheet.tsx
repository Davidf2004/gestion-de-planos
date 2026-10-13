import type { ConstructionInfo, Version } from '../types'

const TYPE_LABEL = {
  fija: 'Fija',
  corredera: 'Corredera',
  proyectante: 'Proyectante',
  oscilobatiente: 'Oscilo-batiente',
}

export function PlanSheet({
  version,
  compact = false,
}: {
  version: Version
  compact?: boolean
}) {
  const info: ConstructionInfo = version.construction
  const maxH = Math.max(...info.esquema.map((b) => b.heightMm + b.sillMm), 1)
  const scale = compact ? 0.045 : 0.07
  const pad = 48
  const svgW = info.esquema.reduce((acc, b) => acc + b.widthMm * scale + 16, pad * 2)
  const svgH = maxH * scale + pad * 2 + 36

  return (
    <div className="plan-sheet">
      <header className="plan-sheet__head">
        <div>
          <p className="plan-sheet__kicker">Plano de construcción · PDF de consulta</p>
          <h3>{version.clave} · {version.version}</h3>
          <p className="muted">{info.ejes} · {info.niveles.join(', ')}</p>
        </div>
        <div className={`badge badge--${version.status}`}>{version.status === 'vigente' ? 'VIGENTE' : version.version}</div>
      </header>

      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="plan-sheet__svg"
        role="img"
        aria-label={`Esquema de vanos ${version.clave}`}
      >
        <rect x="0" y="0" width={svgW} height={svgH} fill="#f8fafc" />
        {info.esquema.map((bay, i) => {
          const x =
            pad +
            info.esquema.slice(0, i).reduce((acc, b) => acc + b.widthMm * scale + 16, 0)
          const sillH = bay.sillMm * scale
          const h = bay.heightMm * scale
          const w = bay.widthMm * scale
          const y = svgH - pad - sillH - h
          return (
            <g key={bay.id}>
              {bay.sillMm > 0 && (
                <rect x={x} y={y + h} width={w} height={sillH} fill="#cbd5e1" stroke="#64748b" />
              )}
              <rect x={x} y={y} width={w} height={h} fill="#e0f2fe" stroke="#1d4ed8" strokeWidth="2" />
              <line x1={x + w / 2} y1={y + 8} x2={x + w / 2} y2={y + h - 8} stroke="#3b82f6" strokeDasharray="4 3" />
              <text x={x + w / 2} y={y + h / 2 - 6} textAnchor="middle" fontSize="11" fill="#1e3a8a" fontFamily="Outfit, sans-serif">
                {bay.label}
              </text>
              <text x={x + w / 2} y={y + h / 2 + 10} textAnchor="middle" fontSize="9" fill="#334155" fontFamily="Outfit, sans-serif">
                {TYPE_LABEL[bay.type]}
              </text>
              <text x={x + w / 2} y={y - 6} textAnchor="middle" fontSize="9" fill="#0f172a" fontFamily="Outfit, sans-serif">
                {bay.widthMm} × {bay.heightMm} mm
              </text>
              {i === 0 && bay.sillMm > 0 && (
                <text x={x - 6} y={y + h + sillH / 2} textAnchor="end" fontSize="9" fill="#475569" fontFamily="Outfit, sans-serif">
                  AP {bay.sillMm}
                </text>
              )}
            </g>
          )
        })}
        <text x={pad} y={18} fontSize="10" fill="#64748b" fontFamily="Outfit, sans-serif">
          Referencia de vanos — no sustituye cotas de taller · escala esquemática
        </text>
      </svg>

      <div className="plan-sheet__grid">
        <section>
          <h4>Medidas clave</h4>
          <ul>
            {info.medidasClave.map((m) => (
              <li key={m.etiqueta}>
                <span>{m.etiqueta}</span>
                <strong>{m.valor}</strong>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h4>Áreas</h4>
          <ul>
            {info.areas.map((a) => (
              <li key={a.nombre}>
                <span>{a.nombre}</span>
                <strong>{a.m2.toFixed(1)} m²</strong>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h4>Materiales</h4>
          <ul className="plain">
            {info.materiales.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </section>
        <section>
          <h4>Anotaciones</h4>
          <ul className="plain">
            {info.anotaciones.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </section>
      </div>
      <p className="plan-sheet__foot">
        Autor {version.autorName} · Emisión {version.fechaEmision} · Motivo: {version.motivoCambio}
        {info.esquema.length ? ` · Vanos ${info.esquema.map((b) => b.label).join(', ')}` : ''}
      </p>
    </div>
  )
}
