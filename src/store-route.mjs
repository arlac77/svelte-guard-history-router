import { GuardedRoute } from "./route.mjs";

export class StoreRoute extends GuardedRoute {
  constructor(path, component, guard) {
    super(path, component, guard);

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
}

export default StoreRoute;
