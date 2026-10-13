# Historias de usuario: Modulo Gestión de planos

Formato esperado pa que suban sus historias de usuario:

```
#### HU-XX: Título de la historia
Requerimiento: RF-XX
Como <rol>, quiero <acción>, para <beneficio>.
- [ ] Dado que <condición inicial>, cuando <acción>, entonces <resultado esperado>
- [ ] <otro escenario de prueba>
```

#### HU-01: Publicar nueva versión de plano

Requerimiento: RF-01

Como proyectista, quiero publicar una nueva versión de un plano, para que la obra siempre construya contra la versión correcta.

- [ ] Dado que subo un archivo de plano con su clave y versión, cuando confirmo la publicación, entonces el sistema marca esa versión como vigente y la anterior pasa a obsoleta.
- [ ] Dado que ya existe una versión vigente de ese plano, cuando publico una nueva, entonces el sistema no permite dos versiones vigentes al mismo tiempo.

#### HU-02: Ver motivo de cambio de plano

Requerimiento: RF-01

Como residente de obra, quiero ver por qué se cambió una versión de plano, para entender qué se corrigió antes de seguir construyendo.

- [ ] Dado que una versión nueva fue publicada, cuando la consulto, entonces veo el motivo del cambio junto con la fecha y quién la emitió.
- [ ] Dado que un plano no tiene motivo registrado, cuando el proyectista intenta publicarlo, entonces el sistema no lo deja avanzar sin ese dato.

#### HU-03: Notificación de cambio de plano

Requerimiento: RF-02

Como maestro de obra, quiero recibir aviso cuando cambia la versión del plano de mi frente, para no seguir construyendo con la versión vieja.

- [ ] Dado que se publica una nueva versión de un plano, cuando alguien tenía descargada la versión anterior, entonces recibe una notificación con el número de la nueva versión.
- [ ] Dado que reviso mis notificaciones, cuando abro una de cambio de plano, entonces veo qué zona o nivel del plano cambió.

#### HU-04: Consultar plano vigente sin señal

Requerimiento: RF-03

Como residente de obra, quiero consultar el plano vigente aunque no tenga señal en obra, para seguir trabajando sin parar.

- [ ] Dado que descargué el plano vigente con señal disponible, cuando pierdo la conexión en obra, entonces puedo seguir consultándolo desde el dispositivo.
- [ ] Dado que estoy sin señal, cuando marco una observación sobre el plano, entonces esa observación queda guardada localmente para sincronizarse después.

#### HU-05: Sincronizar observaciones al recuperar señal

Requerimiento: RF-03

Como supervisor, quiero que mis observaciones tomadas sin señal se suban solas al recuperar conexión, para no tener que capturarlas dos veces.

- [ ] Dado que tengo observaciones guardadas sin sincronizar, cuando el dispositivo recupera señal, entonces el sistema las sube automáticamente sin perder ninguna.
- [ ] Dado que una observación no logra sincronizarse por error, cuando reviso el estado, entonces el sistema me indica cuáles quedaron pendientes.

#### HU-06: Subir las evidencias solicitadas para mi zona

Requerimiento: RF-04

Como residente de obra, quiero ver la lista de evidencias que el sistema me solicita para mi zona y subir la foto de cada una, para no tener que decidir qué fotografiar ni dónde ubicarla.

- [ ] Dado que hay evidencias solicitadas para mi zona, cuando abro la lista, entonces veo cada punto pendiente (ej. "foto del alumbrado 1") con su ubicación en el plano y el ángulo desde el cual debe tomarse.
- [ ] Dado que subo una foto de un punto solicitado, cuando la guardo, entonces queda anclada a la ubicación de ese punto en el plano.
- [ ] Dado que intento subir una foto que no corresponde a ningún punto solicitado, cuando trato de guardarla, entonces el sistema no me lo permite.

#### HU-07: Consultar evidencias por zona del plano

Requerimiento: RF-04

Como supervisor, quiero revisar las fotos que están ancladas a una zona específica del plano, para darme cuenta de cómo va realmente esa parte de la construcción.

- [ ] Dado que una zona del plano tiene evidencias asociadas, cuando entro a esa zona, entonces se despliega la lista de fotos con la fecha y quién las subió.
- [ ] Dado que quiero acotar la búsqueda por fechas, cuando aplico ese filtro, entonces solo me aparecen las fotos tomadas dentro de ese rango.

#### HU-08: Registrar hallazgo con responsable

Requerimiento: RF-05

Como supervisor, quiero dejar registrado un hallazgo cada vez que noto que algo construido no coincide con lo que dice el plano, para que alguien se encargue de darle seguimiento y no se quede en el aire.

