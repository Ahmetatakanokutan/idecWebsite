#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

if [[ $# -lt 1 ]]; then
    echo "Usage: $0 <bundle_dir>" >&2
    exit 1
fi

BUNDLE_DIR="$(cd "$1" && pwd)"
ENV_FILE="${ENV_FILE:-$ROOT_DIR/.env.docker}"
DB_CONTAINER="${DB_CONTAINER:-idectt-db}"
BACKEND_CONTAINER="${BACKEND_CONTAINER:-idectt-backend}"
USE_BUNDLE_ENV="${USE_BUNDLE_ENV:-auto}"

read_env_value() {
    local key="$1"
    local file="$2"
    local default_value="${3:-}"
    local line
    line="$(grep -E "^${key}=" "$file" | tail -n 1 || true)"
    if [[ -z "$line" ]]; then
        printf '%s\n' "$default_value"
        return
    fi
    printf '%s\n' "${line#*=}"
}

need_cmd() {
    command -v "$1" >/dev/null 2>&1 || {
        echo "Missing required command: $1" >&2
        exit 1
    }
}

need_cmd sudo
need_cmd docker
need_cmd gzip
need_cmd tar
need_cmd sha256sum

for required_file in postgres.sql.gz backend_uploads.tar.gz SHA256SUMS; do
    if [[ ! -f "$BUNDLE_DIR/$required_file" ]]; then
        echo "Missing bundle file: $BUNDLE_DIR/$required_file" >&2
        exit 1
    fi
done

if [[ -f "$BUNDLE_DIR/.env.docker" ]]; then
    if [[ "$USE_BUNDLE_ENV" == "replace" || ( "$USE_BUNDLE_ENV" == "auto" && ! -f "$ENV_FILE" ) ]]; then
        cp "$BUNDLE_DIR/.env.docker" "$ENV_FILE"
        chmod 600 "$ENV_FILE"
        echo "Copied bundle env file to $ENV_FILE"
    fi
fi

if [[ ! -f "$ENV_FILE" ]]; then
    echo "Missing target env file: $ENV_FILE" >&2
    exit 1
fi

POSTGRES_DB="${POSTGRES_DB:-$(read_env_value POSTGRES_DB "$ENV_FILE" idecttDb)}"
POSTGRES_USER="${POSTGRES_USER:-$(read_env_value POSTGRES_USER "$ENV_FILE" postgres)}"

echo "Verifying bundle checksums"
(cd "$BUNDLE_DIR" && sha256sum -c SHA256SUMS)

echo "Starting database container"
sudo docker compose --env-file "$ENV_FILE" up -d db

echo "Waiting for PostgreSQL readiness"
for _ in $(seq 1 60); do
    if sudo docker exec "$DB_CONTAINER" pg_isready -U "$POSTGRES_USER" -d postgres >/dev/null 2>&1; then
        break
    fi
    sleep 2
done

if ! sudo docker exec "$DB_CONTAINER" pg_isready -U "$POSTGRES_USER" -d postgres >/dev/null 2>&1; then
    echo "PostgreSQL did not become ready in time." >&2
    exit 1
fi

echo "Stopping app containers before restore"
sudo docker compose --env-file "$ENV_FILE" stop backend frontend || true

echo "Recreating database $POSTGRES_DB"
sudo docker exec "$DB_CONTAINER" psql -U "$POSTGRES_USER" -d postgres -v ON_ERROR_STOP=1 -c "DROP DATABASE IF EXISTS \"$POSTGRES_DB\" WITH (FORCE);"
sudo docker exec "$DB_CONTAINER" psql -U "$POSTGRES_USER" -d postgres -v ON_ERROR_STOP=1 -c "CREATE DATABASE \"$POSTGRES_DB\";"

echo "Restoring PostgreSQL dump"
gunzip -c "$BUNDLE_DIR/postgres.sql.gz" | sudo docker exec -i "$DB_CONTAINER" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1

UPLOADS_VOLUME_NAME="${UPLOADS_VOLUME_NAME:-$(sudo docker inspect "$BACKEND_CONTAINER" --format '{{range .Mounts}}{{if eq .Destination "/app/uploads"}}{{.Name}}{{end}}{{end}}' 2>/dev/null || true)}"
if [[ -z "$UPLOADS_VOLUME_NAME" ]]; then
    echo "Backend container not available yet, starting it once to detect uploads volume"
    sudo docker compose --env-file "$ENV_FILE" up -d backend
    sleep 5
    UPLOADS_VOLUME_NAME="$(sudo docker inspect "$BACKEND_CONTAINER" --format '{{range .Mounts}}{{if eq .Destination "/app/uploads"}}{{.Name}}{{end}}{{end}}')"
fi

if [[ -z "$UPLOADS_VOLUME_NAME" ]]; then
    echo "Could not detect uploads volume." >&2
    exit 1
fi

echo "Clearing uploads volume $UPLOADS_VOLUME_NAME"
sudo docker run --rm -v "$UPLOADS_VOLUME_NAME:/target" alpine:3.20 sh -c 'rm -rf /target/* /target/.[!.]* /target/..?*'

echo "Restoring uploads archive"
sudo docker run --rm \
    -v "$UPLOADS_VOLUME_NAME:/target" \
    -v "$BUNDLE_DIR:/backup:ro" \
    alpine:3.20 \
    sh -c 'cd /target && tar -xzf /backup/backend_uploads.tar.gz'

echo "Starting full stack"
sudo docker compose --env-file "$ENV_FILE" up -d --build

echo "Restore completed from bundle: $BUNDLE_DIR"
