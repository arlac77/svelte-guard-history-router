import test from "ava";
import { SkeletonRoute, ChildStoreRoute } from "../src/routes.mjs";
import { Transition } from "../src/transition.mjs";
import { BaseRouter } from "../src/base-router.mjs";
import { setupRouter } from "./helpers/setup.mjs";

test("ChildStoreRoute objectFor", async t => {
  const parent = new SkeletonRoute("/master");
  const child = new ChildStoreRoute("/detail/:id", { parent });
  const router = new BaseRouter([parent, child], "");
  const transition = new Transition(router, "/master/detail/1");

  const o = await child.objectFor(transition,{});
  t.is(o,undefined);
});
