---
name: Hopn
description: Red social universitaria cálida y accesible para compartir rutas entre alumnos verificados.
colors:
  light-background: "#F3F8F7"
  light-surface: "#FFFFFF"
  light-surface-elevated: "#EAF4F2"
  light-text: "#102321"
  light-text-secondary: "#4F6662"
  light-text-muted: "#718580"
  light-border: "#D5E5E2"
  light-border-strong: "#8AA9A3"
  light-accent-start: "#3BCBB9"
  light-accent-end: "#40B9ED"
  light-accent-strong: "#087F75"
  dark-background: "#101114"
  dark-surface: "#181A1D"
  dark-surface-elevated: "#202328"
  dark-text: "#F7F7F8"
  dark-text-secondary: "#B8BBC1"
  dark-text-muted: "#858991"
  dark-border: "#2A2D33"
  dark-border-strong: "#555A64"
  dark-accent-start: "#FFA263"
  dark-accent-end: "#703297"
  disabled-light: "#D9ECE8"
  disabled-dark: "#2A2D33"
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
    backgroundColor: "{colors.light-accent-start}"
    textColor: "{colors.light-text}"
    typography: "{typography.body-small}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "52px"
  button-primary-dark:
    backgroundColor: "{colors.dark-accent-end}"
    textColor: "{colors.dark-text}"
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

El sistema usa una base neutral teñida suavemente en modo claro y gris grafito en modo oscuro. Un degradado aqua a azul (`#3BCBB9` → `#40B9ED`) identifica el modo claro; el modo oscuro usa naranja a violeta (`#FFA263` → `#703297`). Los degradados se reservan para logo, selección y acciones principales.

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

- **Ruta Aqua** (`#3BCBB9` → `#40B9ED`): logo, selección y acciones principales en modo claro.
- **Ruta Atardecer** (`#FFA263` → `#703297`): logo, selección y acciones principales en modo oscuro; una capa oscura preserva el contraste del texto.

### Neutral

- **Papel de Campus** (`#F3F8F7`): fondo general en modo claro.
- **Superficie Abierta** (`#FFFFFF`): tarjetas y contenedores principales en modo claro.
- **Noche de Ruta** (`#101114`): fondo gris grafito general en modo oscuro.
- **Parada Nocturna** (`#181A1D`): tarjetas y contenedores gris oscuro.
- **Texto Secundario** (`#4F6662` en claro; `#B8BBC1` en oscuro): apoyo, instrucciones y metadatos.
- **Línea Suave** (`#D5E5E2` en claro; `#2A2D33` en oscuro): delimitación sin elevar visualmente las superficies.

### Named Rules

**The Accent-at-the-Junction Rule.** El degradado aparece en logo, selección y acciones principales; no cubre fondos completos ni compite con el contenido.

**The Gradient Border Rule.** Un fondo degradado no usa borde de acento: queda sin borde o con borde gris. El naranja o aqua en bordes se reserva para foco y selección sobre superficies grises.

**The Disabled-is-Subtle Rule.** En modo claro, los botones deshabilitados usan un aqua tenue y texto legible. En modo oscuro conservan un gris sólido. El degradado aparece únicamente cuando la acción está habilitada.

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
- **Primary:** degradado aqua–azul con texto oscuro en claro; degradado naranja–violeta oscurecido con texto blanco en oscuro. No lleva borde de acento.
- **Pressed / Disabled:** opacidad 0.72 al presionar. Deshabilitado usa gris sólido y texto atenuado, sin degradado.
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
- **Focus:** el borde pasa al acento sólido del tema sin añadir resplandor.
- **Error:** borde y mensaje rojos; el texto introducido conserva el color primario.
- **Labels:** mayúsculas discretas sobre el campo, nunca como placeholder único.

### Checkbox

- **Style:** caja de 24 con radio 6 y borde fuerte.
- **Selected:** relleno degradado, borde gris e icono de confirmación con contraste comprobado.

### Authentication Shell

- **Style:** composición centrada y desplazable, con logo, título, texto de apoyo, tarjeta de formulario y pie.
- **Behavior:** respeta teclado y área segura; el contenido no supera 440 de ancho.

## Do's and Don'ts

### Do:

- **Do** usa capas tonales y bordes para separar contenido.
- **Do** conserva objetivos táctiles de al menos 48 en Android y 44 en iOS.
- **Do** reserva el color semántico para estados y el degradado para acentos clave habilitados.
- **Do** usa bordes naranja o aqua únicamente sobre fondos grises.
- **Do** prueba cada pantalla en claro y oscuro con texto ampliado.
- **Do** permite que el contenido respire mediante la escala espacial existente.

### Don't:

- **Don't** cubras fondos completos con degradados ni los uses en cada control.
- **Don't** combines un fondo degradado con un borde naranja o aqua.
- **Don't** muestres degradado en botones deshabilitados.
- **Don't** añadas sombras para compensar una jerarquía tonal débil.
- **Don't** anides tarjetas sin una necesidad funcional clara.
- **Don't** introduzcas radios, colores o tamaños fuera de las escalas documentadas.
- **Don't** uses gris de bajo contraste sobre superficies coloreadas.
