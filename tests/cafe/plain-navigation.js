import { Selector, ClientFunction } from "testcafe";
import { articles } from "../app/src/data.js";

const getLocation = ClientFunction(() => window.location.href);
const goBack = ClientFunction(() => window.history.back());

const al = id => {
  return {
    path: `/article/${id}#price`,
    title: `Article ${articles[id].name}`
  };
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

const base =
  "http://localhost:5000/components/svelte-guard-history-router/tests/app";

fixture`Getting Started`.page`${base}/index.html`;

test("click arund", async t => {
  let first = true;

  for (const l of links) {
    const a = Selector("a").withAttribute("href", l.path);

    await t.click(a);

    if (l.path.startsWith("/article") && first) {
      await t
        .typeText("#username", "user", { replace: true })
        .typeText("#password", "secret", { replace: true })
        .click("#submit");

      first = false;
    }

    const title = Selector(".routetitle");
    await t.expect(title.innerText).eql(l.title);

    await t.expect(getLocation()).contains(l.path);
  }
});

test("routing failure", async t => {
  await t.click(Selector("a").withAttribute("href", "/about"));

  //console.log(await getLocation());

  const title = Selector(".routetitle");
  const a = Selector("a").withAttribute("href", "/about");

  await t.click(a).expect(title.innerText).eql("About");
});

test.page`${base}/about`("about", async t => {
  const title = Selector(".routetitle");
  await t.expect(title.innerText).eql("About");
});

test.page`${base}/article/10`("article/10#price", async t => {
  const title = Selector(".routetitle");

  await t
    .typeText("#username", "user", { replace: true })
    .typeText("#password", "secret", { replace: true })
    .click("#submit");

  //console.log(await t.getBrowserConsoleMessages());

  await t.expect(title.innerText).eql("Article Pizza Quattro Stagioni");
});

test("Navigate around", async t => {
  const title = Selector(".routetitle");

  await t.navigateTo(`${base}/about`).expect(title.innerText).eql("About");

  console.log(await getLocation());

  await t.navigateTo(`${base}/article`);

  //console.log(await getLocation());

  await t
    .typeText("#username", "user", { replace: true })
    .typeText("#password", "secret", { replace: true })
    .click("#submit");

  await t.expect(title.innerText).eql("Articles");

  //console.log(await getLocation());

  await t.expect(getLocation()).contains("article");

  const a = Selector("a").withAttribute("href", "/article/18#price");
  await t.click(a);
  await t.expect(getLocation()).contains("article/18");
  await t.expect(title.innerText).contains("Pizza Prosciutto");

  //console.log(await getLocation());

  await goBack();

  //console.log(await getLocation());
  /* await t.expect(getLocation()).contains("article");
  await t.expect(title.innerText).eql("Articles");
  await t.expect(getLocation()).contains("about");
  await t.expect(title.innerText).eql("About");
*/
});
