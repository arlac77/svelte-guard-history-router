import test from "ava";
import { BaseRouter } from "../src/base-router.mjs";
import { Master, Detail, Leaf, setupRoute } from "./helpers/setup.mjs";

globalThis.window = {
  location: { pathname: "" },
  addEventListener: () => {}
};

function rft(t, object, expected) {
  const { master, detail, leaf, ext1 } = setupRoute();
  const router = new BaseRouter();
  router.addRoute(master);
  router.addRoute(detail);
  router.addRoute(leaf);
  router.addRoute(ext1);

 // console.log(router.routes.map(r => `${r.path} ${r.priority}`));

  t.is(
    router.routeFor(object),
    router.routes.find(r => r.path === expected)
  );
}

rft.title = (providedTitle = "", object, expected) =>
  `router routeFor ${providedTitle} ${JSON.stringify(object)} ${JSON.stringify(
    expected
  )}`.trim();

test(rft, undefined, undefined);
test(rft, {}, undefined);
test(rft, new Date(), undefined);
test(rft, new Detail(1), "/master/:detail");
test(rft, new Leaf("b"), "/master/:detail/:leaf");
