## 2026-08-11 - Password Reset Hashing & Secure Cookie Settings
**Vulnerability:** Password reset tokens were stored as plaintext in the database, allowing database compromised attackers to reset user passwords. Authentication cookies also had `secure: false`, presenting a risk of transmitting session secrets over unsecure connections in production.
**Learning:** For a secure authentication flow, password reset tokens must be stored as SHA-256 hashes, and authentication cookies must only be transmitted over secure connections (HTTPS) in production by setting `secure: process.env.NODE_ENV === "production"`.
**Prevention:** Always hash password reset tokens before saving them to the database and use secure cookie flags conditional on the node environment.
