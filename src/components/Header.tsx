import { Bell, ChevronDown, Menu, Search } from 'lucide-react'
import { USERS } from '../data'
import { useStore } from '../store'

export function Header({ onMenu }: { onMenu: () => void }) {
  const { currentUser, setCurrentUser } = useStore()

  return (
    <header className="topbar">
      <button className="icon-btn topbar__menu" onClick={onMenu} aria-label="Abrir menú principal">
        <Menu size={18} />
      </button>
      <div className="topbar__brand-mobile">
        <span className="sidebar__logo sidebar__logo--sm">CM</span>
      </div>
      <div className="topbar__project">
        <span>Proyecto</span>
        <strong>Torre Residencial Cimas Norte</strong>
      </div>
      <label className="topbar__search">
        <Search size={16} />
        <input placeholder="Buscar planos, clave, versión..." />
      </label>
      <button className="icon-btn" aria-label="Notificaciones">
        <Bell size={18} />
        <span className="dot" />
      </button>
      <label className="topbar__user">
        <div className="avatar">{currentUser.initials}</div>
        <div className="topbar__user-meta">
          <strong>{currentUser.name}</strong>
          <small>{currentUser.title}</small>
        </div>
        <ChevronDown size={14} />
        <select
          aria-label="Cambiar usuario de demostración"
          value={currentUser.id}
          onChange={(e) => setCurrentUser(e.target.value)}
        >
          {USERS.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} — {u.title}
            </option>
          ))}
        </select>
      </label>
    </header>
  )
}
