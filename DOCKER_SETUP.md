# Docker Setup (DB + Backend)

This setup runs:
- `db`: PostgreSQL 16
- `backend`: Spring Boot app (`backend/IdecTTBackend`)

## 1. Prepare env file

```bash
cp .env.docker.example .env.docker
```

Edit `.env.docker` and set:
- `POSTGRES_PASSWORD`
- `JWT_SECRET` (at least 32 chars)

## 2. Start services

```bash
docker compose --env-file .env.docker up -d --build
```

## 3. Check status

```bash
docker compose ps
docker compose logs -f backend
```

## 4. Stop services

```bash
docker compose down
```

## 5. Stop + remove DB data volume

```bash
docker compose down -v
```

## Notes
- Backend API is exposed on `http://localhost:${BACKEND_PORT}` (default `8080`).
- DB is exposed on `localhost:${POSTGRES_PORT}` (default `5432`).
- Persistent volumes:
  - `postgres_data` for PostgreSQL data
  - `backend_uploads` for uploaded files (`/app/uploads`)
