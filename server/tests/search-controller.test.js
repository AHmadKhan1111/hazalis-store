const test = require("node:test");
const assert = require("node:assert");
const Product = require("../models/Product");
const { searchProducts } = require("../controllers/shop/search-controller");

test("searchProducts safely escapes special regex characters in keyword", async (t) => {
  let capturedQuery = null;

  // Mock Product.find
  const originalFind = Product.find;
  Product.find = async (query) => {
    capturedQuery = query;
    return [{ title: "Test Product" }];
  };

  t.after(() => {
    Product.find = originalFind;
  });

  const specialKeywords = [
    "[invalid-regex",
    "(a+)+",
    "cat|dog",
    "100$ sale?",
    ".*",
    "item[123]",
  ];

  for (const keyword of specialKeywords) {
    const req = { params: { keyword } };
    let jsonResult = null;
    let statusCode = null;

    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonResult = data;
        return this;
      },
    };

    await searchProducts(req, res);

    assert.strictEqual(statusCode, 200, `Expected HTTP 200 for keyword: ${keyword}`);
    assert.strictEqual(jsonResult.success, true);
    assert.ok(capturedQuery, "Query should be sent to Product.find");
    assert.ok(capturedQuery.$or, "Query should contain $or clause");

    // Check that $or[0].title is a RegExp and test matching exact string containing special chars
    const titleRegex = capturedQuery.$or[0].title;
    assert.ok(titleRegex instanceof RegExp, "Title condition should be a RegExp");

    // Verify the regex matches literal keyword string, not regex metacharacters
    assert.ok(
      titleRegex.test(`Prefix ${keyword} Suffix`),
      `Regex should match literal string: ${keyword}`
    );

    // Verify metacharacters are escaped (e.g. ".*" should not match "abc")
    if (keyword === ".*") {
      assert.strictEqual(
        titleRegex.test("abc"),
        false,
        "Escaped '.*' should not match arbitrary string 'abc'"
      );
    }
  }
});
