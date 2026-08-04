## 2026-08-04 - Secure Storage of Password Reset Tokens & Cookie Configuration
**Vulnerability:** Storing password reset tokens in plaintext inside the database and transmitting authentication cookies without the `secure` flag on non-production/production environments.
**Learning:** Password reset tokens can be compromised if an attacker gets read access to the database (e.g., via a SQL/NoSQL injection or database leak). They must be stored securely as cryptographic hashes (like SHA-256). Furthermore, JWT session cookies must use the `secure` flag in production to ensure they are only sent over HTTPS.
**Prevention:** Always hash password reset tokens before persistence, and set `secure: config.nodeEnv === "production"` for authentication cookies to protect session identifiers in transit.
