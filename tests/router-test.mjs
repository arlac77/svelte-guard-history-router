import test from "ava";
import { BaseRouter } from "../src/base-router.mjs";
import { Master, Detail, Leaf, setupRoute } from "./helpers/setup.mjs";

globalThis.window = {
  location: { pathname: "" },
  addEventListener: () => {}
};

function rft(t, object, expected) {
  const { master, detail, leaf } = setupRoute();
  const router = new BaseRouter();
  router.addRoute(master);
  router.addRoute(detail);
  router.addRoute(leaf);
  t.is(router.routeFor(object), router.routes.find(r => r.path === expected));
}

rft.title = (providedTitle = "", object, expected) =>
  `router routeFor ${providedTitle} ${JSON.stringify(object)} ${JSON.stringify(
    expected
  )}`.trim();

  test(rft, undefined, undefined);
  test(rft, {}, undefined);
  test(rft, new Date(), undefined);
  test(rft, new Detail(1), '/master/:detail');
  test(rft, new Leaf('b'), '/master/:detail/:leaf');
