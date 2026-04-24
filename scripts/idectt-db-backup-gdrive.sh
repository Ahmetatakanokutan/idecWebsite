#!/usr/bin/env bash
set -euo pipefail

# Optional config file (loaded by systemd EnvironmentFile as well)
BACKUP_ENV_FILE="/etc/idectt/backup.env"
if [[ -f "$BACKUP_ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  source "$BACKUP_ENV_FILE"
fi

: "${BACKUP_DIR:=/var/backups/idectt}"
: "${POSTGRES_CONTAINER:=idectt-db}"
: "${POSTGRES_DB:=idecttDb}"
: "${POSTGRES_USER:=postgres}"
: "${RCLONE_REMOTE:=gdrive}"
: "${RCLONE_FOLDER:=idectt-db-backups}"
: "${LOCAL_RETENTION_DAYS:=14}"
: "${REMOTE_RETENTION_DAYS:=30}"

required_cmds=(docker gzip rclone date find)
for cmd in "${required_cmds[@]}"; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Missing required command: $cmd" >&2
    exit 1
  fi
done

if ! docker ps --format '{{.Names}}' | grep -Fxq "$POSTGRES_CONTAINER"; then
  echo "Postgres container '$POSTGRES_CONTAINER' is not running." >&2
  exit 1
fi

if ! rclone listremotes | grep -Fxq "${RCLONE_REMOTE}:"; then
  echo "Rclone remote '${RCLONE_REMOTE}:' not configured." >&2
  echo "Run: sudo rclone config" >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"
TIMESTAMP="$(date -u +%Y-%m-%d_%H%M%S)"
BACKUP_FILE="$BACKUP_DIR/${POSTGRES_DB}_${TIMESTAMP}.sql.gz"

echo "[backup] Dumping ${POSTGRES_DB} from ${POSTGRES_CONTAINER} -> ${BACKUP_FILE}"
docker exec "$POSTGRES_CONTAINER" pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" | gzip -9 > "$BACKUP_FILE"

echo "[backup] Uploading to ${RCLONE_REMOTE}:${RCLONE_FOLDER}"
rclone copy "$BACKUP_FILE" "${RCLONE_REMOTE}:${RCLONE_FOLDER}" --transfers 1 --checkers 2

echo "[backup] Cleaning local files older than ${LOCAL_RETENTION_DAYS} days"
find "$BACKUP_DIR" -type f -name '*.sql.gz' -mtime "+${LOCAL_RETENTION_DAYS}" -delete

echo "[backup] Cleaning remote files older than ${REMOTE_RETENTION_DAYS} days"
rclone delete "${RCLONE_REMOTE}:${RCLONE_FOLDER}" --min-age "${REMOTE_RETENTION_DAYS}d" --include '*.sql.gz'

echo "[backup] Done: $(basename "$BACKUP_FILE")"
