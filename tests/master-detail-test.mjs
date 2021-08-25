import test from "ava";
import { JSDOM } from "jsdom";
import { MasterRoute } from "../src/master-route.mjs";
import { DetailRoute } from "../src/detail-route.mjs";
import { Transition } from "../src/transition.mjs";
import { BaseRouter } from "../src/base-router.mjs";

const dom = new JSDOM(``, {
  url: "https://example.org/"
});

globalThis.window = dom.window;
globalThis.history = dom.window.history;

function mdSetup() {
  const values = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
  const master = new MasterRoute("/master", {
    iteratorFor: transition => {
      return values;
    },
    propertyMapping: { did: "id" }
  });
  const detail = new DetailRoute("/:did", {
    parent: master
  });

  return {
    router: new BaseRouter([master, detail], ""),
    master,
    detail,
    values
  };
}

test("DetailRoute first, last, next, previous", async t => {
  const { router, detail, values } = mdSetup();

  let transition = new Transition(router, "/master/2");
  await transition.start();

  t.is(await detail.previous(), values[0]);
  t.is(router.pathFor(await detail.previous()), "/master/1");

  t.is(await detail.next(), values[2]);
  t.is(router.pathFor(await detail.next()), "/master/3");

  t.is(await detail.first(), values[0]);
  t.is(router.pathFor(await detail.first()), "/master/1");

  t.is(await detail.last(), values[3]);
  t.is(router.pathFor(await detail.last()), "/master/4");

  
  transition = new Transition(router, "/master/1");
  await transition.start();
  t.is(await detail.next(), values[1]);
});

test("master / detail objectFor", async t => {
  const { router, master, detail, values } = mdSetup();

  const transition = new Transition(router, "/master/2");
  t.deepEqual(transition.params, { did: "2" });

  await transition.start();

  t.is(await master.objectFor(transition), undefined);
  t.is(await detail.objectFor(transition), values[1]);
});
