import test from "ava";
import { SkeletonRoute } from "../src/routes.mjs";

test("route propertiesFor with", t => {
  const route = new SkeletonRoute("", {
    parent: new SkeletonRoute(""),
    propertyMapping: { repository: "name", id: "id" }
  });

  t.deepEqual(route.propertyMapping, { repository: "name", id: "id" });
  t.deepEqual(route.propertiesFor({ name: "r", id: 7 }), {
    repository: "r",
    id: "7"
  });
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
