import test from "ava";
import { setupRouter } from "./helpers/setup.mjs";
import { BaseRouter } from "../src/base-router.mjs";

setupRouter();

test("router basics", t => {
  const router = new BaseRouter([], "/base");
  t.is(router.base, "/base", "given base");
  t.is(router.path, "", "empty path");
  t.deepEqual(router.params, {}, "no params");
  t.is(router.route, undefined, "no route");
  t.is(router.component, undefined, "no component");
  t.is(router.searchParams.get("q"), null);

  /*
  router.replace("/somewhere?q=a");
  t.is(router.path, "/somewhere?q=a");
  t.is(router.searchParams.get("q"), "a");
  */
});

test("use encoded path", async t => {
  const router = new BaseRouter([], "");

  await router.push("/%20with%20spaces");

  t.is(router.path, "/ with spaces");
});
