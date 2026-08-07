## 2026-08-07 - Secure Password Reset Token Storage in MongoDB
**Vulnerability:** Plaintext password reset tokens stored in MongoDB.
**Learning:** Storing password reset tokens in plaintext allows anyone with database access to compromise any user's account by requesting a password reset and reading the token directly from the database.
**Prevention:** Always store password reset tokens as cryptographic hashes (e.g. SHA-256) in the database, and only compare the hash of the incoming token against the stored hash.
