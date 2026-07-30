# Sentinel Security Journal

This journal tracks critical security learnings specific to the codebase.

## 2026-07-30 - Secure Password Reset Token Storage and Cookie Transmission
**Vulnerability:** Password reset tokens were previously generated as random hex strings and stored in plaintext in the MongoDB database. If the database were compromised, an attacker could extract pending reset tokens and bypass authentication to take over user accounts. Additionally, authentication cookies had `secure: false`, making them transmittable over insecure HTTP channels.
**Learning:** Simple password reset and cookie flows often store generated tokens as plaintext for simplicity. However, storing secrets/tokens in plaintext within databases exposes them to leakages. Session and auth cookies should also default to secure options in production contexts.
**Prevention:** Always hash one-time password reset tokens (e.g., using SHA-256) before storing them in the database, and verify the hash during reset. Ensure cookies use `secure: config.nodeEnv === "production"` to prevent transmission over unencrypted connections while retaining compatibility for local development.
