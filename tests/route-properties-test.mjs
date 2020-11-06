import test from "ava";
import { SkeletonRoute } from "../src/routes.mjs";

function rpt(t, route, object, expected) {
  t.deepEqual(route.propertiesFor(object), expected);
}

rpt.title = (providedTitle = "", route, object, expected) =>
  `router propertiesFor ${providedTitle} ${JSON.stringify(
    object
  )} ${JSON.stringify(expected)}`.trim();

const route1 = new SkeletonRoute("", {
  propertyMapping: { repository: "name", id: "id" }
});

test(
  rpt,
  route1,
  { name: "r", id: 7 },
  {
    repository: "r",
    id: "7"
  }
);

test(rpt, route1, undefined, undefined);
test(rpt, route1, { name: "r" }, undefined);

test(
  rpt,
  new SkeletonRoute("", {
    parent: new SkeletonRoute(""),
    propertyMapping: { repository: "name", group: "group.name" }
  }),
  { name: "r", group: { name: "g" } },
  {
    group: "g",
    repository: "r"
  }
);
