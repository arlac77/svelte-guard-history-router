import test from "ava";
import { setupRouter } from "./helpers/setup.mjs";

test("router transition", async t => {
  const { router } = setupRouter();

  let subscriptionPath,subscriptionComponent;

  router.subscribe(router => {
    //console.log("SUBSCRIPTION", router.path);
    subscriptionPath = router.path;
    subscriptionComponent = router.component;
  });

  t.is(subscriptionPath, "/");

  t.is(history.length, 1);
  t.is(router.path, "/");
  t.falsy(router.component);
  t.falsy(router.transition);

  const transition = router.push("/master");

  t.truthy(router.transition);
  t.is(router.transition.path, "/master");
  t.is(subscriptionPath, "/"); // still on old path

  await transition;

  t.falsy(router.transition);
  t.is(router.path, "/master");
  t.is(router.component.name, "MasterComponent");
  t.is(subscriptionPath, "/master");
  t.is(subscriptionComponent.name, "MasterComponent");
  t.is(history.length, 2);
  t.is(window.location.pathname, "/master");
});
