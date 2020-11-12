import test from "ava";
import { BaseTransition } from "../src/base-transition.mjs";

test("BaseTransition static", async t => {
  const bt = new BaseTransition();

  t.falsy(bt.nested);

  t.false(await bt.abort());
  t.false(await bt.continue());

  bt.nest("", BaseTransition);
});

test("BaseTransition lifecycle", async t => {
  const bt = new BaseTransition();

  const nl = bt.nest("a", BaseTransition);

  t.true(bt.nested instanceof BaseTransition);

  await nl;

  await bt.abort();
  t.falsy(bt.nested);
});
