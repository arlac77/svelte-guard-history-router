import { Selector } from "testcafe";

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

const al = id => {
  return { path: `/article/${id}`, title: `Article ${articles[id].name}` };
};

const links = [
  { path: "/about", title: "About" },
  // { path: "/index.html", redirect:"/", title: "Home" },
  { path: "/article", title: "Articles" },
  al("01"),
  { path: "/article", title: "Articles" },
  al("02"),
  { path: "/about", title: "About" },
  { path: "/article", title: "Articles" },
  al("03"),
  { path: "/article", title: "Articles" },
  al("12")
];

const base = "http://localhost:5000/base";

fixture`Getting Started`.page`${base}/index.html`;

test("Click arund", async t => {
  for (const l of links) {
    const title = Selector(".routetitle").withText(l.title);
    const a = Selector("a").withAttribute("href", l.path);

    await t
      .click(a)
      .takeScreenshot()
      .expect(title.innerText)
      .eql(l.title);
  }
});

test("Navigate around", async t => {
  for (const l of links) {
    if (!l.path.match(/\d+/)) {
      const title = Selector(".routetitle").withText(l.title);

      await t
        .navigateTo(base + l.path)
        .takeScreenshot()
        .expect(title.innerText)
        .eql(l.title);
    }
  }
});
