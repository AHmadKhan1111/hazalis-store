## 2026-11-04 - Missing Authentication on Feature Banner Routes
**Vulnerability:** The feature banner endpoints `/api/common/feature/add` (POST) and `/api/common/feature/delete/:id` (DELETE) were unprotected, allowing unauthenticated users to inject banner image URLs onto the homepage or delete legitimate banner images.
**Learning:** Routes placed under `common` instead of `admin` may mistakenly be treated as entirely public; however, write/delete actions in `common` routes still require admin authentication and authorization.
**Prevention:** Always verify that every mutating endpoint (POST, PUT, DELETE) across all route modules (including `common`) has appropriate authentication and role-checking middlewares (`authMiddleware`, `adminMiddleware`).
