import test from "ava";
import { SkeletonRoute } from "svelte-guard-history-router";

test("route path", t => {
  const parentRoute = new SkeletonRoute();
  parentRoute.localPath = "/a";

  const route = new SkeletonRoute();

  route.parent = parentRoute;
  route.localPath = "/b";

  t.is(route.path, "/a/b");
});
