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


test("transition redirect + abort", async t => {
  const { router } = setupRouter();

  const transition = new Transition(router, "/protected");
  const start = transition.start();
  transition.redirect("/login");

  await router.abort();

  t.not(router.route.path,"/protected");

  t.pass("aborted");
  /*
  try {
    await start;
  }
  catch(e) {
  }
*/
 // t.is(transition.redirected,undefined);
  //t.is(router.route.path, "/protected");
});
