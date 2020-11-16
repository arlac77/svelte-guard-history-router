import { ObjectStoreRoute } from "./routes.mjs";

export class DetailRoute extends ObjectStoreRoute {

  get master()
  {
    return this.parent;
  }

  async next()
  {
    return this.master.next();
  }
  
  async previous()
  {
    return this.master.previous();
  }

  async objectFor(transition) {
    //return this.master.objectFor(transition);

    
    for await (const object of this.parent.iteratorFor(transition)) {
      if (this.matches(object, transition.params)) {
        return object;
      }
    }
  }
}

// TODO compatibility
export class ChildStoreRoute extends DetailRoute {}
