## 2026-05-01 - Shop Order Endpoints Lacked Authentication and IDOR Authorization Checks
**Vulnerability:** Shop order routes (`/api/shop/order/create`, `/capture`, `/list/:userId`, `/details/:id`) were unprotected by `authMiddleware`, and order controller handlers did not verify `req.user.id` against the target `userId` or order `userId`. Unauthenticated users could view order histories and personal details of any user via IDOR.
**Learning:** Shop client API calls were sending `{ withCredentials: true }`, but the backend routes missed middleware attach points.
**Prevention:** Always pair client authenticated endpoints with `authMiddleware` on backend routes and double-check resource ownership (`req.user.id === targetUserId`) in controller handlers.
