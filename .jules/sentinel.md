# Sentinel Security Journal

## 2025-05-18 - Plaintext Password Reset Token Storage and Insecure Auth Cookie Flags

**Vulnerability:** Password reset tokens were stored as unhashed plain text strings in MongoDB (`resetPasswordToken`), and JWT auth cookies had `secure: false` hardcoded regardless of the execution environment. Additionally, `authMiddleware` returned HTTP status 500 instead of 401 on JWT verification failures.

**Learning:** Storing reset tokens in plaintext allows anyone with read access to the database (or database backups / NoSQL injection) to hijack any user account by using active reset tokens. Hardcoding `secure: false` allowed auth cookies to be transmitted over unencrypted HTTP connections in production.

**Prevention:** Always hash password reset tokens with SHA-256 (`crypto.createHash("sha256").update(token).digest("hex")`) before storing them in the database, while sending the unhashed token to the user's email. Set cookie `secure` flags dynamically using `process.env.NODE_ENV === "production"`, and ensure auth middleware returns 401 Unauthorized on invalid or expired JWTs.
