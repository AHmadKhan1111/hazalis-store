## 2026-10-27 - Unprotected Feature Banner Management Endpoints
**Vulnerability:** Feature banner image routes (`/common/feature/add` and `/common/feature/delete/:id`) lacked authentication and authorization middleware, allowing unauthenticated users to add or delete home page banner images.
**Learning:** Routes defined in `routes/common/` can easily be overlooked during auth middleware audits because they are under a common/ shared namespace rather than `routes/admin/`.
**Prevention:** Ensure all state-modifying endpoints (POST, PUT, DELETE) across all route modules explicitly apply `authMiddleware` and `adminMiddleware` (or appropriate role checks), even if placed in `common/` directories.
