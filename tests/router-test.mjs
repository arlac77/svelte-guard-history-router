import test from "ava";
import { Detail, Leaf, setupRouter } from "./helpers/setup.mjs";


function rft(t, object, expected) {
  const { router } = setupRouter();

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
test(rft, new Leaf("b"), "/master/:detail/filler/:leaf");
