import test from "ava";
import { SkeletonRoute } from "svelte-guard-history-router";

test("route path", t => {
  const parentRoute = new SkeletonRoute();
  parentRoute.localPath = "/a";

  t.is(parentRoute.path, "/a");

  const route = new SkeletonRoute();
  route.parent = parentRoute;
  route.localPath = "/b";

  t.is(route.path, "/a/b");
});



test("route propertiesFor", t => {
  const parentRoute = new SkeletonRoute();
  parentRoute.localPath = "/a";
  const route = new SkeletonRoute();
  route.parent = parentRoute;
  route.localPath = "/b";

 // route.propertyMapping = { repository: "name" };


  t.deepEqual(route.propertiesFor({ name: "repo1" }),undefined);

});
