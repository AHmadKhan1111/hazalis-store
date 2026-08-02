# 🛡️ Sentinel's Security Journal

Welcome to Sentinel's security journal! This journal records critical, codebase-specific security learnings.

## 2025-02-14 - Hashing Password Reset Tokens & Securing Cookies
**Vulnerability:** Password reset tokens generated via `crypto.randomBytes(20).toString("hex")` were stored as plaintext in the database (`resetPasswordToken`). In addition, the JWT auth cookie was transmitted with `secure: false`, exposing it to potential interception in transit.
**Learning:** Plaintext reset tokens in MongoDB allow an attacker with read-only DB access to request and intercept valid reset tokens, bypassing authorization checks. Keeping session cookies unencrypted/insecure leaves users vulnerable to MITM attacks.
**Prevention:** Always SHA-256 hash password reset tokens before storing them in the database, and configure authentication/session cookies with `secure: config.nodeEnv === "production"` to ensure they are only sent over HTTPS when deployed.
