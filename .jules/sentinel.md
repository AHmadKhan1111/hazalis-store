# Sentinel Security Journal

## 2026-07-29 - Insecure Plaintext Password Reset Tokens & Lax Session Cookies
**Vulnerability:** Password reset tokens were stored in MongoDB in plaintext (raw hexadecimal format). Additionally, user session JWT cookies were transmitted with `secure: false`, meaning they would be exposed over unencrypted connections if not handled strictly behind SSL-terminating proxies.
**Learning:** Plaintext storage of sensitive single-use reset tokens in the database exposes users to account takeover vulnerabilities if the database is ever compromised or leaked. Similarly, non-secure authentication cookies risk credential sniffing and session hijacking under improper proxy configurations.
**Prevention:** Always hash single-use tokens (like password resets, invitation codes, etc.) using cryptographic hash functions (such as SHA-256) before storing them in the database, and transmit them as raw tokens to users. Ensure JWT session cookies are marked as `secure` in production configurations.
