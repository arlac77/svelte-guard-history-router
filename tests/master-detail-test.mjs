import test from "ava";
import { MasterRoute } from "../src/master-route.mjs";
import { DetailRoute } from "../src/detail-route.mjs";
import { Transition } from "../src/transition.mjs";
import { BaseRouter } from "../src/base-router.mjs";
import { setupRouter } from "./helpers/setup.mjs";

function mdSetup() {
  const values = [{ id: 1 }, { id: 2 }];
  const master = new MasterRoute("/master", {
    iteratorFor: transition => values,
    propertyMapping: { did: "id" }
  });
  const detail = new DetailRoute("/detail/:did", {
    parent: master
  });

  const router = new BaseRouter([master, detail], "");
  return { router, master, detail, values };
}

test("DetailRoute fist last next previous", async t => {
  const { router, detail, values } = mdSetup();

  let transition = new Transition(router, "/master/detail/2");
  await transition.start();

  t.is(await detail.first(), values[0]);
  t.is(await detail.last(), values[1]);
  t.is(await detail.next(), undefined);
  t.is(await detail.previous(), values[0]);

  transition = new Transition(router, "/master/detail/1");
  await transition.start();
  t.is(await detail.next(), values[1]);
});

test("MasterRoute objectFor", async t => {
  const { router, master, values } = mdSetup();

  const transition = new Transition(router, "/master/detail/2");
  t.deepEqual(transition.params, { did: "2" });
  await transition.start();

  t.is(await master.objectFor(transition), undefined);
});

test("DetailRoute objectFor", async t => {
  const { router, detail, values } = mdSetup();

  const transition = new Transition(router, "/master/detail/2");

  t.deepEqual(transition.params, { did: "2" });

  await transition.start();

  t.is(await detail.objectFor(transition), values[1]);
});
