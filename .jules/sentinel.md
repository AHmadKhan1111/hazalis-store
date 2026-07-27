# Sentinel Security Journal 🛡️

## 2026-07-27 - Unprotected Administrative State-Modifying Routes
**Vulnerability:** Common feature image creation and deletion endpoints (`/api/common/feature/add` and `/api/common/feature/delete/:id`) were fully exposed publicly with no authentication or role authorization checks. Any unauthenticated attacker could perform malicious uploads or completely wipe the common homepage carousel.
**Learning:** The route was prefixed under `/api/common` rather than `/api/admin`, causing developers to mistakenly treat it as fully public/common to everyone without applying standard security guards like `authMiddleware` and `adminMiddleware` which are typically configured for `/api/admin` prefixed routes.
**Prevention:** Always verify that every state-modifying route (POST, PUT, DELETE, PATCH) is secured with authentication and specific role/permission authorization unless it is explicitly designed to be completely public. Run routing-layer automated checks to find any unprotected state-modifying endpoints during deployment checks.
