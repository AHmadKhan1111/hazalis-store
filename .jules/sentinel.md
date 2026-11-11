# Sentinel's Security Journal

## 2025-05-18 - Promotional Feature Banner Authorization Bypass
**Vulnerability:** Promotional feature banner endpoints (`POST /api/common/feature/add` and `DELETE /api/common/feature/delete/:id`) lacked authentication and admin authorization middlewares, allowing unauthenticated attackers to add or delete homepage feature banners.
**Learning:** Common feature endpoints were placed under `server/routes/common/` rather than `server/routes/admin/`, leading to omitted authorization checks despite mutations strictly being admin actions. Storefront requires unauthenticated access to `GET /get` for banner rendering, so authorization must be applied selectively to mutation routes.
**Prevention:** Whenever route handlers reside in shared/common directories, enforce role-based access control (`authMiddleware` and `adminMiddleware`) on state-altering HTTP methods (POST, PUT, DELETE) while retaining public read access (GET) only where intentionally required.