- [ ] Dado que encuentro una diferencia entre el plano y lo que está construido, cuando doy de alta el hallazgo, entonces tengo que indicar quién es el responsable y para cuándo se compromete a resolverlo.
- [ ] Dado que trato de guardar un hallazgo sin definir responsable o fecha compromiso, cuando le doy guardar, entonces el sistema no lo acepta así.

#### HU-09: Cerrar hallazgo con evidencia

Requerimiento: RF-06

Como residente de obra, quiero que un hallazgo solo se pueda cerrar si hay una evidencia real de que se resolvió, para que el cierre se pueda comprobar y no quede solo en la palabra de alguien.

- [ ] Dado que un hallazgo sigue abierto, cuando intento cerrarlo sin haber subido evidencia, entonces el sistema no me lo permite.
- [ ] Dado que subo una foto que demuestra la solución, cuando cierro el hallazgo, entonces queda guardada la fecha en que realmente se cerró.

#### HU-10: Tablero de hallazgos vencidos

Requerimiento: RF-07

Como coordinador de proyectos, quiero un tablero donde pueda ver los hallazgos abiertos y los que ya se vencieron por cada obra, para identificar dónde hace falta seguimiento sin tener que andar preguntando uno por uno.

- [ ] Dado que un hallazgo llegó a su fecha compromiso y sigue sin cerrarse, cuando reviso el tablero, entonces me aparece marcado como vencido.
- [ ] Dado que filtro el tablero por una obra en particular, cuando aplico ese filtro, entonces solo veo los hallazgos abiertos de esa obra junto con quién es el responsable de cada uno.

#### HU-11: Comparar elemento proyectado contra construido

Requerimiento: RF-08

Como supervisor, quiero ver un elemento del plano junto con su evidencia fotográfica y mis observaciones, para identificar y registrar posibles diferencias sin recurrir a mediciones manuales.

- [ ] Dado que existe evidencia asociada a un elemento del plano, cuando abro la comparación, entonces veo el elemento proyectado junto con sus fotografías y observaciones de supervisión.
- [ ] Dado que identifico una diferencia entre lo proyectado y lo construido, cuando la marco, entonces queda registrada como posible discrepancia para su revisión.
- [ ] Dado que no hay evidencia suficiente para realizar la comparación de ese elemento, cuando reviso el resultado, entonces el sistema me notifica la falta de evidencia en vez de emitir un veredicto forzado.

#### HU-12: Autorizar cambio de proyecto

Requerimiento: RF-09

Como cliente propietario, quiero autorizar un cambio de plano que tiene impacto en la obra, para asegurarme de que nada se construya sin mi consentimiento.

- [ ] Dado que hay un cambio de plano propuesto con impacto en obra, cuando lo examino, entonces cuento con la opción de aprobarlo o rechazarlo dentro del sistema.
- [ ] Dado que un cambio de plano sigue sin aprobación, cuando se intenta establecerlo como vigente, entonces el sistema impide dicha publicación.

#### HU-13: Consultar historial de versiones de un plano

Requerimiento: RF-10

Como proyectista, quiero consultar el historial completo de un plano y sus versiones, para poder justificar cómo se llegó a la versión vigente si me lo preguntan.

- [ ] Dado que un plano tiene múltiples versiones publicadas, cuando ingreso a su historial, entonces puedo visualizar cada una con su fecha, autor y motivo, en orden cronológico.
- [ ] Dado que una versión quedó marcada como obsoleta, cuando la localizo dentro del historial, entonces continúo teniendo acceso a ella, pues no fue eliminada.
- [ ] Dado que consulto una versión anterior, cuando la abro, entonces puedo ver sus medidas y datos de referencia sin tener que volver a levantarlos.

#### HU-14: Generar plano de obra terminada

Requerimiento: RF-11

Como coordinador de proyectos, quiero elaborar el registro de lo que realmente se construyó al finalizar la obra, para entregar un documento confiable sin depender de la memoria.

- [ ] Dado que la obra alcanza su fase de cierre, cuando genero el registro de obra terminada, entonces el sistema lo elabora tomando como base las versiones vigentes y los hallazgos que ya fueron cerrados.
- [ ] Dado que quedan hallazgos abiertos al momento del cierre, cuando se genera el registro, entonces el sistema los muestra en un listado aparte como pendientes, sin excluirlos.

#### HU-15: Descargar plano vigente ligero para celular

Requerimiento: RF-12

Como maestro de obra, quiero abrir el plano vigente en mi celular sin demoras ni fallas, para consultarlo de forma ágil durante la jornada en obra.

