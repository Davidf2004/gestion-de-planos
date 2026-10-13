# Riesgos: Modulo Gestión de planos

Formato esperado pa que suban sus riesgos (una fila por riesgo, al final de la tabla, con el siguiente identificador):

```
| RIE-XX | Título corto del riesgo | Debido a <causa> | puede ocurrir <consecuencia> | <Baja | Media | Alta> | <Bajo | Medio | Alto> | <Evitar | Mitigar | Transferir | Aceptar> | <acción concreta de respuesta> | <usuario de GitHub> |
```

- **Causa y consecuencia:** se redactan siempre como "Debido a ..." y "puede ocurrir ...", en columnas separadas.
- **Probabilidad:** qué tan posible es que ocurra (Baja, Media o Alta).
- **Impacto:** qué tanto daña al proyecto si ocurre (Bajo, Medio o Alto).
- **Tipo de respuesta:** Evitar (se elimina la causa), Mitigar (se reduce la probabilidad o el impacto), Transferir (otra parte lo asume) o Aceptar (se acepta y se vigila).
- **Responsable:** una sola persona, con su usuario de GitHub.
- Los riesgos que se ejecutan en un ciclo pasan al tablero como issue con el mismo identificador (`RIE-XX: título`).

## Registro de riesgos

| ID     | Riesgo                                  | Causa                                                                                                                      | Consecuencia                                                                                         | Probabilidad | Impacto | Tipo de respuesta | Respuesta                                                                                                                                   | Responsable    |
| ------ | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------ | ------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| RIE-01 | Sobrecarga de horas                     | Debido a que el módulo completo se estima en 168 horas y el equipo es de cuatro personas con otras materias                | puede ocurrir que no se terminen los requerimientos esenciales dentro del ciclo                      | Alta         | Alto    | Mitigar           | Limitar lo que se desarrolla sí o sí a RF-01 a RF-06 (82 h), dejar el resto en prioridad media o baja y revisar el avance a mitad del ciclo | dxvm0n         |
| RIE-02 | Requerimientos incompletos o cambiantes | Debido a que la entrevista con los arquitectos dejó dudas abiertas (costos, suministros, programa de obra, tipos de plano) | puede ocurrir que haya que rehacer requerimientos e historias ya estimados                           | Media        | Alto    | Mitigar           | Validar el backlog con los arquitectos y aclarar los puntos pendientes antes de cerrar el ciclo                                             | dxvm0n         |
| RIE-03 | Poca disponibilidad de un integrante    | Debido a que la carga académica de las demás materias puede impedir que un integrante avance en sus tarjetas               | puede ocurrir que las tarjetas queden sin avance y el ciclo se retrase                               | Media        | Medio   | Mitigar           | Revisar el tablero a mitad del ciclo y reasignar las tarjetas que no avancen                                                                | Davidf2004     |
| RIE-04 | Desconocimiento del dominio de obra     | Debido a que el equipo no domina los términos ni los procesos de una obra (puntos de evidencia, frentes, niveles)          | puede ocurrir que se interpreten mal las historias y se construya algo que el arquitecto no necesita | Media        | Medio   | Mitigar           | Armar un glosario de términos de obra y consultar las dudas con los arquitectos antes de implementar                                        | MarcosAriciaga |
| RIE-05 | Conflictos al subir cambios             | Debido a que varios integrantes editan los mismos documentos al mismo tiempo y ya ocurrió un merge que perdió contenido    | puede ocurrir que se pierda trabajo o se gaste tiempo resolviendo conflictos                         | Alta         | Medio   | Mitigar           | Trabajar en ramas por tarea, hacer pull antes de subir y entregar cambios pequeños por pull request                                         | Tedtar25       |
| RIE-06 | Entrega fuera de tiempo                 | Debido a una mala coordinación de fechas o a que el trabajo se acumula al final del ciclo                                  | puede ocurrir que la entrega llegue tarde y se descuenten puntos a todo el equipo                    | Media        | Alto    | Evitar            | Mantener visibles las fechas de entrega en el tablero y cerrar las tarjetas antes del último día del ciclo                                  | Davidf2004     |
