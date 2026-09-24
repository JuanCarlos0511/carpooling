# Ejecutar Carpooling en Expo Go por ADB inalámbrico

Este flujo inicia el servicio de scraping, el backend y Metro; configura el reenvío de puertos ADB y abre el proyecto en Expo Go en el teléfono. Mantén esta terminal abierta mientras usas la aplicación. Al presionar `Ctrl+C`, Metro y los servicios que inició el script se detienen.

## Requisitos

- Node.js y npm instalados.
- Android Platform Tools (`adb`) instaladas y disponibles en `PATH`.
- El teléfono y la computadora emparejados mediante Depuración inalámbrica de Android.
- Expo Go instalado en el teléfono.
- Los repositorios `carpooling`, `backend` y `scrap-uat-service` como carpetas hermanas.

Comprueba la conexión inalámbrica:

```bash
adb devices -l
```

El teléfono debe aparecer con estado `device`. Si ADB todavía no muestra el teléfono, empareja desde **Opciones de desarrollador → Depuración inalámbrica** y conecta con el puerto que Android indica:

```bash
adb pair IP_DEL_TELEFONO:PUERTO_DE_EMPAREJAMIENTO
adb connect IP_DEL_TELEFONO:PUERTO_ADB
```

Los puertos de emparejamiento y de conexión pueden ser distintos. No hace falta conectar un cable USB.

## Iniciar todo y abrir Expo Go

Desde la carpeta `carpooling`:

```bash
npm run start:expo-go
```

El script `scripts/dev-usb.sh` detecta el teléfono conectado, inicia los servicios que no estén activos, ejecuta `adb reverse` para Metro (`8081`) y el backend (`3200`), arranca Expo en modo Expo Go y abre el enlace directamente en Expo Go. Metro entrega el bundle y Fast Refresh queda activo.

Si ADB muestra más de un dispositivo, especifica el serial que aparece en `adb devices -l`:

```bash
ADB_SERIAL=192.168.1.90:35509 npm run start:expo-go
```

Para volver a cargar la app, pulsa `r` en la terminal de Metro. Para detener la sesión, pulsa `Ctrl+C`.

## Diagnóstico rápido

```bash
adb devices -l
adb -s SERIAL_DEL_TELEFONO reverse --list
curl -fsS http://127.0.0.1:8081/status
curl -fsS http://127.0.0.1:3200/health
curl -fsS http://127.0.0.1:3100/health/ready
```

Los logs de los servicios se escriben en `/tmp/hopn-backend.log` y `/tmp/hopn-scrap-uat-service.log`. Si Expo Go ya estaba abierto, el script vuelve a abrir la URL del proyecto en esa aplicación.

## Límite de Expo Go y el mapa

Expo Go no incluye el módulo nativo MapLibre de este proyecto. Al detectar Expo Go, la app usa el mapa alternativo disponible en JavaScript; MapLibre se ejecuta en la build de desarrollo nativa. Para trabajar con el módulo nativo se puede iniciar esa build con `npm run start:adb` (requiere que la build de desarrollo esté instalada).
