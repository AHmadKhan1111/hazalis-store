# Sentinel Security Journal

## 2026-10-30 - Administrative Route Authorization on Feature Banner Endpoints
**Vulnerability:** The feature banner endpoints (`/api/common/feature/add` and `/api/common/feature/delete/:id`) lacked authentication and admin authorization middlewares (`authMiddleware` and `adminMiddleware`), allowing unauthenticated users to create and delete homepage banner features.
**Learning:** Routes located under `routes/common/` can mix public and administrative actions; developers assumed `common` meant unauthenticated, leaving modifying operations exposed.
**Prevention:** Explicitly guard all mutating endpoints with `authMiddleware` and `adminMiddleware`, and separate administrative endpoints from public read endpoints.
