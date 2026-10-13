import { NavLink } from 'react-router-dom'
import {
  Building2,
  ClipboardList,
  HardHat,
  LayoutDashboard,
  Map,
  Settings,
  Wallet,
} from 'lucide-react'

const items = [
  {
    group: 'Menú principal',
    links: [
      {
        to: '/planner',
        label: 'Planner',
        hint: 'Cronograma, Gantt y plantilla',
        icon: LayoutDashboard,
        enabled: false,
      },
      {
        to: '/ejecucion',
        label: 'Ejecución (campo)',
        hint: 'Bitácora, fotos HD y asistencia',
        icon: HardHat,
        enabled: false,
      },
      {
        to: '/',
        label: 'Gestión de planos',
        hint: 'Versiones, aprobación y consulta',
        icon: Map,
        enabled: true,
      },
      {
        to: '/admin',
        label: 'Administración',
        hint: 'Costos, gastos, almacén y cobranza',
        icon: Wallet,
        enabled: false,
      },
      {
        to: '/config',
        label: 'Configuración',
        hint: 'General, roles, usuarios y reglas',
        icon: Settings,
        enabled: false,
      },
    ],
  },
]

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {open && <button className="sidebar-backdrop" aria-label="Cerrar menú" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <div className="sidebar__brand">
          <div className="sidebar__logo">CM</div>
          <div>
            <p className="sidebar__title">CIMAS ERP</p>
            <p className="sidebar__sub">Control de obra</p>
          </div>
        </div>

        <div className="sidebar__obra">
          <p className="sidebar__kicker">Obra activa</p>
          <p className="sidebar__obra-name">Torre Residencial Cimas Norte</p>
          <p className="sidebar__obra-id">CIM-2026-N1</p>
        </div>

        {items.map((group) => (
          <nav key={group.group} className="sidebar__nav" aria-label={group.group}>
            <p className="sidebar__kicker">{group.group}</p>
            {group.links.map((link) => {
              const Icon = link.icon
              if (!link.enabled) {
                return (
                  <span key={link.to} className="sidebar__link is-disabled" title="Módulo no integrado en este prototipo">
                    <Icon size={18} />
                    <span>
                      <strong>{link.label}</strong>
                      <small>{link.hint}</small>
                    </span>
                  </span>
                )
              }
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => `sidebar__link ${isActive ? 'is-active' : ''}`}
                  onClick={onClose}
                >
                  <Icon size={18} />
                  <span>
                    <strong>{link.label}</strong>
                    <small>{link.hint}</small>
                  </span>
                </NavLink>
              )
            })}
          </nav>
        ))}

        <div className="sidebar__foot">
          <ClipboardList size={14} />
          <span>CIMAS ERP v2.4 · Módulo planos</span>
          <Building2 size={14} />
        </div>
      </aside>
    </>
  )
}
