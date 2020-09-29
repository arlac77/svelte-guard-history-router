import test from "ava";
import { setupRouter } from "./helpers/setup.mjs";

test("router transition", async t => {
  const { router } = setupRouter();

  let subscriptionPath;

  router.subscribe(value => {
    //  console.log("SUBSCRIPTION", value);
    subscriptionPath = value.path;
  });

  t.is(history.length, 1);
  t.is(router.path, "/");
  t.falsy(router.transition);

  const transition = router.push("/master");

  t.truthy(router.transition);
  t.is(router.transition.path, "/master");

  t.is(subscriptionPath, "/"); // still on old path

  await transition;

  t.falsy(router.transition);

  t.is(router.path, "/master");

  t.is(history.length, 2);
});
