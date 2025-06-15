#!/bin/sh
set -e

# Ensure APP_NAMES is provided (comma-separated list with optional :port)
PROJECT_ROOT_DIR="${PROJECT_ROOT_DIR:-/usr/src/app/}"
APPS_ROOT_DIR="${PROJECT_ROOT_DIR}apps/"
APP_EXPORT_PATH="${APP_EXPORT_PATH:-/opt/adit-api/}"
BASE_PORT="${BASE_PORT:-3000}"

if [ -z "${APP_NAMES}" ]; then
  echo "❌ APP_NAMES is not set!"
  exit 1
fi

if [ ! -d "${PROJECT_ROOT_DIR}" ] || [ ! -d "${APPS_ROOT_DIR}" ]; then
  echo "❌ Apps directory ${PROJECT_ROOT_DIR} or ${APPS_ROOT_DIR} not found!"
  exit 1
fi

if [ "${APP_NAMES}" = "*" ]; then
  if [ ! -d "${APP_EXPORT_PATH}apps" ]; then
    mkdir -p "${APP_EXPORT_PATH}apps/"
    cp -R "${APPS_ROOT_DIR}" "${APP_EXPORT_PATH}apps/"
  fi
  unison -ignorearchives -prefer newer -repeat 0 -silent -auto -batch \
    "${APPS_ROOT_DIR}" "${APP_EXPORT_PATH}apps/" -force "${APP_EXPORT_PATH}apps/" &
elif [ "${APP_NAMES}" = "**" ]; then
  if [ ! -d "${APP_EXPORT_PATH}" ]; then
    mkdir -p "${APP_EXPORT_PATH}"
    cp -R "${PROJECT_ROOT_DIR}" "${APP_EXPORT_PATH}"
  fi
  unison -ignorearchives -prefer newer -repeat 0 -silent -auto -batch \
    "${PROJECT_ROOT_DIR}" "${APP_EXPORT_PATH}" -force "${APP_EXPORT_PATH}" &
else
  # For each app: create folder, start unison sync in background
  for ENTRY in "$(echo "${APP_NAMES}" | tr ',' '\n')"; do
    APP="${ENTRY%:*}"
    MY_PATH="${APP_EXPORT_PATH}apps/${APP}/"
    if [ ! -d "${MY_PATH}" ]; then
      echo
      mkdir -p "${MY_PATH}"
      cp -R "${APPS_ROOT_DIR}${APP}/" "${APP_EXPORT_PATH}apps/"
    fi
    unison -ignorearchives -prefer newer -repeat 0 -silent -auto -batch \
      "${APPS_ROOT_DIR}${APP}/" "${MY_PATH}" -force "${MY_PATH}" &
  done
fi

# Expose node_modules to host path for editor use
NODE_MODULES_LOCAL_PATH="${APP_EXPORT_PATH}/node_modules"

if [ ! -d "${NODE_MODULES_LOCAL_PATH}" ]; then
  echo "🔁 Copying node_modules to host for IntelliSense..."
  mkdir -p "${NODE_MODULES_LOCAL_PATH}"
  cp -R "${PROJECT_ROOT_DIR}/node_modules" "${APP_EXPORT_PATH}/"
fi

echo "At Source:"
ls -l "${APPS_ROOT_DIR}" || true
echo "At Destination:"
ls -l "${APP_EXPORT_PATH}" || true

echo "🚀 Starting NestJS apps: ${APP_NAMES} in watch mode"

if [ "${APP_NAMES}" = "*" ] || [ "${APP_NAMES}" = "**" ]; then
  for ENTRY in "${APPS_ROOT_DIR}"*/; do
    APP="$(basename "$ENTRY")"
    port="${BASE_PORT}" npm run start:"${APP}":dev
    BASE_PORT="$((BASE_PORT + 1))"
  done
else
  for ENTRY in "$(echo "${APP_NAMES}" | tr ',' '\n')"; do
    APP="${ENTRY%:*}"
    PORT="${ENTRY#*:}"
    PORT="$(printf '%s' "${PORT##*:}" | tr -cd '0-9')"

    if [ -z "${PORT}" ]; then
      PORT="${BASE_PORT}"
      BASE_PORT="$((BASE_PORT + 1))"
    fi
    port="${PORT}" npm run start:"${APP}":dev
  done
fi
