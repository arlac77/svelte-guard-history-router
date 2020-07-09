import { ObjectStoreRoute } from "./object-store-route.mjs";

export class ChildStoreRoute extends ObjectStoreRoute {
  async objectFor(properties) {
    for await (const object of this.parent.iteratorFor()) {
      if (this.matches(object, properties)) {
        return object;
      }
    }
  }

  matches(object, properties) {}
}
