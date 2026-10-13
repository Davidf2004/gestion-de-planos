export type Role =
  | 'proyectista'
  | 'autorizador'
  | 'cliente'
  | 'residente'

export type VersionStatus =
  | 'en_revision'
  | 'pendiente_cliente'
  | 'vigente'
  | 'obsoleta'
  | 'rechazada'

export type Disciplina =
  | 'Ventanas'
  | 'Fachada'
  | 'Arquitectónico'
  | 'Cancelería'

export interface User {
  id: string
  name: string
  role: Role
  title: string
  initials: string
}

export interface ConstructionInfo {
  niveles: string[]
  areas: { nombre: string; m2: number }[]
  materiales: string[]
  medidasClave: { etiqueta: string; valor: string }[]
  anotaciones: string[]
  ejes: string
  esquema: WindowBay[]
}

export interface WindowBay {
  id: string
  label: string
  widthMm: number
  heightMm: number
  sillMm: number
  type: 'fija' | 'corredera' | 'proyectante' | 'oscilobatiente'
}

export interface Approval {
  tipo: 'interno' | 'cliente'
  decision: 'aprobado' | 'rechazado'
  actorId: string
  actorName: string
  fecha: string
  comentario: string
}

export interface Version {
  id: string
  planoId: string
  version: string
  clave: string
  motivoCambio: string
  fechaEmision: string
  autorId: string
  autorName: string
  status: VersionStatus
  pdfName: string
  pdfDataUrl?: string
  dwgName?: string
  afectaObra: boolean
  solicitanteId: string
  solicitanteName: string
  approvals: Approval[]
  createdAt: string
  construction: ConstructionInfo
}

export interface Plano {
  id: string
  clave: string
  nombre: string
  disciplina: Disciplina
  zona: string
  nivel: string
}

export interface StoreState {
  planos: Plano[]
  versions: Version[]
  currentUserId: string
}

export interface PublishPayload {
  planoId?: string
  newPlano?: {
    clave: string
    nombre: string
    disciplina: Disciplina
    zona: string
    nivel: string
  }
  version: string
  clave: string
  motivoCambio: string
  fechaEmision: string
  pdfName: string
  pdfDataUrl?: string
  dwgName?: string
  afectaObra: boolean
  construction: ConstructionInfo
}
