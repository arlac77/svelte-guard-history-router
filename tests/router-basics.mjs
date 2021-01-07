import test from "ava";
import { setupRouter } from "./helpers/setup.mjs";
import { BaseRouter } from "../src/base-router.mjs";
import { MasterRoute } from "../src/master-route.mjs";

setupRouter();

test("router basics", t => {
  const router = new BaseRouter([], "/base");
  t.is(router.base, "/base", "given base");
  t.is(router.path, "", "empty path");
  t.deepEqual(router.params, {}, "no params");
  t.is(router.route, undefined, "no route");
  t.is(router.component, undefined, "no component");
  t.is(router.searchParams.get("q"), null);
});

test("push encoded path", async t => {
  const router = new BaseRouter([], "");

  await router.push("/%20with%20spaces?q=a");

  t.is(router.path, "/ with spaces?q=a");
  t.is(router.searchParams.get("q"), "a");
});

test("replace encoded path", async t => {
  const router = new BaseRouter([new MasterRoute("/other spaces")], "");
  await router.replace("/other%20spaces?q=a");

  t.is(router.state.route.path, "/other spaces");
  // t.is(router.path, "/other spaces?q=a");
  t.is(router.searchParams.get("q"), "a");
});
