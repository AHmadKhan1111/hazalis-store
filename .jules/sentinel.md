## 2026-08-09 - [Password Reset and Secure Cookie Options]
**Vulnerability:** Weaknesses in authentication include unhashed password reset tokens in database (susceptible to token leakage/database theft) and insecure cookies transmitting over non-encrypted connections.
**Learning:** Storing reset tokens in plaintext allows any DB-read attacker to reset passwords, and insecure HTTP cookie transmissions are prone to MITM attacks.
**Prevention:** Hash password reset tokens using SHA-256 before database storage, and set secure cookie attributes (such as `secure` flag based on production environment or proxy configurations) to enforce encrypted transmissions.
