import { Selector } from "testcafe";
import { base } from "./helpers/config.js";

fixture`Query Params`.page`${base}/article?q=Pizza`;

test("query params extracted", async t => {
  const title = Selector(".routetitle");

  if (await Selector("#submit").exists) {
    await t
      .typeText("#username", "user", { replace: true })
      .typeText("#password", "secret", { replace: true })
      .click("#submit");
  }

  await t.expect(title.innerText).eql("Articles");
  await t.expect(Selector("#filter").value).eql("Pizza");
});
