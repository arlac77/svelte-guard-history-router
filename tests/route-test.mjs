import test from "ava";
import { SkeletonRoute, ChildStoreRoute } from "../src/routes.mjs";

test("route path", t => {
  const parentRoute = new SkeletonRoute();
  parentRoute._path = "/a";

  t.is(parentRoute.path, "/a");

  const route = new SkeletonRoute();
  route._parent = parentRoute;
  route._path = "/b";

  t.is(route.path, "/a/b");
});

test("route guard", t => {
  let parentGuardEntered = false;
  const parentRoute = new SkeletonRoute();
  parentRoute._guard = { enter: x => (parentGuardEntered = x) };

  const route = new SkeletonRoute();
  route._parent = parentRoute;

  const transition = {};
  route.enter(transition);

  t.deepEqual(parentGuardEntered, transition);
});

test("route propertiesFor", t => {
  const parentRoute = new SkeletonRoute();
  const route = new SkeletonRoute();
  route._parent = parentRoute;

  t.deepEqual(route.propertiesFor({ name: "repo1" }), undefined);

  route._propertyMapping = { repository: "name" };
  t.deepEqual(route._propertyMapping, { repository: "name" });
  t.deepEqual(route.propertiesFor({ name: "repo1" }), { repository: "repo1" });
});

test("route objectFor", t => {
  const parentRoute = new SkeletonRoute();

  const route = new SkeletonRoute();
  route._parent = parentRoute;

  t.deepEqual(route.objectFor({ repository: "repo1" }), undefined);
});

test("route objectInstance", t => {
  const route = new SkeletonRoute();

  t.is(route.objectInstance, Object);

  route._objectInstance = Number;
  t.is(route.objectInstance, Number);


  const child = new ChildStoreRoute();

  child._parent = route;
  t.is(child.objectInstance, Number);
});

test("route subscription", t => {
  const route = new SkeletonRoute();

  route.value = 4711;

  let changed;

  route.subscribe(x => (changed = x));

  t.is(changed, 4711);
});


