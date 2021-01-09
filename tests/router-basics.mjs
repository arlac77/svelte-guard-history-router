import test from "ava";
import { JSDOM } from "jsdom";
import { BaseRouter } from "../src/base-router.mjs";
import { MasterRoute } from "../src/master-route.mjs";

test.beforeEach(() => {
  const dom = new JSDOM(``, {
    url: "https://example.org/"
  });

  globalThis.window = dom.window;
  globalThis.history = dom.window.history;
});

/*test.afterEach(() => {
  delete globalThis.window;
  delete globalThis.history;
});*/

test.serial("router basics", t => {
  const router = new BaseRouter([], "/base");
  t.is(router.base, "/base", "given base");
  t.is(router.path, "", "empty path");
  t.deepEqual(router.params, {}, "no params");
  t.is(router.route, undefined, "no route");
  t.is(router.component, undefined, "no component");
  t.is(router.searchParams.get("q"), null);
});

test.serial("push encoded path", async t => {
  const router = new BaseRouter([], "");

  await router.push("/%20with%20spaces?q=a");

  t.is(router.path, "/ with spaces?q=a");
  t.is(router.searchParams.get("q"), "a");
});

test.serial("router replace", async t => {
  const router = new BaseRouter([new MasterRoute("/aRoute")], "");
  await router.replace("/aRoute");

  t.is(router.state.route.path, "/aRoute");
  t.is(router.path, "/aRoute");
});

test.serial("replace encoded path", async t => {
  const router = new BaseRouter([new MasterRoute("/other spaces")], "");
  await router.replace("/other%20spaces?q=a");

  t.is(router.state.route.path, "/other spaces");
  t.is(router.path, "/other spaces?q=a");
  t.is(router.searchParams.get("q"), "a");
});
