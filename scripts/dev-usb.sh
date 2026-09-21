#!/usr/bin/env bash

set -Eeuo pipefail

APP_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
WORKSPACE_DIR="$(cd -- "$APP_DIR/.." && pwd)"
STARTED_PIDS=()

cleanup() {
  local exit_code=$?
  trap - EXIT INT TERM

  if ((${#STARTED_PIDS[@]} > 0)); then
    echo
    echo "Deteniendo servicios iniciados por este script..."
    for pid in "${STARTED_PIDS[@]}"; do
      kill "$pid" 2>/dev/null || true
    done
    wait "${STARTED_PIDS[@]}" 2>/dev/null || true
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

start_service_if_needed() {
  local name=$1
  local directory=$2
  local health_url=$3
  local log_file="/tmp/hopn-${name}.log"

  if curl -fsS "$health_url" >/dev/null 2>&1; then
    echo "✓ $name ya está activo"
    return
  fi

  echo "Iniciando $name..."
  (
    cd "$directory"
    exec npm run dev
  ) >"$log_file" 2>&1 &
  local pid=$!
  STARTED_PIDS+=("$pid")

  for _ in {1..30}; do
    if curl -fsS "$health_url" >/dev/null 2>&1; then
      echo "✓ $name listo"
      return
    fi

    if ! kill -0 "$pid" 2>/dev/null; then
      echo "Error: $name terminó antes de estar listo. Log: $log_file" >&2
      tail -n 30 "$log_file" >&2 || true
      exit 1
    fi

    sleep 1
  done

  echo "Error: $name no respondió en 30 segundos. Log: $log_file" >&2
  tail -n 30 "$log_file" >&2 || true
  exit 1
}

require_command adb
require_command curl
require_command npm

if ! adb get-state >/dev/null 2>&1; then
  echo "Error: ADB no detecta un teléfono autorizado." >&2
  echo "Conecta el cable, habilita Depuración USB y acepta la autorización en Android." >&2
  exit 1
fi

ADB_SERIAL="$(adb get-serialno)"
echo "✓ Android conectado: $ADB_SERIAL"
if [[ "$ADB_SERIAL" == *:* ]]; then
  echo "Aviso: ADB está usando Wi-Fi. Para evitar la red del campus, conecta y autoriza USB."
fi

if ! adb shell pm path host.exp.exponent >/dev/null 2>&1; then
  echo "Error: Expo Go no está instalado en el teléfono." >&2
  exit 1
fi

start_service_if_needed \
  "scrap-uat-service" \
  "$WORKSPACE_DIR/scrap-uat-service" \
  "http://127.0.0.1:3100/health/ready"

start_service_if_needed \
  "backend" \
  "$WORKSPACE_DIR/backend" \
  "http://127.0.0.1:3200/health"

adb reverse tcp:8081 tcp:8081 >/dev/null
adb reverse tcp:3200 tcp:3200 >/dev/null
echo "✓ ADB reverse: Metro 8081 y backend 3200"

(
  for _ in {1..60}; do
    if curl -fsS http://127.0.0.1:8081/status >/dev/null 2>&1; then
      adb shell am start \
        -a android.intent.action.VIEW \
        -d exp://127.0.0.1:8081 \
        host.exp.exponent >/dev/null
      echo "✓ Proyecto abierto en Expo Go"
      exit 0
    fi
    sleep 1
  done

  echo "Aviso: Metro no respondió en 60 segundos; abre exp://127.0.0.1:8081 manualmente." >&2
) &

echo "Iniciando Metro con Fast Refresh..."
echo "Presiona Ctrl+C para detener esta sesión."
cd "$APP_DIR"
EXPO_PUBLIC_API_URL=http://127.0.0.1:3200 \
  REACT_NATIVE_PACKAGER_HOSTNAME=127.0.0.1 \
  npx expo start --lan
