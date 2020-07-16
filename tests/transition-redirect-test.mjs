import test from "ava";
import { Transition } from "../src/transition.mjs";

import { Master, Detail, Leaf, setupRouter } from "./helpers/setup.mjs";

test("route master detail subscription", async t => {
  const { router, detail, model } = setupRouter();

  const transition = new Transition(router, "/master/2");
  await transition.start();
  transition.redirect("/login");

  t.truthy(transition.redirected);

  await transition.continue();
  t.falsy(transition.redirected);
});

