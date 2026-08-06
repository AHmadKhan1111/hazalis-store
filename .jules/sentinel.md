## 2026-05-01 - Secure Authentication Cookies and Hashed Password Reset Tokens
**Vulnerability:**
1. Authentication cookies used `secure: false`, which allows cookie transmission over unencrypted HTTP channels.
2. Password reset tokens were stored as plaintext in MongoDB, exposing them to exploitation in case of a database breach.

**Learning:**
1. Authentication cookies must dynamically respect the environment and set `secure: true` in production behind SSL/TLS terminating proxies.
2. Storing sensitive temporary tokens (like password reset tokens) in plaintext presents the same risk as storing plaintext passwords.

**Prevention:**
1. Always enforce `secure: config.nodeEnv === "production"` (or `true` if behind proxies) for sensitive session/auth cookies.
2. Apply a cryptographic one-way hash (e.g., SHA-256 via crypto module) before saving password reset tokens to the database, and compare the hashed version on lookup.
