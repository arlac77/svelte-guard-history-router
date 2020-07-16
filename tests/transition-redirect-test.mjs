import test from "ava";
import { Transition } from "../src/transition.mjs";
import { setupRouter } from "./helpers/setup.mjs";

test("transition redirect", async t => {
  const { router, noLoginRequired } = setupRouter();

  const transition = new Transition(router, "/protected");
  const start = transition.start();
  transition.redirect("/login");

  t.truthy(transition.redirected);

  noLoginRequired();

  await transition.continue();

  await start;

  t.falsy(transition.redirected);

  t.is(router.route.path, "/protected");
});
