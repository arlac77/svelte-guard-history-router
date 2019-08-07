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

  it("selecting routes", browser => {
    browser
      .url("http://localhost:5000/")
      .waitForElementVisible("h2.routetitle")
      .assert.containsText("h2.routetitle", "Home");

    browser
      .url("http://localhost:5000/index.html")
      .waitForElementVisible("h2.routetitle")
      .assert.containsText("h2.routetitle", "Home");

    browser
      .url("http://localhost:5000/about")
      .waitForElementVisible("h2.routetitle")
      .assert.containsText("h2.routetitle", "About");

    browser.end();
  });

  it("clicking on link", browser => {
    browser
      .url("http://localhost:5000/")
      .waitForElementVisible('a[href="/about"]')
      .click('a[href="/about"]', () => {
        browser
          .waitForElementVisible("h2.routetitle")
          .assert.containsText("h2.routetitle", "About")
          .click('a[href="/"]', () => {
            browser
              .waitForElementVisible("h2.routetitle")
              .assert.containsText("h2.routetitle", "Home");
            browser.end();
          });
      });
  });
});
