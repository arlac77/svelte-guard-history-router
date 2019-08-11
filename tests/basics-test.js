const base = "http://localhost:5000";

describe("example", function() {
  it("entry-page-renders", browser => {
    browser
      .url(base)
      .expect.element("body")
      .to.be.present.before(1000);

    browser.assert.containsText("h1", "Example");

    browser.end();
  });
});
