# Dónde se cumplen los requerimientos

Este prototipo cubre **RF-01, RF-09, RF-10 y RF-12** del módulo Gestión de planos. Es solo front-end (React + Vite): las reglas viven en `src/store.tsx` y la interfaz en las páginas y modales.

Para probar cada rol, cambia el usuario arriba a la derecha:

| Rol en el requerimiento | Usuario de demo |
| --- | --- |
| Persona autorizada para publicar | Arq. Laura Ruiz (proyectista) |
| Persona autorizada para visto bueno | Ing. Carlos Mendoza (autorizador) |
| Cliente propietario | Sr. Ricardo Cimas |
| Consulta en campo | Ing. Mateo Hernández (residente) |

---

## RF-01 — Publicar / modificar versión (PDF obligatorio, una vigente)

**Texto:** Solo una persona autorizada publica o modifica una versión (AutoCAD o PDF) con clave, versión, motivo y fecha de emisión. Al publicarse, la anterior queda obsoleta. Una sola vigente por plano. Siempre hay PDF de consulta.

| Qué pide | Dónde se cumple | Cómo se ve / se prueba |
| --- | --- | --- |
| Solo persona autorizada | `src/store.tsx` → `publishVersion` rechaza si el rol no es `proyectista`. `src/pages/PlanosPage.tsx` y `src/pages/PlanoDetailPage.tsx` ocultan el botón si no eres proyectista. | Entra como Mateo o Ricardo: no aparece “Publicar” / “Nueva versión”. Como Laura sí. |
| Datos obligatorios: clave, versión, motivo, fecha | Formulario en `src/components/PublishModal.tsx`. Validación en `publishVersion`. | Intenta enviar sin motivo: no deja avanzar. |
| Formato PDF y AutoCAD | El modal pide PDF (obligatorio) y DWG/DXF (opcional). Si no subes PDF, se nombra uno de consulta (`clave_versión.pdf`). | Inventario → Publicar plano / versión. |
| Una vigente por plano | Al quedar vigente, `decide` marca las demás vigentes del mismo plano como `obsoleta`. No se pueden mandar dos versiones en revisión a la vez. | Publica Rev D de un plano que ya tiene una en revisión: el sistema lo bloquea. |
| Siempre hay PDF para consultar | Toda versión guarda `pdfName`. La ficha vigente y el historial lo muestran. La vista de campo genera el PDF de consulta. | Columna PDF del inventario; ficha del plano; botón de descarga en `/planos/:id/movil`. |

**Nota de flujo:** “Publicar” **no** deja la versión vigente al instante. Queda `en_revision` hasta cumplir RF-09. Cuando se aprueba, ahí sí la anterior pasa a obsoleta (eso es el “al publicarse” del RF-01, unido al visto bueno).

---

## RF-09 — Visto bueno interno y autorización del cliente

**Texto:** Una persona autorizada da el visto bueno o rechaza antes de que el plano quede vigente. Si el cambio afecta la obra, el cliente propietario también autoriza. Se registra quién solicita y quién autoriza.

| Qué pide | Dónde se cumple | Cómo se ve / se prueba |
| --- | --- | --- |
| Nada vigente sin aprobación | `publishVersion` crea la versión en `en_revision`, no en `vigente`. | Publica una Rev nueva como Laura: el vigente anterior no cambia hasta que aprueben. |
| Visto bueno o rechazo interno | `src/store.tsx` → `decide`. Solo el rol `autorizador`. UI en pestaña **Aprobación** de `src/pages/PlanoDetailPage.tsx`. | Como Carlos, entra a un plano en revisión → Aprobación → Dar visto bueno o Rechazar. |
| Cliente si afecta la obra | En el modal, checkbox “El cambio afecta la obra”. Si está marcado, tras el VB interno el estado pasa a `pendiente_cliente` y solo el rol `cliente` puede autorizar. | Demo lista: `VEN-N4-FN-02` Rev B (o publica una versión con el checkbox activo). Cambia a Ricardo → Autorizar como cliente. |
| Quién solicita y quién autoriza | Cada versión guarda `solicitanteName`. Cada decisión se agrega a `approvals` (actor, tipo interno/cliente, fecha, comentario). Se muestra en la ficha vigente y en Aprobación. | Abre `VEN-N3-FN-01` → Plano vigente → bloque “Quién autorizó”. |
| Rechazo | `decide` con `rechazado` deja la versión en `rechazada`; el vigente no se toca. | Como Carlos, rechaza con comentario: el plano vigente sigue siendo el anterior. |

---

## RF-10 — Historial completo, obsoletas no se borran

**Texto:** Historial de versiones de cada plano con fecha, autor y motivo, sin borrar las que ya quedaron obsoletas.

