---
name: Hopn
description: Red social universitaria cálida y accesible para compartir rutas entre alumnos verificados.
colors:
  light-background: "#F4F4F5"
  light-surface: "#FFFFFF"
  light-surface-elevated: "#FAFAFA"
  light-text: "#18181B"
  light-text-secondary: "#71717A"
  light-text-muted: "#A1A1AA"
  light-border: "#E4E4E7"
  light-border-strong: "#A1A1AA"
  dark-background: "#0F0F12"
  dark-surface: "#16161D"
  dark-surface-elevated: "#1D1D25"
  dark-text: "#FFFFFF"
  dark-text-secondary: "#A1A1AA"
  dark-text-muted: "#71717A"
  dark-border: "#262631"
  dark-border-strong: "#52525B"
  success: "#22C55E"
  danger: "#EF4444"
  warning: "#F59E0B"
typography:
  display:
    fontFamily: "system-ui"
    fontSize: "28px"
    fontWeight: 700
  headline:
    fontFamily: "system-ui"
    fontSize: "17px"
    fontWeight: 600
  body:
    fontFamily: "system-ui"
    fontSize: "15px"
    fontWeight: 400
  body-small:
    fontFamily: "system-ui"
    fontSize: "13px"
    fontWeight: 400
  label:
    fontFamily: "system-ui"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.8px"
  caption:
    fontFamily: "system-ui"
    fontSize: "10px"
    fontWeight: 600
    letterSpacing: "1.6px"
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  full: "9999px"
spacing:
  none: "0px"
  xxs: "2px"
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary-light:
    backgroundColor: "{colors.light-text}"
    textColor: "{colors.light-surface}"
    typography: "{typography.body-small}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "52px"
  button-primary-dark:
    backgroundColor: "{colors.dark-text}"
    textColor: "{colors.light-text}"
    typography: "{typography.body-small}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "52px"
  button-outline-light:
    backgroundColor: "transparent"
    textColor: "{colors.light-text}"
    typography: "{typography.body-small}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "52px"
  input-light:
    backgroundColor: "{colors.light-background}"
    textColor: "{colors.light-text}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "52px"
  input-dark:
    backgroundColor: "{colors.dark-background}"
    textColor: "{colors.dark-text}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "52px"
  auth-card-light:
    backgroundColor: "{colors.light-surface}"
    textColor: "{colors.light-text}"
    rounded: "{rounded.md}"
    padding: "16px"
  auth-card-dark:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.dark-text}"
    rounded: "{rounded.md}"
    padding: "16px"
---

# Design System: Hopn

## Overview

**Creative North Star: "Rutas en común"**

Hopn debe sentirse como un punto de encuentro entre alumnos que ya comparten universidad, horarios y trayectos. Su interfaz es cercana y social, con controles cálidos y accesibles, pero conserva la precisión necesaria para tratar identidad, reservas y coordinación de viajes.

El sistema vigente usa una base neutral de alto contraste. La evolución cromática confirmada añadirá un degradado aqua a azul (`#14B8A6` → `#0EA5E9`) en modo claro y naranja a violeta (`#FFA263` → `#703297`) en modo oscuro. Esos degradados se reservarán para acentos clave y solo pasarán a ser tokens normativos cuando estén implementados en el tema.

La profundidad se expresa con cambios tonales, bordes finos y jerarquía espacial. Las sombras no forman parte del lenguaje base.

**Key Characteristics:**

- Cercano, social y universitario.
- Contraste claro y lectura inmediata.
- Controles cálidos, accesibles y de geometría contenida.
- Capas planas diferenciadas por tono y borde.
- Color expresivo reservado para momentos de identidad y acción.

## Colors

La paleta implementada es neutral y adaptable a los modos claro y oscuro, con colores semánticos reservados para estados.

### Primary

- **Tinta de Encuentro** (`#18181B`): acción principal, texto de mayor jerarquía y marca en modo claro.
- **Luz de Encuentro** (`#FFFFFF`): acción principal y texto de mayor jerarquía en modo oscuro.

### Neutral

- **Papel de Campus** (`#F4F4F5`): fondo general y fondo de campos en modo claro.
- **Superficie Abierta** (`#FFFFFF`): tarjetas y contenedores principales en modo claro.
- **Noche de Ruta** (`#0F0F12`): fondo general y fondo de campos en modo oscuro.
- **Parada Nocturna** (`#16161D`): tarjetas y contenedores principales en modo oscuro.
- **Texto Secundario** (`#71717A` en claro; `#A1A1AA` en oscuro): apoyo, instrucciones y metadatos.
- **Línea Suave** (`#E4E4E7` en claro; `#262631` en oscuro): delimitación sin elevar visualmente las superficies.

### Named Rules

**The Accent-at-the-Junction Rule.** El degradado futuro aparece en logo, selección y acciones principales; no cubre fondos completos ni compite con el contenido.

**The Semantic Color Rule.** Verde, rojo y ámbar comunican éxito, error y advertencia. No se usan como decoración.

