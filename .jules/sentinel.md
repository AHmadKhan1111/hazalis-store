# Sentinel Security Journal 🛡️

This journal logs critical security learnings specific to the Hazalis codebase.

## 2024-11-20 - Plaintext Password Reset Tokens in MongoDB
**Vulnerability:** Password reset tokens generated via `crypto.randomBytes(20).toString("hex")` were being stored in MongoDB in plaintext under the `UserSchema`'s `resetPasswordToken` field. Any database compromise or internal exposure could allow attackers to bypass authentication by constructing active reset links.
**Learning:** Storing authentication tokens, even temporary ones, in plaintext at rest violates standard defense-in-depth principles. Tokens should be treated like transient passwords.
**Prevention:** Hash the reset tokens using SHA-256 before storing them in MongoDB, and hash user-supplied tokens before querying.
