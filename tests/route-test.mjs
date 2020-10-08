import test from "ava";
import { setupRouter } from "./helpers/setup.mjs";

import { SkeletonRoute, ChildStoreRoute } from "../src/routes.mjs";
import { Transition } from "../src/transition.mjs";

test("route common ancestor", t => {
  const parentRoute = new SkeletonRoute();
  parentRoute._path = "/parent";
  t.is(parentRoute.commonAncestor(parentRoute), parentRoute);
  t.is(parentRoute.commonAncestor(), undefined);

  const routeA = new SkeletonRoute();
  routeA._parent = parentRoute;
  routeA._path = "/a";
  t.is(routeA.commonAncestor(parentRoute), parentRoute);

  const routeB = new SkeletonRoute();
  routeB._parent = parentRoute;
  routeB._path = "/b";
  t.is(routeB.commonAncestor(routeA), parentRoute);
});

test("route path", t => {
  const parentRoute = new SkeletonRoute();
  parentRoute._path = "/a";

  t.is(parentRoute.path, "/a");

  const route = new SkeletonRoute();
  route._parent = parentRoute;
  route._path = "/b";

  t.is(route.path, "/a/b");
});

test("route guard", async t => {
  const { router } = setupRouter();

  const parentRoute = new SkeletonRoute();
  parentRoute._path = "/base";

  let parentGuardEntered = false;

  parentRoute._guard = {
    toString: () => "test",
    enter: transition => {
      parentGuardEntered = transition;
    }
  };

  const route = new SkeletonRoute();
  route._path = "/a";
  route._parent = parentRoute;

  const transition = new Transition(router, "/base/a");
  await route.enter(transition);

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
  route._propertyMapping = { repository: "name", group: "owner.name" };
  t.deepEqual(route.propertiesFor({ name: "r1", owner: { name: "g1" } }), {
    group: "g1",
    repository: "r1"
  });
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
  let changed,routeValue;

  route.subscribe(x => {
    routeValue = route.value;
    changed = x;
  });

  route.value = 4711;

  t.is(changed, 4711);
  t.is(routeValue, 4711);
});
