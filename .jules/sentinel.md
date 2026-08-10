# Sentinel Security Journal 🛡️

## 2024-08-10 - Secure Cookie Transmission and Database Password Reset Token Hashing
**Vulnerability:** Password reset tokens were stored as plaintext hexadecimal strings in MongoDB (`resetPasswordToken` field). Additionally, JWT authentication cookies had the `secure` option hardcoded to `false` (intended to allow HTTP in development, but left active in production behind SSL reverse proxies/Cloudflare).
**Learning:** Hardcoding token storage in plaintext and disabling cookie security flags are highly risky anti-patterns. If database tables are leaked or exposed, attackers can hijack password resets for any account. For cookies, relying strictly on downstream proxies for SSL while disabling the secure cookie attribute allows potential MITM interception between the user and the proxy or within internal networks.
**Prevention:**
1. Always hash random, short-lived session or reset tokens (like password reset URLs) using a one-way hash function (such as SHA-256) before storing them in the database.
2. Ensure cookie security properties are dynamic (e.g., `secure: config.nodeEnv === "production"`) so they automatically enable transmission safety over HTTPS in production without breaking developers' local HTTP environments.
