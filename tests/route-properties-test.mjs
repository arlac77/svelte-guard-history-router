import test from "ava";
import { SkeletonRoute } from "../src/routes.mjs";

test("route propertiesFor", t => {
  const route = new SkeletonRoute("", {
    parent: new SkeletonRoute(""),
    propertyMapping: { repository: "name" }
  });

  t.deepEqual(route.propertyMapping, { repository: "name" });
  t.deepEqual(route.propertiesFor({ name: "r" }), { repository: "r" });
});

test("route propertiesFor property paths", t => {
  const route = new SkeletonRoute("", {
    parent: new SkeletonRoute(""),
    propertyMapping: { repository: "name", group: "group.name" }
  });

  t.deepEqual(route.propertiesFor({ name: "r", group: { name: "g" } }), {
    group: "g",
    repository: "r"
  });
});
