import test from "ava";
import { SkeletonRoute } from "../src/routes.mjs";

test("route path", t => {
  const parentRoute = new SkeletonRoute();
  parentRoute._path = "/a";

  t.is(parentRoute.path, "/a");

  const route = new SkeletonRoute();
  route._parent = parentRoute;
  route._path = "/b";

  t.is(route.path, "/a/b");
});

test("route propertiesFor", t => {
  const parentRoute = new SkeletonRoute();
  parentRoute._path = "/a";
  const route = new SkeletonRoute();
  route._parent = parentRoute;
  route._path = "/b";

  t.deepEqual(route.propertiesFor({ name: "repo1" }), undefined);
});

test("route objectFor", t => {
  const parentRoute = new SkeletonRoute();
  parentRoute._path = "/a";
  const route = new SkeletonRoute();
  route._parent = parentRoute;
  route._path = "/b";

  t.deepEqual(route.objectFor({ repository: "repo1" }), undefined);
});

test("route subscription", t => {
  const route = new SkeletonRoute();

  let value;
  Object.defineProperties(route, {
    value: { get: () => value, set: v => (value = v) }
  });

  route.value = 4711;

  let changed;

  route.subscribe(x => (changed = x));

  t.is(changed, 4711);
});