## Typography

**Display Font:** tipografía del sistema (`system-ui`)
**Body Font:** tipografía del sistema (`system-ui`)

**Character:** La tipografía nativa mantiene el producto familiar en Android e iOS. La personalidad proviene de la jerarquía, el espaciado y el contenido, sin introducir una familia ajena a los patrones de cada plataforma.

### Hierarchy

- **Display** (700, 28): títulos principales de autenticación y encabezados de alto nivel.
- **Headline** (600, 17): títulos de sección, selección y diálogos.
- **Body** (400, 15): contenido, campos y explicaciones principales.
- **Body Small** (400–500, 13): botones, enlaces, metadatos y mensajes de estado.
- **Label** (500, 11, espaciado 0.8): etiquetas breves de campo en mayúsculas.
- **Caption** (600, 10, espaciado 1.6): insignias y separadores de contexto.

### Named Rules

**The Native Voice Rule.** Mantén la tipografía del sistema y respeta el escalado de texto; no fijes una fuente web como sustituto de la voz nativa.

## Layout

El sistema usa una escala espacial de 2, 4, 8, 16, 24, 32 y 48. Los formularios siguen un ritmo base de 16, con 8 entre elementos relacionados y 24–32 para separar bloques completos. El contenido de autenticación se centra dentro de un ancho máximo de 440 y respeta las áreas seguras.

Los controles principales miden 52 de alto. Las pantallas deben mantener al menos 16 de margen lateral en teléfonos y aprovechar espacio adicional sin ensanchar formularios más allá de su medida legible. En tablets, el contenido permanece contenido en lugar de estirarse de borde a borde.

**The Shared-Rhythm Rule.** Los elementos que describen una misma decisión usan 8; los pasos o secciones distintas usan 16 o 24.

## Elevation & Depth

Hopn es plano por defecto. La profundidad surge al colocar superficies blancas o zinc oscuro sobre fondos ligeramente distintos, reforzadas por bordes de un píxel. Los estados activos pueden aumentar el contraste del borde o del tono, pero no añaden sombras ornamentales.

**The Tonal-Layers Rule.** Cada nivel debe poder distinguirse mediante tono y borde; si necesita una sombra para ser comprensible, la jerarquía de superficie todavía no está resuelta.

## Shapes

Las esquinas son suaves y contenidas: 6 para controles, 10 para tarjetas y 16 para contenedores destacados. La forma de píldora se reserva para insignias, estados y elementos compactos. Los bordes son finos y continuos; no se mezclan radios arbitrarios dentro de un mismo bloque.

## Components

### Buttons

- **Shape:** rectángulo suavemente curvado (radio 6), altura 52 y relleno horizontal 16.
- **Primary:** inversión de alto contraste; tinta sobre luz en oscuro y luz sobre tinta en claro.
- **Pressed / Disabled:** opacidad 0.72 al presionar y 0.45 al deshabilitar.
- **Outline / Social:** fondo transparente con borde fuerte o suave según jerarquía.

### Badges

- **Style:** píldora compacta, borde suave, fondo tonal y texto de 10 con espaciado amplio.
- **Marker:** punto de 4 que vincula visualmente el estado con su etiqueta.

### Cards / Containers

- **Corner Style:** curva media (radio 10).
- **Background:** superficie neutral específica de cada tema.
- **Shadow Strategy:** ninguna; usa capa tonal y borde.
- **Border:** un píxel en el color neutral correspondiente.
- **Internal Padding:** 16.

### Inputs / Fields

- **Style:** altura 52, radio 6, fondo igual al lienzo y borde neutral.
- **Focus:** el borde pasa al neutral fuerte sin añadir resplandor.
- **Error:** borde y mensaje rojos; el texto introducido conserva el color primario.
- **Labels:** mayúsculas discretas sobre el campo, nunca como placeholder único.

### Checkbox

- **Style:** caja de 24 con radio 6 y borde fuerte.
- **Selected:** relleno de alto contraste e icono de confirmación invertido.

### Authentication Shell

- **Style:** composición centrada y desplazable, con logo, título, texto de apoyo, tarjeta de formulario y pie.
- **Behavior:** respeta teclado y área segura; el contenido no supera 440 de ancho.

## Do's and Don'ts

### Do:

- **Do** usa capas tonales y bordes para separar contenido.
- **Do** conserva objetivos táctiles de al menos 48 en Android y 44 en iOS.
- **Do** reserva el color semántico para estados y el degradado futuro para acentos clave.
- **Do** prueba cada pantalla en claro y oscuro con texto ampliado.
- **Do** permite que el contenido respire mediante la escala espacial existente.

### Don't:

- **Don't** cubras fondos completos con degradados ni los uses en cada control.
- **Don't** añadas sombras para compensar una jerarquía tonal débil.
- **Don't** anides tarjetas sin una necesidad funcional clara.
- **Don't** introduzcas radios, colores o tamaños fuera de las escalas documentadas.
- **Don't** uses gris de bajo contraste sobre superficies coloreadas.
