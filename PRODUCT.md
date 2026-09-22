# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Users

Alumnos de la Universidad Autónoma de Tamaulipas (UAT) que quieren relacionarse con otros alumnos y coordinar viajes compartidos dentro de su comunidad universitaria.

## Product Purpose

Hopn es una red social universitaria cuyo mecanismo central es compartir viajes. Permite que alumnos verificados se encuentren, alternen entre los roles de conductor y pasajero, publiquen viajes y reserven lugares. El éxito significa que la comunidad pueda crear conexiones útiles y coordinar traslados con identidad institucional verificada.

## Positioning

Hopn combina una red limitada a alumnos con la coordinación de viajes compartidos. Su diferencia verificable es que vincula cada cuenta con la identidad institucional de la UAT y descarta las credenciales universitarias después de comprobarla, en lugar de admitir perfiles universitarios sin validar.

## Operating Context

- Los alumnos usan la aplicación móvil para coordinar traslados relacionados con su vida universitaria.
- Una misma persona puede actuar como conductor o pasajero y cambiar de modalidad según el viaje.
- Los flujos actuales contemplan registro, inicio de sesión, verificación institucional, publicación y búsqueda de viajes, reservas y consulta de viajes propios.
- El producto depende de una API de Hopn que delega la comprobación institucional a un servicio independiente conectado con los portales escolares de la UAT.

## Capabilities and Constraints

- Aplicación móvil desarrollada con React Native, Expo y Expo Router, dirigida a Android e iOS.
- Experiencia y contenido en español.
- La comunidad inicial está limitada a alumnos de la UAT.
- La identidad institucional se verifica con credenciales UAT; Hopn no persiste la contraseña institucional.
- El cliente móvil consume únicamente la API de Hopn. La integración con los portales UAT permanece detrás del backend.
- Las funciones sociales que vayan más allá de compartir viajes aún no están definidas y no deben inventarse sin una decisión de producto.

## Brand Commitments

- `Hopn` es el nombre presente en la interfaz y en el identificador Android existente.
- El tono debe ser directo, cercano y adecuado para alumnos universitarios.
- El nombre visible de Expo todavía figura como `Carpooling`; unificarlo con `Hopn` queda como decisión abierta.

## Evidence on Hand

- La aplicación contiene flujos funcionales de autenticación, registro y verificación institucional en `src/features/auth`.
- Los roles intercambiables de conductor y pasajero están representados en `src/features/mobility`.
- La API documenta búsqueda y publicación de viajes, reservas y viajes propios en el repositorio hermano `backend`.
- La integración institucional y sus controles de sesión están implementados en el repositorio hermano `scrap-uat-service`.
- Los recursos gráficos actuales están en `assets`.
- No hay investigación de usuarios, testimonios, métricas de adopción ni afirmaciones comerciales documentadas; no deben fabricarse.

## Product Principles

1. Tratar cada viaje como una interacción entre miembros de una comunidad universitaria, no como una transacción anónima.
2. Construir confianza mediante identidad institucional verificada y manejo mínimo de credenciales.
3. Permitir que cada alumno cambie con facilidad entre conducir y viajar como pasajero.
4. Mantener la coordinación clara y breve para que funcione durante la rutina universitaria.
5. Incorporar nuevas funciones sociales solo cuando fortalezcan conexiones reales entre alumnos y la coordinación de viajes.

## Accessibility & Inclusion

- La interfaz debe conservar soporte para temas claro y oscuro.
- Los controles deben mantener etiquetas accesibles, estados de error comprensibles y áreas táctiles adecuadas para uso móvil.
- La experiencia debe servir tanto a alumnos que conducen como a quienes dependen de otros para trasladarse.