| Qué pide | Dónde se cumple | Cómo se ve / se prueba |
| --- | --- | --- |
| Listar todas las versiones | `versionsOf` en `src/store.tsx` (ordena por fecha, no filtra obsoletas). Pestaña **Historial** en `src/pages/PlanoDetailPage.tsx`. | Abre `VEN-N3-FN-01` → Historial (3): Rev C vigente, Rev B y Rev A obsoletas. |
| Fecha, autor y motivo | Campos `fechaEmision`, `autorName`, `motivoCambio` en cada versión (`src/types.ts`). Semilla en `src/data.ts`. | Cada tarjeta del historial muestra esos tres datos. |
| No borrar obsoletas | No hay función de eliminar versiones. Al aprobar, solo se cambia `status` a `obsoleta`. El texto de la UI dice “no se elimina al quedar obsoleta”. | Aprueba un cambio: el conteo “Obsoletas conservadas” del inventario sube; las revisiones viejas siguen abriéndose. |
| Consultar datos de una versión vieja | En el historial, “Medidas y datos de referencia” abre el mismo esquema (`PlanSheet`) de esa revisión. | En Rev B de N3 ves antepecho 1 050 mm; en Rev C vuelve a 900 mm. |

---

## RF-12 — Plano vigente adaptado a móvil, con datos de construcción

**Texto:** El plano vigente en un formato adaptado a dispositivos móviles, conservando la información necesaria para construir.

| Qué pide | Dónde se cumple | Cómo se ve / se prueba |
| --- | --- | --- |
| Formato para teléfono | Ruta `/planos/:id/movil` → `src/pages/MobilePlanPage.tsx`. Layout angosto (`mobile-shell` en `src/index.css`). Botón **Móvil** / **Vista móvil** en inventario y ficha. | En el inventario, Móvil en `VEN-N3-FN-01`, o reduce el ancho de la ventana. |
| Información de construcción | `src/components/PlanSheet.tsx`: vanos, medidas, áreas, materiales, anotaciones, ejes y niveles. | La vista de campo muestra el esquema y las cotas, no el DWG. |
| Descarga para obra | `src/lib/downloadPlanPdf.ts` genera un **PDF de consulta** (o el PDF que se haya subido). | El ícono de descarga ya no baja JSON; baja `VEN-N3-FN-01_RevC.pdf`. |
| Solo el vigente | `MobilePlanPage` usa `vigenteOf`. Si no hay vigente, no hay vista de campo. | — |

El CSS en `@media (max-width: 980px)` también adapta menú, tabla y ficha al teléfono, no solo esa ruta.

---

## Mapa rápido archivo ↔ requerimiento

| Archivo | RF-01 | RF-09 | RF-10 | RF-12 |
| --- | :---: | :---: | :---: | :---: |
| `src/store.tsx` | sí | sí | sí | — |
| `src/types.ts` | sí | sí | sí | sí |
| `src/data.ts` (semilla de demo) | sí | sí | sí | sí |
| `src/components/PublishModal.tsx` | sí | afecta obra | — | PDF |
| `src/pages/PlanosPage.tsx` | sí | — | conteo historial | enlace móvil |
| `src/pages/PlanoDetailPage.tsx` | sí | sí | sí | enlace móvil |
| `src/components/PlanSheet.tsx` | consulta PDF | — | medidas de obsoletas | sí |
| `src/pages/MobilePlanPage.tsx` | — | — | — | sí |
| `src/lib/downloadPlanPdf.ts` | PDF de consulta | — | — | sí |
| `src/components/Header.tsx` | cambio de rol para demostrar permisos | | | |

---

## Qué no está en este prototipo

Los demás ítems de `docs/REQUERIMIENTOS.md` **no** están implementados a propósito (este entregable es RF-01, 09, 10 y 12):

- **RF-02** notificaciones por versión descargada  
- **RF-03** observaciones offline y sync  
- **RF-04, RF-08, RNF-03** evidencias fotográficas ancladas al plano  
- **RF-05, RF-06, RF-07** hallazgos  
- **RF-11** registro de obra terminada  
- **RF-13** visibilidad por frente de contratista  
- **RF-14, RF-15** validación de avance vs materiales  
- **RNF-01, RNF-02** medición de 5 s en 1 Mbps y sync de 50 capturas  

---

## Recorrido de demostración (los cuatro RF juntos)

1. **RF-12:** Inventario → Móvil en `VEN-N3-FN-01` → descarga el PDF.  
2. **RF-10:** Volver → Abrir el mismo plano → Historial: Rev A y B obsoletas siguen ahí.  
3. **RF-01:** Como Laura, **Nueva versión** (clave, Rev, motivo, fecha, PDF). Queda en revisión, no vigente.  
4. **RF-09:** Como Carlos, Aprobación → visto bueno. Si marcaste “afecta la obra”, como Ricardo autoriza. Recién ahí la nueva es vigente y la anterior, obsoleta (RF-01 + RF-10).  
