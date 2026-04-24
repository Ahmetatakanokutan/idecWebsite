# Review Baseline (2026-02-27)

This file is the baseline so future sessions do not need a full repo re-review from scratch.

## Snapshot
- Reviewed at: 2026-02-27
- Repo root: `/home/ubuntu/idecWebsite`
- Baseline commit: `7b5141ab3e72838cbe2fa6b8d2cfb230eb9c0628`
- Working tree at review time: dirty (`42` changed/untracked entries)

## What was checked
- Frontend build/lint:
  - `npm run lint` -> PASS
  - `npm run build` -> PASS (chunk-size warning present)
- Backend build/tests:
  - `./mvnw -q -DskipTests package` -> PASS
  - `./mvnw test -q` -> FAIL (DB auth: `FATAL: password authentication failed for user "postgres"`)
- Manual code review:
  - Backend security/auth/controllers/services/repos/entities/config
  - Frontend auth/routing/api layer + user/admin pages
  - Deployment/docs for operational risks

## Open findings (ordered by severity)

1. **High - Sensitive credentials/history in repo docs**
   - File: `GEMINI.md` (historical; removed on 2026-03-09 after this baseline)
   - Issue: Operational secrets/password history appears in tracked docs.
   - Risk: Credential leakage and audit/compliance risk.

2. **High - Backend tests require real Postgres and fail by default**
   - Files: `backend/IdecTTBackend/src/test/java/com/example/IdecTTBackend/IdecTtBackendApplicationTests.java`, `backend/IdecTTBackend/src/main/resources/application.properties`
   - Issue: `@SpringBootTest` context load depends on external DB credentials; CI/local fails without configured Postgres password.
   - Risk: No reliable automated regression gate.

3. **High - Upload endpoint can be abused by any authenticated user**
   - Files: `backend/IdecTTBackend/src/main/java/com/example/idectt/controller/FileUploadController.java`, `backend/IdecTTBackend/src/main/java/com/example/idectt/security/SecurityConfig.java`
   - Issue: `/api/upload` is not admin-restricted; default max upload is 500MB.
   - Risk: Disk abuse/DoS via large repeated uploads.

4. **Medium - Frontend API fallback can break local dev API calls**
   - File: `src/services/apiService.ts`
   - Issue: If `VITE_API_BASE_URL` is unset, API base falls back to `window.location.origin` (e.g. `http://localhost:5173`), which is wrong when backend runs on `:8080` without proxy.
   - Risk: Login/register/API calls fail in common local setup.

5. **Medium - Course edit modal is underfed data from list DTO**
   - Files: `src/pages/admin/ManageCoursesPage.tsx`, `src/pages/admin/CourseFormModal.tsx`
   - Issue: Edit modal opens with summary DTO lacking full course fields (notably instructor id), causing incomplete prefill and risky updates.
   - Risk: Accidental wrong updates / mandatory reselection.

6. **Medium - Favorite state is not initialized from backend**
   - File: `src/pages/CourseDetailPage.tsx`
   - Issue: `isFavorited` starts as `false` and no initial sync call is done.
   - Risk: First click may perform opposite of user expectation on already-favorited courses.

7. **Low - Public test endpoints enabled**
   - Files: `backend/IdecTTBackend/src/main/java/com/example/idectt/controller/test/TestController.java`, `backend/IdecTTBackend/src/main/java/com/example/idectt/security/SecurityConfig.java`
   - Issue: `/api/test/**` is publicly accessible.
   - Risk: Unnecessary surface area in production.

## Fast re-review protocol for next sessions

1. Check delta since baseline:
   - `git diff --name-only 7b5141ab3e72838cbe2fa6b8d2cfb230eb9c0628...HEAD`
2. Re-review only changed files + directly impacted call paths.
3. Re-run minimum gates:
   - `npm run lint`
   - `npm run build`
   - `(cd backend/IdecTTBackend && ./mvnw -q -DskipTests package)`
4. If backend runtime/config changed, run tests with an isolated test profile (H2/Testcontainers) before accepting.

## Notes
- This baseline is a technical review snapshot, not a claim that all business requirements are complete.
- Keep this file updated when major auth/security/data-model changes are made.
