import test from "ava";
import { BaseRouter } from "../src/base-router.mjs";
import { Master, Detail, Leaf, setupRoute } from "./helpers/setup.mjs";

globalThis.window = {
  location: { pathname: "" },
  addEventListener: () => {}
};

test("router", async t => {
  const { master } = setupRoute();
  const router = new BaseRouter();

  t.is(router.routeFor(undefined), undefined);
});
