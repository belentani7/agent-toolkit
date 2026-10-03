#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
OUTPUT_DIR="${ROOT_DIR}/../ai-command-center-delivery"
STAGE_DIR="$(mktemp -d)"
PACKAGE_NAME="ai-command-center-${STAMP}"

cleanup() {
  rm -rf "${STAGE_DIR}"
}
trap cleanup EXIT

mkdir -p "${OUTPUT_DIR}"
cp -a "${ROOT_DIR}" "${STAGE_DIR}/${PACKAGE_NAME}"

rm -rf "${STAGE_DIR}/${PACKAGE_NAME}/node_modules" \
       "${STAGE_DIR}/${PACKAGE_NAME}/dist" \
       "${STAGE_DIR}/${PACKAGE_NAME}/.git" \
       "${STAGE_DIR}/${PACKAGE_NAME}/.manus-logs" \
       "${STAGE_DIR}/${PACKAGE_NAME}/coverage"
find "${STAGE_DIR}/${PACKAGE_NAME}" -type f \( -name ".env" -o -name ".env.*" -o -name "*.log" \) -delete

ZIP_PATH="${OUTPUT_DIR}/${PACKAGE_NAME}.zip"
rm -f "${ZIP_PATH}"
(cd "${STAGE_DIR}" && zip -qr "${ZIP_PATH}" "${PACKAGE_NAME}")

printf '%s\n' "${ZIP_PATH}"
