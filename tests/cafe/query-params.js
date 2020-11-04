import { Selector } from "testcafe";
import { base, login } from "./helpers/util.js";

fixture`Query Params`.page`${base}/article?q=Pizza`;

test("query params extracted", async t => {
  const title = Selector(".routetitle");

  await login(t);

  await t.expect(title.innerText).eql("Articles");
  await t.expect(Selector("#filter").value).eql("Pizza");
});
