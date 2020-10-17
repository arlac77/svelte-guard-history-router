import test from "ava";
import { SkeletonRoute, ChildStoreRoute } from "../src/routes.mjs";
import { Transition } from "../src/transition.mjs";
import { BaseRouter } from "../src/base-router.mjs";
import { setupRouter } from "./helpers/setup.mjs";

test("DetailRoute objectFor", async t => {
  const values = [{ id: 1 }, { id: 2 }];
  const parent = new SkeletonRoute("/master", {
    iteratorFor: (transition, properties) => values
  });
  const child = new ChildStoreRoute("/detail/:id", {
    parent,
    propertyMapping: { id: "id" }
  });
  const router = new BaseRouter([parent, child], "");
  const transition = new Transition(router, "/master/detail/7");

  t.is(await child.objectFor(transition, { id: 7 }), undefined);
  t.is(await child.objectFor(transition, { id: 2 }), values[1]);
});
