# Ejecutar Carpooling en Expo Go por ADB inalámbrico

Este flujo inicia Metro, configura el reenvío de su puerto por ADB y abre el proyecto en el teléfono. La aplicación usa el backend remoto indicado en su configuración. Mantén esta terminal abierta mientras usas la aplicación.

## Requisitos

- Node.js y npm instalados.
- Android Platform Tools (`adb`) instaladas y disponibles en `PATH`.
- El teléfono y la computadora emparejados mediante Depuración inalámbrica de Android.
- Expo Go instalado en el teléfono.
- El backend remoto accesible por HTTPS desde el teléfono.

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

## Elegir la API

El archivo `.env` contiene la URL de producción. Para usar la instancia debug, copia `.env.debug.example` a `.env.debug` y cambia `EXPO_PUBLIC_API_URL` por el dominio HTTPS de tu backend debug. Mientras exista `.env.debug`, `npm run start:adb` y `npm run start:expo-go` usarán esa URL. Para volver a producción, quita o renombra `.env.debug` y reinicia Expo.

El seed se ejecuta manualmente en el contenedor `backend-debug` de Dokploy con `npm run seed:demo`. El arranque de la app no inicia ni necesita backend, scraper o PostgreSQL locales.

## Iniciar y abrir Expo Go

Desde la carpeta `carpooling`:

```bash
npm run start:expo-go
```

El script `scripts/dev-usb.sh` detecta el teléfono conectado, ejecuta `adb reverse` solo para Metro (`8081`), arranca Expo en modo Expo Go y abre el enlace directamente en Expo Go. Metro entrega el bundle y Fast Refresh queda activo. Para la build de desarrollo usa `npm run start:adb`.

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
curl -fsS https://backendaventon-debug.452111.xyz/health
```

Sustituye el dominio de ejemplo por el que hayas configurado en Dokploy. Si Expo Go ya estaba abierto, el script vuelve a abrir la URL del proyecto en esa aplicación.

## Límite de Expo Go y el mapa

Expo Go no incluye el módulo nativo MapLibre de este proyecto. Al detectar Expo Go, la app usa el mapa alternativo disponible en JavaScript; MapLibre se ejecuta en la build de desarrollo nativa. Para trabajar con el módulo nativo se puede iniciar esa build con `npm run start:adb` (requiere que la build de desarrollo esté instalada).
