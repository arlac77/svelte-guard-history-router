import { SkeletonRoute } from "./skeleton-route.mjs";

export class StoreRoute extends SkeletonRoute {
  constructor() {
    super();

    const properties = {
      subscriptions: { value: new Set() }
    };

    Object.defineProperties(this, properties);
  }

  get value() {
    return undefined;
  }

  subscribe(subscription) {
    this.subscriptions.add(subscription);
    subscription(this.value);
    return () => this.subscriptions.delete(subscription);
  }

  propertiesFor(object) {
    return Object.fromEntries(this.keys.map(key => [key, object[key]]));
  }
}

export default StoreRoute;
