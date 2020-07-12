import test from "ava";
import { Master, Detail, Leaf, setupRoute } from "./helpers/setup.mjs";

test("route master detail subscription", async t => {
  const { detail, model } = setupRoute();

  let detailValue;

  detail.subscribe(x => (detailValue = x));

  const transition = { path: "/master/2", router: { params: { detail: "2" } } };

  await detail.enter(transition);

  t.deepEqual(detailValue, model.details[1]);
});

test.skip("route master detail leaf subscription", async t => {
  const { leaf, model } = setupRoute();

  let leafValue;

  leaf.subscribe(x => (leafValue = x));

  const transition = {
    path: "/master/2/d",
    router: { params: { detail: "2", leaf: "d" } }
  };

  await leaf.enter(transition);

  t.deepEqual(leafValue, model.details[1].leafs[1]);
});
