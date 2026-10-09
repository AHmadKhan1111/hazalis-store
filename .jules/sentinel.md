## 2025-02-17 - Unsanitized Search Keyword Regex Injection & ReDoS
**Vulnerability:** User input passed directly into `new RegExp(keyword, "i")` without escaping special regex characters in `searchProducts`.
**Learning:** Constructing regular expressions directly from user params allows attackers to pass special regex characters that trigger syntax errors, unescaped matching, or ReDoS.
**Prevention:** Always sanitize user input strings with `keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")` before creating `RegExp` instances for database queries.
