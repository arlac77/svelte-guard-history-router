import test from "ava";
import { SkeletonRoute, ChildStoreRoute } from "../src/routes.mjs";

class Master {
  constructor(details) {
    this.details = details;
  }
}

class Detail {
  constructor(id) { this.id = id; }
}

test("route master detail subscription", async t => {
  const m = new Master([new Detail(1),new Detail(2)]);
  const master = new SkeletonRoute();
  master._path = "/master";
  master._objectInstance = Master;
  master.iteratorFor = m.details;

  const detail = new SkeletonRoute();
  detail._path = "/:detail";
  detail._parent = master;
  detail._objectInstance = Detail;
  detail._propertyMapping = { detail: "id" };
  
  let detailValue;
  
  detail.subscribe(x => detailValue = x);

  const transition = { path: "/master/2" };
  
  await detail.enter(transition);

  t.deepEqual(detailValue,m.details[1]);
});