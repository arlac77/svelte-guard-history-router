const assert = require("assert");

const base = "http://localhost:5000";

const sg = (t, name = "xxx") =>
  `test-results/${t.test.fullTitle().replace(/\s+/, "-", "g")}-${name}.png`;

const articles = {
  "01": {
    name: "Peanutbutter",
    price: 1.2
  },
  "02": { name: "Cheesecake" },
  "03": { name: "Hot Dog" },
  "10": { name: "Pizza Quattro Stagioni" },
  "11": { name: "Pizza Salami" },
  "12": { name: "Pizza Hawaii" },
  "13": { name: "Pizza Margherita" },
  "14": { name: "Pizza Funghi" }
};

const al = (id) => { return { path: `/article/${id}`, title: `Article ${articles[id].name}`}; };

const links = [
  { path: "/about", title: "About" },
 // { path: "/index.html", redirect:"/", title: "Home" },
 { path: "/article", title: "Articles" },
 al('01'),
 { path: "/article", title: "Articles" },
 al('02'),
 { path: "/article", title: "Articles" },
 al('03')


 /*
 { path: "/article/01", title: "Peanutbutter" },
 { path: "/article/02", title: "Article Cheesecake" },
 { path: "/article/03", title: "Article Hot Dog" },
{ path: "/article/03", title: "Article Hot Dog" },
{ path: "/article/12", title: "Article Pizza Hawaii" },
{ path: "/article/14", title: "Article Pizza Funghi" }
*/
];

describe("router", function() {
  this.slow(2000);
  this.timeout(3000);

  /*
  it("navigate-on-link", async function(browser) {
    for (const l of links) {
      await browser.url(`${base}${l.path}`);
      await browser.saveScreenshot(sg(this, l.title));
      await browser.waitForElementVisible("h2.routetitle");
      await browser.assert.containsText("h2.routetitle", l.title);
      await browser.assert.urlEquals(`${base}${l.redirect?l.redirect:l.path}`);
    }
    browser.end();
  });
*/

  it("clicking-on-link", async function(browser) {
    await browser.url(`${base}`);

    for (const l of links) {
      await browser.waitForElementVisible(`a[href="${l.path}"]`);
      await browser.saveScreenshot(sg(this, l.title));
      await browser.click(`a[href="${l.path}"]`);
      await browser.assert.containsText("h2.routetitle", l.title);
    }
    browser.end();
  });
  
});
