import test from "ava";
import { setupRouter } from "./helpers/setup.mjs";
import { SkeletonRoute } from "../src/routes.mjs";
import { Transition } from "../src/transition.mjs";

test("route constructor", t => {
  const route = new SkeletonRoute("/a", { guard: 77 });

  t.is(route.path, "/a");
  t.is(route.guard, 77);
  t.is(route.objectInstance, Object);
});

test("route path", t => {
  const parent = new SkeletonRoute("/a");
  const route = new SkeletonRoute("/b", { parent });

  t.is(parent.path, "/a");
  t.is(route.parent, parent);
  t.is(route.path, "/a/b");
});

test("route common ancestor", t => {
  const parent = new SkeletonRoute("/parent");
  t.is(parent.commonAncestor(parent), parent);
  t.is(parent.commonAncestor(), undefined);

  const routeA = new SkeletonRoute("/a", { parent });
  t.is(routeA.commonAncestor(parent), parent);

  const routeB = new SkeletonRoute("/b", { parent });
  t.is(routeB.commonAncestor(routeA), parent);
});

test("route guard", async t => {
  const { router } = setupRouter();

  let parentGuardEntered = false;

  const parent = new SkeletonRoute("/base", {
    guard: {
      toString: () => "test",
      enter: transition => {
        parentGuardEntered = transition;
      }
    }
  });

  const route = new SkeletonRoute("/a", { parent });
  const transition = new Transition(router, "/base/a");
  await route.enter(transition);

  t.deepEqual(parentGuardEntered, transition);
});

test("route propertiesFor", t => {
  const parent = new SkeletonRoute("/a");
  const route = new SkeletonRoute("/b", {
    parent,
    propertyMapping: { repository: "name" }
  });

  t.deepEqual(route.propertyMapping, { repository: "name" });
  t.deepEqual(route.propertiesFor({ name: "r1" }), { repository: "r1" });
});

test("route propertiesFor deep refs", t => {
  const route = new SkeletonRoute("/a", {
    propertyMapping: { repository: "name", group: "owner.name" }
  });

  t.deepEqual(route.propertiesFor({ name: "r1", owner: { name: "g1" } }), {
    group: "g1",
    repository: "r1"
  });
});

test("route objectFor", t => {
  const object = { x: 77 };

  const parent = new SkeletonRoute("/a", {
    objectFor: properties => {
      return object;
    }
  });

  const route = new SkeletonRoute("/b", { parent });

  t.deepEqual(route.objectFor({ repository: "repo1" }), object);
  t.deepEqual(parent.objectFor({ repository: "repo1" }), object);
});

test("route objectInstance", t => {
  const parent = new SkeletonRoute();
  t.is(parent.objectInstance, Object);

  const child = new SkeletonRoute("c", { parent, objectInstance: Date });
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
