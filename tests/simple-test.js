const assert = require("assert");

const base = "http://localhost:5000";

const sg = (t, name = "xxx") =>
  `test-results/${t.test.fullTitle().replace(/\s+/, "-", "g")}-${name}.png`;

const articles = {
  "01": {
    name: "Peanutbutter",
    price: 1.2,
    history: [{ price: 1.1 }, { price: 1.05 }, { price: 1.0 }]
  },
  "02": { name: "Cheesecake" },
  "03": { name: "Hot Dog" },
  "10": { name: "Pizza Quattro Stagioni" },
  "11": { name: "Pizza Salami" },
  "12": { name: "Pizza Hawaii" },
  "13": { name: "Pizza Margherita" },
  "14": { name: "Pizza Funghi" }
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
          .click('a[href="/article"]', () => {
            browser
              .saveScreenshot(sg(this, "click-home"))
              .waitForElementVisible("h2.routetitle")
              .assert.containsText("h2.routetitle", "Articles")
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

  /*
  it("clicking-on-link", async function(browser) {
    await browser.url(`${base}`);

    for (const l of [
      { path: "/about", title: "About" },
      { path: "/articles", title: "Articles" },
      { path: "/article/01", title: "Article Peanutbutter" }
    ]) {
      await browser.waitForElementVisible(`a[href="${l.path}"]`);
      browser.saveScreenshot(sg(this, l.title));
      await browser.click(`a[href="${l.path}"]`);
      await browser.assert.containsText("h2.routetitle", l.title);
    }
    browser.end();
  });
*/

  it("browse-through-articles", async function(browser) {
    browser.url(`${base}`).click('a[href="/article"]', async () => {
      await browser
        .saveScreenshot(sg(this, "overview"))
        .waitForElementVisible("h2.routetitle")
        .assert.containsText("h2.routetitle", "Articles")
        .assert.urlEquals(`${base}/article`);

      const ids = Object.keys(articles);

      const checkArticle = async i => {
        const id = ids[i];
        if (id === undefined) {
          browser.end();
          return;
        }
        console.log("check", id);
        const article = articles[id];

         await browser.click(`a[href="/article/${id}"]`, async () => {
           await browser
            .waitForElementVisible("h2.routetitle")
            .saveScreenshot(sg(this, `click-${id}`))
            .assert.urlEquals(`${base}/article/${id}`)
            .assert.containsText("h2.routetitle", `Article ${article.name}`);
           await checkArticle(i + 1);
        });

        console.log("done check", id);
      };

      await checkArticle(0);
    });
  });
});
