## 2026-09-11 - Prevent Mass Assignment in Mongoose Update Queries
**Vulnerability:** Passing unvalidated `req.body` (`formData`) directly into `Address.findOneAndUpdate()` in `server/controllers/shop/address-controller.js` allowed client request payloads to modify non-intended schema properties or cause unexpected parameter pollution.
**Learning:** Accepting raw request body objects in database write/update methods opens up mass assignment risks, even if the Mongoose schema currently restricts strictly defined fields.
**Prevention:** Always explicitly destructure and whitelist expected properties from request bodies into an explicit update payload before passing them to database update queries.
