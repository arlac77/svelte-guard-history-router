import test from "ava";
import { Transition } from "../src/transition.mjs";
import { setupRouter } from "./helpers/setup.mjs";

test("route master detail subscription", async t => {
  const { router, detail, model } = setupRouter();

  let detailValue;

  detail.subscribe(x => (detailValue = x));

  const transition = new Transition(router, "/master/2");
  await transition.start();

  t.deepEqual(detailValue, model.details[1]);
});

test("route master detail leaf subscription", async t => {
  const { router, leaf, model } = setupRouter();

  let leafValue;

  leaf.subscribe(x => (leafValue = x));

  const transition = new Transition(router, "/master/2/filler/d");
  await transition.start();

  t.deepEqual(leafValue, model.details[1].leafs[1]);
});
