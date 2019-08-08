const assert = require("assert");

const base = "http://localhost:5000";

const sg = (t,name='xxx') => `test-results/${t.test.fullTitle()}-${name}.png`

describe("router", function() {
  this.slow(2000);
  this.timeout(3000);

  it("renders-on-the-page", browser => {
    browser
      .url(base)
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

  it("navigate-url-routes", browser => {
    browser
      .url(`${base}/`)
      .waitForElementVisible("h2.routetitle")
      .assert.containsText("h2.routetitle", "Home");

    browser
      .url(`${base}/index.html`)
      .waitForElementVisible("h2.routetitle")
      .assert.containsText("h2.routetitle", "Home");

    browser
      .url(`${base}/about`)
      .waitForElementVisible("h2.routetitle")
      .assert.containsText("h2.routetitle", "About");

    /*
    browser
      .url(`${base}/article/01`)
      .waitForElementVisible("h2.routetitle")
      browser.saveScreenshot("./url-article-01.png")
      .assert.containsText("h2.routetitle", "Article Peanutbutter");
*/
    browser.end();
  });

  it("clicking-on-link", function(browser) {
    browser
      .url(`${base}`)
      .waitForElementVisible('a[href="/about"]')
      .click('a[href="/about"]', () => {
        browser.saveScreenshot(sg(this,'click-about'));
        browser
          .waitForElementVisible("h2.routetitle")
          .assert.containsText("h2.routetitle", "About")
          .click('a[href="/"]', () => {
            browser.saveScreenshot(sg(this,'click-home'));
            browser
              .waitForElementVisible("h2.routetitle")
              .assert.containsText("h2.routetitle", "Home")
              .click('a[href="/article/01"]', () => {
                browser.saveScreenshot(sg(this,'click-article-01'));
                browser
                  .waitForElementVisible("h2.routetitle")
                  .assert.containsText("h2.routetitle", "Article Peanutbutter");
                browser.end();
              });
          });
      });
  });


  it("clicking-through-articles", function(browser) {
    browser
    .url(`${base}`)
    .click('a[href="/article"]', () => {
      browser.saveScreenshot(sg(this,'articles'));

      browser
      .waitForElementVisible("h2.routetitle")
      .assert.containsText("h2.routetitle", "Articles");

      browser.end();
    });
  });


});
