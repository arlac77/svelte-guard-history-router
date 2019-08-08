const assert = require("assert");

const base = "http://localhost:5000";

const sg = (t, name = "xxx") =>
  `test-results/${t.test.fullTitle().replace(/\s+/, "-", "g")}-${name}.png`;

const articles = {
  "01": { name: "Peanutbutter" },
  "02": { name: "Cheesecake" },
  "03": { name: "Pizza Four Seasons" },
  "04": { name: "Pizza Salami" },
  "05": { name: "Pizza Hawaii" }
};

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

  it("navigate-url-routes", function(browser) {
    browser
      .url(`${base}/`)
      .waitForElementVisible("h2.routetitle")
      .assert.containsText("h2.routetitle", "Home")
      .assert.urlEquals(`${base}/`);

    browser
      .url(`${base}/index.html`)
      .waitForElementVisible("h2.routetitle")
      .saveScreenshot(sg(this, "index"))
      .assert.containsText("h2.routetitle", "Home")
      .assert.urlEquals(`${base}/`);

    browser
      .url(`${base}/about`)
      .waitForElementVisible("h2.routetitle")
      .assert.containsText("h2.routetitle", "About")
      .assert.urlEquals(`${base}/about`);

    /*
    browser
      .url(`${base}/article/01`)
      .saveScreenshot(sg(this,'pre-article-01'))
      .waitForElementVisible("h2.routetitle")
      .saveScreenshot(sg(this,'article-01'))
      .assert.containsText("h2.routetitle", "Article Peanutbutter");
*/
    browser.end();
  });

  it("clicking-on-link", function(browser) {
    browser
      .url(`${base}`)
      .waitForElementVisible('a[href="/about"]')
      .click('a[href="/about"]', () => {
        browser
          .saveScreenshot(sg(this, "click-about"))
          .assert.urlContains("/about");

        browser
          .waitForElementVisible("h2.routetitle")
          .assert.containsText("h2.routetitle", "About")
          .click('a[href="/"]', () => {
            browser.saveScreenshot(sg(this, "click-home"));
            browser
              .waitForElementVisible("h2.routetitle")
              .assert.containsText("h2.routetitle", "Home")
              .click('a[href="/article/01"]', () => {
                browser
                  .saveScreenshot(sg(this, "click-article-01"))
                  .waitForElementVisible("h2.routetitle")
                  .assert.containsText("h2.routetitle", "Article Peanutbutter")
                  .assert.urlEquals(`${base}/article/01`);

                browser.end();
              });
          });
      });
  });

  it("browse-through-articles", async function(browser) {
    browser.url(`${base}`).click('a[href="/article"]', async () => {
      browser
        .saveScreenshot(sg(this, "overview"))
        .waitForElementVisible("h2.routetitle")
        .assert.containsText("h2.routetitle", "Articles")
        .assert.urlEquals(`${base}/article`);

      const checkArticle = async (id,article) => {
        await browser.click(`a[href="/article/${id}"]`, () => {
          browser
            .waitForElementVisible("h2.routetitle")
            .saveScreenshot(sg(this, `click-${id}`))
            .assert.urlEquals(`${base}/article/${id}`)
            .assert.containsText("h2.routetitle", `Article ${article.name}`)
        });
      };

      for (const id of Object.keys(articles)) {
        await checkArticle(id, articles[id]);
      }

      browser.end();
    });
  });
});
