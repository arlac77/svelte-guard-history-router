import {
  ChildStoreRoute,
  IteratorStoreRoute,
  SkeletonRoute
} from "../../src/routes.mjs";

export class Master {
  constructor(details) {
    this.details = details;
  }

  async *[Symbol.asyncIterator]() {
    for (const d of this.details) {
      yield d;
    }
  }
}

export class Detail {
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

export class Leaf {
  constructor(id) {
    this.id = id;
  }
}

export function setupRoute() {
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

  detail.iteratorFor = async function* (properties) {
    for await (const d of this.parent.iteratorFor()) {
      if (d.id === properties.detail) {
        yield* d.leafs;
      }
    }

    //return this.parent.iteratorFor();
  };

  const leaf = new ChildStoreRoute();
  leaf._path = "/:leaf";
  leaf._parent = detail;
  leaf._objectInstance = Leaf;
  leaf._propertyMapping = { leaf: "id" };

  const ext1 = new SkeletonRoute();
  ext1._path = "/ext1";
  ext1._parent = leaf;
  const ext2 = new SkeletonRoute();
  ext2._path = "/ext2";
  ext2._parent = leaf;

  return { master, detail, leaf, ext1, ext2, model };
}