- [ ] Dado que accedo a un plano desde el celular mientras estoy en obra, cuando lo abro, entonces el sistema me proporciona una versión adaptada al dispositivo sin omitir la información indispensable para construir.
- [ ] Dado que el celular dispone de espacio de almacenamiento reducido, cuando descargo el plano vigente, entonces el sistema se ajusta a ese espacio disponible y me alerta en caso de que no sea suficiente.

#### HU-16: Consultar únicamente los planos del frente asignado

Requerimiento: RF-13

Como contratista externo, quiero ver únicamente los planos que corresponden al frente de trabajo que tengo asignado, para no confundirme con información de otras áreas y trabajar solamente con lo que me toca.

- [ ] Dado que ingreso al sistema como contratista externo, cuando consulto el apartado de planos, entonces el sistema me muestra únicamente los planos relacionados con mi frente de trabajo asignado.

- [ ] Dado que existen planos pertenecientes a otros frentes de trabajo, cuando intento consultarlos, entonces el sistema restringe su acceso y evita que pueda visualizarlos.

- [ ] Dado que mi frente de trabajo asignado cambia, cuando vuelvo a ingresar al sistema, entonces los planos disponibles se actualizan de acuerdo con mi nueva asignación.

#### HU-17: Abrir el plano vigente sin tener que esperar demasiado

Requerimiento: RNF-01

Como residente de obra, quiero que el plano vigente abra rápido desde mi celular, para poder consultarlo en el momento aunque la conexión a internet no sea muy buena.

- [ ] Dado que utilizo una conexión limitada a 1 Mbps, cuando abro el plano vigente desde un dispositivo móvil de referencia, entonces la mediana de 10 cargas es de 5 segundos o menos.

- [ ] Dado que necesito revisar información durante la jornada en obra, cuando abro el plano vigente, entonces este debe quedar disponible para su consulta sin retrasos mayores al tiempo establecido.

#### HU-18: Sincronizar capturas sin perder ninguna

Requerimiento: RNF-02

Como residente de obra, quiero que ninguna observación ni evidencia capturada sin señal se pierda al sincronizarse, para no tener que repetir el trabajo hecho en obra.

- [ ] Dado que se realizan 50 capturas de prueba sin conexión, cuando se recupera la señal y se realiza la sincronización, entonces las 50 capturas quedan registradas correctamente sin perder ninguna.

- [ ] Dado que la conexión se interrumpe durante la sincronización, cuando la señal regresa, entonces el sistema la reanuda sin perder ni duplicar ninguna captura.

- [ ] Dado que hay capturas pendientes de sincronizar, cuando se cierra la aplicación o se reinicia el dispositivo, entonces las capturas siguen guardadas y se sincronizan al recuperar la señal.

#### HU-19: Anclar una fotografía al plano de forma sencilla

Requerimiento: RNF-03

Como residente de obra que apenas empieza a utilizar el sistema, quiero tomar una fotografía y colocarla en el punto correspondiente del plano de manera sencilla, para registrar evidencias sin tener que aprender un proceso complicado.

- [ ] Dado que estoy utilizando la cámara del dispositivo, cuando tomo una fotografía como evidencia, entonces el sistema debe permitirme relacionarla con un punto del plano.

- [ ] Dado que 5 residentes sin capacitación previa realizan el proceso para anclar una fotografía al plano, cuando se cuentan sus pasos desde abrir la cámara, entonces al menos 4 de 5 lo completan en un máximo de 3 pasos.

- [ ] Dado que selecciono el punto correspondiente dentro del plano, cuando confirmo la fotografía, entonces esta debe quedar guardada y asociada correctamente a esa ubicación.

#### HU-20: Definir el catálogo de evidencias de una obra

Requerimiento: RF-04

Como proyectista, quiero definir qué evidencias fotográficas se solicitan en cada zona de la obra (ej. "alumbrado 1", "ventana V4"), para que el residente sepa exactamente qué fotografías debe subir.

- [ ] Dado que tengo un plano con zonas definidas, cuando agrego un punto de evidencia con su nombre, ubicación y ángulo de toma, entonces queda registrado en el catálogo de esa obra.
- [ ] Dado que un punto de evidencia ya tiene fotografías, cuando intento eliminarlo del catálogo, entonces el sistema me advierte antes de hacerlo.

#### HU-21: Validar avance en sitio

Requerimiento: RF-14

Como supervisor autorizado, quiero validar en sitio el avance que reporta el residente, para que solo se considere real el avance comprobado.

