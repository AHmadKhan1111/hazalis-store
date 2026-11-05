## 2026-05-01 - Missing Authorization on Common Feature Banner Endpoints
**Vulnerability:** Unauthenticated and unauthorized users could add or delete homepage feature banner images via `POST /api/common/feature/add` and `DELETE /api/common/feature/delete/:id`.
**Learning:** Routes placed under `routes/common/` rather than `routes/admin/` were overlooked during access control implementation, even though modification actions on common features are restricted to administrators in the frontend.
**Prevention:** Always enforce `authMiddleware` and `adminMiddleware` on state-mutating endpoints (`POST`, `PUT`, `DELETE`), even if they reside in shared or common route directories.
