# Sentinel Security Journal 🛡️

## 2025-02-12 - Secure Password Reset Hashing and Session Cookie Protection
**Vulnerability:** Plaintext password reset tokens stored in MongoDB and insecure authentication cookie configuration (hardcoded to secure: false).
**Learning:** Storing reset tokens in plaintext allows attackers with database access to bypass authentication. Session cookies set with `secure: false` can be intercepted over unencrypted channels.
**Prevention:** Always hash sensitive short-lived tokens like password reset tokens using SHA-256 before database storage. Always dynamically configure session cookies to use `secure: true` in production environments (e.g., `secure: process.env.NODE_ENV === "production"`).
