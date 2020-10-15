import { JSDOM } from "jsdom";
import {
  ChildStoreRoute,
  IteratorStoreRoute,
  SkeletonRoute
} from "../../src/routes.mjs";
import { BaseRouter } from "../../src/base-router.mjs";
import { redirectGuard } from "../../src/guard.mjs";

const dom = new JSDOM(``, {
  url: "https://example.org/"
  // referrer: "https://example.com/",
  // contentType: "text/html",
  // includeNodeLocations: true
});

globalThis.window = dom.window;
globalThis.history = dom.window.history;

function Component(name) {
  return { name };
}

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
  const master = new IteratorStoreRoute("/master", {
    component: Component("MasterComponent"),
    objectInstance: Master,
    iteratorFor: () => model
  });

  const detail = new ChildStoreRoute("/:detail", {
    parent: master,
    component: Component("DetailComponent"),
    objectInstance: Detail,
    propertyMapping: { detail: "id" },
    iteratorFor: async function* (transition, properties) {
      for await (const d of this.parent.iteratorFor(transition, properties)) {
        if (d.id === properties.detail) {
          yield* d.leafs;
        }
      }
    }
  });

  const filler = new SkeletonRoute("/filler", { parent: detail });
  const leaf = new ChildStoreRoute("/:leaf", {
    parent: filler,
    component: Component("LeafComponent"),
    objectInstance: Leaf,
    propertyMapping: { leaf: "id" }
  });

  const ext1 = new SkeletonRoute("/ext1", { parent: leaf });
  const ext2 = new SkeletonRoute("/ext2", { parent: leaf });
  const login = new SkeletonRoute("/login", {
    component: Component("LoginComponent")
  });

  let needsLogin = true;

  const redirect = new SkeletonRoute("/protected", {
    component: Component("ProtectedComponent"),
    guard: redirectGuard("/login", () => needsLogin)
  });

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
