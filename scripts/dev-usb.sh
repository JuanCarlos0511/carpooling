#!/usr/bin/env bash

set -Eeuo pipefail

APP_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
OPEN_APP_PID=
DEBUG_API_URL=

cleanup() {
  local exit_code=$?
  trap - EXIT INT TERM

  if [[ -n "$OPEN_APP_PID" ]]; then
    kill "$OPEN_APP_PID" 2>/dev/null || true
    wait "$OPEN_APP_PID" 2>/dev/null || true
  fi

  exit "$exit_code"
}

trap cleanup EXIT INT TERM

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Error: falta el comando '$1'." >&2
    exit 1
  fi
}

require_command adb
require_command curl
require_command npm

if [[ -f "$APP_DIR/.env.debug" ]]; then
  while IFS= read -r line || [[ -n "$line" ]]; do
    if [[ "$line" == EXPO_PUBLIC_API_URL=* ]]; then
      DEBUG_API_URL="${line#EXPO_PUBLIC_API_URL=}"
    fi
  done < "$APP_DIR/.env.debug"
  if [[ "$DEBUG_API_URL" != https://* ]]; then
    echo "Error: configura EXPO_PUBLIC_API_URL con el dominio HTTPS del backend debug en .env.debug." >&2
    exit 1
  fi
  echo "✓ API debug: $DEBUG_API_URL"
fi

if [[ -z "${ADB_SERIAL:-}" ]]; then
  mapfile -t CONNECTED_DEVICES < <(adb devices | awk 'NR > 1 && $2 == "device" { print $1 }')
  if ((${#CONNECTED_DEVICES[@]} == 0)); then
    echo "Error: ADB no detecta un teléfono autorizado." >&2
    echo "Conéctalo por Wi-Fi y verifica que aparezca como 'device' con: adb devices -l" >&2
    exit 1
  elif ((${#CONNECTED_DEVICES[@]} > 1)); then
    echo "Error: hay varios dispositivos ADB. Elige uno con ADB_SERIAL=..." >&2
    printf '  %s\n' "${CONNECTED_DEVICES[@]}" >&2
    exit 1
  fi
  ADB_SERIAL="${CONNECTED_DEVICES[0]}"
fi

if ! adb -s "$ADB_SERIAL" get-state 2>/dev/null | grep -qx device; then
  echo "Error: el dispositivo '$ADB_SERIAL' no está conectado o autorizado en ADB." >&2
  exit 1
fi
echo "✓ Android conectado: $ADB_SERIAL"
if [[ "$ADB_SERIAL" == *:* ]]; then
  echo "✓ ADB conectado por Wi-Fi"
fi

EXPO_CLIENT="${EXPO_CLIENT:-dev-client}"
if [[ "$EXPO_CLIENT" == "expo-go" ]]; then
  if ! adb -s "$ADB_SERIAL" shell pm path host.exp.exponent >/dev/null 2>&1; then
    echo "Error: Expo Go no está instalado en el teléfono." >&2
    exit 1
  fi
  APP_PACKAGE="host.exp.exponent"
  APP_URL="exp://127.0.0.1:8081"
  EXPO_FLAG="--go"
else
  if ! adb -s "$ADB_SERIAL" shell pm path com.hopn.carpooling >/dev/null 2>&1; then
    echo "Error: instala primero la build de desarrollo de Carpooling en el teléfono." >&2
    exit 1
  fi
  APP_PACKAGE="com.hopn.carpooling"
  APP_URL='exp+carpooling://expo-development-client/?url=http%3A%2F%2F127.0.0.1%3A8081'
  EXPO_FLAG="--dev-client"
fi

adb -s "$ADB_SERIAL" reverse tcp:8081 tcp:8081 >/dev/null
echo "✓ ADB reverse: Metro 8081"

(
  for _ in {1..60}; do
    if curl -fsS http://127.0.0.1:8081/status >/dev/null 2>&1; then
      adb -s "$ADB_SERIAL" shell am start \
        -a android.intent.action.VIEW \
        -d "$APP_URL" \
        "$APP_PACKAGE" >/dev/null
      echo "✓ Proyecto abierto en $APP_PACKAGE"
      exit 0
    fi
    sleep 1
  done

  echo "Aviso: Metro no respondió en 60 segundos; abre Carpooling manualmente." >&2
) &
OPEN_APP_PID=$!

echo "Iniciando Metro con Fast Refresh..."
echo "Presiona Ctrl+C para detener esta sesión."
cd "$APP_DIR"
if [[ -n "$DEBUG_API_URL" ]]; then
  EXPO_PUBLIC_API_URL="$DEBUG_API_URL" REACT_NATIVE_PACKAGER_HOSTNAME=127.0.0.1 npx expo start "$EXPO_FLAG" --lan
else
  REACT_NATIVE_PACKAGER_HOSTNAME=127.0.0.1 npx expo start "$EXPO_FLAG" --lan
fi
