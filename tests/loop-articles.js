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

  it("clicking-on-link", async function(browser) {
    await browser.url(`${base}`);

    for (const l of [
      { path: "/about", title: "About" },
      { path: "/articles", title: "Articles" } /*, 
      { path: "/article/01", title: "Article Peanutbutter" }*/
    ]) {
        console.log('enter', l.path);
      await browser.pause(1000);
      await browser.waitForElementVisible(`a[href="${l.path}"]`);
      await browser.saveScreenshot(sg(this, l.title));
      await browser.click(`a[href="${l.path}"]`);
      await browser.assert.containsText("h2.routetitle", l.title);
      console.log('exit', l.path);

    }

    browser.end();
  });
});
