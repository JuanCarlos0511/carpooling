# Método de trabajo del proyecto

## Convención de commits

- `fix:` corrige defectos de comportamiento, presentación o integración existentes.
- `ui:` agrega una pantalla, componente o estructura visual funcional nueva.
- `ui-enhance:` mejora detalles puramente visuales o decorativos que no cambian la funcionalidad, como animaciones, transiciones y pulido estético.
- Cada cambio debe quedar en un commit pequeño, independiente y fácil de revisar.
- Cuando una solicitud combine una corrección y una mejora visual, crear primero el commit `fix:` y después el commit `ui-enhance:`.
- No mezclar refactors ni cambios no relacionados dentro de esos commits.
