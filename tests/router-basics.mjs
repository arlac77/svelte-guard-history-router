import test from "ava";
import { setupRouter } from "./helpers/setup.mjs";
import { BaseRouter } from "../src/base-router.mjs";

setupRouter();

test("router basics", t => {
  const router = new BaseRouter([], "/base");
  t.is(router.base, "/base");
  t.is(router.path, "");
  t.is(router.searchParams.get("q"), null);

  /*
  router.replace("/somewhere?q=a");
  t.is(router.path, "/somewhere?q=a");
  t.is(router.searchParams.get("q"), "a");
  */
});
