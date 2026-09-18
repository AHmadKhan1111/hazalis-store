# Sentinel Security Journal

## 2025-03-09 - Missing Authentication & Authorization on Common Feature Routes
**Vulnerability:** The feature image routes (`/api/common/feature/add` and `/api/common/feature/delete/:id`) lacked `authMiddleware` and `adminMiddleware`, allowing unauthenticated users to modify homepage banner images.
**Learning:** Common routes under `routes/common/` were initially grouped separately from `routes/admin/`, leading to omitted security middleware on administrative write operations.
**Prevention:** Always enforce `authMiddleware` and `adminMiddleware` on any route handler that performs write/delete operations on shared site content, regardless of the folder path structure.
