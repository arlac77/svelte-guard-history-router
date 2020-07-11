import test from "ava";
import { ChildStoreRoute, IteratorStoreRoute } from "../src/routes.mjs";

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

test("route master detail subscription", async t => {
  const { detail, model } = setupRoute();

  let detailValue;

  detail.subscribe(x => (detailValue = x));

  const transition = { path: "/master/2", router: { params: { detail: "2" } } };

  await detail.enter(transition);

  t.deepEqual(detailValue, model.details[1]);
});

test.skip("route master detail leaf subscription", async t => {
  const { leaf, model } = setupRoute();

  let leafValue;

  leaf.subscribe(x => (leafValue = x));

  const transition = { path: "/master/2/d", router: { params: { detail: "2", leaf: "d" } } };

  await leaf.enter(transition);

  t.deepEqual(leafValue, model.details[1].leafs[1]);
});
