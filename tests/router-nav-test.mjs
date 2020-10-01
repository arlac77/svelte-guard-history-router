import test from "ava";
import { setupRouter } from "./helpers/setup.mjs";

async function rtt(t, path, componentName) {
  const { router } = setupRouter();

  let subscriptionPath, subscriptionComponent;

  router.subscribe(router => {
    subscriptionPath = router.path;
    subscriptionComponent = router.component;
  });

  const startPath = subscriptionPath;
  const startHistoryLength = history.length;
  //t.is(history.length, 1);
  t.is(router.path, startPath);
  t.falsy(router.component);
  t.falsy(router.transition);

  const transition = router.push(path);

  t.truthy(router.transition);
  t.is(router.transition.path, path);
  t.is(subscriptionPath, startPath);

  await transition;

  t.falsy(router.transition);
  t.is(router.path, path);
  t.is(router.component.name, componentName);
  t.is(subscriptionPath, path);
  t.is(subscriptionComponent.name, componentName);
  t.is(history.length, startHistoryLength + 1);
  t.is(window.location.pathname, path);
}

rtt.title = (providedTitle = "", path, componentName) =>
  `router transition ${providedTitle} ${path}}`.trim();

test.serial(rtt, "/master", "MasterComponent");
test.serial(rtt, "/master/1", "DetailComponent");
