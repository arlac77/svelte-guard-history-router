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

  subscribe(subscription) {
    this.subscriptions.add(subscription);
    subscription(this.value);
    return () => this.subscriptions.delete(subscription);
  }
}

export default StoreRoute;
