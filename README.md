# Gestión de planos — CIMAS ERP

Módulo independiente de **Gestión de planos** para [CIMAS ERP](https://t-efficiency.com/cimas-erp-lasalle/), sin integrar aún el Planner, Ejecución ni Administración.

**Es solo front-end:** no hay servidor, API ni base de datos. React + Vite. Los planos, versiones y aprobaciones viven en el navegador (`localStorage`).

## Qué cubre este prototipo

| ID | Qué hace |
| --- | --- |
| **RF-01** | Solo la proyectista autorizada publica una versión (PDF obligatorio, AutoCAD opcional) con clave, versión, motivo y fecha. Al quedar vigente, la anterior pasa a obsoleta. Una sola vigente por plano. |
| **RF-09** | Nada queda vigente sin visto bueno interno. Si el cambio afecta la obra, el cliente propietario también autoriza o rechaza. Se registra quién solicita y quién autoriza. |
| **RF-10** | Historial completo (fecha, autor, motivo). Las versiones obsoletas no se borran y se pueden consultar. |
| **RF-12** | Vista móvil del plano vigente con medidas, vanos, materiales y anotaciones de construcción. |

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre la URL local (Vite, normalmente `http://localhost:5173`).

En la esquina superior derecha cambia de usuario para probar cada rol:

- **Arq. Laura Ruiz** — publica versiones
- **Ing. Carlos Mendoza** — da el visto bueno interno
- **Sr. Ricardo Cimas** — autoriza cambios que afectan la obra
- **Ing. Mateo Hernández** — consulta (incluye vista móvil)

Los datos viven en el navegador (`localStorage`), no en un backend. Usa **Restaurar demo** para volver a la semilla.

## Equipo DreamTeam

- Marcos Ariciaga Valdez (MarcosAriciaga)
- Cesar Alberto Carrillo Paez (Tedtar25)
- David Fonseca Marin (Davidf2004)
- Emiliano Ramirez Ayala (dxvm0n)
