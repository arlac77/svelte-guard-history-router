import test from "ava";
import { setupRouter } from "./helpers/setup.mjs";
import { SkeletonRoute, ChildStoreRoute } from "../src/routes.mjs";
import { Transition } from "../src/transition.mjs";

test("route common ancestor", t => {
  const parentRoute = new SkeletonRoute("/parent");
  t.is(parentRoute.commonAncestor(parentRoute), parentRoute);
  t.is(parentRoute.commonAncestor(), undefined);

  const routeA = new SkeletonRoute("/a",parentRoute);
  t.is(routeA.commonAncestor(parentRoute), parentRoute);

  const routeB = new SkeletonRoute("/b",parentRoute);
  t.is(routeB.commonAncestor(routeA), parentRoute);
});

test("route path", t => {
  const parentRoute = new SkeletonRoute("/a");

  t.is(parentRoute.path, "/a");

  const route = new SkeletonRoute("/b",parentRoute);

  t.is(route.path, "/a/b");
});

test("route guard", async t => {
  const { router } = setupRouter();

  const parentRoute = new SkeletonRoute("/base");

  let parentGuardEntered = false;

  parentRoute.guard = {
    toString: () => "test",
    enter: transition => {
      parentGuardEntered = transition;
    }
  };

  const route = new SkeletonRoute("/a",parentRoute);

  const transition = new Transition(router, "/base/a");
  await route.enter(transition);

  t.deepEqual(parentGuardEntered, transition);
});

test("route propertiesFor", t => {
  const parentRoute = new SkeletonRoute();
  const route = new SkeletonRoute(undefined,parentRoute);

  t.deepEqual(route.propertiesFor({ name: "repo1" }), undefined);

  route.propertyMapping = { repository: "name" };
  t.deepEqual(route.propertyMapping, { repository: "name" });
  t.deepEqual(route.propertiesFor({ name: "r1" }), { repository: "r1" });
});

test("route propertiesFor deep refs", t => {
  const route = new SkeletonRoute();
  route.propertyMapping = { repository: "name", group: "owner.name" };
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

  const route = new SkeletonRoute(undefined,parentRoute);

  t.deepEqual(route.objectFor({ repository: "repo1" }), object);
  t.deepEqual(parentRoute.objectFor({ repository: "repo1" }), object);
});

test("route objectInstance", t => {
  const route = new SkeletonRoute();
  t.is(route.objectInstance, Object);

  route.objectInstance = Number;
  t.is(route.objectInstance, Number);

  const child = new ChildStoreRoute(undefined,route);
  child.objectInstance = Date;

  t.is(child.objectInstance, Date);
});

test("route subscription", t => {
  const route = new SkeletonRoute();
  let changed, routeValue;

  route.subscribe(x => {
    routeValue = route.value;
    changed = x;
  });

  route.value = 4711;

  t.is(changed, 4711);
  t.is(routeValue, 4711);
});
