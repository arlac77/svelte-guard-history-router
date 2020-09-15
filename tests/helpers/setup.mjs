import jsdom from "jsdom";

import {
  ChildStoreRoute,
  IteratorStoreRoute,
  SkeletonRoute
} from "../../src/routes.mjs";

import { BaseRouter } from "../../src/base-router.mjs";
import { redirectGuard } from "../../src/guard.mjs";

const j = new jsdom.JSDOM(``, {
  url: "https://example.org/",
 // referrer: "https://example.com/",
 // contentType: "text/html",
 // includeNodeLocations: true
})

globalThis.window = j.window;
globalThis.history = j.window.history;

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

export function setupModel() {
  const model = new Master([
    new Detail("1", [new Leaf("a"), new Leaf("b")]),
    new Detail("2", [new Leaf("c"), new Leaf("d")])
  ]);

  return model;
}

export function setupRoutes() {
  const model = setupModel();
  const master = new IteratorStoreRoute();
  master._path = "/master";
  master._objectInstance = Master;
  master.iteratorFor = () => model;

  const detail = new ChildStoreRoute();
  detail._path = "/:detail";
  detail._parent = master;
  detail._objectInstance = Detail;
  detail._propertyMapping = { detail: "id" };

  detail.iteratorFor = async function* (transition, properties) {
    for await (const d of this.parent.iteratorFor(transition, properties)) {
      if (d.id === properties.detail) {
        yield* d.leafs;
      }
    }
  };

  const filler = new SkeletonRoute();
  filler._path = "/filler";
  filler._parent = detail;

  const leaf = new ChildStoreRoute();
  leaf._path = "/:leaf";
  leaf._parent = filler;
  leaf._objectInstance = Leaf;
  leaf._propertyMapping = { leaf: "id" };

  const ext1 = new SkeletonRoute();
  ext1._path = "/ext1";
  ext1._parent = leaf;
  const ext2 = new SkeletonRoute();
  ext2._path = "/ext2";
  ext2._parent = leaf;

  const login = new SkeletonRoute();
  login._path = "/login";

  const redirect = new SkeletonRoute();
  redirect._path = "/protected";

  let needsLogin = true;

  redirect._guard = redirectGuard("/login", () => needsLogin);

  function noLoginRequired() {
    needsLogin = false;
  }

  return {
    master,
    detail,
    filler,
    leaf,
    ext1,
    ext2,
    redirect,
    login,
    model,
    noLoginRequired
  };
}

export function setupRouter() {
  const all = setupRoutes();
  const router = new BaseRouter();
  router.addRoute(all.master);
  router.addRoute(all.detail);
  router.addRoute(all.filler);
  router.addRoute(all.leaf);
  router.addRoute(all.ext1);
  router.addRoute(all.ext2);
  router.addRoute(all.redirect);
  router.addRoute(all.login);

  all.router = router;
  return all;
}
