#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

BUNDLE_ROOT="${BUNDLE_ROOT:-$ROOT_DIR/migration_bundle}"
TIMESTAMP="${TIMESTAMP:-$(date -u +%Y-%m-%d_%H%M%S)}"
OUT_DIR="${1:-$BUNDLE_ROOT/$TIMESTAMP}"
ENV_FILE="${ENV_FILE:-$ROOT_DIR/.env.docker}"
FRONTEND_DIR="${FRONTEND_DIR:-/var/www/idectt}"
DB_CONTAINER="${DB_CONTAINER:-idectt-db}"
BACKEND_CONTAINER="${BACKEND_CONTAINER:-idectt-backend}"

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

if [[ ! -f "$ENV_FILE" ]]; then
    echo "Missing env file: $ENV_FILE" >&2
    exit 1
fi

POSTGRES_DB="${POSTGRES_DB:-$(read_env_value POSTGRES_DB "$ENV_FILE" idecttDb)}"
POSTGRES_USER="${POSTGRES_USER:-$(read_env_value POSTGRES_USER "$ENV_FILE" postgres)}"

mkdir -p "$OUT_DIR"

UPLOADS_VOLUME_NAME="${UPLOADS_VOLUME_NAME:-$(sudo docker inspect "$BACKEND_CONTAINER" --format '{{range .Mounts}}{{if eq .Destination "/app/uploads"}}{{.Name}}{{end}}{{end}}')}"
if [[ -z "$UPLOADS_VOLUME_NAME" ]]; then
    echo "Could not detect uploads volume from container: $BACKEND_CONTAINER" >&2
    exit 1
fi

echo "[1/5] Copying live env file"
cp "$ENV_FILE" "$OUT_DIR/.env.docker"
chmod 600 "$OUT_DIR/.env.docker"

echo "[2/5] Dumping PostgreSQL database from $DB_CONTAINER"
sudo docker exec "$DB_CONTAINER" pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" | gzip -9 > "$OUT_DIR/postgres.sql.gz"

echo "[3/5] Archiving backend uploads from volume $UPLOADS_VOLUME_NAME"
sudo docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$UPLOADS_VOLUME_NAME:/source:ro" \
    -v "$OUT_DIR:/backup" \
    alpine:3.20 \
    sh -c 'cd /source && tar -czf /backup/backend_uploads.tar.gz .'

if [[ -d "$FRONTEND_DIR" ]]; then
    echo "[4/5] Archiving live frontend from $FRONTEND_DIR"
    tar -C "$FRONTEND_DIR" -czf "$OUT_DIR/live_frontend.tar.gz" .
else
    echo "[4/5] Skipping live frontend archive because directory is missing: $FRONTEND_DIR"
fi

echo "[5/5] Writing manifest and checksums"
cat > "$OUT_DIR/MANIFEST.md" <<EOF
# Live Migration Bundle

- Created at (UTC): $(date -u +"%Y-%m-%d %H:%M:%S")
- Repo root: $ROOT_DIR
- Env file source: $ENV_FILE
- DB container: $DB_CONTAINER
- Backend container: $BACKEND_CONTAINER
- PostgreSQL database: $POSTGRES_DB
- PostgreSQL user: $POSTGRES_USER
- Uploads volume: $UPLOADS_VOLUME_NAME
- Frontend directory: $FRONTEND_DIR

## Files

- \`.env.docker\`
- \`postgres.sql.gz\`
- \`backend_uploads.tar.gz\`
$( [[ -f "$OUT_DIR/live_frontend.tar.gz" ]] && printf '%s\n' '- `live_frontend.tar.gz`' )
EOF

(cd "$OUT_DIR" && sha256sum .env.docker postgres.sql.gz backend_uploads.tar.gz $( [[ -f live_frontend.tar.gz ]] && printf '%s' 'live_frontend.tar.gz' ) > SHA256SUMS)

echo "Bundle created at: $OUT_DIR"
