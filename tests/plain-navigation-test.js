import { Selector } from "testcafe";

const articles = {
  "01": {
    name: "Peanutbutter",
    category: "staple",
    price: 1.98
  },
  "02": { name: "Cheesecake", price: 2.0, category: "dessert" },
  "03": { name: "Hot Dog", price: 2.0, category: "to go" },
  "10": { name: "Pizza Quattro Stagioni", price: 8.0, category: "pizza" },
  "11": { name: "Pizza Salami", price: 7.0, category: "pizza" },
  "12": { name: "Pizza Hawaii", price: 7.0, category: "pizza" },
  "13": { name: "Pizza Margherita", price: 5.0, category: "pizza" },
  "14": { name: "Pizza Funghi", price: 7.0, category: "pizza" }
};

Object.keys(articles).forEach(id => (articles[id].id = id));

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

test("click arund", async t => {
  for (const l of links) {
    const title = Selector(".routetitle").withText(l.title);
    const a = Selector("a").withAttribute("href", l.path);

    await t
      .click(a)
     // .takeScreenshot()
      .expect(title.innerText)
      .eql(l.title);
  }
});

test("routing failure", async t => {
    await t.click(Selector("a").withAttribute("href", "/about"));

    const title = Selector(".routetitle").withText('About');
    const a = Selector("a").withAttribute("href", "/noway");

    await t
      .click(a)
      .expect(title.innerText)
      .eql("About");
});


test.page`${base}/about`("about", async t => {
  const title = Selector(".routetitle").withText("About");
  await t.expect(title.innerText).eql("About");
});

test.page`${base}/article/10`("artices/10", async t => {
  const title = Selector(".routetitle").withText("Article Pizza Quattro Stagioni");
  await t.expect(title.innerText).eql("Article Pizza Quattro Stagioni");
});

/*
test("Navigate around", async t => {
  const title = Selector(".routetitle");

  await t
    .navigateTo(`/base/about`)
    .expect(title.innerText)
    .eql("About");
});
*/
