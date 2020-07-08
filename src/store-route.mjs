import { SkeletonRoute } from "./skeleton-route.mjs";

export class StoreRoute extends SkeletonRoute {
  constructor() {
    super();
    let value = this.defaultValue;

    const properties = {
      value: { get: () => value, set: v => (value = v) },
      subscriptions: { value: new Set() }
    };

    Object.defineProperties(this, properties);
  }

  get defaultValue()
  {
    return undefined;
  }

  subscribe(subscription) {
    this.subscriptions.add(subscription);
    subscription(this.value);
    return () => this.subscriptions.delete(subscription);
  }

  propertiesFor(object) {
    return this.keys.length === 0 ? undefined : Object.fromEntries(this.keys.map(key => [key, object[key]]));
  }
}

export default StoreRoute;
