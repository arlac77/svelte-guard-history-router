import test from "ava";
import { SkeletonRoute, ChildStoreRoute } from "../src/routes.mjs";
import { Transition } from "../src/transition.mjs";
import { BaseRouter } from "../src/base-router.mjs";
import { setupRouter } from "./helpers/setup.mjs";

test("DetailRoute objectFor", async t => {
  const values = [{ id: 1 }, { id: 2 }];
  const parent = new SkeletonRoute("/master", {
    iteratorFor: transition => values,
    propertyMapping: { did: "id" }
  });
  const child = new ChildStoreRoute("/detail/:did", {
    parent
  });

  const router = new BaseRouter([parent, child], "");
  const transition = new Transition(router, "/master/detail/2");
  
  t.deepEqual(transition.params, { did: "2" });

  t.is(await child.objectFor(transition, { did: "7" }), undefined);

  await transition.start();

  t.is(await child.objectFor(transition, { did: "2" }), values[1]);
});