- [ ] Dado que hay un avance reportado con sus evidencias, cuando lo reviso en sitio y lo valido, entonces queda registrado quién lo validó y cuándo.
- [ ] Dado que un avance no ha sido validado, cuando consulto el estado de la obra, entonces aparece como pendiente de validación y no como avance real.
- [ ] Dado que no soy una persona autorizada, cuando intento validar un avance, entonces el sistema no me lo permite.
- [ ] Dado que el avance tiene una diferencia registrada sin revisar, cuando intento validarlo, entonces el sistema no me lo permite hasta que se revise.

#### HU-22: Contrastar avance contra consumo de materiales

Requerimiento: RF-15

Como coordinador de proyectos, quiero ver si el avance reportado es coherente con el consumo de materiales, para detectar avances que no están respaldados por materiales usados.

- [ ] Dado que hay avance reportado y consumo de materiales registrado, cuando reviso el contraste, entonces veo si ambos son consistentes.
- [ ] Dado que el avance reportado no coincide con el consumo de materiales, cuando reviso el contraste, entonces el sistema lo señala como posible inconsistencia.

#### HU-23: Identificar medidas, áreas, niveles, materiales y anotaciones del plano

Requerimiento: RF-03

Como residente de obra, quiero identificar las medidas, áreas, niveles, materiales y anotaciones de un plano, para entender correctamente su información antes de construir.

- [ ] Dado que abro el plano vigente, cuando selecciono un área o elemento, entonces veo sus medidas, área, nivel, materiales y anotaciones.
- [ ] Dado que estoy sin conexión, cuando consulto esos datos en un plano descargado, entonces los veo igual que con conexión.

#### HU-24: Notificar al encargado cuando se registra un hallazgo

Requerimiento: RF-05

Como persona encargada de la obra, quiero recibir un aviso cuando se registra un hallazgo, para atenderlo a tiempo.

- [ ] Dado que se registra un hallazgo, cuando se guarda, entonces se notifica a la persona encargada de la obra.
- [ ] Dado que no hay una persona encargada definida, cuando se registra el hallazgo, entonces se notifica al representante asignado.

#### HU-25: Generar reporte PDF de un hallazgo

Requerimiento: RF-05

Como supervisor, quiero generar un reporte en PDF de un hallazgo, para documentar la discrepancia y poder compartirla.

- [ ] Dado que existe un hallazgo, cuando genero su reporte, entonces obtengo un PDF con la descripción del problema, su ubicación en la obra o el plano y fotografías como evidencia.
- [ ] Dado que genero un reporte, cuando lo abro, entonces incluye el nombre de la persona que lo generó.

#### HU-26: Restringir quién puede modificar planos

Requerimiento: RF-01

Como coordinador de proyectos, quiero que solo personas autorizadas puedan publicar o modificar planos, para evitar cambios hechos por quien no corresponde.

- [ ] Dado que no soy una persona autorizada, cuando intento publicar o modificar un plano, entonces el sistema no me lo permite.
- [ ] Dado que soy una persona autorizada, cuando publico o modifico un plano, entonces el sistema me lo permite y queda registrado quién lo hizo.

#### HU-27: Revisar y autorizar un plano antes de publicarlo

Requerimiento: RF-09

Como persona autorizada, quiero revisar un plano antes de que se publique, para aprobarlo o rechazarlo.

- [ ] Dado que hay un plano pendiente de publicación, cuando lo reviso, entonces puedo aprobarlo o rechazarlo.
- [ ] Dado que un plano no ha sido aprobado, cuando se intenta publicarlo como vigente, entonces el sistema lo impide.
- [ ] Dado que rechazo un plano, cuando confirmo el rechazo, entonces debo indicar el motivo.

#### HU-28: Registrar quién solicita y quién autoriza un cambio

Requerimiento: RF-09

Como coordinador de proyectos, quiero saber quién solicitó y quién autorizó cada cambio de plano, para tener claro el proceso de autorización.

- [ ] Dado que se solicita un cambio de plano, cuando se registra la solicitud, entonces queda guardado quién la solicitó y cuándo.
- [ ] Dado que un cambio de plano es autorizado o rechazado, cuando reviso su historial, entonces veo quién lo resolvió y en qué fecha.

#### HU-29: Publicar planos en formato AutoCAD y PDF

Requerimiento: RF-01

Como proyectista, quiero publicar planos en formato AutoCAD y PDF, para que todos puedan consultarlos aunque no tengan AutoCAD.

- [ ] Dado que subo un plano en AutoCAD o PDF, cuando confirmo la publicación, entonces el sistema lo acepta.
- [ ] Dado que publico un plano en AutoCAD, cuando termina la publicación, entonces existe también una versión en PDF que todos pueden abrir.
