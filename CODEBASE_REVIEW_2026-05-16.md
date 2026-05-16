# Codebase Review - 2026-05-16

## Scope

This review covers the repository under `/home/ubuntu/idecWebsite`, the project-owned Markdown documents in the repo root, and the live frontend artifact directory under `/var/www/idectt`.

## Repository Summary

- Frontend: React 18 + TypeScript + Vite + Tailwind
- Routing: `react-router-dom` with public, authenticated, and admin areas
- Localization: `i18next` with `tr` and `en` translation files
- Backend: Spring Boot 3.5 + Java 17 + Spring Security + JPA
- Database: PostgreSQL
- Deployment styles present in repo:
  - direct host deployment with Nginx + systemd
  - Docker Compose for DB + backend

## Frontend Structure

- Entry points:
  - `src/main.tsx`
  - `src/App.tsx`
  - `src/routes/index.tsx`
- Main public pages:
  - home, about/contact, projects, project detail, courses, course detail
  - login, register, verify email, forgot password
- Authenticated user pages:
  - profile
  - favorites
- Admin pages:
  - dashboard
  - project, course, lesson, instructor, user, announcement management
- API integration:
  - centralized in `src/services/apiService.ts`
  - token stored in `localStorage`
  - default API base falls back to `window.location.origin` when `VITE_API_BASE_URL` is unset

## Backend Structure

- Maven app root: `backend/IdecTTBackend`
- Core backend areas:
  - `controller`
  - `service`
  - `repository`
  - `entity`
  - `security`
- Main exposed domains:
  - auth and email verification
  - users
  - projects
  - courses, sections, lessons
  - favorites and enrollments
  - announcements
  - file upload
- Security model:
  - JWT-based stateless auth
  - role-driven access with `ROLE_USER`, `ROLE_COMPANY`, `ROLE_ADMIN`
  - public read access exists for project/course/announcement reads

## Markdown Files Reviewed

### `DEPLOYMENT_GUIDE_V2.md`

- Documents host-based production deployment.
- Assumes Nginx serves frontend from `/home/ubuntu/idecWebsite/dist`.
- Includes systemd environment-variable based backend setup.

### `DOCKER_SETUP.md`

- Documents Docker Compose setup for PostgreSQL + backend.
- Mentions persistent upload storage through `backend_uploads`.

### `REVIEW_BASELINE.md`

- Contains prior technical review baseline dated `2026-02-27`.
- Useful as a delta-review starting point for future sessions.

## Live Deployment Observation

- `/var/www/idectt` currently contains the live built frontend files:
  - `index.html`
  - `logo.svg`
  - `assets/index-D3PTuMQS.js`
  - `assets/index-eLXW10p8.css`
- The repository `dist/` directory currently contains the same artifact names and timestamps as `/var/www/idectt`.

## Important Operational Note

There is an operational mismatch between the written deployment guide and the live frontend location:

- Guide says frontend should be served from `/home/ubuntu/idecWebsite/dist`
- Live published files are present under `/var/www/idectt`

If Nginx is really serving `/var/www/idectt`, then the guide is outdated for the frontend publish path. If Nginx is serving repo `dist/`, then `/var/www/idectt` is only a copied mirror. This should be clarified before future deployment automation changes.

## Git Status At Review Time

The repository was already dirty before adding this file. Existing modified files:

- `DEPLOYMENT_GUIDE_V2.md`
- `DOCKER_SETUP.md`
- `src/pages/CourseDetailPage.tsx`
- `src/pages/admin/LessonFormModal.tsx`

This review does not revert or rewrite those changes.

## Push Readiness Notes

- Remote is configured: `origin -> https://github.com/Ahmetatakanokutan/idecWebsite.git`
- A push is technically possible once the intended file set is reviewed, staged, and committed.
- Because the worktree already contains user changes, pushing blindly is not safe without deciding whether those four modified files should be included together with this review document.

## Recommended Next Step

Before pushing, compare the intended deployment flow against the real Nginx root and then make a single deliberate commit that includes:

- this review file
- only the code/doc changes you actually want published
