## 2025-05-18 - Missing Authentication and Authorization on Common Feature Routes
**Vulnerability:** The feature banner endpoints (`POST /api/common/feature/add` and `DELETE /api/common/feature/delete/:id`) lacked authentication and admin authorization checks, allowing unauthenticated attackers to add or delete store banners.
**Learning:** Routes organized under `common/` rather than `admin/` were unintentionally left unprotected even though mutating operations on store banners are strictly administrative actions managed by the admin panel.
**Prevention:** Ensure all mutating routes (POST, PUT, DELETE) across all router modules—regardless of directory grouping—enforce `authMiddleware` and role-based checks (such as `adminMiddleware`) unless explicitly designed to be public.
