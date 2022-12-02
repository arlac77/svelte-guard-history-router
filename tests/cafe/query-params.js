import { Selector } from "testcafe";
import { base, login } from "./helpers/util.js";

fixture`Query Params`.page`${base}article?filter:name=Pizza`;

test("query params extracted", async t => {
  const title = Selector(".routetitle");

  await login(t);

  await t.expect(title.innerText).eql("Articles");
  
  await t.expect(Selector("#filter_name").value).eql("Pizza");

  /*
  await t.typeText("#filter_name", "Hot", { replace: true });
  */
});
