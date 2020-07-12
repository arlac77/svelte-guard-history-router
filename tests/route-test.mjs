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
  t.deepEqual(route.propertiesFor({ name: "r1" }), { repository: "r1" });
});

test("route propertiesFor deep refs", t => {
  const route = new SkeletonRoute();
  route._propertyMapping = { repository: "name", "group" : "owner.name" };
  t.deepEqual(route.propertiesFor({ name: "r1", owner: { name: "g1"} }), { group: "g1", repository: "r1" });
});

test("route objectFor", t => {
  const parentRoute = new SkeletonRoute();

  const object = { x: 77 };

  parentRoute.objectFor = properties => {
    return object;
  };

  const route = new SkeletonRoute();
  route._parent = parentRoute;

  t.deepEqual(route.objectFor({ repository: "repo1" }), object);
  t.deepEqual(parentRoute.objectFor({ repository: "repo1" }), object);
});

test("route objectInstance", t => {
  const route = new SkeletonRoute();
  t.is(route.objectInstance, Object);

  route._objectInstance = Number;
  t.is(route.objectInstance, Number);

  const child = new ChildStoreRoute();
  child._objectInstance = Date;

  child._parent = route;
  t.is(child.objectInstance, Date);
});

test("route subscription", t => {
  const route = new SkeletonRoute();

  route.value = 4711;

  let changed;

  route.subscribe(x => (changed = x));

  t.is(changed, 4711);
});
