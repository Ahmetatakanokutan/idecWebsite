# Docker Setup (Frontend + Backend + DB)

This setup runs:
- `db`: PostgreSQL 16
- `backend`: Spring Boot app (`backend/IdecTTBackend`)
- `frontend`: Nginx container serving the Vite build and proxying `/api` + `/uploads` to backend

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
docker compose logs -f frontend
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
- Frontend is exposed on `http://localhost:${FRONTEND_PORT}` (default `80`).
- Backend API is exposed on `http://localhost:${BACKEND_PORT}` (default `8080`).
- DB is exposed on `localhost:${POSTGRES_PORT}` (default `5432`).
- Persistent volumes:
  - `postgres_data` for PostgreSQL data
  - `backend_uploads` for uploaded files (`/app/uploads`)
- Lesson videos can be provided in two ways:
  - Upload the video file from the admin lesson form and store it in `backend_uploads`
  - Paste a public Google Drive file link; the frontend will render it with the Drive preview player
