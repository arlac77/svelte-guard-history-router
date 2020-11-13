import { ObjectStoreRoute } from "./routes.mjs";

export class DetailRoute extends ObjectStoreRoute {
  async objectFor(transition) {
    //return this.parent.objectFor(transition);

    
    for await (const object of this.parent.iteratorFor(transition)) {
      if (this.matches(object, transition.params)) {
        return object;
      }
    }
  }
}

// TODO compatibility
export class ChildStoreRoute extends DetailRoute {}
