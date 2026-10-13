import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { SEED_PLANOS, SEED_VERSIONS, USERS } from './data'
import type {
  Approval,
  Plano,
  PublishPayload,
  StoreState,
  User,
  Version,
} from './types'

/** Persistencia solo en el navegador. No hay API ni backend. */
const STORAGE_KEY = 'cimas-gestion-planos-v1'

function loadState(): StoreState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as StoreState
  } catch {
    /* ignore */
  }
  return {
    planos: SEED_PLANOS,
    versions: SEED_VERSIONS,
    currentUserId: 'u-laura',
  }
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`
}

function requiredApprovals(version: Version) {
  const interno = version.approvals.find(
    (a) => a.tipo === 'interno' && a.decision === 'aprobado',
  )
  const cliente = version.approvals.find(
    (a) => a.tipo === 'cliente' && a.decision === 'aprobado',
  )
  return {
    interno: Boolean(interno),
    cliente: version.afectaObra ? Boolean(cliente) : true,
  }
}

function canBecomeVigente(version: Version) {
  const req = requiredApprovals(version)
  return req.interno && req.cliente
}

interface StoreApi {
  state: StoreState
  currentUser: User
  setCurrentUser: (id: string) => void
  versionsOf: (planoId: string) => Version[]
  vigenteOf: (planoId: string) => Version | undefined
  pendingOf: (planoId: string) => Version | undefined
  publishVersion: (payload: PublishPayload) => { ok: true; version: Version } | { ok: false; error: string }
  decide: (
    versionId: string,
    decision: 'aprobado' | 'rechazado',
    comentario: string,
  ) => { ok: true } | { ok: false; error: string }
  resetDemo: () => void
}

const StoreContext = createContext<StoreApi | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(loadState)

  const persist = useCallback((next: StoreState) => {
    setState(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const currentUser = useMemo(
    () => USERS.find((u) => u.id === state.currentUserId) ?? USERS[0],
    [state.currentUserId],
  )

  const versionsOf = useCallback(
    (planoId: string) =>
      state.versions
        .filter((v) => v.planoId === planoId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [state.versions],
  )

  const vigenteOf = useCallback(
    (planoId: string) =>
      state.versions.find((v) => v.planoId === planoId && v.status === 'vigente'),
    [state.versions],
  )

  const pendingOf = useCallback(
    (planoId: string) =>
      state.versions.find(
        (v) =>
          v.planoId === planoId &&
          (v.status === 'en_revision' || v.status === 'pendiente_cliente'),
      ),
    [state.versions],
  )

  const publishVersion: StoreApi['publishVersion'] = useCallback(
    (payload) => {
      if (currentUser.role !== 'proyectista') {
        return { ok: false, error: 'Solo una persona autorizada puede publicar o modificar una versión.' }
      }
      if (!payload.motivoCambio.trim()) {
        return { ok: false, error: 'El motivo del cambio es obligatorio.' }
      }
      if (!payload.version.trim() || !payload.clave.trim() || !payload.fechaEmision) {
        return { ok: false, error: 'Clave, versión y fecha de emisión son obligatorios.' }
      }
      if (!payload.pdfName) {
        return { ok: false, error: 'Siempre debe existir una versión en PDF para que todos puedan consultarla.' }
      }

      let planos = state.planos
      let planoId = payload.planoId
      if (!planoId && payload.newPlano) {
        const plano: Plano = { id: uid('p'), ...payload.newPlano, clave: payload.clave }
        planos = [...planos, plano]
        planoId = plano.id
      }
      if (!planoId) {
        return { ok: false, error: 'Selecciona o crea un plano.' }
      }

      const existingPending = state.versions.find(
        (v) =>
          v.planoId === planoId &&
          (v.status === 'en_revision' || v.status === 'pendiente_cliente'),
      )
      if (existingPending) {
        return {
          ok: false,
          error: `Ya hay una versión ${existingPending.version} en revisión. Debe aprobarse o rechazarse antes de enviar otra.`,
        }
      }

      const version: Version = {
        id: uid('v'),
        planoId,
        version: payload.version.trim(),
        clave: payload.clave.trim(),
        motivoCambio: payload.motivoCambio.trim(),
        fechaEmision: payload.fechaEmision,
        autorId: currentUser.id,
        autorName: currentUser.name,
        status: 'en_revision',
        pdfName: payload.pdfName,
        pdfDataUrl: payload.pdfDataUrl,
        dwgName: payload.dwgName,
        afectaObra: payload.afectaObra,
        solicitanteId: currentUser.id,
        solicitanteName: currentUser.name,
        approvals: [],
        createdAt: new Date().toISOString(),
        construction: payload.construction,
      }

      persist({
        ...state,
        planos,
        versions: [...state.versions, version],
      })
      return { ok: true, version }
    },
    [currentUser, persist, state],
  )

  const decide: StoreApi['decide'] = useCallback(
    (versionId, decision, comentario) => {
      const version = state.versions.find((v) => v.id === versionId)
      if (!version) return { ok: false, error: 'Versión no encontrada.' }
      if (version.status === 'vigente' || version.status === 'obsoleta' || version.status === 'rechazada') {
        return { ok: false, error: 'Esta versión ya no está en revisión.' }
      }

      const tipo: Approval['tipo'] =
        version.status === 'pendiente_cliente' ||
        (version.afectaObra &&
          version.approvals.some((a) => a.tipo === 'interno' && a.decision === 'aprobado') &&
          currentUser.role === 'cliente')
          ? 'cliente'
          : 'interno'

      if (tipo === 'interno' && currentUser.role !== 'autorizador') {
        return { ok: false, error: 'El visto bueno interno lo da una persona autorizada (autorizador).' }
      }
      if (tipo === 'cliente' && currentUser.role !== 'cliente') {
        return { ok: false, error: 'Cuando el cambio afecta la obra, el cliente propietario debe autorizarlo.' }
      }
      if (!comentario.trim() && decision === 'rechazado') {
        return { ok: false, error: 'Indica el motivo del rechazo.' }
      }

      const approval: Approval = {
        tipo,
        decision,
        actorId: currentUser.id,
        actorName: currentUser.name,
        fecha: new Date().toISOString(),
        comentario: comentario.trim(),
      }

      const nextStatus: Version['status'] = decision === 'rechazado'
        ? 'rechazada'
        : tipo === 'interno' && version.afectaObra
          ? 'pendiente_cliente'
          : 'vigente'

      const updated: Version = {
        ...version,
        approvals: [...version.approvals, approval],
        status: nextStatus,
      }

      if (updated.status !== 'vigente' && canBecomeVigente(updated)) {
        updated.status = 'vigente'
      }

      let versions = state.versions.map((v) => (v.id === versionId ? updated : v))
      if (updated.status === 'vigente') {
        versions = versions.map((v) => {
          if (v.planoId === version.planoId && v.id !== version.id && v.status === 'vigente') {
            return { ...v, status: 'obsoleta' as const }
          }
          return v
        })
      }

      persist({ ...state, versions })
      return { ok: true }
    },
    [currentUser, persist, state],
  )

  const api: StoreApi = {
    state,
    currentUser,
    setCurrentUser: (id) => persist({ ...state, currentUserId: id }),
    versionsOf,
    vigenteOf,
    pendingOf,
    publishVersion,
    decide,
    resetDemo: () => {
      const fresh: StoreState = {
        planos: SEED_PLANOS,
        versions: SEED_VERSIONS,
        currentUserId: currentUser.id,
      }
      persist(fresh)
    },
  }

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

export function statusLabel(status: Version['status']) {
  switch (status) {
    case 'vigente':
      return 'Vigente'
    case 'obsoleta':
      return 'Obsoleta'
    case 'en_revision':
      return 'En revisión'
    case 'pendiente_cliente':
      return 'Pendiente cliente'
    case 'rechazada':
      return 'Rechazada'
  }
}
