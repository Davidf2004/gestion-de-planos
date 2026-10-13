import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { MobilePlanPage } from './pages/MobilePlanPage'
import { PlanoDetailPage } from './pages/PlanoDetailPage'
import { PlanosPage } from './pages/PlanosPage'
import { StoreProvider, useStore } from './store'

function Placeholder({ title }: { title: string }) {
  return (
    <div className="page">
      <div className="empty">
        <h2>{title}</h2>
        <p>Este módulo pertenece a CIMAS ERP y no está integrado en este prototipo. Usa Gestión de planos.</p>
      </div>
    </div>
  )
}

function Shell() {
  const [menu, setMenu] = useState(false)
  const { currentUser, resetDemo } = useStore()
  return (
    <div className="app-shell">
      <Sidebar open={menu} onClose={() => setMenu(false)} />
      <div className="app-main">
        <Header onMenu={() => setMenu(true)} />
        <div className="role-hint">
          Prototipo 100% front-end (sin servidor). Actúas como <strong>{currentUser.name}</strong> ({currentUser.title}).
          Cambia el usuario arriba para publicar, dar visto bueno o autorizar como cliente.
          <button type="button" className="linkish" onClick={resetDemo}>
            Restaurar demo
          </button>
        </div>
        <Routes>
          <Route path="/" element={<PlanosPage />} />
          <Route path="/planos/:id" element={<PlanoDetailPage />} />
          <Route path="/planos/:id/movil" element={<MobilePlanPage />} />
          <Route path="/planner" element={<Placeholder title="Planner" />} />
          <Route path="/ejecucion" element={<Placeholder title="Ejecución" />} />
          <Route path="/admin" element={<Placeholder title="Administración" />} />
          <Route path="/config" element={<Placeholder title="Configuración" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </StoreProvider>
  )
}
