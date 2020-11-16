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

test("MasterRoute fist last next previous", async t => {
  const { router, master, values } = mdSetup();

  const transition = new Transition(router, "/master");
  await transition.start();

  t.is(await master.first(), values[0]);
  t.is(await master.last(), values[1]);
  t.is(await master.next(values[0]), values[1]);
  t.is(await master.previous(values[1]), values[0]);
});

test("MasterRoute objectFor", async t => {
  const { router, master, values } = mdSetup();

  const transition = new Transition(router, "/master/detail/2");
  t.deepEqual(transition.params, { did: "2" });
  await transition.start();

  t.is(await master.objectFor(transition), values[1]);
});

test("DetailRoute objectFor", async t => {
  const { router, detail, values } = mdSetup();

  const transition = new Transition(router, "/master/detail/2");

  t.deepEqual(transition.params, { did: "2" });

  await transition.start();

  t.is(await detail.objectFor(transition), values[1]);
});
