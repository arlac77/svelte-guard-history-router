const assert = require("assert");

describe("<Router> component", function() {
  this.slow(2000);
  this.timeout(3000);

  it("renders on the page", browser => {
    browser
      .url("http://localhost:5000")
      .expect.element("body")
      .to.be.present.before(1000);

    browser
      .waitForElementVisible("h1.routetitle")
      .assert.containsText(
        "h1.routetitle",
        "svelte-guard-history-router example"
      );

    browser.end();
  });
});
