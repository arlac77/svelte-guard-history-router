import { ObjectStoreRoute } from "./object-store-route.mjs";

export class ChildStoreRoute extends ObjectStoreRoute {
  matches(object, properties) {
    for (const [p, n] of Object.entries(this.propertyMapping)) {
      if (object[n] !== properties[p]) {
        return false;
      }
    }

    return true;
  }

  propertiesFor(object) {
    let properties;

    for (const [p, n] of Object.entries(this.propertyMapping)) {
      const v = object[n];
      if (v !== undefined) {
        if (properties === undefined) {
          properties = {};
        }
        properties[p] = v;
      }
    }
    return properties;
  }

  async objectFor(properties) {
    for await (const object of this.parent.iteratorFor()) {
      if (this.matches(object, properties)) {
        return object;
      }
    }
  }
}
