import { Selector } from "testcafe";

const base = "http://localhost:5000";

fixture`Getting Started`.page`${base}/index.html`;

test("can load", async t => {
    const title = Selector("h1");

    await t
      .expect(title.innerText)
      .eql("Example");
  }
);
