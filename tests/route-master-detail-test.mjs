import test from "ava";
import { SkeletonRoute, ChildStoreRoute } from "../src/routes.mjs";

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
  constructor(id) { this.id = id; }
}

function setupRoute()
{
  const model = new Master([new Detail(1),new Detail(2)]);
  const master = new SkeletonRoute();
  master._path = "/master";
  master._objectInstance = Master;
  master.iteratorFor = model;

  const detail = new SkeletonRoute();
  detail._path = "/:detail";
  detail._parent = master;
  detail._objectInstance = Detail;
  detail._propertyMapping = { detail: "id" };
  
  return { master, detail, model};
}

test("route master detail subscription", async t => {
  const { master, detail, model } = setupRoute();
 
  let detailValue;
  
  detail.subscribe(x => detailValue = x);

  const transition = { path: "/master/2" };
  
  await detail.enter(transition);

  t.deepEqual(detailValue, model.details[1]);
});