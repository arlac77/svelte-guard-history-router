import test from "ava";
import { Transition } from "../src/transition.mjs";
import { setupRouter } from "./helpers/setup.mjs";

test("transition redirect", async t => {
  const { router } = setupRouter();

  const transition = new Transition(router, "/protected");
  await transition.start();
  transition.redirect("/login");

  t.truthy(transition.redirected);

  await transition.continue();
  t.falsy(transition.redirected);
});

