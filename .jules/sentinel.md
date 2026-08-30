## 2025-05-30 - Password Reset Token Storage Security
**Vulnerability:** Raw password reset tokens generated during `forgotPassword` were stored in cleartext in MongoDB documents.
**Learning:** Storing active password reset tokens unhashed allows full account takeover if the database or backups are compromised or read-accessed.
**Prevention:** Always hash sensitive authentication tokens (e.g. SHA-256) before storing them in database models, while transmitting the raw token to the user via email link.
