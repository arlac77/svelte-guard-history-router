import test from "ava";
import { SkeletonRoute } from "../src/routes.mjs";
import { ChildStoreRoute } from "../src/detail-route.mjs";
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

  await transition.start();

  t.is(await child.objectFor(transition), values[1]);
});
