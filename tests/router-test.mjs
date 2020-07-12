import test from "ava";
import { ChildStoreRoute, IteratorStoreRoute } from "../src/routes.mjs";
import { BaseRouter } from "../src/base-router.mjs";

class Master {
  constructor(details) {
    this.details = details;
  }

  async *[Symbol.asyncIterator]() {
    for (const d of this.details) {
      yield d;
    }
  }
}

class Detail {
  constructor(id, leafs = []) {
    this.id = id;
    this.leafs = leafs;
  }

  async *[Symbol.asyncIterator]() {
    for (const l of this.leafs) {
      yield l;
    }
  }
}

class Leaf {
  constructor(id) {
    this.id = id;
  }
}

function setupRoute() {
  const model = new Master([
    new Detail("1", [new Leaf("a"), new Leaf("b")]),
    new Detail("2", [new Leaf("c"), new Leaf("d")])
  ]);
  const master = new IteratorStoreRoute();
  master._path = "/master";
  master._objectInstance = Master;
  master.iteratorFor = () => model;

  const detail = new ChildStoreRoute();
  detail._path = "/:detail";
  detail._parent = master;
  detail._objectInstance = Detail;
  detail._propertyMapping = { detail: "id" };

  detail.iteratorFor = function (properties) {
    return this.parent.iteratorFor()
  };

  const leaf = new ChildStoreRoute();
  leaf._path = "/:leaf";
  leaf._parent = detail;
  leaf._objectInstance = Leaf;
  leaf._propertyMapping = { leaf: "id" };

  return { master, detail, leaf, model };
}

test("router", async t => {
  const {master} = setupRoute();
  const router = new BaseRouter();
  
  t.is(routeFor(undefined),undefined);
});

