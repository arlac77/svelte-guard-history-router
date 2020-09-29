import test from "ava";
import { setupRouter } from "./helpers/setup.mjs";

test("router transition", async t => {
  const { router } = setupRouter();

  t.is(router.path, "/");
  t.falsy(router.transition);

  const transition = router.push("/master");

  t.truthy(router.transition);
  t.is(router.transition.path, "/master");

  await transition;

  t.falsy(router.transition);

  t.is(router.path, "/master");
});
