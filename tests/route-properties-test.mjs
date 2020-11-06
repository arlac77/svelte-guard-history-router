import test from "ava";
import { SkeletonRoute } from "../src/routes.mjs";

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
